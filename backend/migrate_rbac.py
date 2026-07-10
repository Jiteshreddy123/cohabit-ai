import os
from sqlalchemy import create_engine, text
from config import settings

engine = create_engine(settings.get_db_url)

def run_migration():
    with engine.begin() as conn:
        print("Running migrations for RBAC...")
        
        # 1. Add college_code to college table
        try:
            conn.execute(text("ALTER TABLE college ADD COLUMN college_code VARCHAR(50) UNIQUE;"))
            print("Added college_code to college")
        except Exception as e:
            print(f"college_code might already exist: {e}")

        # 2. Add password and interview_status to student table
        try:
            conn.execute(text("ALTER TABLE student ADD COLUMN password VARCHAR(255);"))
            print("Added password to student")
        except Exception as e:
            print(f"password might already exist in student: {e}")
            
        try:
            conn.execute(text("ALTER TABLE student ADD COLUMN interview_status VARCHAR(20) DEFAULT 'Pending';"))
            # Update existing students
            conn.execute(text("UPDATE student SET interview_status = 'Pending' WHERE interview_status IS NULL;"))
            print("Added interview_status to student")
        except Exception as e:
            print(f"interview_status might already exist: {e}")

        # 3. Add is_published to allocation_sessions table
        try:
            conn.execute(text("ALTER TABLE allocation_sessions ADD COLUMN is_published BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("UPDATE allocation_sessions SET is_published = FALSE WHERE is_published IS NULL;"))
            print("Added is_published to allocation_sessions")
        except Exception as e:
            print(f"is_published might already exist: {e}")

        print("Migration complete!")

if __name__ == "__main__":
    run_migration()
