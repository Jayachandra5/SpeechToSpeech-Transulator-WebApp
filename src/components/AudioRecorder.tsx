import React, { useContext } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { toast } from "sonner";
import { ChatContext } from "./ChatContext";

const VoiceRecorder = () => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const addAudioElement = async (blob: Blob) => {
    try {
      const formData = new FormData();
      const mp3File = new File([blob], "audio.mp3", { type: "audio/mp3" });
      formData.append("file", mp3File, "audio.mp3");
      console.log(formData)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const url = await response.json();
        console.log(url)
        const e = { target: { value: url.url } };
        //@ts-ignore
        handleInputChange(e);
      } else {
        toast.error("Failed to upload audio.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error("Error uploading audio.");
    }
  };

  return (
    <AudioRecorder
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={false}
      downloadFileExtension="mp3"
    />
  );
};

export default VoiceRecorder;
