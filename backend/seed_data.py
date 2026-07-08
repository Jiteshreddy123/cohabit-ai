"""
Seed Data Script for CoHabit-AI

This script is OPTIONAL and only for development/testing purposes.
It creates a test college account so you can log in without signing up manually.

Usage:
    cd backend
    python seed_data.py

The script uses UPSERT-style logic so it's safe to run multiple times.
It does NOT create any students, sessions, or mock allocations.
"""

import os
import sys
import logging

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.college import College
from services.auth_service import hash_password
import models  # noqa: F401 — ensures all models are registered with SQLAlchemy

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def seed():
    """Creates database tables and seeds a development test college account."""
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created (or already exist)")

    db = SessionLocal()
    try:
        # Create a test admin/college account for development login
        test_email = "admin@cohabit.dev"
        test_password = "Admin@123"

        existing = db.query(College).filter_by(email=test_email).first()
        if not existing:
            college = College(
                name="CoHabit Dev College",
                email=test_email,
                password=hash_password(test_password)
            )
            db.add(college)
            db.commit()
            logger.info(f"✅ Dev college account created: {test_email} / {test_password}")
        else:
            logger.info(f"ℹ️  Dev college account already exists: {test_email}")

        logger.info("Seed complete. Ready for development.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
