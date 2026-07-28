# Project instructions

## Always flag anomalies
Always check the data and the result, and proactively tell the user when something looks strange —
don't silently accept it and don't silently "fix" it either. Report it and ask.

Examples of things to always flag:
- Prices that don't increase with quantity, or a faster delivery that costs less than a slower one
- Duplicate / identical values where a progression is expected
- Missing tiers, formats, papers or delivery options compared to sibling products
- Values that break the established markup rule or pattern
- Inconsistencies between the front-end price table (index.html) and the server-side
  validation table (api/_pricing-data.js), or between displayed / quoted / charged amounts
- Broken or missing links, images, env vars, or pages

Rule: verify before delivering, then state clearly what looks off and let the user decide.
