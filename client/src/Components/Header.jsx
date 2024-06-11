import React from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
// import logo from '../assets/logo.png'; // Import your fantasy-themed logo

const Header = () => {
    const logo = 'https://gamerules.com/wp-content/uploads/What-do-You-Meme.png'
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">
        <Image src={logo} alt="Meme Game Logo" className="logo-img" />
        Meme Quest
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/game">Quests</Nav.Link>
          <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
