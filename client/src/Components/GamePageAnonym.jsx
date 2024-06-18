import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/GamePage.css'; // Import the custom CSS file

const GamePageAnonym = () => {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [correctCaptionParts, setCorrectCaptionParts] = useState([]);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30); // Timer in seconds
    const [usedMemes, setUsedMemes] = useState([]);
    const navigate = useNavigate();

    // Function to fetch a random meme
    const fetchRandomMeme = async () => {
        try {
            let memeId;
            let data;

            // Retry fetching a meme until a unique one is found
            do {
                const response = await fetch('http://localhost:3001/api/random-meme');
                if (!response.ok) {
                    throw new Error('Failed to fetch random meme');
                }
                data = await response.json();
                memeId = data.meme_id;
            } while (usedMemes.includes(memeId));

            setMeme(data); // Assuming `data` contains the meme object with `meme_id` and `image_path`
            setUsedMemes([...usedMemes, memeId]); // Add memeId to usedMemes
            return memeId; // Return the meme_id for use in subsequent functions
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
            const parts = data.split(','); // Split the correct caption by comma
            setCorrectCaptionParts(parts); // Set the parts of the correct caption
            return parts;
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
            const correctCaptionParts = await fetchCorrectCaption(memeId);

            // Include the correct caption parts in the captions list and shuffle them
            if (captions && correctCaptionParts) {
                const allCaptions = [...captions, ...correctCaptionParts];
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

        const isCorrect = correctCaptionParts.includes(caption);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 5); // 2.5 points for each part
            setMessage('Correct! You got  it right and 5 points added to your score!');
        } else {
            setMessage(`Incorrect! The correct caption was: "${correctCaptionParts.join(' and ')}"`);
        }

        setTimeout(() => {
            nextRound();
        }, 2000); // Delay before moving to the next round
    };

    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            setMessage('Getting ready for the next round...');
        } else {
            // Ensure score is calculated before displaying the final message
            const finalMessage = `Game Over! Your final score is ${score}. You will be redirected to the home page shortly.`;
            setMessage(finalMessage);

            // Delay the redirection to show the final message
            setTimeout(() => {
                navigate('/');
            }, 3000); // 3 seconds delay before redirecting to the home page
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

export default GamePageAnonym;

