-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Friends Table
CREATE TABLE friends (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id)
);

-- Create Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    distance_unit VARCHAR(10) NOT NULL,
    duration INTEGER NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, password, name, role)
VALUES (1, 'cle20', 'hashed_password', 'Cesar Le', 'admin');

-- Insert Sample Users
INSERT INTO users (username, name, password, role) VALUES
('cle20', 'Cesar Le', 'cesarle', 'admin'),
('jewpaltz', 'Rabbi Moshe Plotkin', 'professor', 'user'),
('jngo', 'Johnny Ngo', 'johnnyngo', 'user'),
('thunguyen', 'Thu Nguyen', 'mabu', 'user');

-- Insert Friend Relationships
INSERT INTO friends (user_id, friend_id) VALUES
(1, 2), (1, 3),
(2, 1), (2, 3),
(3, 1), (3, 2),
(4, 1), (4, 4);

-- Insert Sample Activities
INSERT INTO activities (user_id, type, distance, distance_unit, duration, date, location) VALUES
(1, 'Run', 3.1, 'mi', 30, '2025-02-20 10:00:00', 
    jsonb_build_object('lat', 41.7459793, 'lng', -74.082801)),
(2, 'Walk', 1.2, 'mi', 45, '2025-02-15 15:30:00',
    jsonb_build_object('lat', 41.7459793, 'lng', -74.082801)),
(1, 'Cycle', 15.5, 'km', 60, '2025-02-18 14:00:00',
    jsonb_build_object('lat', 41.7459793, 'lng', -74.082801)),
(3, 'Swim', 1000, 'm', 35, '2025-02-19 11:15:00',
    jsonb_build_object('lat', 41.7459793, 'lng', -74.082801));

-- Insert Sample Posts
INSERT INTO posts (user_id, title, content, date) VALUES
(1, 'First Post', 'This is my first post!', '2025-02-20 10:00:00'),
(2, 'Welcome', 'Hello !', '2025-02-15 15:30:00');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;