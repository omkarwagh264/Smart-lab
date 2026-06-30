# BUG-FIXES.md

This document explains the 3 intentional bugs found and fixed in
`backend/utils/healthScore.js`, as required by Tier 2 of the assessment.

---

## Bug 1 — `calculateHealthScore`: milliseconds used as days

**Symptom:** Every piece of equipment scored a health of ~0 regardless of
how recently it was maintained.

**Root cause:** The difference between two `Date` objects in JavaScript is
in milliseconds, not days. The buggy version subtracted the dates and used
that raw millisecond count directly in the scoring formula
(`100 - msDifference * 0.5`), which immediately blew past 0 because a
millisecond count is many orders of magnitude larger than 100.

**Fix:** Convert the millisecond difference to whole days first:

```js
const msPerDay = 1000 * 60 * 60 * 24;
const daysSinceMaintenance = Math.floor((now - lastMaintained) / msPerDay);
```

Then the existing `score = 100 - daysSinceMaintenance * 0.5` formula behaves
correctly.

---

## Bug 2 — `aggregateStats`: shared accumulator across calls

**Symptom:** Dashboard stats grew on every refresh/request instead of
reflecting the current state — e.g. "Active" count kept climbing even when
no equipment had changed.

**Root cause:** The stats object used as the starting accumulator was
defined once at module load time (outside the function), so every call to
`aggregateStats` mutated the *same* object instead of starting fresh. This
is a classic JS closure/mutable-default bug.

**Fix:** Create a new `stats` object literal inside the function body on
every call, so each invocation starts from zero:

```js
function aggregateStats(equipmentList) {
  const stats = { total: 0, active: 0, underMaintenance: 0, decommissioned: 0, averageHealth: 0 };
  // ...
}
```

---

## Bug 3 — `validateEquipmentPayload`: arrow function not returning a value

**Symptom:** Every equipment submission was rejected as "invalid," even
when all required fields were filled in correctly.

**Root cause:** The `Array.prototype.every` callback was written with a
block body (`{ ... }`) but was missing a `return` statement, so it always
implicitly returned `undefined`. `undefined` is falsy, so `.every()` always
evaluated to `false`, failing validation unconditionally.

**Fix:** Add the `return` statement so the callback actually returns the
boolean check:

```js
const hasAllRequired = requiredFields.every((field) => {
  return payload[field] !== undefined && String(payload[field]).trim() !== '';
});
```

---

## Testing approach

Each fix was verified by:
1. Running the backend locally and hitting the relevant endpoint with
   `curl` (`POST /api/equipment`, `GET /api/stats`).
2. Confirming health scores now fall in a sane 0–100 range tied to
   maintenance recency.
3. Confirming `/api/stats` returns counts matching the actual current
   equipment table, refreshed correctly on repeated calls.
4. Confirming a valid equipment payload is accepted (`201 Created`) and an
   invalid one is rejected with a clear `400` and field-level error list.
