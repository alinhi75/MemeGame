// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { gameAPI } from '../../API/api';
// // import axios from 'axios';

// const GamePage = () => {
//   const [meme, setMeme] = useState(null);
//   const [captions, setCaptions] = useState([]);
//   const [selectedCaption, setSelectedCaption] = useState(null);
//   const [round, setRound] = useState(1);
//   const [score, setScore] = useState(0);
//   const [message, setMessage] = useState('');
//   const [timer, setTimer] = useState(30); // Timer in seconds
//   const navigate = useNavigate();

//   //FETCH A RANDOM MEME WITHOUT USING AXIOS
//   const fetchRandomMeme = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/random-meme');
//       if (!response.ok) {
//         throw new Error('Failed to fetch random meme');
//       }
//       const data = await response.json();
//       // console.log(data);
//       setMeme(data.image_path); // Assuming `data` is the URL of the meme image
//     } catch (error) {
//       console.error('Error fetching random meme:', error);
//       setMessage('An error occurred while fetching the random meme.');
//     }
//   };
  



  
//   const fetchCaptions = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/caption');
//       if (!response.ok) {
//         throw new Error('Failed to fetch random caption');
//       }
//       const data = await response.json();
//       // console.log(data);
//       setCaptions(data); // Assuming `data` is the caption text
//     }
//     catch (error) {
//       console.error('Error fetching random caption:', error);
//       setMessage('An error occurred while fetching the random caption.');
//     }
//   };

//   useEffect(() => {
//     fetchRandomMeme();
//     fetchCaptions();
//   }, [round]);

//   useEffect(() => {
//     const timerInterval = setInterval(() => {
//       setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
//     }, 1000);

//     return () => clearInterval(timerInterval);
//   }, []);

//   useEffect(() => {
//     if (timer === 0) {
//       handleTimerExpiration();
//     }
//   }, [timer]);
  
//   const handleTimerExpiration = () => {
//     setMessage("Time's up! You did not select a caption.");
//     setTimeout(() => {
//       nextRound();
//     }, 2000); // Wait 2 seconds before proceeding to the next round
//   };

//   const handleCaptionClick = (caption) => {
    
//     setSelectedCaption(caption);
//     // Assuming correctCaptions is a property of meme (adjust accordingly)
//     // const isCorrect = meme.correctCaptions.includes(caption);

//     // Placeholder logic for checking correct caption
//     const isCorrect = true; // Replace with actual logic

//     if (isCorrect) {
//       setScore((prevScore) => prevScore + 5);
//       alert('Correct! You got it right and 5 points added to your score!');
//     } else {
//       alert(`Incorrect! The correct captions were: ${meme.correctCaptions.join(', ')}`);
//     }

//     setTimeout(() => {
//       nextRound();
//     }, 1000); // Wait 2 seconds before proceeding to the next round
//   };

//   const nextRound = () => {
//     if (round < 3) {
//       setRound((prevRound) => prevRound + 1);
//     } else {
//       alert(`Game Over! Your final score is ${score}`);
//       navigate('/');
//     }
//   };

//   return (
//     <div className="game-page">
//       <div>
//         <h2>Round {round}</h2>
//         {meme ? (
//           <>
//             <img src={meme}  alt="Meme" />
//             <div>
//               <h3>Select a caption:</h3>
              
//               <div>
//                 <input type="radio" id="caption1" name="caption" value={captions[0]} onClick={() => handleCaptionClick(captions[0])} />
//                 <label htmlFor="caption1">{captions[0]}</label><br/>
//                 <input type="radio" id="caption2" name="caption" value={captions[1]} onClick={() => handleCaptionClick(captions[1])} />
//                 <label htmlFor="caption2">{captions[1]}</label><br/>
//                 <input type="radio" id="caption3" name="caption" value={captions[2]} onClick={() => handleCaptionClick(captions[2])} />
//                 <label htmlFor="caption3">{captions[2]}</label><br/>
//                 <input type="radio" id="caption4" name="caption" value={captions[3]} onClick={() => handleCaptionClick(captions[3])} />
//                 <label htmlFor="caption4">{captions[3]}</label><br/>
//                 <input type="radio" id="caption5" name="caption" value={captions[4]} onClick={() => handleCaptionClick(captions[4])} />
//                 <label htmlFor="caption5">{captions[4]}</label><br/>
//                 <input type="radio" id="caption6" name="caption" value={captions[5]} onClick={() => handleCaptionClick(captions[5])} />
//                 <label htmlFor="caption6">{captions[5]}</label><br/>
//                 <input type="radio" id="caption7" name="caption" value={captions[6]} onClick={() => handleCaptionClick(captions[6])} />
//                 <label htmlFor="caption7">{captions[6]}</label><br/> 

                

//               </div>  
//               <button onClick={nextRound}>Skip</button>
//               <br/>
//               <button onClick={() => navigate('/')}>Exit</button>
              

              
//             </div>
//           </>
//         )  : (
//           <p>Loading...</p>
//         )}
//         <p>Time left: {timer} seconds</p>
//         {message && <p>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default GamePage;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gameAPI } from '../../API/api';
// import memePlaceholder from '../../assets/meme-placeholder.jpg'; // Replace with your actual image path

const GamePage = () => {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(30); // Timer in seconds
  const navigate = useNavigate();

  // Fetch a random meme and captions from API
  const fetchRandomMeme = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/random-meme');
      if (!response.ok) {
        throw new Error('Failed to fetch random meme');
      }
      const data = await response.json();
      setMeme(data.image_path); // Assuming `data` contains the URL of the meme image
    } catch (error) {
      console.error('Error fetching random meme:', error);
      setMessage('An error occurred while fetching the random meme.');
    }
  };

  const fetchCaptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/caption');
      if (!response.ok) {
        throw new Error('Failed to fetch captions');
      }
      const data = await response.json();
      setCaptions(data); // Assuming `data` is an array of caption strings
    } catch (error) {
      console.error('Error fetching captions:', error);
      setMessage('An error occurred while fetching the captions.');
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
    // Placeholder logic for checking correct caption
    const isCorrect = true; // Replace with actual logic

    if (isCorrect) {
      setScore((prevScore) => prevScore + 5);
      setMessage('Correct! You got it right and 5 points added to your score!');
    } else {
      setMessage(`Incorrect! The correct captions were: ${meme.correctCaptions.join(', ')}`);
    }

    setTimeout(() => {
      nextRound();
    }, 1000); // Wait 2 seconds before proceeding to the next round
  };

  const nextRound = () => {
    if (round < 3) {
      setRound((prevRound) => prevRound + 1);
    } else {
      // setmessage on top of the page

      setMessage(`Game Over! Your final score is ${score}`,'You will be redirected to the home page shortly');
      setTimeout(() => {
        navigate('/');
      }, 5000);
      
    }
  };

  return (
    <Container className="game-page-container">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="mb-4">Round {round}</h2>
          {meme ? (
            <>
              <img src={meme} alt="Meme" className="img-fluid rounded mb-4" style={{ maxHeight: '300px' }} />
              <div className="caption-options">
                <h3>Select a caption:</h3>
                {captions.map((caption, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    id={`caption${index + 1}`}
                    label={caption}
                    name="caption"
                    value={caption}
                    onClick={() => handleCaptionClick(caption)}
                  />
                ))}
                <Button variant="primary" className="mt-3 mr-3" onClick={nextRound}>Skip</Button>
                <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Exit</Button>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <p className="mt-4">Time left: {timer} seconds</p>
          {message && <Alert variant="info">{message}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
