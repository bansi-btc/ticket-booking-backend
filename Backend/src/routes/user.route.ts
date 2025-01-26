import { Request, Response } from "express";
import authenticator from "authenticator";
import { client } from "../client";
import jwt from "jsonwebtoken";
require("dotenv").config();

const express = require("express");

const router = express.Router();

router.post("/signUp", async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await client.user.upsert({
      where: {
        number: phoneNumber,
      },
      update: {},
      create: {
        number: phoneNumber,
        name: "",
      },
    });

    const tOtp = authenticator.generateToken(phoneNumber + "SIGNUP");

    return res.status(200).json({
      id: user.id,
      message: "OTP sent successfully",
      otp: tOtp,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/signUp/verify", async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, otp } = req.body;

    if (!name || !phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isValid = authenticator.verifyToken(phoneNumber + "SIGNUP", otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const verifiedUser = await client.user.update({
      where: {
        number: phoneNumber,
      },
      data: {
        name: name,
        verified: true,
      },
    });

    const payload = {
      userId: verifiedUser.id,
      phoneNumber: verifiedUser.number,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET ?? " ");

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

export default router;
