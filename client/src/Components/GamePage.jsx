import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GamePage.css'; // Import the custom CSS file

const GamePage = () => {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [correctCaption, setCorrectCaption] = useState('');
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30); // Timer in seconds
    const navigate = useNavigate();

    // Function to fetch a random meme
    const fetchRandomMeme = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/random-meme');
            if (!response.ok) {
                throw new Error('Failed to fetch random meme');
            }
            const data = await response.json();
            setMeme(data); // Assuming `data` contains the meme object with `meme_id` and `image_path`
            return data.meme_id; // Return the meme_id for use in subsequent functions
        } catch (error) {
            console.error('Error fetching random meme:', error);
            setMessage('An error occurred while fetching the random meme.');
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
            return data; // Assuming `data` is an array of caption strings
        } catch (error) {
            console.error('Error fetching captions:', error);
            setMessage('An error occurred while fetching the captions.');
        }
    };

    // Function to fetch the correct caption based on meme_id
    const fetchCorrectCaption = async (memeId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/correct-caption/${memeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch correct caption');
            }
            const data = await response.json();
            setCorrectCaption(data); // Assuming `data` contains the correct caption string
            return data;
        } catch (error) {
            console.error('Error fetching correct caption:', error);
            setMessage('An error occurred while fetching the correct caption.');
        }
    };

    // Function to initialize data for each round
    const initializeRound = async () => {
        const memeId = await fetchRandomMeme();
        const captions = await fetchCaptions();
        if (memeId) {
            
            const correctCaption = await fetchCorrectCaption(memeId);

            // Include the correct caption in the captions list and shuffle them
            if (captions && correctCaption) {
                const allCaptions = [...captions, correctCaption];
                setCaptions(shuffleArray(allCaptions));
            }
        }
    };

    // Shuffle array function
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
        }, 2000); // Delay before moving to the next round
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);

        const isCorrect = caption === correctCaption;

        if (isCorrect) {
            setScore((prevScore) => prevScore + 5);
            setMessage('Correct! You got it right and 5 points added to your score!');
        } else {
            setMessage(`Incorrect! The correct caption was: "${correctCaption}"`);
        }

        setTimeout(() => {
            nextRound();
        }, 6000); // Delay before moving to the next round
    };

    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            setMessage('Getting ready for the next round...');
        } else {
            setMessage(`Game Over! Your final score is ${score}. You will be redirected to the home page shortly.`);
            setTimeout(() => {
                navigate('/');
            }, 5000); // Delay before redirecting to the home page
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

export default GamePage;
