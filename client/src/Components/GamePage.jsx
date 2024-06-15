import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gameAPI } from '../../API/api';
// import axios from 'axios';

const GamePage = () => {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(30); // Timer in seconds
  const navigate = useNavigate();

  //FETCH A RANDOM MEME WITHOUT USING AXIOS
  const fetchRandomMeme = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/random-meme');
      if (!response.ok) {
        throw new Error('Failed to fetch random meme');
      }
      const data = await response.json();
      console.log(data);
      setMeme(data.image_path); // Assuming `data` is the URL of the meme image
    } catch (error) {
      console.error('Error fetching random meme:', error);
      setMessage('An error occurred while fetching the random meme.');
    }
  };
  



  //FETCH A RANDOM caption WITHOUT USING AXIOS
  const fetchCaptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/caption');
      if (!response.ok) {
        throw new Error('Failed to fetch random caption');
      }
      const data = await response.json();
      console.log(data.caption_text);
      setCaptions(data.caption_text); // Assuming `data` is the caption text
    }
    catch (error) {
      console.error('Error fetching random caption:', error);
      setMessage('An error occurred while fetching the random caption.');
    }
  };

  useEffect(() => {
    fetchRandomMeme();
    fetchCaptions();
  }, [round]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleTimerExpiration();
    }
  }, [timer]);
  
  const handleTimerExpiration = () => {
    setMessage("Time's up! You did not select a caption.");
    setTimeout(() => {
      nextRound();
    }, 2000); // Wait 2 seconds before proceeding to the next round
  };

  const handleCaptionClick = (caption) => {
    setSelectedCaption(caption);
    // Assuming correctCaptions is a property of meme (adjust accordingly)
    // const isCorrect = meme.correctCaptions.includes(caption);

    // Placeholder logic for checking correct caption
    const isCorrect = true; // Replace with actual logic

    if (isCorrect) {
      setScore((prevScore) => prevScore + 5);
      alert('Correct! You got it right and 5 points added to your score!');
    } else {
      alert(`Incorrect! The correct captions were: ${meme.correctCaptions.join(', ')}`);
    }

    setTimeout(() => {
      nextRound();
    }, 2000); // Wait 2 seconds before proceeding to the next round
  };

  const nextRound = () => {
    if (round < 3) {
      setRound((prevRound) => prevRound + 1);
    } else {
      alert(`Game Over! Your final score is ${score}`);
      navigate('/');
    }
  };

  return (
    <div className="game-page">
      <div>
        <h2>Round {round}</h2>
        {meme ? (
          <>
            <img src={meme}  alt="Meme" />
            <div>
              <h3>Select a caption:</h3>
              //show captions with out using map function with checkbox selection
              <div>
                <input type="radio" id="caption1" name="caption" value={captions} onClick={() => handleCaptionClick(captions[0])} />
                <label htmlFor="caption1">{captions}</label>
                <input type="radio" id="caption2" name="caption" value={captions} onClick={() => handleCaptionClick(captions[1])} />
                <label htmlFor="caption2">{captions}</label>
                <input type="radio" id="caption3" name="caption" value={captions} onClick={() => handleCaptionClick(captions[2])} />
                <label htmlFor="caption3">{captions}</label>

              </div>  
              
            </div>
          </>
        )  : (
          <p>Loading...</p>
        )}
        <p>Time left: {timer} seconds</p>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default GamePage;
