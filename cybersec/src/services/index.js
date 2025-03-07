import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const sessionCreate = async (userData) => {
  const response = await api.post("/session/create", userData);
  return response.data;
};

export const sessionScan = async (authorization, qrCode = "") => {
  const response = await api.post(
    "/session/scan",
    { code: qrCode },
    {
      headers: {
        Authorization: authorization,
      },
    }
  );
  return response.data;
};

export const sessionAnswer = async (authorization) => {
  const response = await api.post(
    "/session/answer",
    {},
    {
      headers: {
        Authorization: authorization,
      },
    }
  );
  return response.data;
};

export default {
  sessionCreate,
  sessionScan,
  sessionAnswer,
};
