-- 1. Safely drop existing tables if they exist
DROP TABLE IF EXISTS recommendation_members CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS compatibility_scores CASCADE;
DROP TABLE IF EXISTS traits CASCADE;
DROP TABLE IF EXISTS interview CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS allocation_sessions CASCADE;
DROP TABLE IF EXISTS college CASCADE;

-- 2. Re-create all tables cleanly
CREATE TABLE college (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE allocation_sessions (
    id SERIAL PRIMARY KEY,
    college_id INT NOT NULL, 
    title VARCHAR(255),
    academic_year VARCHAR(50) NOT NULL,
    room_capacity INT NOT NULL,
    session_status VARCHAR(20) NOT NULL DEFAULT 'Draft',

    CONSTRAINT check_session_status
        CHECK (session_status IN ('Draft', 'Active', 'Completed')),

    CONSTRAINT Foreign_college_session
        FOREIGN KEY (college_id) 
        REFERENCES college(id)        
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    college_id INT NOT NULL,
    allocation_session_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    gender VARCHAR(10) NOT NULL,

    CONSTRAINT check_gender
        CHECK (gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT fk_student_college
        FOREIGN KEY (college_id) 
        REFERENCES college(id),

    CONSTRAINT Foreign_allocation_session
        FOREIGN KEY (allocation_session_id) 
        REFERENCES allocation_sessions(id)
);    

CREATE TABLE interview (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    conversation TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT Foreign_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE
);

CREATE TABLE traits (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE, 
    sleep_time VARCHAR(100),
    wake_time VARCHAR(100),
    study_style VARCHAR(255),
    
    noise_tolerance FLOAT NOT NULL,
    cleanliness FLOAT NOT NULL,
    social_level FLOAT NOT NULL,
    
    flexible_preferences TEXT,
    non_negotiable_preferences JSONB,
    personality_summary TEXT,
    trait_json JSONB,

    CONSTRAINT fk_traits_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE
);

CREATE TABLE compatibility_scores (
    id SERIAL PRIMARY KEY,
    allocation_session_id INT NOT NULL,
    student1_id INT NOT NULL,
    student2_id INT NOT NULL,
    compatibility_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (allocation_session_id)
        REFERENCES allocation_sessions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (student1_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    FOREIGN KEY (student2_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    CHECK (student1_id <> student2_id),
    UNIQUE (allocation_session_id, student1_id, student2_id)
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    allocation_session_id INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    compatibility_score FLOAT NOT NULL,
    reason TEXT NOT NULL,

    CONSTRAINT chk_compatibility_score 
        CHECK (compatibility_score >= 0 AND compatibility_score <= 100),

    CONSTRAINT fk_recommendation_session
        FOREIGN KEY (allocation_session_id) 
        REFERENCES allocation_sessions(id)
        ON DELETE CASCADE
);

CREATE TABLE recommendation_members (
    id SERIAL PRIMARY KEY,
    recommendation_id INT NOT NULL,
    student_id INT NOT NULL,

    CONSTRAINT unique_room_student 
        UNIQUE (recommendation_id, student_id),

    CONSTRAINT fk_member_recommendation
        FOREIGN KEY (recommendation_id) 
        REFERENCES recommendations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_member_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE
);

COMMIT;