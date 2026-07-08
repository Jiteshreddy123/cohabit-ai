-- ============================================================
-- CoHabit-AI Database Schema
-- Canonical source of truth. Aligned with SQLAlchemy ORM models.
--
-- Changes:
--   - allocation_sessions: replaced room_capacity/sharing_options
--     with room_inventory JSONB (e.g. {"2": 20, "3": 10})
--   - allocation_sessions: added session_size
--   - traits: added preferred_room_size (extracted from AI interview)
--   - compatibility_score: fixed FK typo (allocation_session → allocation_sessions)
-- ============================================================

-- ─── College ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- ─── Allocation Sessions ──────────────────────────────────────────────────────
-- room_inventory stores a JSON object: {"2": 20, "3": 10}
-- meaning 20 double rooms, 10 triple rooms are available.
CREATE TABLE IF NOT EXISTS allocation_sessions (
    id               SERIAL PRIMARY KEY,
    college_id       INT NOT NULL,
    title            VARCHAR(255),
    academic_year    VARCHAR(50) NOT NULL,
    session_size     INT NOT NULL,           -- total students to allocate
    room_inventory   JSONB,                  -- {"capacity": count, ...}
    session_status   VARCHAR(20) NOT NULL DEFAULT 'Draft',

    CONSTRAINT check_session_status
        CHECK (session_status IN ('Draft', 'Active', 'Completed')),

    CONSTRAINT fk_session_college
        FOREIGN KEY (college_id)
        REFERENCES college(id)
        ON DELETE CASCADE
);

-- ─── Student ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student (
    id                    SERIAL PRIMARY KEY,
    college_id            INT NOT NULL,
    allocation_session_id INT NOT NULL,
    name                  VARCHAR(255) NOT NULL,
    roll_number           VARCHAR(50)  UNIQUE NOT NULL,
    email                 VARCHAR(255) UNIQUE NOT NULL,
    branch                VARCHAR(100) NOT NULL,
    year_of_study         INT NOT NULL,
    gender                VARCHAR(10)  NOT NULL,

    CONSTRAINT check_gender
        CHECK (gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT fk_student_college
        FOREIGN KEY (college_id)
        REFERENCES college(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_session
        FOREIGN KEY (allocation_session_id)
        REFERENCES allocation_sessions(id)
        ON DELETE CASCADE
);

-- ─── Interview ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview (
    id           SERIAL PRIMARY KEY,
    student_id   INT NOT NULL,
    conversation TEXT NOT NULL,          -- JSON-encoded chat history
    completed_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_interview_student
        FOREIGN KEY (student_id)
        REFERENCES student(id)
        ON DELETE CASCADE
);

-- ─── Traits ───────────────────────────────────────────────────────────────────
-- preferred_room_size: extracted from AI interview (1=single, 2=double, etc.)
-- This is the HARD CONSTRAINT for the OR-Tools optimizer.
CREATE TABLE IF NOT EXISTS traits (
    id                       SERIAL PRIMARY KEY,
    student_id               INT NOT NULL UNIQUE,   -- one profile per student
    sleep_time               VARCHAR(100),
    wake_time                VARCHAR(100),
    study_style              VARCHAR(255),
    noise_tolerance          FLOAT NOT NULL,        -- 0.0 (hates noise) to 1.0 (tolerant)
    cleanliness              FLOAT NOT NULL,        -- 0.0 (messy) to 1.0 (very neat)
    social_level             FLOAT NOT NULL,        -- 0.0 (introvert) to 1.0 (extrovert)
    preferred_room_size      INT,                   -- 1, 2, 3, or 4
    flexible_preferences     TEXT,
    non_negotiable_preferences TEXT,
    personality_summary      TEXT,

    CONSTRAINT chk_preferred_room_size
        CHECK (preferred_room_size IS NULL OR preferred_room_size BETWEEN 1 AND 5),

    CONSTRAINT fk_traits_student
        FOREIGN KEY (student_id)
        REFERENCES student(id)
        ON DELETE CASCADE
);

-- ─── Compatibility Score ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compatibility_score (
    id                    SERIAL PRIMARY KEY,
    allocation_session_id INT NOT NULL,
    student1_id           INT NOT NULL,
    student2_id           INT NOT NULL,
    compatibility_score   DECIMAL(5, 2) NOT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_compat_session
        FOREIGN KEY (allocation_session_id)
        REFERENCES allocation_sessions(id)    -- Fixed: was referencing wrong table name
        ON DELETE CASCADE,

    CONSTRAINT fk_compat_student1
        FOREIGN KEY (student1_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_compat_student2
        FOREIGN KEY (student2_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    CHECK (student1_id <> student2_id),
    UNIQUE (allocation_session_id, student1_id, student2_id)
);

-- ─── Recommendations ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
    id                    SERIAL PRIMARY KEY,
    allocation_session_id INT NOT NULL,
    room_number           VARCHAR(50) NOT NULL,
    compatibility_score   FLOAT NOT NULL,
    reason                TEXT NOT NULL,

    CONSTRAINT chk_rec_score
        CHECK (compatibility_score >= 0 AND compatibility_score <= 100),

    CONSTRAINT fk_rec_session
        FOREIGN KEY (allocation_session_id)
        REFERENCES allocation_sessions(id)
        ON DELETE CASCADE
);

-- ─── Recommendation Members ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendation_members (
    id                SERIAL PRIMARY KEY,
    recommendation_id INT NOT NULL,
    student_id        INT NOT NULL,

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
