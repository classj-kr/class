-- "I don't know" is an explicit response, not a wrong choice or a confidence rating.
ALTER TABLE metacognition_attempts
  ADD COLUMN IF NOT EXISTS unknown_count SMALLINT NOT NULL DEFAULT 0
    CHECK (unknown_count >= 0 AND unknown_count <= item_count),
  ALTER COLUMN mean_confidence DROP NOT NULL,
  ALTER COLUMN bias DROP NOT NULL,
  ALTER COLUMN calibration_error DROP NOT NULL,
  ALTER COLUMN brier DROP NOT NULL;
