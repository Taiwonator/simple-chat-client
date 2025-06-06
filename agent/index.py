from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import json
import re
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from pymongo import MongoClient

# Setup Mongo
mongo_uri = "mongodb://localhost:27017/"
mongo_db_name = "bizclik-site-development"
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client[mongo_db_name]


load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

print(MongoClient)

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

def get_weather(city: str):
    """Get the weather for a given city."""
    return f"It's always sunny in {city}"

def get_time(city: str):
    """Get the time for a given city."""
    return f"The time is whatever you want it to be in {city}"

def get_fake_calculation():
    """Get the correct answer to any math question"""
    return "42"

def do_addition(a: int, b: int):
    """A additional method"""
    return a + b

agent = create_react_agent(
    model=ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=gemini_api_key),
    tools=[get_weather, get_time, get_fake_calculation, do_addition],
    prompt="You are a helpful assistant who gives information based on a city"
)

@app.get("/london")
def read_london_weather():
    response = agent.invoke(
        {"messages": [{"role": "user", "content": "what is the weather in London"}]}
    )
    last_message = (response["messages"])[len(response["messages"]) - 1]
    return last_message.content

class InfoRequest(BaseModel):
    city: str
    custom_message: str

@app.post("/info")
def post_info(request: InfoRequest):
    print('request...')
    response = agent.invoke(
        {"messages": [{"role": "user", "content": f"what do you know about {request.city}, and what is 2+10, and {request.custom_message}"}]}
    )
    print(response)
    last_message = (response["messages"])[len(response["messages"]) - 1]
    return last_message.content
    

@app.get("/mongo-test")
def test_mongo():
    query = {}
    results = list(mongo_db["company"].find(query).limit(5))
    print(results)
    return str(results)
    
# Creating an agent which returns the entities in an article

# Tools
# 1. Regex lookup words in mongo comapny.name (for example Adobe, or Bank of Canada (can check for Canada, Bank and of, and determine which company is most likely a match))
def lookup_company_name(company_name: str):
    """Lookup a company name in the database."""
    query = {"name": {"$regex": company_name, "$options": "i"}}
    results = list(mongo_db["company"].find(query).limit(5))
    return results

#2. Return article data based on article id
def get_article(article_id: str):
    """Get an article from the database."""
    query = {"_id": article_id}
    result = mongo_db["article"].find_one(query)
    return result

#3. Return article based on the article headline
def get_article_by_headline(headline: str):
    """Get an article from the database."""
    query = {"headline": {"$regex": headline, "$options": "i"}}
    result = mongo_db["article"].find_one(query)
    return result

#4. Return a list of entites in a string using gemini api with a prompt "Pretend your're spacy and return the entities in this string"
def get_entities_in_string(string: str):
    """Get the companies in a string."""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Pretend your're spacy and find the entities in this string, but only return the ORG entites. The string is: " + string
    )
    return response.text

# Create a react agent receievs a prompt such as "find me the entities in this article - [id or headline here]. "
ner_agent_prompt = "You are a helpful assistant who helps find companies in articles. If no id or headline are given, please ask the user to provide one."
ner_agent = create_react_agent(
    model=ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=gemini_api_key),
    tools=[lookup_company_name, get_article, get_article_by_headline, get_entities_in_string],
    prompt=ner_agent_prompt
)

class NERRequest(BaseModel):
    message: str

@app.post("/ner")
def ner(request: NERRequest):
    response = ner_agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]}
    )
    last_message = (response["messages"])[len(response["messages"]) - 1]
    return last_message.content