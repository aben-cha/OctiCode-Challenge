import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Patients API', () => {
  it('should create a patient', async () => {
    const response = await request(app).post('/api/patients').send({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      medicalRecordNumber: 'TEST123',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe('John');
  });

  it('should get all patients', async () => {
    const response = await request(app).get('/api/patients');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
