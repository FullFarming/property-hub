CREATE INDEX IF NOT EXISTS idx_buildings_coordinates
  ON buildings (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;