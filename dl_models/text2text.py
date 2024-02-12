import uvicorn
from fastapi import FastAPI
from googletrans import Translator
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

@app.post("/translate/")
async def translate_text(text: str, dest_lang: str) -> str:
    """Translate text to the specified language"""
    translator = Translator()
    translation = translator.translate(text, dest=dest_lang)
    translated_text = translation.text
    return translated_text

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
