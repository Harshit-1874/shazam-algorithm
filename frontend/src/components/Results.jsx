import React from 'react';

const Results = ({ result }) => {
  // If no match was found
  if (!result || result.match === false) {
    return (
      <div className="results no-match">
        <h2>No Match Found</h2>
        <p>Sorry, we couldn't identify this song. Please try again.</p>
      </div>
    );
  }

  // If match was found
  return (
    <div className="results match-found">
      <h2>Song Identified!</h2>
      <div className="song-details">
        <div className="song-cover">
          {result.album_art ? (
            <img src={result.album_art} alt={`${result.title} cover`} />
          ) : (
            <div className="placeholder-cover"></div>
          )}
        </div>
        <div className="song-info">
          <h3>{result.title}</h3>
          <p className="artist">{result.artist}</p>
          <p className="album">{result.album}</p>
          <p className="year">{result.year}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;