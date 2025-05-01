-- Drop existing tables if needed (uncomment to use)
 DROP TABLE IF EXISTS posts CASCADE;
 DROP TABLE IF EXISTS activities CASCADE;
 DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    type VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    distance DECIMAL(10,2),
    location VARCHAR(255),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_userId ON activities(userId);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    content TEXT,
    duration INTEGER NOT NULL,
    distance DECIMAL(10,2),
    location VARCHAR(255),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX idx_posts_date ON posts(date);

INSERT INTO users (username, name, email, password, role) VALUES
('cle20', 'Cesar Le', 'cle20@example.com', 'password123', 'admin'),
('jewpaltz', 'Moshe Plotkin', 'jewpaltz@example.com', 'password123', 'user'),
('jngo', 'Johnny Ngo', 'jngo@example.com', 'password123', 'user'),
('thunguyen', 'Thu Nguyen', 'thunguyen@example.com', 'password123', 'user');

INSERT INTO activities (userId, type, duration, distance, location, date) VALUES
(1, 'Running', 30, 3.1, 'New Paltz Trail', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 'Walking', 45, 1.2, 'SUNY New Paltz', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 'Cycling', 60, 15.5, 'Hudson Valley Rail Trail', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(3, 'Swimming', 35, 1.0, 'Athletic Center', CURRENT_TIMESTAMP - INTERVAL '4 days');

INSERT INTO posts (userId, username, type, content, duration, distance, location, date) VALUES
(1, 'cle20', 'Running', 'Morning run at the park. Beautiful day!', 30, 3.1, 'New Paltz Trail', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 'jewpaltz', 'Walking', 'Evening stroll around campus. Lovely sunset today.', 45, 1.2, 'SUNY New Paltz', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 'jngo', 'Swimming', 'Great swimming session. Improved my lap time!', 35, 1.0, 'Athletic Center', CURRENT_TIMESTAMP - INTERVAL '4 days');