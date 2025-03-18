import React from 'react';

const Results = ({ result }) => {
  // If no match was found
  if (!result || result.match === false) {
    return (
      <div className="results no-match">
        <h2>No Match Found</h2>
        <p>Sorry, we couldn't identify this song. Please try recording again when the music is clearer.</p>
      </div>
    );
  }

  return (
    <div className="results match-found">
      <h2>Song Identified!</h2>
      <div className="song-details">
        <div className="song-cover">
          {result.album_art ? (
            <img src={result.album_art} alt={`${result.title} cover`} />
          ) : (
            <div className="placeholder-cover">
              {result.title.charAt(0)}
              {result.artist.charAt(0)}
            </div>
          )}
        </div>
        <div className="song-info">
          <h3>{result.title}</h3>
          <p className="artist">{result.artist}</p>
          <p className="album">{result.album}</p>
          <p className="year">{result.year}</p>
          {result.confidence && (
            <div className="confidence">
              Match confidence: {Math.round(result.confidence * 100)}%
            </div>
          )}
        </div>
      </div>
      
      {/* Optional: Add actions like "Listen on Spotify" or "See lyrics" */}
      <div className="song-actions">
        {/* These buttons would be linked to actual services in a real app */}
      </div>
    </div>
  );
};

export default Results;