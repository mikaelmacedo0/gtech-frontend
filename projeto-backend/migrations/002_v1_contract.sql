ALTER TABLE users ADD COLUMN firstname TEXT;
ALTER TABLE users ADD COLUMN surname TEXT;

ALTER TABLE products ADD COLUMN enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN use_in_menu INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN price_with_discount REAL;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  use_in_menu INTEGER NOT NULL DEFAULT 0 CHECK (use_in_menu IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
  product_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  path TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  shape TEXT NOT NULL DEFAULT 'square' CHECK (shape IN ('square', 'circle')),
  radius INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'color')),
  option_values TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_categories_category ON product_categories(category_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_options_product ON product_options(product_id);
