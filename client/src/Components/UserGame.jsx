// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './CSS/GamePage.css';

// const UserGame = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const username = location.state?.username;

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

//     // Function to fetch a random meme
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

//     // Function to fetch captions
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

//     // Function to shuffle an array
//     const shuffleArray = (array) => {
//         return array.sort(() => Math.random() - 0.5);
//     };

//     // Effect to initialize the first round on component mount or round change
//     useEffect(() => {
//         initializeRound();
//     }, [round]);

//     // Effect to handle the game timer
//     useEffect(() => {
//         const timerInterval = setInterval(() => {
//             setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
//         }, 1000);

//         return () => clearInterval(timerInterval);
//     }, []);

//     // Effect to handle timer expiration
//     useEffect(() => {
//         if (timer === 0) {
//             handleTimerExpiration();
//         }
//     }, [timer]);

//     // Function to handle timer expiration
//     const handleTimerExpiration = () => {
//         setMessage("Time's up! You did not select a caption.");
//         setMessageType('danger');
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
//             setMessage(`Incorrect! You selected: "${caption}". The correct caption was: "${correctCaptionParts.join(' and ')}"`);
//             setMessageType('danger');
//         }

//         recordGameState(isCorrect);

//         if (round < 3) {
//             setTimeout(() => {
//                 nextRound();
//             }, 2000);
//         } else {
//             setTimeout(() => {
//                 setMessage(`Game Over! Your final score is ${score + (isCorrect ? 5 : 0)}.`);
//                 setMessageType('info');
//             }, 2000);
//         }
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
//                     rightcaption: correctCaptionParts.join(' and ') // Recording the correct captions
//                 }),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to record game state');
//             }
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
//         }
//     };

//     // Function to handle playing again
//     const handlePlayAgain = () => {
//         setRound(1);
//         setScore(0);
//         setUsedMemes([]);
//         setMessage('');
//         setMessageType('info');
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
//             <Row className="justify-content-center">
//                 <Col md={8} className="text-center">
//                     <h2 className="mb-4">Round {round}</h2>
//                     <p className="mt-4">Time left: {timer} seconds</p>
//                     {message && <Alert variant={messageType} className="message">{message}</Alert>}
//                     {meme ? (
//                         <>
//                             <div className="meme-container">
//                                 <img src={meme.image_path} alt="Meme" className="img-fluid rounded mb-4" />
//                             </div>
//                             <div className="caption-options">
//                                 <h3>Select a caption:</h3>
//                                 {captions.map((caption, index) => (
//                                     <div key={index}>
//                                         <Form.Check
//                                             type="radio"
//                                             id={`caption${index}`}
//                                             label={caption}
//                                             name="caption"
//                                             value={caption}
//                                             onClick={() => handleCaptionClick(caption)}
//                                             className={`caption-option ${getCaptionClass(caption)}`}
//                                         />
//                                     </div>
//                                 ))}
//                                 {round < 3 && (
//                                     <Button variant="primary" className="mt-3" onClick={nextRound}>Skip</Button>
//                                 )}
//                                 <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Exit</Button>
//                             </div>
//                         </>
//                     ) : (
//                         <p>Loading...</p>
//                     )}
//                     <p className="mt-4">Time left: {timer} seconds</p>
//                 </Col>
//             </Row>
//             {captionClicks === 3 && (
//                 <Row className="justify-content-center mt-4">
//                     <Col md={6} className="text-center">
//                         <Alert variant="info">
//                             <p>Game Over! Your final score is {score}.</p>
//                             <Button variant="primary" className="mr-3" onClick={handlePlayAgain}>Play Again</Button>
//                             <Button variant="secondary" onClick={() => navigate('/profile')}>Profile</Button>
//                         </Alert>
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
    const username = location.state?.username;

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

    // Function to fetch a random meme
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

    // Function to fetch captions
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

    // Function to fetch correct caption parts for a given meme ID
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

    // Function to initialize a new round
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

    // Function to shuffle an array
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Effect to initialize the first round on component mount or round change
    useEffect(() => {
        initializeRound();
    }, [round]);

    // Effect to handle the game timer
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // Effect to handle timer expiration
    useEffect(() => {
        if (timer === 0) {
            handleTimerExpiration();
        }
    }, [timer]);

    // Function to handle timer expiration
    const handleTimerExpiration = () => {
        setMessage("Time's up! You did not select a caption.");
        setMessageType('danger');
        setTimeout(() => {
            nextRound();
        }, 2000);
    };

    // Function to handle caption click
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
            setMessage(`Incorrect! You selected: "${caption}". The correct caption was: "${correctCaptionParts.join(' and ')}"`);
            setMessageType('danger');
        }

        recordGameState(isCorrect);

        if (round < 3) {
            setTimeout(() => {
                nextRound();
            }, 2000);
        } else {
            setTimeout(() => {
                setMessage(`Game Over! Your final score is ${score + (isCorrect ? 5 : 0)}.`);
                setMessageType('info');
            }, 2000);
        }
    };

    // Function to record game state
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
                    rightcaption: correctCaptionParts.join(' and '),
                    image_path: meme.image_path // Include the image path in the request
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to record game state');
            }
        } catch (error) {
            console.error('Error recording game state:', error);
            setMessage('An error occurred while recording the game state.');
            setMessageType('danger');
        }
    };

    // Function to proceed to the next round
    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            setMessage('Getting ready for the next round...');
            setMessageType('info');
        }
    };

    // Function to handle playing again
    const handlePlayAgain = () => {
        setRound(1);
        setScore(0);
        setUsedMemes([]);
        setMessage('');
        setMessageType('info');
        initializeRound();
    };

    // Function to get caption class based on correctness
    const getCaptionClass = (caption) => {
        if (!selectedCaption) return '';

        if (caption === selectedCaption) {
            return isCorrectCaption ? 'caption-correct' : 'caption-incorrect';
        }

        return '';
    };

    return (
        <Container className="game-page-container">
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h2 className="mb-4">Round {round}</h2>
                    <p className="mt-4">Time left: {timer} seconds</p>
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
                                    <Button variant="primary" className="mt-3" onClick={nextRound}>Skip</Button>
                                )}
                                <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>Exit</Button>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <p className="mt-4">Time left: {timer} seconds</p>
                </Col>
            </Row>
            {captionClicks === 3 && (
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center">
                        <Alert variant="info">
                            <p>Game Over! Your final score is {score}.</p>
                            <Button variant="primary" className="mr-3" onClick={handlePlayAgain}>Play Again</Button>
                            <Button variant="secondary" onClick={() => navigate('/profile')}>Profile</Button>
                        </Alert>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default UserGame;
