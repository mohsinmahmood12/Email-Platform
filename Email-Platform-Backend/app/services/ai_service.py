# app/services/ai_service.py
import time
import logging
from openai import OpenAI
from fastapi import HTTPException
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Initialize a simple rate limiter
last_request_time = 0
min_interval = 1  # Minimum interval between requests in seconds

logger = logging.getLogger(__name__)

def rate_limit():
    global last_request_time
    current_time = time.time()
    if current_time - last_request_time < min_interval:
        time.sleep(min_interval - (current_time - last_request_time))
    last_request_time = time.time()

def handle_openai_error(func):
    def wrapper(*args, **kwargs):
        try:
            rate_limit()
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing your request")
    return wrapper

@handle_openai_error
def generate_email_content(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant specialized in writing emails."},
            {"role": "user", "content": f"Write an email based on this prompt: {prompt}"}
        ],
        max_tokens=150,
        n=1,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

@handle_openai_error
def generate_email_template(template_type: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant specialized in creating email templates."},
            {"role": "user", "content": f"Create an email template for {template_type}"}
        ],
        max_tokens=200,
        n=1,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

@handle_openai_error
def improve_email(email_content: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant specialized in improving emails."},
            {"role": "user", "content": f"Improve the following email:\n\n{email_content}"}
        ],
        max_tokens=300,
        n=1,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

@handle_openai_error
def analyze_sentiment(email_content: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI assistant specialized in analyzing email sentiment."},
            {"role": "user", "content": f"Analyze the sentiment of this email:\n\n{email_content}"}
        ],
        max_tokens=100,
        n=1,
        temperature=0.5,
    )
    return response.choices[0].message.content.strip()