// src/components/Game.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function Game() {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);

  useEffect(() => {
    const fetchMemeAndCaptions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/game/start', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMeme(response.data.meme);
        setCaptions(response.data.captions);
      } catch (error) {
        console.error('Error fetching meme and captions:', error);
      }
    };

    fetchMemeAndCaptions();
  }, []);

  const handleCaptionSelect = async (captionId) => {
    setSelectedCaption(captionId);
    // Submit the round result
    try {
      await axios.post('http://localhost:3000/api/game/round', {
        game_id: 1, // Replace with actual game ID
        round_id: 1, // Replace with actual round ID
        meme_id: meme.id,
        selected_caption_id: captionId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Proceed to the next round or end the game
    } catch (error) {
      console.error('Error submitting round result:', error);
    }
  };

  return (
    <div>
      {meme && <img src={meme.image_path} alt="Meme" />}
      {captions.map((caption) => (
        <button key={caption.id} onClick={() => handleCaptionSelect(caption.id)}>
          {caption.caption_text}
        </button>
      ))}
    </div>
  );
}

export default Game;
