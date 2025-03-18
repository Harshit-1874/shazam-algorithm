import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import Results from './components/Results';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="app-container">
      <header>
        <h1>Shazam Clone</h1>
        <p>Record audio to identify songs</p>
      </header>

      <main>
        <AudioRecorder
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setMatchResult={setMatchResult}
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
        {isLoading && <div className="loading">Identifying song...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {matchResult && <Results result={matchResult} />}
      </main>
    </div>
  );
}

export default App;