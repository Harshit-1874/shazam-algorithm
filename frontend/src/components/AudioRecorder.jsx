import React, { useRef } from 'react';
import { identifySong } from '../services/api';

const AudioRecorder = ({ 
  isRecording, 
  setIsRecording, 
  setMatchResult, 
  setIsLoading, 
  setError 
}) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Reset states
      setMatchResult(null);
      setError(null);
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioForIdentification(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const sendAudioForIdentification = async (audioBlob) => {
    try {
      setIsLoading(true);
      const result = await identifySong(audioBlob);
      setMatchResult(result);
      setIsLoading(false);
    } catch (err) {
      console.error('Error identifying song:', err);
      setError('Failed to identify song. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="audio-recorder">
      {!isRecording ? (
        <button 
          className="record-button"
          onClick={startRecording}
        >
          Listen
        </button>
      ) : (
        <button 
          className="stop-button"
          onClick={stopRecording}
        >
          Stop
        </button>
      )}
      {isRecording && <div className="pulse-animation"></div>}
    </div>
  );
};

export default AudioRecorder;