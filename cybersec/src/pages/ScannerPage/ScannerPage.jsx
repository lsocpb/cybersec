import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Scanner } from "@yudiel/react-qr-scanner";
import { sessionScan, sessionAnswer } from "@/services";
import "./ScannerPage.css";

const ScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [qrValue, setQrValue] = useState("");

  const handleScan = async (decodedText) => {
    if (!decodedText || loading) return;

    console.log("QR code decoded:", decodedText);

    setScanning(false);
    setLoading(true);
    setQrValue(decodedText);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Sesja wygasła. Zaloguj się ponownie.");
        setLoading(false);
        return;
      }

      const authHeader = `Bearer ${token}`;
      const response = await sessionScan(authHeader, decodedText);

      if (response && response.question) {
        setQuestion(response.question);
      } else {
        throw new Error("Nieprawidłowa odpowiedź z serwera");
      }
    } catch (err) {
      console.error("Błąd podczas skanowania:", err);
      setError(
        "Wystąpił błąd podczas przetwarzania kodu QR. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error("Błąd skanera QR:", error);
    setError(
      "Wystąpił problem ze skanerem. Sprawdź, czy przeglądarka ma dostęp do kamery."
    );
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError("Wprowadź odpowiedź przed wysłaniem");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Sesja wygasła. Zaloguj się ponownie.");
        setLoading(false);
        return;
      }

      const authHeader = `Bearer ${token}`;

      const response = await sessionAnswer(authHeader, answer, qrValue);

      if (response) {
        setResult(response);
      } else {
        throw new Error("Nieprawidłowa odpowiedź z serwera");
      }
    } catch (err) {
      console.error("Błąd podczas wysyłania odpowiedzi:", err);
      setError(
        "Wystąpił błąd podczas przetwarzania odpowiedzi. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setQuestion(null);
    setAnswer("");
    setError("");
    setResult(null);
    setQrValue("");
  };

  return (
    <Container className="scanner-page py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Skanowanie kodu QR</h2>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {scanning ? (
                <div className="qr-scanner-container mb-4">
                  <Scanner
                    onDecode={handleScan}
                    onError={handleError}
                    constraints={{ facingMode: "environment" }}
                  />
                  <div className="scanner-overlay">
                    <div className="scanner-frame"></div>
                  </div>
                </div>
              ) : question && !result ? (
                <div className="question-container">
                  <Alert variant="info" className="mb-4">
                    <h4>Pytanie:</h4>
                    <p>{question}</p>
                  </Alert>

                  <Form onSubmit={handleAnswerSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Twoja odpowiedź:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button
                        variant="secondary"
                        onClick={resetScanner}
                        disabled={loading}
                      >
                        Anuluj
                      </Button>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Wysyłanie...
                          </>
                        ) : (
                          "Wyślij odpowiedź"
                        )}
                      </Button>
                    </div>
                  </Form>
                </div>
              ) : (
                result && (
                  <div className="result-container text-center">
                    <Alert
                      variant={result.correct ? "success" : "danger"}
                      className="mb-4"
                    >
                      <h4>
                        {result.correct
                          ? "Poprawna odpowiedź!"
                          : "Niestety, to nie jest poprawna odpowiedź"}
                      </h4>
                      {result.message && <p>{result.message}</p>}
                    </Alert>

                    <Button
                      variant="primary"
                      onClick={resetScanner}
                      className="px-4"
                    >
                      Skanuj kolejny kod
                    </Button>
                  </div>
                )
              )}

              {loading && !scanning && !result && (
                <div className="text-center mt-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Ładowanie...</span>
                  </Spinner>
                  <p className="mt-2">Przetwarzanie...</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ScannerPage;
