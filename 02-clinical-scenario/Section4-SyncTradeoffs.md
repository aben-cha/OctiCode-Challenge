# SECTION 4: Real-Time Sync Trade-Offs

## Deep Dive: Battery Impact

## Real-Time (Persistent Connection)

    Maintains open WebSocket/SSE connection
    Network radio stays active (higher power state)
    Firestore SDK optimizes with connection pooling
    Measured Impact: 5-10% additional battery drain over 8-hour shift
    Mitigation: Battery Saver mode disables real-time, switches to polling

## Periodic Polling

    Network radio wakes every 30-60 seconds
    If poorly implemented (no request coalescing), similar drain as real-time
    Well-optimized polling (batch requests, exponential backoff when idle): 2-3% drain
    Trade-off: Lower battery but higher latency

## Cost Model Analysis
## Real-Time (Firestore)

    Document reads: $0.06 per 100,000 reads
    Document writes: $0.18 per 100,000 writes
    Bandwidth: $0.12 per GB
    Example: 100 doctors, 50 recordings/day each, 5 listeners per recording

    Reads: 100 × 50 × 5 × 30 days = 750,000 reads/month = $0.45
    Writes: 100 × 50 × 30 = 150,000 writes/month = $0.27
    Total: ~$0.72/month


    Scaling: At 10,000 doctors: ~$72/month (negligible)

## Periodic Polling (REST API)

    API Gateway: $3.50 per million requests
    Lambda invocations: $0.20 per million requests
    Example: 100 doctors, polling every 30s for 8 hours/day

    Requests: 100 × (8 × 3600 / 30) × 30 days = 2.88M requests/month
    Cost: $3.50 × 2.88 = $10.08/month


    Scaling: At 10,000 doctors: $1,008/month (14x more expensive than Firestore)

    Winner: Real-time is more cost-effective at scale.
    Offline Caching Strategy
    Real-Time Approach (Firestore)

    Built-in offline persistence (SQLite on mobile)
    SDK caches all queried data automatically
    Configurable cache size (default 40MB, expandable to 100MB)
    Cache eviction: LRU (Least Recently Used)
    Advantage: Zero developer effort, robust out-of-the-box

## Polling Approach (Custom)

    Must implement: local SQLite, cache invalidation logic, manual sync
    Risk: Cache staleness if poll fails repeatedly
    Requires differential sync to minimize data transfer
    Advantage: Full control over caching strategy

    Conflict Resolution
    Scenario: Doctor edits summary on mobile while offline. Meanwhile, admin edits same summary on web.
    Real-Time (Firestore Transactions)
    javascriptdb.runTransaction(async (transaction) => {
    const doc = await transaction.get(summaryRef);
    if (doc.data().version !== localVersion) {
        throw new ConflictError('Document modified');
    }
    transaction.update(summaryRef, { 
        summary: newText, 
        version: localVersion + 1 
    });
    });

    Optimistic locking with version field
    On conflict: notify doctor, show diff view, allow merge or overwrite

## Polling (Last-Write-Wins)

No built-in conflict detection
Must implement: compare timestamps, show warning if updatedAt > localEditedAt
Higher risk of data loss


Recommended Hybrid Approach
Tier 1: Real-Time (Critical Data)

Entities: Recording (status changes), SummarizationOutput (AI completion), Recommendation
Scope: Data modified in last 24 hours
Firestore Query: where('updatedAt', '>', Date.now() - 86400000)
Rationale: Active workflows need instant updates. Most doctor activity is on recent data.

Tier 2: Periodic Polling (Less Critical)

Entities: Historical recordings (>24 hours old), PersonalNote, MedicalSource updates
Frequency: Poll every 5 minutes when app is active, stop when backgrounded
Rationale: Older data changes rarely. Polling sufficient for occasional updates.

Tier 3: On-Demand (Archive)

Entities: Recordings older than 30 days, AuditTrail, detailed analytics
Fetch: Only when explicitly accessed by doctor (e.g., taps "Load Older")
Pagination: Load 20 items at a time, infinite scroll
Rationale: Rarely accessed, no need to sync proactively.

Power Management

Automatically downgrade to Tier 2 (polling) when battery < 20%
Provide user toggle in settings: "Low Power Mode" to disable real-time sync
Desktop/web always uses full real-time (no battery concern)

Implementation
typescript// Mobile SDK
if (batteryLevel < 20 || userPreference === 'low-power') {
  usePolling(intervalMs: 300000); // 5 min
} else {
  useRealtime(recentDataOnly: true); // Last 24h
}
Expected Outcomes

Latency: <1s for active data, <5min for historical data
Battery: 3-5% additional drain (vs 5-10% for full real-time)
Cost: $1.50/month per 100 doctors (vs $3 for naive real-time, $10 for polling)
UX: Best of both worlds—instant updates for active work, acceptable delay for archives