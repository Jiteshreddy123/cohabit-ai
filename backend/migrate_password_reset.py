import os
from sqlalchemy import create_engine, text
from config import settings

engine = create_engine(settings.get_db_url)

def run_migration():
    with engine.begin() as conn:
        print("Running migrations for Password Reset...")
        
        try:
            conn.execute(text("ALTER TABLE college ADD COLUMN reset_token VARCHAR(255) UNIQUE;"))
            print("Added reset_token to college")
        except Exception as e:
            print(f"reset_token might already exist: {e}")
            
    with engine.begin() as conn:
        try:
            conn.execute(text("CREATE INDEX ix_college_reset_token ON college (reset_token);"))
            print("Created index for reset_token")
        except Exception as e:
            print(f"index ix_college_reset_token might already exist: {e}")

    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE college ADD COLUMN reset_token_expiry TIMESTAMP WITH TIME ZONE;"))
            print("Added reset_token_expiry to college")
        except Exception as e:
            print(f"reset_token_expiry might already exist: {e}")

        print("Migration complete!")

if __name__ == "__main__":
    run_migration()
