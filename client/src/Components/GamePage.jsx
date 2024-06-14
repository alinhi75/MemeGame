// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';


// const GamePage = ({ user }) => {
//     // const memeId = Math.floor(Math.random() * 10) + 1;
//     const navigate = useNavigate();

//     // State variables
//     const [meme, setMeme] = useState(null);
//     const [captions, setCaptions] = useState([]);
//     const [selectedCaption, setSelectedCaption] = useState('');
//     const [timer, setTimer] = useState(30);
//     const [roundScore, setRoundScore] = useState(0);
//     const [roundNumber, setRoundNumber] = useState(1);



//     // Timer countdown effect
//     useEffect(() => {
//         const countdown = setInterval(() => {
//             if (timer > 0) {
//                 setTimer(timer - 1);
//             } else {
//                 handleTimeout();
//             }
//         }, 1000);

//         return () => clearInterval(countdown);
//     }, [timer]);

//     // Handle caption selection
//     const handleCaptionSelection = (caption) => {
//         setSelectedCaption(caption);
//     };

//     // Handle submit button click
//     const handleSubmit = () => {
//         const isCorrect = selectedCaption === meme.correctCaption;
//         if (isCorrect) {
//             setRoundScore(5);
//         } else {
//             setRoundScore(0);
//         }
//         handleNextRound();
//     };

//     // Move to the next round or end game logic
//     const handleNextRound = () => {
//         if (roundNumber < 3) {
//             setRoundNumber(roundNumber + 1);
//         } else {
//             // show the alert with the score then go home
//             alert(`Game Over! Your final score is ${roundScore}`);
//             navigate('/');
            
//         }
//     };

//     // Handle when timer runs out
//     const handleTimeout = () => {
//         setRoundScore(0);
//         handleNextRound();
//     };

//     // Utility function to shuffle array
//     const shuffleArray = (array) => {
//         if (!Array.isArray(array)) {
//             console.error('Invalid argument passed to shuffleArray: ', array);
//             return [];
//         }
    
//         // Fisher-Yates shuffle algorithm
//         let currentIndex = array.length, temporaryValue, randomIndex;
//         while (currentIndex !== 0) {
//             randomIndex = Math.floor(Math.random() * currentIndex);
//             currentIndex -= 1;
//             temporaryValue = array[currentIndex];
//             array[currentIndex] = array[randomIndex];
//             array[randomIndex] = temporaryValue;
//         }
//         return array;
//     };

//     // Render the game UI
//     return (
//         <div className="game-container">
//             <h2>Round {roundNumber}</h2>
//             <h3>Guess the caption:</h3>
//             {/* <img src={`public/images/${memeId}`} alt="Meme" className="meme-image" /> */}
//             {/* <h3>Select the correct caption:</h3> */}
//             <img src={`public/images/Meme`} alt="Meme" className="meme-image" />
//             <h3>Select the correct caption:</h3>
//             <div className="caption-options">
//                 {captions.map((caption, index) => (
//                     <button key={index} onClick={() => handleCaptionSelection(caption)}>
//                         {caption}
//                     </button>
//                 ))}
//             </div>
//             <p>Time left: {timer} seconds</p>
//             <button onClick={handleSubmit}>Submit</button>
//             <button onClick={handleNextRound}>Next Round</button>
//             <button onClick={() => navigate('/')}>Exit</button>
//             <p>Score this round: {roundScore}</p>
//         </div>
//     );
// };

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const memeData = [
  {
    id: 'meme1',
    imageUrl: '/Meme1.jpg',
    correctCaptions: ['Caption 1', 'Caption 2'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme2',
    imageUrl: '/Meme2.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme3',
    imageUrl: '/Meme3.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme4',
    imageUrl: '/Meme4.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme5',
    imageUrl: '/Meme5.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme6',
    imageUrl: '/Meme6.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  {
    id: 'meme7',
    imageUrl: '/Meme7.jpg',
    correctCaptions: ['Caption 3', 'Caption 4'],
    captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5', 'Caption 6', 'Caption 7'],
  },
  // Add more meme data as needed
];

const generateRandomMemeIndex = () => {
  return Math.floor(Math.random() * memeData.length);
};

const GamePage = () => {
  const [memeIndex, setMemeIndex] = useState(generateRandomMemeIndex());
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(30); // Timer in seconds
  const navigate = useNavigate();

  useEffect(() => {
    // Update captions when meme index changes
    setCaptions(memeData[memeIndex].captions);

    // Reset timer on each meme change
    setTimer(30);
  }, [memeIndex]);

  useEffect(() => {
    // Timer logic
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Cleanup function for clearInterval
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    // Check timer expiration
    if (timer === 0) {
      handleTimerExpiration();
    }
  }, [timer]);

  const handleTimerExpiration = () => {
    // Handle when timer reaches 0
    setMessage('Time\'s up! You did not select a caption.');
    setTimeout(() => {
      nextRound();
    }, 2000); // Wait 2 seconds before proceeding to next round
  };

  const handleCaptionClick = (caption) => {
    setSelectedCaption(caption);
    const correctCaptions = memeData[memeIndex].correctCaptions;
    
    if (correctCaptions.includes(caption)) {
      setScore((prevScore) => prevScore + 5);
      // alert the user that they got it right
        alert('Correct!you Got it right and 5 points added to your score!');
    } else {
      alert(`Incorrect! The correct captions were: ${correctCaptions.join(', ')}`);
    }

    // Proceed to the next round
    setTimeout(() => {
      nextRound();
    }, 2000); // Wait 2 seconds before proceeding to next round
  };

  const nextRound = () => {
    if (round < 3) {
      setRound((prevRound) => prevRound + 1);
      setMemeIndex(generateRandomMemeIndex());
      setSelectedCaption(null);
      setMessage('');
      setTimer(30); // Reset timer for the next round
    } else {
      // End of game
      alert(`Game Over! Your final score is ${score}`);
      navigate('/');
    }
  };

  return (
    <div className="game-page">
      <div>
        <h2>Round {round}</h2>
        <img src={'public/Images' + memeData[memeIndex].imageUrl} alt="Meme" />
        <div className="captions">
          {captions.map((caption, index) => (
            <button
              key={index}
              className={`caption-button ${selectedCaption === caption ? 'selected' : ''}`}
              onClick={() => handleCaptionClick(caption)}
              disabled={!!selectedCaption}
            >
              {caption}
            </button>
          ))}
        </div>
        <p>Time left: {timer} seconds</p>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default GamePage;

