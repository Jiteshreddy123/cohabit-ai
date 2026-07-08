from config import settings
from google import genai

client = genai.Client(api_key=settings.GEMINI_API_KEY)
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Tell me a short joke.'
)
print(response.text)
