# SECTION 3: Voice Recording Lifecycle

## Detailed Flow: Record → Stop → Save

## Step 1: Doctor Taps "Record"

    * App checks microphone permissions (request if not granted)
    
    * If recording linked to patient: Display consent dialog "Did patient consent to this recording?" (Yes/No/Ask Later)
    
    * Create local Recording object: tempId, status: "recording", startTime, patientId (if linked)
    
    * Initialize audio capture: 16kHz sample rate, mono channel, AAC compression
    
    * Start streaming to local encrypted file using AES-256-GCM with device-specific key from Keychain/Keystore
    
    * Checkpoint every 30 seconds: save audio chunk + metadata to device storage (enables crash recovery)
    
    * UI displays: red recording indicator, elapsed time, patient name (if linked), "Stop" button


## Step 2: Doctor Taps "Stop"
    
    * Finalize audio file: write remaining buffer, close file handle
    
    * Calculate audio duration and file size
    
    * Generate file hash (SHA-256) for integrity verification
    
    * Update Recording status: status: "pending_upload"
    
    * Display preview screen: duration, patient name, "Personal Note" toggle, "Save" / "Discard" buttons
    
    * If "Discard" tapped: delete local file, remove from queue, show confirmation


## Step 3: Doctor Taps "Save"

    * Validate required fields: if patient recording, patientId must be set; if personal, must explicitly confirm
    
    * Add Recording to upload queue with priority (patient recordings > personal notes)
    
    * Generate upload URL: signed Cloud Storage URL with 1-hour expiration
    
    * Display "Uploading..." toast notification
    
    * Background upload service activates (continues even if app minimized)


## Step 4: Upload Process (Good Network: WiFi or 4G)

    * Chunked Upload: Split file into 1MB chunks for resume capability
    
    * Upload chunks sequentially, track progress: (uploadedBytes / totalBytes) * 100
    
    * On each chunk success: update upload progress in local DB
    
    * On complete upload: receive permanent storageUrl from backend
    
    * Backend verifies file hash matches local hash (integrity check)
    
    * Create Firestore document: Recording { id, doctorId, patientId, storageUrl, duration, status: "uploaded" }
    
    * Real-time sync pushes Recording metadata to web dashboard instantly
    
    * Delete local encrypted file after successful Firestore write confirmation

## Step 5: Upload Process (Bad Network: Spotty 3G, Airplane Mode)

    * Exponential Backoff Retry: Attempt 1 (immediate), Attempt 2 (+10s), Attempt 3 (+30s), Attempt 4 (+60s), Attempt 5 (+5min)
    
    * Resumable Upload: If connection drops mid-chunk, resume from last successful chunk (not from start)
    
    * Track uploaded byte ranges: [0-1048576, 1048577-2097152, ...]
    
    * If all retries fail: mark Recording as status: "upload_failed"
    
    * Show persistent notification: "Recording saved locally. Will upload when online.
    
    * Recording remains accessible in app with "Pending Upload" badge
    
    * Background Sync Service: When network improves (WiFi connected, or 4G restored), retry queue automatically
    
    * Service uses WorkManager (Android) / BackgroundTasks (iOS) for reliability

## Step 6: Offline Mode Handling

    * All recordings stored locally with full encryption (device never deletes until upload confirmed)
    
    * Doctor can review, add notes, edit metadata while offline
    
    * Changes queued in pending_sync table with timestamps
    
    * Queue processes FIFO when connectivity restored
    
    * Conflict Resolution: If recording edited offline and simultaneously on web (rare), use last-write-wins with conflict notification to doctor

## Step 7: STT (Speech-to-Text) Triggering

    * Event: Cloud Function listens to Firestore Recording collection for status: "uploaded" events
    
    * Trigger adds job to Cloud Tasks queue (ensures at-least-once processing)
    
    * Task payload: { recordingId, storageUrl, language: "auto-detect" }
    
    * STT service (Google Speech-to-Text or Whisper) processes audio asynchronously
    
    * Output: { transcriptionText, confidence, wordTimestamps[], language }
    * Create Firestore document: Transcription { id, recordingId, rawText, confidence, status: "completed" }
    
    * Real-time Update: Mobile app receives Firestore listener update, displays transcription in UI
    
    * Failure Handling: If STT fails (timeout, rate limit), retry up to 3 times with exponential backoff
    
    * After 3 failures: mark status: "stt_failed", send alert to monitoring system (PagerDuty/Slack)
    
    * Admin dashboard shows failed transcriptions for manual review

## Step 8: AI Summarization Pipeline

    * Event: Cloud Function listens for Transcription with status: "completed"
    * Construct AI prompt:
             System: You are a medical summarization assistant.
  
            Context:
            - Patient: [Patient name, age, relevant history]
            - Doctor specialization: [e.g., Cardiology]
            
            Medical Guidelines:
            [Retrieved relevant sections from MedicalSource PDFs using vector search]
            
            Transcription:
            [Full transcription text]
            
            Task: Generate structured summary with:
            1. Chief Complaint
            2. Symptoms (list)
            3. Preliminary Diagnosis
            4. Recommended Actions
            
            IMPORTANT: Output only facts from transcription. Do not invent information.
    
    * Create Firestore document: SummarizationOutput { id, transcriptionId, summary, status: "draft", confidence }
    
    * Real-time Update: Mobile app shows "AI Summary Ready" notification with review prompt


## Step 9: Failed AI Call Retry Logic

    Transient Errors (timeout, rate limit 429, server error 500): Exponential backoff, max 5 retries over 1 hour
    Retry Queue: Separate from STT queue to avoid blocking
    Each retry logs: attempt number, error type, timestamp
    Model Errors (4xx client errors, invalid input): Mark as ai_failed, no retry
    Notify doctor: "AI summary unavailable. You can manually summarize or retry."
    Dead Letter Queue: After 5 failed retries, move to DLQ for manual investigation
    Admin can manually trigger re-processing with adjusted parameters

## Step 10: Disclaimer Persistence

    Disclaimer is stored in SummarizationOutput.disclaimer field (separate from summary text)
    When doctor copies summary to EHR: disclaimer is prepended to exported text
    Disclaimer cannot be edited or removed by doctor (system-enforced)
    When doctor marks summary as "Reviewed": disclaimer updates to include reviewer info

    ⚠️ AI-Generated Summary (Reviewed by Dr. Smith on 2024-12-27)
    Original AI confidence: 87%. Doctor-verified and approved for medical record.


## Step 11: Synchronization to Web Dashboard

    Firestore Real-Time Listeners: Web app subscribes to relevant collections

    javascript  db.collection('recordings')
        .where('doctorId', '==', currentUserId)
        .where('createdAt', '>', last24Hours)
        .onSnapshot(snapshot => {
        // UI updates automatically
        })

    WebSocket Connection: Maintained while dashboard is open, fallback to long-polling if WebSocket fails
    Periodic Polling Fallback: If real-time connection drops, poll every 30 seconds
    Live Status Indicators: Web shows recording progress (uploading, transcribing, summarizing) in real-time
    Optimistic UI Updates: When doctor edits summary on web, UI updates immediately; if server rejects, rollback with notification
    Service Worker: Caches recent recordings for offline web access (last 7 days), syncs changes when back online
