# Architecture Decision Records

Architecture Decision Records capture decisions that are expensive to rediscover or difficult to reverse.

## Decision index

| ADR | Status | Decision |
| --- | --- | --- |
| [`0001`](0001-problem-first-github-boundary.md) | accepted | Keep ManyHands problem-first and keep GitHub authoritative for code. |
| [`0002`](0002-initial-technology-direction.md) | accepted | Begin with a TypeScript, Next.js, PostgreSQL/Supabase, and GitHub App architecture. |
| [`0003`](0003-stable-identity-and-public-read-models.md) | accepted | Separate authentication identity, stable attribution, private account data, and public read models. |

## Status values

- `proposed`
- `accepted`
- `superseded`
- `deprecated`
- `rejected`

## Template

```md
# NNNN — Decision title

- Status: proposed
- Date: YYYY-MM-DD
- Deciders: names or roles

## Context

## Decision

## Consequences

## Alternatives considered

## Revisit when
```

Create the next sequential file and link superseding decisions in both directions.
