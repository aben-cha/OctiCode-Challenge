// api/user.ts
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Types
interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

const inviteSchema = z.object({
  email: z.string().email().max(255),
  role: z.enum(['user', 'admin']).default('user')
});

// Validation middleware
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
}

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts' },
  keyGenerator: (req) => req.body.email || req.ip
});

const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Invite limit exceeded' }
});

// Authorization middleware
export function requireAuth( req: Request, res: Response, next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
      role: string;
    };

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// Routes
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Query user by email (safe, parameterized)
      const result = await pool.query<User>(
        "SELECT id, email, password, role FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result.rows[0];

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/invite",
  requireAuth,      // JWT verification middleware
  requireAdmin,    // role === "admin"
  inviteLimiter,
  validate(inviteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;

      // Check if user exists
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Generate secure temporary password
      const tempPassword = crypto.randomBytes(16).toString("hex");

      // Hash password
      const hash = await bcrypt.hash(tempPassword, 12);

      // Insert user safely
      await pool.query(
        "INSERT INTO users(email, password, role) VALUES ($1, $2, $3)",
        [email, hash, role]
      );

      // In production: send via email
      // await sendInviteEmail(email, tempPassword);

      res.json({
        ok: true,
        message: "Invitation sent",
        tempPassword, // remove in production
      });
    } catch (error) {
      next(error);
    }
  }
);