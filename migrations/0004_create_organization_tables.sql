-- Migration number: 0004
-- Organization

-- ============================================
-- ORGANIZATION STRUCTURE
-- ============================================

CREATE TABLE IF NOT EXISTS organization_structure (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- ORGANIZATION MEMBERS
-- ============================================

CREATE TABLE IF NOT EXISTS organization_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  division TEXT,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- BRANCHES
-- ============================================

CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- INITIAL ORGANIZATION MEMBERS
-- ============================================

INSERT INTO organization_members
  (name, position, division, sort_order)
VALUES
  ('Siti Aminah', 'Ketua', NULL, 1),
  ('Nur Aisyah', 'Sekretaris', NULL, 2),
  ('Dewi Lestari', 'Bendahara', NULL, 3),
  ('Fatimah Zahra', 'Ketua Majelis', 'Majelis Pendidikan', 4),
  ('Aisyah Rahma', 'Ketua Majelis', 'Majelis Sosial', 5);


-- ============================================
-- INITIAL BRANCHES
-- ============================================

INSERT INTO branches
  (name, description, address, sort_order)
VALUES
  (
    'Ranting Aisyiyah Sugio',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Kecamatan Sugio, Lamongan',
    1
  ),
  (
    'Ranting Aisyiyah Bedingin',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Kecamatan Sugio, Lamongan',
    2
  ),
  (
    'Ranting Aisyiyah Daliwangun',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Kecamatan Sugio, Lamongan',
    3
  );