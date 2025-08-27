import { RequestHandler } from "express";
import { AuthResponse } from "@shared/api";

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const response: AuthResponse = {
    message: "Logged in successfully",
    token: "fake-jwt-token",
  };

  res.status(200).json(response);
};

export const handleSignUp: RequestHandler = (req, res) => {
  const { fullName, email, mobile, password } = req.body as {
    fullName?: string;
    email?: string;
    mobile?: string;
    password?: string;
  };

  if (!fullName || !email || !mobile || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const response: AuthResponse = {
    message: "Account created successfully",
  };

  res.status(201).json(response);
};
