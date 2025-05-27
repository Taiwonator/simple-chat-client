from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import json
import re


load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

client = None
if gemini_api_key is None:
    print("WARNING: ⚠️ No Gemini API Key Provided")
else:
    client = genai.Client(api_key=gemini_api_key)
    print("SUCCESS: ✅ GEMINI Key Provided")

origins = [
    'http://localhost:5173'
]

class UserActionRequest(BaseModel):
    message: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

def extract_json_from_ai_response(text: str):
    """
    Extract and parse JSON content from a markdown-formatted string.
    Removes ```json ... ``` wrapper and parses the inner JSON.
    """
    # Remove triple backtick blocks (e.g., ```json ... ```)
    cleaned = re.sub(r"^```json\s*|\s*```$", "", text.strip(), flags=re.IGNORECASE)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
        return None

@app.get("/")
def read_root():
    return {"message": "Unsupported command@"}

@app.get("/hello")
def read_hello():
    return "Hello there from your (mock) agent :)"

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/action/")
def action(request: UserActionRequest):
    isClient = client is not None
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="The user is writing in a chatbox and is a @agent command to call this /action api endpoint. You should first determine whether the user is asking a question, or if they're asking you to write a message for them. If it is a question you should return { type: 'answer', message: [answer to the question] }. If they're asking you to write a message for them it should be in the following format { type: 'write_message', message: [written message which was asked for]. If it doesn't seem liek either of the previous 2, please repsond with { type: 'unknown', message: 'Unable to help you sadly :( )' } }. Don't send any text, should only respond with a JSON object. Here is the user request: " + request.message
    )
    clean_message = extract_json_from_ai_response(response.text)
    print(clean_message)
    return {
        "model_response": clean_message,
        "isClient": isClient,
        "request.message": request.message
    }


# Lets create some tools for Gemini to use
# - Read last n messages

