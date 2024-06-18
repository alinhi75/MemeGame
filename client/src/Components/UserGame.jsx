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
    const [correctCaptionParts, setCorrectCaptionParts] = useState([]);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30); // Timer in seconds
    const [usedMemes, setUsedMemes] = useState([]);

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
        }
    };
    // const fetchMemeData = async (memeId) => {
    //     try {
    //       const response = await fetch(`http://localhost:3001/api/memes/${memeId}`);
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch meme data');
    //       }
    //       const memeData = await response.json();
    //       return memeData;
    //     } catch (error) {
    //       console.error('Error fetching meme data:', error);
    //       return null; // Handle error gracefully in your component
    //     }
    //   };

    const initializeRound = async () => {
        const memeId = await fetchRandomMeme();
        const captions = await fetchCaptions();
        // const memeData = await fetchMemeData(memeId);
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
        }, 2000);
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);

        const isCorrect = correctCaptionParts.includes(caption);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 5);
            setMessage('Correct! You got it right and 5 points added to your score!');
        } else {
            setMessage(`Incorrect! The correct caption was: "${correctCaptionParts.join(' and ')}"`);
        }

        recordGameState();

        setTimeout(() => {
            nextRound();
        }, 2000);
    };

    

    const recordGameState = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/record-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    round,
                    username,
                    score,
                    caption: selectedCaption || (correctCaptionParts.length > 0 ? correctCaptionParts[0] : null),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to record game state');
            }
        } catch (error) {
            console.error('Error recording game state:', error);
            setMessage('An error occurred while recording the game state.');
        }
    };

    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            setMessage('Getting ready for the next round...');
        } else {
            const finalMessage = `Game Over! Your final score is ${score}. You will be redirected to the home page shortly.`;
            setMessage(finalMessage);

            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    };

    return (
        <Container className="game-page-container">
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h2 className="mb-4">Round {round}</h2>
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
                                            className="caption-option"
                                        />
                                    </div>
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

export default UserGame;
