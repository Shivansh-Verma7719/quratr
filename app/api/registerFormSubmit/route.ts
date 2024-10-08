import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    // Verify reCAPTCHA token
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const recaptchaResponse = await axios.post(verificationURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (recaptchaResponse.data.success && recaptchaResponse.data.score >= 0.5) {
      // reCAPTCHA verification successful
      return NextResponse.json({
        success: true,
        message: "reCAPTCHA verification successful",
        score: recaptchaResponse.data.score,
      });
    } else {
      // reCAPTCHA verification failed
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA verification failed",
          score: recaptchaResponse.data.score,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", score: 0 },
      { status: 500 }
    );
  }
}
