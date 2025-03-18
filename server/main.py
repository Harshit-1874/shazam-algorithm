from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from server.routers import audio

app = FastAPI(title="Shazam Algorithm")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audio.router, prefix="/api", tags=["audio"])

frontend_path = Path(__file__).parent.parent / "frontend" / "dist"

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend(request: Request):
    with open(frontend_path / "index.html") as f:
        return f.read()

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_spa(full_path: str):
    # This catches all routes and returns the React app for client-side routing
    with open(frontend_path / "index.html") as f:
        return f.read()
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)