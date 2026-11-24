CREATE DATABASE IF NOT EXISTS bineta_code_new
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bineta_code_new;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username),
  UNIQUE KEY uq_admins_email (email)
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NULL,
  technologies JSON NOT NULL,
  live_url VARCHAR(2048) NULL,
  github_url VARCHAR(2048) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_projects_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_status_created (status, created_at)
);

CREATE TABLE IF NOT EXISTS profile (
  id TINYINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  headline VARCHAR(180) NOT NULL,
  biography TEXT NOT NULL,
  profile_image VARCHAR(500) NULL,
  email VARCHAR(254) NOT NULL,
  social_links JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_profile_singleton CHECK (id = 1)
);

INSERT INTO profile (id, full_name, headline, biography, email, social_links)
VALUES (
  1,
  'Biniam Agegnehu',
  'Full-stack developer & software engineering student',
  'I am a Software Engineering student at Mizan Tepi University, Ethiopia, passionate about building useful digital products. I enjoy web and application development, thoughtful UI design, and learning how to make software reliable.',
  'you@example.com',
  JSON_OBJECT('github', '', 'linkedin', '', 'instagram', '')
)
ON DUPLICATE KEY UPDATE id = VALUES(id);
