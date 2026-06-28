from fastapi import FastAPI

# This is the "app" that Uvicorn is looking for!
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Cohabit-AI"}