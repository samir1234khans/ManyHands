# Backup and restore runbook

A backup is useful only if another database can be restored from it and the restored application can pass integrity checks.

## Ownership

The production operator owns backup scheduling, encryption, retention, access, and restore drills. Managed-platform snapshots can be the implementation, but ManyHands must document what is retained and how it is recovered.

## Provisional objectives

Until usage and legal requirements justify different values:

- **RPO target:** no more than 24 hours of committed ManyHands database state;
- **RTO target:** restore a minimal read/write service within 8 hours of deciding a database restore is required.

These are engineering targets, not contractual SLAs. Change them through documented operational review when real usage demands it.

## Backup scope

Back up PostgreSQL data and schema metadata necessary to reconstruct the ManyHands database. Application source and migrations are already versioned in Git; secrets should be recreated from the operator's secret store rather than embedded in database exports.

## Restore drill

1. Choose a recent production-like backup and record its creation timestamp.
2. Create an isolated target database that cannot send production notifications or access production OAuth secrets.
3. Restore the backup using the provider-supported PostgreSQL restore mechanism.
4. Compare the restored migration history with the reviewed repository migration history.
5. Start an application build compatible with the restored schema.
6. Verify liveness and readiness.
7. Verify representative public reads and authenticated writes using test accounts.
8. Verify RLS prevents cross-account private data access.
9. Record duration, data age, warnings, operator, and cleanup evidence.
10. Destroy the isolated restore environment when the exercise is complete.

## Restore evidence template

```text
Date/time UTC:
Source backup timestamp:
Source environment:
Isolated restore target:
Application commit:
Migration head:
Restore duration:
Maximum data age:
Liveness result:
Readiness result:
RLS smoke result:
Problems found:
Corrective issues:
Operator:
```

Do not mark backup/restore acceptance criteria complete until a dated drill fills this template with actual evidence.
