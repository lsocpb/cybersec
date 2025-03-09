import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

const RulesPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="rules-section position-relative">
      <div className="bg-overlay-rules position-absolute w-full h-full"></div>

      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <h1 className="display-4 fw-bold text-center mb-5">
              Zasady konkursu
            </h1>

            <div className="rules-content bg-dark text-white p-4 p-md-5 rounded shadow">
              <h3 className="mb-4">Ogólne Zasady Uczestnictwa</h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim.
              </p>

              <h3 className="mb-4 mt-5">Rejestracja</h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor. Suspendisse dictum feugiat
                nisl ut dapibus.
              </p>

              <h3 className="mb-4 mt-5">Bezpieczeństwo</h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor.
              </p>

              <h3 className="mb-4 mt-5">Prawa i Obowiązki</h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor. Suspendisse dictum feugiat
                nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id
                metus massa, ut blandit odio.
              </p>

              <div className="text-center mt-5">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-3 fw-bold"
                  onClick={handleBackClick}
                >
                  Powrót
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RulesPage;
