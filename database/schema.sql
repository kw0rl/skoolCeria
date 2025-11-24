-- Create Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    session VARCHAR(20) NOT NULL -- 'Pagi' or 'Petang'
);

-- Create Cleanliness Reports Table
CREATE TABLE IF NOT EXISTS reports_cleanliness (
    id SERIAL PRIMARY KEY,
    week VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    session VARCHAR(20) NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id),
    class_id INTEGER REFERENCES classes(id),
    
    -- Scores
    score_kebersihan INTEGER DEFAULT 0, -- Max 30
    score_keceriaan INTEGER DEFAULT 0, -- Max 10
    score_papan_kenyataan INTEGER DEFAULT 0, -- Max 10
    score_markah_tambahan INTEGER DEFAULT 0, -- Max 20
    
    total_score INTEGER DEFAULT 0, -- Max 70
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Teacher Duty Reports Table
CREATE TABLE IF NOT EXISTS reports_duty (
    id SERIAL PRIMARY KEY,
    week VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    session VARCHAR(20) NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id),
    
    activities TEXT,
    issues TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Teachers
INSERT INTO teachers (name) VALUES 
('Cikgu Ahmad'),
('Cikgu Siti'),
('Cikgu Tan'),
('Cikgu Kumar'),
('Cikgu Nurul')
ON CONFLICT DO NOTHING;

-- Seed Data: Classes
INSERT INTO classes (name, session) VALUES 
('1 Anggerik', 'Pagi'),
('1 Bakawali', 'Pagi'),
('1 Cempaka', 'Pagi'),
('2 Anggerik', 'Petang'),
('2 Bakawali', 'Petang'),
('2 Cempaka', 'Petang')
ON CONFLICT DO NOTHING;
