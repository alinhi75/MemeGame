// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './CSS/GamePage.css';

// const UserGame = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const username = location.state?.username || localStorage.getItem('username');

//     const [meme, setMeme] = useState(null);
//     const [captions, setCaptions] = useState([]);
//     const [selectedCaption, setSelectedCaption] = useState(null);
//     const [isCorrectCaption, setIsCorrectCaption] = useState(null);
//     const [correctCaptionParts, setCorrectCaptionParts] = useState([]);
//     const [round, setRound] = useState(1);
//     const [score, setScore] = useState(0);
//     const [message, setMessage] = useState('');
//     const [timer, setTimer] = useState(30); // Timer in seconds
//     const [usedMemes, setUsedMemes] = useState([]);
//     const [messageType, setMessageType] = useState('info');
//     const [captionClicks, setCaptionClicks] = useState(0);
//     const [gameSummary, setGameSummary] = useState([]);
//     const [gameEnded, setGameEnded] = useState(false);
//     const [gameStateRecorded, setGameStateRecorded] = useState(false); // New state to track if game state is recorded

//     // Function to fetch a random meme from the API
//     const fetchRandomMeme = async () => {
//         try {
//             let memeId;
//             let data;

//             do {
//                 const response = await fetch('http://localhost:3001/api/random-meme');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch random meme');
//                 }
//                 data = await response.json();
//                 memeId = data.meme_id;
//             } while (usedMemes.includes(memeId));

//             setMeme(data);
//             setUsedMemes([...usedMemes, memeId]);
//             return memeId;
//         } catch (error) {
//             console.error('Error fetching random meme:', error);
//             setMessage('An error occurred while fetching the random meme.');
//             setMessageType('danger');
//         }
//     };

//     // Function to fetch captions from the API
//     const fetchCaptions = async () => {
//         try {
//             const response = await fetch('http://localhost:3001/api/caption');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch captions');
//             }
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('Error fetching captions:', error);
//             setMessage('An error occurred while fetching the captions.');
//             setMessageType('danger');
//         }
//     };

//     // Function to fetch correct caption parts for a given meme ID
//     const fetchCorrectCaption = async (memeId) => {
//         try {
//             const response = await fetch(`http://localhost:3001/api/correct-caption/${memeId}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch correct caption');
//             }
//             const data = await response.json();
//             const parts = data.split(',');
//             setCorrectCaptionParts(parts);
//             return parts;
//         } catch (error) {
//             console.error('Error fetching correct caption:', error);
//             setMessage('An error occurred while fetching the correct caption.');
//             setMessageType('danger');
//         }
//     };

//     // Function to initialize a new round
//     const initializeRound = async () => {
//         const memeId = await fetchRandomMeme();
//         const captions = await fetchCaptions();
//         if (memeId) {
//             const correctCaptionParts = await fetchCorrectCaption(memeId);

//             if (captions && correctCaptionParts) {
//                 const allCaptions = [...captions, ...correctCaptionParts];
//                 setCaptions(shuffleArray(allCaptions));
//             }
//         }
//     };

//     // Function to shuffle an array of all captions
//     const shuffleArray = (array) => {
//         return array.sort(() => Math.random() - 0.5);
//     };

//     // Effect to initialize the first round on component mount or round change
//     useEffect(() => {
//         initializeRound();
//     }, [round]);

//     // Effect to handle the game timer
//     useEffect(() => {
//         let timerInterval;
//         if (!gameEnded) {
//             timerInterval = setInterval(() => {
//                 setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
//             }, 1000);
//         }

//         return () => clearInterval(timerInterval);
//     }, [gameEnded]);

//     // Effect to handle timer expiration
//     useEffect(() => {
//         if (timer === 0 && !gameEnded) {
//             handleTimerExpiration();
//         }
//     }, [timer, gameEnded]);

//     // Function to handle timer expiration
//     const handleTimerExpiration = () => {
//         setMessage("Time's up! You did not select a caption.");
//         setMessageType('danger');
//         updateGameSummary(null, false);
//         setTimeout(() => {
//             nextRound();
//         }, 2000);
//     };

//     // Function to handle caption click
//     const handleCaptionClick = (caption) => {
//         setSelectedCaption(caption);
//         setCaptionClicks((prevClicks) => prevClicks + 1);

//         const isCorrect = correctCaptionParts.includes(caption);
//         setIsCorrectCaption(isCorrect);

