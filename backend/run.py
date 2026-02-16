"""
Production entry point for the FastAPI application.
This file provides a clean start without the --reload flag.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        workers=1,
        reload=False,  # Explicitly disable reload for production
        log_level="info"
    )
