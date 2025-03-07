import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./StarterPage.css";
import { useNavigate } from "react-router-dom";

const StarterPage = () => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    navigate("/scanner");
  };

  return (
    <div className="hero-section text-white position-relative">
      <div className="bg-overlay position-absolute w-full h-full"></div>

      <Container className="py-5 d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Row className="justify-content-center text-center mb-5">
          <Col lg={10}>
            <h1 className="display-3 fw-bold mb-4">CyberSafe 2025</h1>
            <p className="lead mb-5">
              Koło naukowe GoSecurity zaprasza na konferencję CyberSafe 2025 –
              wydarzenie poświęcone najnowszym zagrożeniom i trendom w
              cyberbezpieczeństwie! Poznaj aktualne wyzwania, nowe technologie
              ochrony i zdobądź praktyczną wiedzę od najlepszych specjalistów w
              branży.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center text-center">
          <Col
            md={6}
            className="d-flex flex-column flex-md-row justify-content-center gap-4 mb-4"
          >
            <Button
              variant="primary"
              size="lg"
              className="px-5 py-3 fw-bold"
              onClick={handleScanClick}
            >
              Skanuj
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              className="px-5 py-3 fw-bold"
            >
              Poznaj zasady
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StarterPage;
