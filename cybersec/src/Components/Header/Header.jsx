import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { WILogo, GoSecurityLogo } from "@/assets";
import "./Header.css";

const Header = () => {
  return (
    <Navbar expand="lg" className="header-navbar fixed-top custom-navbar">
      <Container>
        <div className="mobile-container d-flex justify-content-between align-items-center w-100">
          <div className="left-logo">
            <img
              src={GoSecurityLogo}
              alt="GoSecurity Logo"
              height="50"
              className="d-inline-block align-top"
            />
          </div>
          <Navbar.Brand href="https://wi.pb.edu.pl/" className="center-logo">
            <img
              src={WILogo}
              alt="WI Logo"
              height="60"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <div className="right-spacer"></div>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
