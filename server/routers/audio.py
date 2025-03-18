from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import tempfile
import os

# Import services (to be implemented)
from server.services.fingerprinting import identify_song

router = APIRouter()

@router.post("/identify")
async def identify_audio(audio: UploadFile = File(...)):
    """
    Endpoint to identify a song from an audio file.
    """
    # Validate file type
    if not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file_path = temp_file.name
        content = await audio.read()
        temp_file.write(content)
    
    try:
        # Process the audio file
        result = identify_song(temp_file_path)
        
        # For demo purposes, return mock data if no match found
        if not result:
            # In a real app, this would return more useful info
            return {
                "match": False,
                "message": "No match found"
            }
        
        return result
    finally:
        # Clean up the temporary file
        os.unlink(temp_file_path)