-- Hapus tabel 
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS auth_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS course_chapters CASCADE;
DROP TABLE IF EXISTS chapter_contents CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;

-- enum untuk role user
DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- enum untuk payment method
DROP TYPE IF EXISTS payment_method_type;
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'paypal', 'bank_transfer');

-- enum untuk token type
DROP TYPE IF EXISTS token_type;
CREATE TYPE token_type AS ENUM ('access', 'refresh', 'verification');

-- enum untuk satuan durasi
DROP TYPE IF EXISTS duration_unit_type;
CREATE TYPE duration_unit_type AS ENUM ('hour', 'minute', 'day');

-- Tabel users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel payments
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method payment_method_type NOT NULL
);

-- Tabel auth_tokens
CREATE TABLE auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    is_blacklisted BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    type token_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel courses
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    duration_unit duration_unit_type,
    difficulty VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel discussions
CREATE TABLE discussions (
    discussion_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel course_chapters
CREATE TABLE course_chapters (
    chapter_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    chapter_order INT NOT NULL,
    title VARCHAR(255) NOT NULL
);

-- Tabel chapter_contents
CREATE TABLE chapter_contents (
    content_id SERIAL PRIMARY KEY,
    section_id INT REFERENCES course_chapters(chapter_id) ON DELETE CASCADE,
    content_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration INT,
    duration_unit duration_unit_type,
    content_url TEXT,
    description TEXT
);

-- Tabel memberships
CREATE TABLE memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
