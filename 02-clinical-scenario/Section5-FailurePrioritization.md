## Section 5 — Failure scenario prioritization

Ranked by urgency (highest → lowest)

---

### 🔴 CRITICAL — D) Personal recordings incorrectly linked to patients  
**Severity:** P0 — Security & compliance incident  
**Impact**
- GDPR/HIPAA risk: personal notes mixed with patient PHI → regulatory exposure.  
- Clinical risk: incorrect context may lead to misdiagnosis.  
- Privacy breach: doctor personal data exposed in patient records.  
- Legal & trust: potential fines, lawsuits, and loss of clinician trust.

**Immediate actions (first 4 hours)**
- Deploy hotfix: add double-confirmation dialog for patient linking; enforce validation that personal recordings cannot have `patient_id` and patient recordings must have `patient_id`.  
- Run audit query to find misclassified recordings:

```sql
SELECT * FROM recordings
WHERE (is_personal = true AND patient_id IS NOT NULL)
   OR (is_personal = false AND patient_id IS NULL);
```

- If PHI exposed, follow breach notification process (notify affected parties within 72 hours per GDPR Article 33).  
- Start root‑cause analysis (race condition? UI state bug?) and add regression/integration tests.

**Stakeholder message**
> We’ve identified a critical data classification issue affecting <X> recordings. It is being treated as a P0 security incident. Emergency hotfix deployed and a full data audit is underway. Affected patients will be notified per GDPR. ETA for full remediation: 48 hours.

---

### 🟡 HIGH — A) 1% of recordings fail upload and never retry  
**Severity:** P1 — Data loss risk  
**Impact**
- ~1% of consultations lost → clinical documentation gaps and extra clinician time to recover.  
- Erodes trust; potential operational impact at scale (e.g., 10 lost recordings/day for 1,000 daily recordings).

**Why not P0**
- No exposure of PHI (data lost, not leaked). Workarounds exist (manual notes/re-record). No immediate clinical harm in most cases.

**Fix priority:** This week (P1 sprint)  
**Actions**
- Add DLQ monitoring & alerting for uploads that exhaust retries.  
- Provide admin UI: “Failed uploads” with a manual “Retry” action.  
- Increase retry policy: e.g., from 5 → 10 attempts across 24 hours with exponential backoff + jitter.  
- Implement resumable, chunked uploads (smaller chunks like 500KB) and persistent local upload state (survive app restart).  
- Root cause analysis: inspect timeouts, network errors (hospital Wi‑Fi), and upload library behavior.

**Stakeholder message**
> We’ve observed a 1% upload failure rate resulting in data loss. We are deploying extended retry logic, recovery UI, and improved monitoring. Target: reduce failures to <0.1% within 2 weeks. No patient safety incidents reported.

---

### 🟠 MEDIUM — B) Summaries occasionally miss a relevant symptom  
**Severity:** P2 — AI accuracy / clinical completeness  
**Impact**
- If relied on without review, omissions could affect care.  
- Increases clinician time to check full transcript; reduces confidence in AI.

**Why lower priority**
- Mandatory human review exists by policy; summaries are assistive and show disclaimers. No immediate automated propagation to records without signoff.

**Fix priority:** Next regular sprint (2–4 weeks)  
**Actions**
- Log clinician edits to create a feedback loop (track additions/deletions).  
- Improve model prompts: explicitly request extraction of ALL symptoms, including low‑confidence mentions.  
- Train/fine‑tune on annotated transcripts; run A/B tests.  
- Add a “completeness” or symptom‑recall score and surface a symptom checklist in the UI for quick verification.

**Stakeholder message**
> AI summaries currently have ~85% symptom recall; goal 95% by Q1. We are improving prompts, training data, and adding UI guardrails to ensure clinicians can catch omissions.

---

### 🟢 LOW — C) Web dashboard shows duplicate recordings for ~3% of users  
**Severity:** P3 — UI / sync bug  
**Impact**
- UX clutter and confusion; no data loss or privacy issue. Temporary workaround: refresh page.

**Why lowest priority**
- Cosmetic/display issue only; backend authoritative data is correct.

**Fix priority:** Next release cycle (4–6 weeks)  
**Actions**
- Investigate Firestore/listener deduplication and event handling (ensure idempotency).  
- Add client‑side deduplication (example):

```typescript
const uniqueRecordings = recordings.reduce((acc, rec) => {
  if (!acc.some(r => r.id === rec.id)) acc.push(rec);
  return acc;
}, []);
```

- Ensure server → Firestore sync pipeline produces idempotent updates and add monitoring for duplicate event emission.

**Stakeholder message**
> A UI sync issue is causing duplicate display for a small subset of users. This is cosmetic and scheduled for the next release. Temporary workaround: refresh.

---

## Summary of priorities & next steps
1. Fix D (P0) immediately — security & compliance first.  
2. Remediate A (P1) in the current sprint — prevent data loss.  
3. Improve B (P2) in the next sprint — increase AI accuracy and visibility.  
4. Schedule C (P3) in the next release cycle — resolve UX duplication.

Each remediation should include: emergency mitigation, monitoring/alerting, root‑cause analysis, regression tests, and a stakeholder communication plan.