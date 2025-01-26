import { Request, Response } from "express";
import authenticator from "authenticator";

const express = require("express");

const router = express.Router();

router.post("/signUp", (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const tOtp = authenticator.generateToken(phoneNumber + "SIGNUP");

  return res.status(200).json({
    message: "OTP sent successfully",
    otp: tOtp,
  });
});

router.post("/signUp/verify", (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;

  const isValid = authenticator.verifyToken(phoneNumber + "SIGNUP", otp);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Signed in successfully",
  });
});

export default router;
