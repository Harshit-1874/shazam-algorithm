import React, { useRef, useState, useEffect } from 'react';
import { identifySong } from '../services/api';

const AudioRecorder = ({ 
  isRecording, 
  setIsRecording, 
  setMatchResult, 
  setIsLoading, 
  setError,
  resetResults
}) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);

  // Reset timer when recording state changes
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Reset states
      resetResults();
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
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
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length === 0) {
          setError("No audio recorded. Please try again.");
          return;
        }

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
      setError('Could not access microphone. Please check permissions and try again.');
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

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="audio-recorder">
      {isRecording && <div className="pulse-animation"></div>}
      
      <button 
        className={isRecording ? "stop-button" : "record-button"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={setIsLoading}
      >
        {isRecording ? "Stop" : "Listen"}
      </button>
      
      {isRecording && (
        <div className="recording-time">
          {formatTime(recordingTime)} / 00:10
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;