//         if (isCorrect) {
//             setScore((prevScore) => prevScore + 5);
//             setMessage('Correct! You got it right and 5 points added to your score!');
//             setMessageType('success');
//         } else {
//             setMessage(`Incorrect! The correct caption was: "${correctCaptionParts.join(' <AND> ')}"`);
//             setMessageType('danger');
//         }

//         updateGameSummary(caption, isCorrect);

//         // Record game state only if the user has completed the round
//         if (round === 3) {
//             recordGameState(isCorrect);
//         }

//         setTimeout(() => {
//             if (round < 3 && !gameEnded) {
//                 nextRound();
//             } else {
//                 endGame();
//             }
//         }, 2000);
//     };

//     // Function to update game summary
//     const updateGameSummary = (caption, isCorrect) => {
//         setGameSummary((prevSummary) => [
//             ...prevSummary,
//             {
//                 round,
//                 meme: meme.image_path,
//                 selectedCaption: caption,
//                 isCorrect,
//                 correctCaption: correctCaptionParts.join(' <AND> ')
//             }
//         ]);
//     };

//     // Function to record game state
//     const recordGameState = async (isCorrect) => {
//         try {
//             const response = await fetch('http://localhost:3001/api/record-game', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     round,
//                     username,
//                     score: isCorrect ? 5 : 0,
//                     caption: selectedCaption || (correctCaptionParts.length > 0 ? correctCaptionParts[0] : null),
//                     rightcaption: correctCaptionParts.join(' <AND> '),
//                     image_path: meme.image_path // Include the image path in the request
//                 }),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to record game state');
//             }
//             setGameStateRecorded(true); // Mark game state as recorded
//         } catch (error) {
//             console.error('Error recording game state:', error);
//             setMessage('An error occurred while recording the game state.');
//             setMessageType('danger');
//         }
//     };

//     // Function to proceed to the next round
//     const nextRound = () => {
//         if (round < 3) {
//             setRound((prevRound) => prevRound + 1);
//             setTimer(30);
//             setMessage('Getting ready for the next round...');
//             setMessageType('info');
//             setSelectedCaption(null);
//             setIsCorrectCaption(null);
//             setGameStateRecorded(false); // Reset game state recorded flag for next round
//         } else {
//             setGameEnded(true);
//         }
//     };

//     // Function to end the game
//     const endGame = () => {
//         setCaptionClicks(3);
//         setGameEnded(true);

//         // If the game has not been completed (user exits before round 3), ensure game state is not recorded
//         if (!gameStateRecorded) {
//             setGameSummary([]); // Clear game summary
//             setMessage('Game is not completed due to User exited before round 3 or the timer expired.');
//         }
//     };

//     // Function to handle playing again
//     const handlePlayAgain = () => {
//         setRound(1);
//         setScore(0);
//         setUsedMemes([]);
//         setMessage('');
//         setMessageType('info');
//         setCaptionClicks(0);
//         setGameSummary([]);
//         setGameEnded(false);
//         initializeRound();
//     };

//     // Function to get caption class based on correctness
//     const getCaptionClass = (caption) => {
//         if (!selectedCaption) return '';

//         if (caption === selectedCaption) {
//             return isCorrectCaption ? 'caption-correct' : 'caption-incorrect';
//         }

//         return '';
//     };


