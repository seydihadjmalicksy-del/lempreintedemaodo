"""
Database configuration and MongoDB connection
"""
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with fallback defaults
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'tariqa_tidiane')

logger.info(f"Connecting to MongoDB database: {db_name}")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

async def close_db_connection():
    """Close MongoDB connection on shutdown"""
    client.close()
