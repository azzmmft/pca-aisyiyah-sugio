-- Migration number: 0005
-- Profile sections

CREATE TABLE IF NOT EXISTS profile_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO profile_sections
  (slug, title, content)
VALUES
  (
    'sejarah',
    'Sejarah PCA Aisyiyah Sugio',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sejarah Pimpinan Cabang Aisyiyah Sugio akan ditampilkan di halaman ini.'
  ),
  (
    'visi-misi',
    'Visi dan Misi PCA Aisyiyah Sugio',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visi dan misi Pimpinan Cabang Aisyiyah Sugio akan ditampilkan di halaman ini.'
  );