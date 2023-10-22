CREATE TABLE matrix (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  size INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_mutation BOOLEAN NOT NULL
);

CREATE TABLE row (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY ,
  matrix_id UUID REFERENCES matrix(id),
  index INT NOT NULL
);

CREATE TABLE col (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  row_id UUID REFERENCES row(id),
  index INT NOT NULL,
  value CHAR(1) NOT NULL
);
