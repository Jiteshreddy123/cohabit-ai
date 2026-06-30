Create table college (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

Create table allocation_sessions (
    id SERIAL PRIMARY KEY,
    college_id INT NOT NULL, 
    title VARCHAR(255) ,
     academic_year VARCHAR(50) NOT NULL,
     room_capacity INT NOT NULL,
     session_status VARCHAR(20) NOT NULL DEFAULT 'Draft',

    CONSTRAINT check_session_status
        CHECK (session_status IN ('Draft', 'Active', 'Completed')),

     CONSTRAINT Foreign_college
        FOREIGN KEY (college_id) 
        REFERENCES college(id)        
);

Create table student (
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

    CONSTRAINT Foreign_college
        FOREIGN KEY (college_id) 
        REFERENCES college(id),

    CONSTRAINT Foreign_allocation_session
        FOREIGN KEY (allocation_session_id) 
        REFERENCES allocation_sessions(id)
);    

Create table interview (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    conversation TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT Foreign_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE -- If a student is deleted, their interview is deleted too

);

CREATE TABLE traits (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE, -- UNIQUE ensures one trait profile per student
    sleep_time VARCHAR(100),
    wake_time VARCHAR(100),
    study_style VARCHAR(255),
    
    -- FLOAT maps to REAL/DOUBLE PRECISION in Postgres, perfect for decimal scores
    noise_tolerance FLOAT NOT NULL,
    cleanliness FLOAT NOT NULL,
    social_level FLOAT NOT NULL,
    
    flexible_preferences TEXT,
    non_negotiable_preferences TEXT,
    personality_summary TEXT,

    -- Foreign Key Constraint
    CONSTRAINT fk_traits_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE -- If a student is deleted, their traits are deleted too
);

CREATE TABLE compatibility_score (
    id SERIAL PRIMARY KEY,

    allocation_session_id INT NOT NULL,

    student1_id INT NOT NULL,

    student2_id INT NOT NULL,

    compatibility_score DECIMAL(5,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (allocation_session_id)
        REFERENCES allocation_session(id)
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

    -- Boundary check: Ensures scores stay between 0 and 100%
    CONSTRAINT chk_compatibility_score 
        CHECK (compatibility_score >= 0 AND compatibility_score <= 100),

    -- Foreign Key Constraint
    CONSTRAINT fk_recommendation_session
        FOREIGN KEY (allocation_session_id) 
        REFERENCES allocation_sessions(id)
        ON DELETE CASCADE
);


CREATE TABLE recommendation_members (
    id SERIAL PRIMARY KEY,
    recommendation_id INT NOT NULL,
    student_id INT NOT NULL,

    -- Safety Check: Prevents adding the exact same student to the same room recommendation twice
    CONSTRAINT unique_room_student 
        UNIQUE (recommendation_id, student_id),

    -- Foreign Key 1: Link to the Recommendation (Room)
    CONSTRAINT fk_member_recommendation
        FOREIGN KEY (recommendation_id) 
        REFERENCES recommendations(id)
        ON DELETE CASCADE,

    -- Foreign Key 2: Link to the Student
    CONSTRAINT fk_member_student
        FOREIGN KEY (student_id) 
        REFERENCES student(id)
        ON DELETE CASCADE
);

