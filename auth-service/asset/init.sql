CREATE TABLE IF NOT EXISTS "users" (
    "id"           SERIAL PRIMARY KEY,
    "email"        VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role"         VARCHAR(50)  NOT NULL DEFAULT 'user',
    "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL
);