//     return (
//         <Container className="game-page-container">
//             {gameEnded ? (
//                 <Row className="justify-content-center mt-4">
//                     <Col md={8} className="text-center">
//                         <h2>Game Summary</h2>
//                         <Alert variant="info">
//                             <p>Game Over! Your final score is {score}.</p>
//                             <p>Game is not completed due to User exited before round 3 or the timer expired.</p>
//                             {gameSummary.map((roundSummary, index) => (
//                                 <div key={index} className="round-summary mb-3">
//                                     <h4>Round {roundSummary.round}</h4>
//                                     <img src={roundSummary.meme} alt={`Meme Round ${roundSummary.round}`} className="img-fluid rounded mb-2" />
//                                     <p><strong>Selected Caption:</strong> {roundSummary.selectedCaption}</p>
//                                     {roundSummary.isCorrect ? (
//                                         <p className="text-success"><strong>Result:</strong> Correct</p>
//                                     ) : (
//                                         <>
//                                             <p className="text-danger"><strong>Result:</strong> Incorrect</p>
//                                             <p><strong>Correct Caption:</strong> {roundSummary.correctCaption}</p>
//                                         </>
//                                     )}
//                                 </div>
//                             ))}
//                             <Button variant="primary" className="mr-3" onClick={handlePlayAgain}>Play Again</Button>
//                             <Button variant="secondary" onClick={() => navigate('/profile')}>Profile</Button>
//                         </Alert>
//                     </Col>
//                 </Row>
//             ) : (
//                 <Row className="justify-content-center">
//                     <Col md={8} className="text-center">
//                         <h2 className="mb-4">Round {round}</h2>
//                         {message && <Alert variant={messageType} className="message">{message}</Alert>}
//                         {meme ? (
//                             <>
//                                 <div className="meme-container">
//                                     <img src={meme.image_path} alt="Meme" className="img-fluid rounded mb-4" />
//                                 </div>
//                                 <div className="caption-options">
//                                     <h3>Select a caption:</h3>
//                                     {captions.map((caption, index) => (
//                                         <div key={index}>
//                                             <Form.Check
//                                                 type="radio"
//                                                 id={`caption${index}`}
//                                                 label={caption}
//                                                 name="caption"
//                                                 value={caption}
//                                                 onClick={() => handleCaptionClick(caption)}
//                                                 className={`caption-option ${getCaptionClass(caption)}`}
//                                             />
//                                         </div>
//                                     ))}
//                                     {round < 3 && (
//                                         <Button variant="primary" className="mt-3" onClick={nextRound}>Skip</Button>
//                                     )}
//                                     <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Exit</Button>
//                                 </div>
//                             </>
//                         ) : (
//                             <p>Loading...</p>
//                         )}
//                         <p className="mt-4">Time left: {timer} seconds</p>
//                     </Col>
//                 </Row>
//             )}
//         </Container>
//     );
// };

// export default UserGame;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/GamePage.css';

const UserGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username || localStorage.getItem('username');

    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [isCorrectCaption, setIsCorrectCaption] = useState(null);
    const [correctCaptionParts, setCorrectCaptionParts] = useState([]);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30); // Timer in seconds
    const [usedMemes, setUsedMemes] = useState([]);
    const [messageType, setMessageType] = useState('info');
    const [captionClicks, setCaptionClicks] = useState(0);
    const [gameSummary, setGameSummary] = useState([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameStateRecorded, setGameStateRecorded] = useState(false);

    const fetchRandomMeme = async () => {
        try {
            let memeId;
            let data;

            do {
                const response = await fetch('http://localhost:3001/api/random-meme');
                if (!response.ok) {
                    throw new Error('Failed to fetch random meme');
                }
                data = await response.json();
                memeId = data.meme_id;
            } while (usedMemes.includes(memeId));

            setMeme(data);
            setUsedMemes([...usedMemes, memeId]);
            return memeId;
        } catch (error) {
            console.error('Error fetching random meme:', error);
            setMessage('An error occurred while fetching the random meme.');
            setMessageType('danger');
        }
    };

    const fetchCaptions = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/caption');
            if (!response.ok) {
                throw new Error('Failed to fetch captions');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching captions:', error);
            setMessage('An error occurred while fetching the captions.');
            setMessageType('danger');
        }
    };

    const fetchCorrectCaption = async (memeId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/correct-caption/${memeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch correct caption');
            }
            const data = await response.json();
            const parts = data.split(',');
            setCorrectCaptionParts(parts);
            return parts;
        } catch (error) {
            console.error('Error fetching correct caption:', error);
            setMessage('An error occurred while fetching the correct caption.');
            setMessageType('danger');
        }
    };

    const initializeRound = async () => {
        const memeId = await fetchRandomMeme();
        const captions = await fetchCaptions();
        if (memeId) {
            const correctCaptionParts = await fetchCorrectCaption(memeId);

            if (captions && correctCaptionParts) {
                const allCaptions = [...captions, ...correctCaptionParts];
                setCaptions(shuffleArray(allCaptions));
            }
        }
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        initializeRound();
    }, [round]);

    useEffect(() => {
        let timerInterval;
        if (!gameEnded) {
            timerInterval = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [gameEnded]);

    useEffect(() => {
        if (timer === 0 && !gameEnded) {
            handleTimerExpiration();
        }
    }, [timer, gameEnded]);

    const handleTimerExpiration = () => {
        setMessage("Time's up! You did not select a caption.");
        setMessageType('danger');
        updateGameSummary(null, false);
        setTimeout(() => {
            nextRound();
        }, 2000);
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);
        setCaptionClicks((prevClicks) => prevClicks + 1);

        const isCorrect = correctCaptionParts.includes(caption);
        setIsCorrectCaption(isCorrect);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 5);
            setMessage('Correct! You got it right and 5 points added to your score!');
            setMessageType('success');
        } else {
            setMessage(`Incorrect! The correct caption was: "${correctCaptionParts.join(' <AND> ')}"`);
            setMessageType('danger');
        }

        updateGameSummary(caption, isCorrect);

        if (round === 3) {
            recordGameState(isCorrect);
        }

        setTimeout(() => {
            if (round < 3 && !gameEnded) {
                nextRound();
            } else {
                endGame();
            }
        }, 2000);
    };

    const updateGameSummary = (caption, isCorrect) => {
        setGameSummary((prevSummary) => [
            ...prevSummary,
            {
                round,
                meme: meme.image_path,
                selectedCaption: caption,
                isCorrect,
                correctCaption: correctCaptionParts.join(' <AND> ')
            }
        ]);
    };

    const recordGameState = async (isCorrect) => {
        try {
            const response = await fetch('http://localhost:3001/api/record-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    round,
                    username,
                    score: isCorrect ? 5 : 0,
                    caption: selectedCaption || (correctCaptionParts.length > 0 ? correctCaptionParts[0] : null),
                    rightcaption: correctCaptionParts.join(' <AND> '),
                    image_path: meme.image_path
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to record game state');
            }
            setGameStateRecorded(true);
        } catch (error) {
            console.error('Error recording game state:', error);
            setMessage('An error occurred while recording the game state.');
            setMessageType('danger');
        }
    };

    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            setMessage('Getting ready for the next round...');
            setMessageType('info');
            setSelectedCaption(null);
            setIsCorrectCaption(null);
            setGameStateRecorded(false);
        } else {
            setGameEnded(true);
        }
    };

    const endGame = () => {
        setCaptionClicks(3);
        setGameEnded(true);
        setMessage('');
    };

    const handlePlayAgain = () => {
        setRound(1);
        setScore(0);
        setUsedMemes([]);
        setMessage('');
        setMessageType('info');
        setCaptionClicks(0);
        setGameSummary([]);
        setGameEnded(false);
        initializeRound();
    };

    const getCaptionClass = (caption) => {
        if (!selectedCaption) return '';

        if (caption === selectedCaption) {
            return isCorrectCaption ? 'caption-correct' : 'caption-incorrect';
        }

        return '';
    };

    return (
        <Container className="game-page-container">
            {gameEnded ? (
                <Row className="justify-content-center mt-4">
                    <Col md={8} className="text-center">
                        <h2>Game Summary</h2>
                        <Alert variant="info">
                            <p>Game Over! Your final score is {score}.</p>
                            {gameSummary.map((roundSummary, index) => (
                                <div key={index} className="round-summary mb-3">
                                    <h4>Round {roundSummary.round}</h4>
                                    <img src={roundSummary.meme} alt={`Meme Round ${roundSummary.round}`} className="img-fluid rounded mb-2" />
                                    <p><strong>Selected Caption:</strong> {roundSummary.selectedCaption}</p>
                                    {roundSummary.isCorrect ? (
                                        <p className="text-success"><strong>Result:</strong> Correct</p>
                                    ) : (
                                        <>
                                            <p className="text-danger"><strong>Result:</strong> Incorrect</p>
                                            <p><strong>Correct Caption:</strong> {roundSummary.correctCaption}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                            <Button variant="primary" className="mr-3" onClick={handlePlayAgain}>Play Again</Button>
                            <Button variant="secondary" onClick={() => navigate('/profile')}>Profile</Button>
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <h2 className="mb-4">Round {round}</h2>
                        {message && <Alert variant={messageType} className="message">{message}</Alert>}
                        {meme ? (
                            <>
                                <div className="meme-container">
                                    <img src={meme.image_path} alt="Meme" className="img-fluid rounded mb-4" />
                                </div>
                                <div className="caption-options">
                                    <h3>Select a caption:</h3>
                                    {captions.map((caption, index) => (
                                        <div key={index}>
                                            <Form.Check
                                                type="radio"
                                                id={`caption${index}`}
                                                label={caption}
                                                name="caption"
                                                value={caption}
                                                onClick={() => handleCaptionClick(caption)}
                                                className={`caption-option ${getCaptionClass(caption)}`}
                                            />
                                        </div>
                                    ))}
                                    {round < 3 && (
                                        // <Button variant="primary" className="mt-3" onClick={nextRound}>Skip</Button>
                                        <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Exit</Button>
                                    )}
                                    
                                </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                        <p className="mt-4">Time left: {timer} seconds</p>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default UserGame;
