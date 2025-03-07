import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { sessionCreate } from "@/services";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Niepoprawny format adresu email";
    }

    if (!formData.first_name) {
      newErrors.first_name = "Imię jest wymagane";
    }

    if (!formData.last_name) {
      newErrors.last_name = "Nazwisko jest wymagane";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError("");

      try {
        const response = await sessionCreate(formData);

        if (response && response.session_token) {
          localStorage.setItem("authToken", response.session_token);
          navigate("/starter");
          setSubmitSuccess(true);
        } else {
          throw new Error("Nie otrzymano poprawnego tokenu sesji");
        }
      } catch (error) {
        console.error("Błąd podczas rejestracji:", error);
        setSubmitError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <Container className="auth-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="auth-title">Rejestracja uczestnika</h2>
                  <p className="auth-subtitle">
                    Wprowadź swoje dane aby kontynuować
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label className="form-label">Adres email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="example@ex.pl"
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formFirstName">
                        <Form.Label className="form-label">Imię</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                          <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            isInvalid={!!errors.first_name}
                            placeholder="Imię"
                            className="form-control-lg"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.first_name}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formLastName">
                        <Form.Label className="form-label">Nazwisko</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person-badge"></i>
                          </span>
                          <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            isInvalid={!!errors.last_name}
                            placeholder="Nazwisko"
                            className="form-control-lg"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.last_name}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {submitError && (
                    <Alert variant="danger" className="mt-3">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {submitError}
                    </Alert>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-4 auth-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Przetwarzanie...
                      </>
                    ) : (
                      "Zapisz dane"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Authentication;
