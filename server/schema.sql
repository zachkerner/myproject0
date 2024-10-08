CREATE TABLE IF NOT EXISTS fields (
  id serial PRIMARY KEY,
  field varchar(25) NOT NULL,
  page INT NOT NULL
);

INSERT INTO fields (field, page)
VALUES
  ('birthday', 3),
  ('aboutMe', 2),
  ('address', 2);


CREATE TABLE IF NOT EXISTS user_data (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  about_me TEXT,
  address VARCHAR(100),
  birthday DATE
);

