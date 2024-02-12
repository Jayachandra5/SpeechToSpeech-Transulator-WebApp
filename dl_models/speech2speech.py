import random
import requests
from fastapi import FastAPI
import edge_tts
from edge_tts import VoicesManager
from googletrans import Translator
from transformers import pipeline
from fastapi.responses import FileResponse
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# Allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# instantiate pipeline
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-medium",  # select checkpoint from https://huggingface.co/openai/whisper-large-v3#model-details
)

@app.post("/translate/")
async def generate_english_audio(audio_url, lang) -> bytes:
    """Generate English audio from audio URL"""
    # Download audio file from the provided URL
    response = requests.get(audio_url)
    response.raise_for_status()

    # Save the audio locally
    with open("uploaded_audio.mp3", "wb") as buffer:
        buffer.write(response.content)

    # Perform speech to text conversion
    outputs = pipe(
        "uploaded_audio.mp3",
        chunk_length_s=30,
        batch_size=24,
        return_timestamps=True,
    )
    speech_to_text = outputs["text"]

    # Translate the text
    translator = Translator()
    translation = translator.translate(speech_to_text, dest = lang)
    text_prompt = translation.text

    # Generate translated audio
    voices = await VoicesManager.create()
    voice = voices.find(Gender="Female", Language=lang)
    communicate = edge_tts.Communicate(text_prompt, random.choice(voice)["Name"])
    OUTPUT_FILE = "new.mp3"
    await communicate.save(OUTPUT_FILE)
    return FileResponse(OUTPUT_FILE)

if __name__ == "__main__":
    uvicorn.run(app, host = "0.0.0.0", port=8000)
