import sys
import os
sys.path.append('c:\\Users\\jites\\Documents\\ProjectsInBtech\\Activeprojects\\cohabit-ai\\backend')
from database import SessionLocal
from models.college import College
from models.student import Student

db = SessionLocal()
print("--- Colleges ---")
colleges = db.query(College).all()
for c in colleges:
    print(f"Email: {c.email}, Name: {c.name}")

print("--- Students ---")
students = db.query(Student).all()
for s in students:
    print(f"Email: {s.email}, Name: {s.name}")
