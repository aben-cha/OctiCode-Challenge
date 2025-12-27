# SECTION 2: Domain Modeling


## Entity Design & Storage Decisions

**Recording**
    
    * Fields: id, 
              doctorId, 
              patientId (nullable), 
              storageUrl, 
              duration, 
              createdAt, 
              status, 
              encryptionKeyId, 
              isPersonal, 
              consentStatus, 
              retentionDate
    * Storage: Firestore
    * Justification: Needs real-time sync to mobile and web. Metadata is small (<10KB). 
      Firestore's offline persistence and real-time listeners are ideal. Document updates 
      propagate instantly to all devices. Query patterns are simple (by doctorId, patientId, date range).


**Transcription**

    * Fields: id, 
              recordingId, 
              rawText, 
              language, 
              confidence, 
              sttProvider, 
              modelVersion, 
              processedAt, 
              status, 
              wordTimestamps[]
    * Storage: Firestore
    * Justification: Tightly coupled with Recording lifecycle. Text size manageable (<100KB typically). Benefits from same real-time sync. Doctors need immediate access when transcription completes. Firestore's document size limit (1MB) is sufficient.


**Doctor**

    * Fields: id, 
              email, 
              firstName, 
              lastName, 
              clinicIds[], 
              role, 
              specialization, 
              licenseNumber, 
              canApproveReviews, 
              createdAt
    * Storage: PostgreSQL
    * Justification: User authentication data needs strong consistency. Multi-clinic relationships (many-to-many with Clinic entity) benefit from SQL joins. Role-based access control queries are complex. PostgreSQL transactions ensure consistent user state during updates.

**PersonalNote**

    * Fields: id, 
              doctorId, 
              recordingId, 
              title, 
              tags[], 
              notes, 
              createdAt, 
              updatedAt
    * Storage: Firestore
    * Justification: Doctor's private data, no complex relationships. Real-time sync improves UX. No need for cross-entity joins. Firestore's scalability handles high write volume from active doctors.

**MedicalSource**

    * Fields: id, 
              title, 
              documentUrl, 
              author, 
              publicationDate, 
              uploadedAt, 
              uploadedBy, 
              category, 
              version, 
              indexStatus, 
              chunkCount
    * Storage: PostgreSQL
    * Justification: Authoritative reference data requiring versioning. When a source is updated, we need to track which AI outputs used which version. Complex queries: "Find all summaries generated using MedicalSource v1.0" requires SQL joins. Full-text search in PostgreSQL (pg_trgm, ts_vector) for document retrieval.

**Recommendation**

    * Fields: id, summarizationId, text, sourceIds[], confidence, category, generatedAt, doctorFeedback (helpful/not-helpful)
    * Storage: Firestore
    * Justification: Displayed alongside summaries in real-time. Tight coupling with SummarizationOutput. Feedback collection benefits from Firestore's offline writes. No complex queries needed—always fetched by summarizationId.

**AuditTrail**

    * Fields: id, 
              entityType, 
              entityId, 
              action, 
              userId, 
              timestamp, 
              ipAddress, 
              userAgent, 
              changesBefore, 
              changesAfter, 
              metadata
    * Storage: PostgreSQL
    * Justification: Compliance requirement for long-term retention and complex queries. Audit queries span time ranges, entity types, users: "Show all Patient data access by Doctor X in Q3 2024." PostgreSQL's indexing (B-tree, BRIN for time-series) and aggregation functions are essential. Append-only workload fits PostgreSQL write patterns.

**DataRetentionPolicy**

    * Fields: id, 
              entityType, 
              retentionPeriodDays, 
              autoDeleteEnabled, 
              applicableRegions[], 
              applicableRoles[], 
              createdAt, 
              updatedAt, 
              createdBy
    * Storage: PostgreSQL
    * Justification: Configuration data requiring strong consistency. Policies are referenced by scheduled deletion jobs that query by date ranges and entity types. SQL's JOIN with Patient/Recording tables to identify deletion candidates. Transactional updates ensure policy changes are atomic.



## Hybrid Architecture Rationale

**PostgreSQL** for: 

    Master data (Patient, Doctor), compliance (AuditTrail), configuration (DataRetentionPolicy), reference data (MedicalSource). Optimizes for: complex queries, referential integrity, long-term storage, reporting.

**Firestore** for: 

    Operational data (Recording, Transcription, SummarizationOutput), personal data (PersonalNote), real-time features (Recommendation). Optimizes for: real-time sync, offline-first mobile, scalability, developer velocity.
    This separation maximizes strengths: PostgreSQL handles relational complexity and compliance, Firestore handles real-time user experience.