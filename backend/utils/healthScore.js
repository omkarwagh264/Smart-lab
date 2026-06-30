// backend/utils/healthScore.js
//
// Utility functions for computing equipment "health scores" and
// related stats. This file originally shipped with 3 intentional bugs
// as part of the Tier 2 assessment challenge. Each bug is documented
// inline with BUG / FIX comments, and the reasoning is duplicated in
// BUG-FIXES.md at the project root.

/**
 * Calculates a health score (0-100) for a piece of equipment based on
 * days since last maintenance and current status.
 *
 * BUG #1 (original): used `Date.now() - lastMaintained` directly as if it
 * were already in days, instead of converting milliseconds -> days.
 * This made every machine look "ancient" (score always near 0) since
 * the millisecond count is astronomically larger than a 0-100 scale.
 *
 * FIX: convert the millisecond difference to days before scoring.
 */
function calculateHealthScore(lastMaintainedDate, status) {
  if (!lastMaintainedDate) return status === 'Decommissioned' ? 0 : 50;

  const lastMaintained = new Date(lastMaintainedDate);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;

  // FIXED: convert ms -> days
  const daysSinceMaintenance = Math.floor((now - lastMaintained) / msPerDay);

  let score = 100 - daysSinceMaintenance * 0.5; // lose 0.5 points per day idle

  if (status === 'Under Maintenance') score -= 20;
  if (status === 'Decommissioned') score = 0;

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}

/**
 * Aggregates dashboard stats from a list of equipment rows.
 *
 * BUG #2 (original): used `==` loosely against status strings inside a
 * reduce, and mutated the accumulator object passed in by reference
 * across calls because the initial value was defined OUTSIDE the
 * function (a shared object literal), causing counts to accumulate
 * across multiple requests instead of resetting each time.
 *
 * FIX: define the initial accumulator fresh inside the function call
 * (new object literal per invocation) and use strict equality.
 */
function aggregateStats(equipmentList) {
  // FIXED: fresh object created on every call, not a shared/module-level one
  const stats = {
    total: 0,
    active: 0,
    underMaintenance: 0,
    decommissioned: 0,
    averageHealth: 0,
  };

  let healthSum = 0;

  for (const item of equipmentList) {
    stats.total += 1;
    healthSum += item.health_score || 0;

    // FIXED: strict equality
    if (item.status === 'Active') stats.active += 1;
    else if (item.status === 'Under Maintenance') stats.underMaintenance += 1;
    else if (item.status === 'Decommissioned') stats.decommissioned += 1;
  }

  stats.averageHealth = stats.total > 0 ? Math.round(healthSum / stats.total) : 0;

  return stats;
}

/**
 * Validates equipment payload before insert/update.
 *
 * BUG #3 (original): the required-fields check used `Array.prototype.every`
 * but the callback never returned a value (missing `return`), so `every`
 * always evaluated the implicit `undefined` as falsy-but-then-coerced
 * incorrectly due to a stray semicolon turning the arrow function body
 * into an empty block — meaning validation silently always failed,
 * rejecting every valid submission.
 *
 * FIX: arrow function now correctly returns a boolean per field check.
 */
function validateEquipmentPayload(payload) {
  const requiredFields = ['name', 'type', 'status', 'location', 'serial_number'];

  // FIXED: arrow function body returns the boolean check
  const hasAllRequired = requiredFields.every((field) => {
    return payload[field] !== undefined && String(payload[field]).trim() !== '';
  });

  const errors = [];
  if (!hasAllRequired) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || String(payload[field]).trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  const validTypes = [
    'CNC Machine', 'IoT Sensor', 'Automation Trainer',
    'PLC Module', 'Hydraulic System', 'Pneumatic System', 'Electrical Panel',
  ];
  if (payload.type && !validTypes.includes(payload.type)) {
    errors.push(`Invalid type: ${payload.type}`);
  }

  const validStatuses = ['Active', 'Under Maintenance', 'Decommissioned'];
  if (payload.status && !validStatuses.includes(payload.status)) {
    errors.push(`Invalid status: ${payload.status}`);
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  calculateHealthScore,
  aggregateStats,
  validateEquipmentPayload,
};
