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
    const [gameSummary, setGameSummary] = useState([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameIds, setGameIds] = useState([]); // Store game IDs

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

    const handleExitButton = async () => {
        setGameEnded(true);
        await deleteGameRecords();
        navigate('/profile');
    };
    const handlerestartButton = async () => {
        setGameEnded(true);
        await deleteGameRecords();
        window.location.reload();
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
        alert("Time's up! You did not select a caption and score for this round is 0. Moving on to the next round...");
        alert(`The correct caption was: "${correctCaptionParts.join(' <AND> ')}"`);
        setMessageType('danger');
    // i want to show in summary that no caption was selected or time's up
        
        gameSummary.push({
            round,
            meme: meme.image_path,
            selectedCaption: "No caption selected or time's Up",
            isCorrect: false,
            correctCaption: correctCaptionParts.join(' <AND> ')
        });

        // updateGameSummary(`Game:${game.round}No caption selected or time's Up`, false); // Record no caption selected (incorrect
        setTimeout(() => {
            nextRound();
        }, 2000);
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);

        const isCorrect = correctCaptionParts.includes(caption);
        setIsCorrectCaption(isCorrect);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 5);
            alert('Correct! You got it right and 5 points added to your score!');
            setMessageType('success');
        } else {
            alert(`Incorrect! The correct caption was: "${correctCaptionParts.join(' <AND> ')}"`);
            setMessageType('danger');
        }

        updateGameSummary(caption, isCorrect);

        setTimeout(() => {
            if (round < 3 && !gameEnded) {
                nextRound();
            } else {
                setGameEnded(true); // Set gameEnded to true after round 3
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

        // Record game state after updating summary
        recordGameState(isCorrect);
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
            const data = await response.json();
            setGameIds((prevGameIds) => [...prevGameIds, data.id]); // Store game ID
        } catch (error) {
            console.error('Error recording game state:', error);
            setMessage('An error occurred while recording the game state.');
            setMessageType('danger');
        }
    };

    const deleteGameRecords = async () => {
        try {
            for (const gameId of gameIds) {
                const response = await fetch(`http://localhost:3001/api/games/${gameId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete game record');
                }
            }
            setGameIds([]); // Clear game IDs after deletion
        } catch (error) {
            console.error('Error deleting game records:', error);
            setMessage('An error occurred while deleting the game records.');
            setMessageType('danger');
        }
    };

    const nextRound = () => {
        if (round < 3) {
            setRound((prevRound) => prevRound + 1);
            setTimer(30);
            alert('Getting ready for the next round...');
            setSelectedCaption(null);
        } else {
            setGameEnded(true); // Set gameEnded to true after round 3
        }
    };

    const handlePlayAgain = () => {
        setRound(1);
        setScore(0);
        setUsedMemes([]);
        setMessage('');
        setMessageType('info');
        setGameSummary([]);
        setGameEnded(false);
        setGameIds([]); // Clear game IDs
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
                                    <Alert variant="info" className="mt-4">
                                    <Button variant="danger"  onClick={handleExitButton}>Exit</Button>
                                    {'      '}
                                    <Button variant='primary'  onClick={handlerestartButton}>Restart</Button>
                                    </Alert>
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
