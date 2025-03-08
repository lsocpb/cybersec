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
  Toast,
  ToastContainer,
  Badge,
} from "react-bootstrap";
import { Scanner } from "@yudiel/react-qr-scanner";
import { sessionScan, sessionAnswer, sessionResults } from "@/services";
import "./ScannerPage.css";

const UserStatsCard = ({ userStats, isLoading }) => {
  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body className="p-3">
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          {isLoading && (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              variant="primary"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Card.Title>

        {userStats ? (
          <>
            <div className="mb-3">
              <h6 className="mb-0 fw-bold">
                {userStats.first_name} {userStats.last_name}
              </h6>
              <small className="text-muted">Uczestnik</small>
            </div>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <div className="p-2 rounded bg-light">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <i className="bi bi-qr-code text-primary"></i>
                    </div>
                    <div>
                      <span className="fw-bold">
                        {userStats.qr_codes_scanned}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-2 rounded bg-light">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <span className="fw-bold">{userStats.valid_answers}</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="mb-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Procent poprawnych</small>
                <small className="text-muted">
                  {userStats.qr_codes_scanned > 0
                    ? Math.round(
                        (userStats.valid_answers / userStats.qr_codes_scanned) *
                          100
                      )
                    : 0}
                  %
                </small>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width:
                      userStats.qr_codes_scanned > 0
                        ? `${
                            (userStats.valid_answers /
                              userStats.qr_codes_scanned) *
                            100
                          }%`
                        : "0%",
                  }}
                  aria-valuenow={userStats.valid_answers}
                  aria-valuemin="0"
                  aria-valuemax={userStats.qr_codes_scanned}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-3">
            <small className="text-muted">Loading user statistics...</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const ScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionOptions, setQuestionOptions] = useState({});
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [scanId, setScanId] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "danger",
  });
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadUserStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await sessionResults(token);
      setUserStats(response);
    } catch (err) {
      console.error("Error loading user stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadUserStats();
  }, [result]);

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
        if (response.scan_answered_at) {
          setError("Ten kod został już zeskanowany.");
          loadUserStats();
        } else {
          setQuestion(response.question);
          setQuestionOptions(response.answers);
          setScanId(response.scan_id);
        }
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
        const isCorrect = response.message === "Correct answer";

        if (isCorrect) {
          setResult({
            correct: true,
            message: response.message || "",
          });
        } else {
          setToast({
            show: true,
            message: "Niestety, to nie jest poprawna odpowiedź",
            type: "danger",
          });
          resetScanner();
          loadUserStats();
        }
      } else {
        throw new Error("Nieprawidłowa odpowiedź z serwera");
      }
    } catch (err) {
      resetScanner();
      setToast({
        show: true,
        message:
          err.response?.data?.detail ||
          "Wystąpił błąd podczas wysyłania odpowiedzi",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setQuestion(null);
    setQuestionOptions({});
    setAnswer("");
    setError("");
    setResult(null);
    setQrValue("");
    setScanId("");
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <Container className="scanner-page py-5">
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          bg={toast.type}
          delay={5000}
          autohide
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Powiadomienie</strong>
          </Toast.Header>
          <Toast.Body className={toast.type === "danger" ? "text-white" : ""}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* User Stats Card */}
          <UserStatsCard userStats={userStats} isLoading={statsLoading} />

          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Skanowanie kodu QR</h2>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {error === "Ten kod został już zeskanowany." && (
                <div className="text-center mb-4">
                  <Button variant="primary" onClick={resetScanner}>
                    Skanuj kolejny kod
                  </Button>
                </div>
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
                    {Object.keys(questionOptions).length > 0 ? (
                      <Form.Group className="mb-3">
                        <Form.Label>Wybierz odpowiedź:</Form.Label>
                        {Object.entries(questionOptions).map(([key, value]) => (
                          <Form.Check
                            key={key}
                            type="radio"
                            id={`option-${key}`}
                            label={`${key}: ${value}`}
                            name="answerOption"
                            value={key}
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
                        disabled={loading || !answer}
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
                result &&
                result.correct && (
                  <div className="result-container text-center">
                    <Alert variant="success" className="mb-4">
                      <h4>Poprawna odpowiedź!</h4>
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
