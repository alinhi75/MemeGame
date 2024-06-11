import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { gameAPI } from '../../API/api';

const Game = () => {
    const [token, setToken] = useState(localStorage.getItem('token')); // Assuming token is stored in localStorage
    const [game, setGame] = useState(null);
    const [round, setRound] = useState(null);
    const [selectedCaption, setSelectedCaption] = useState('');
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const startGame = async () => {
      try {
          setError(null);
          const response = await gameAPI.startRegisteredGame(token);
          if (response) {
              const gameData = response.data;
              setGame(gameData);
              fetchRound(gameData.id, 1); // Start with the first round
          } else {
              throw new Error('No response from server');
          }
      } catch (err) {
          setError(err.message);
      }
  };

    const fetchRound = async (gameId, roundNumber) => {
        try {
            setError(null);
            const roundData = await gameAPI.getRound(gameId, roundNumber);
            setRound(roundData);
            setSelectedCaption('');
        } catch (err) {
            setError(err.message);
        }
    };

    const submitRound = async () => {
        try {
            setError(null);
            await gameAPI.submitRound(game.id, round.roundNumber, selectedCaption, token);
            fetchRound(game.id, round.roundNumber + 1); // Proceed to next round
        } catch (err) {
            setError(err.message);
        }
    };

    const endGame = async () => {
        try {
            setError(null);
            const resultData = await gameAPI.getGameResult(game.id, token);
            setResult(resultData);
            setGame(null);
            setRound(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            {!game ? (
                <Button onClick={startGame}>Start Game</Button>
            ) : (
                <>
                    {round && (
                        <Card className="mb-3">
                            <Card.Header>Round {round.roundNumber}</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Card.Img variant="top" src={round.meme.imageUrl} />
                                    </Col>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="captionSelect">
                                                <Form.Label>Select a caption</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={selectedCaption}
                                                    onChange={(e) => setSelectedCaption(e.target.value)}
                                                >
                                                    <option value="">Select a caption...</option>
                                                    {round.meme.captions.map((caption, index) => (
                                                        <option key={index} value={caption}>{caption}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button onClick={submitRound} className="mt-3">Submit</Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                    <Button onClick={endGame} className="mt-3">End Game</Button>
                </>
            )}
            {result && (
                <Card className="mt-3">
                    <Card.Header>Game Result</Card.Header>
                    <Card.Body>
                        <Card.Text>Total Score: {result.totalScore}</Card.Text>
                        <Card.Text>Rounds Played: {result.rounds.length}</Card.Text>
                        {/* Add more result details as needed */}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Game;
