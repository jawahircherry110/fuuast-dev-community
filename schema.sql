-- FUUAST Developer Community - MySQL Database Schema
-- Database: u870455810_fuuast_db

CREATE TABLE IF NOT EXISTS student_profiles (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(64) NOT NULL UNIQUE,
  department VARCHAR(16) NOT NULL,
  semester VARCHAR(32) NOT NULL,
  bio TEXT,
  skills TEXT,
  email VARCHAR(255) NOT NULL,
  github VARCHAR(255),
  linkedin VARCHAR(255),
  avatar_bg VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(32),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
