-- Initial database setup for interview appointment system
-- This file will be executed when the PostgreSQL container starts for the first time
-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET
  timezone = 'UTC';

-- Create initial tables can be added here if needed
-- For now, we'll let NestJS handle the schema creation