import React, { useEffect, useState } from "react";
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
  const [questionOptions, setQuestionOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [scanId, setScanId] = useState("");

  const handleScan = async (decodedText) => {
    console.log("entering handleScan");

    if (!decodedText || loading) return;

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

      const authHeader = `${token}`;
      const response = await sessionScan(authHeader, decodedText[0].rawValue);

      if (response && response.question) {
        setQuestion(response.question.question_text);
        if (response.question.options_array) {
          setQuestionOptions(response.question.options_array.split(";"));
        } else {
          setQuestionOptions([]);
        }
        setScanId(response.scan_id);
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

      const authHeader = `${token}`;

      const response = await sessionAnswer(authHeader, answer, scanId);

      if (response) {
        const formattedResult = {
          correct: response.message === "Correct answer",
          message: response.message || "",
        };
        setResult(formattedResult);
      } else {
        throw new Error("Nieprawidłowa odpowiedź z serwera");
      }
    } catch (err) {
      setError(
        err.response.data.detail ||
          "Wystąpił błąd podczas wysyłania odpowiedzi. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setQuestion(null);
    setQuestionOptions([]);
    setAnswer("");
    setError("");
    setResult(null);
    setQrValue("");
    setScanId("");
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
                    onScan={handleScan}
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
                    {questionOptions.length > 0 ? (
                      <Form.Group className="mb-3">
                        <Form.Label>Wybierz odpowiedź:</Form.Label>
                        {questionOptions.map((option, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            id={`option-${index}`}
                            label={option}
                            name="answerOption"
                            value={option}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={loading}
                            className="mb-2"
                          />
                        ))}
                      </Form.Group>
                    ) : (
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
                    )}

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
