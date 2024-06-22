import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFoundPage = () => {
  return (
    <Container className="text-center" style={{ marginTop: '10%', marginBottom: '10%' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="not-found-icon" style={{ fontSize: '5rem', color: '#f8d7da' }}>
            <FaExclamationTriangle />
          </div>
          <h1 className="mt-4">404 - Page Not Found</h1>
          <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
          <Link to="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
