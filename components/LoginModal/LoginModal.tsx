"use client";

// components/LoginModal/LoginModal.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./LoginModal.css";
import apiClient, { setCookie } from "@/utils/ApiClient";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const RESEND_SECONDS = 30;
const HOME_URL = "/flights";

interface LoginModalProps {
    onClose: () => void;
}

interface LoginResponse {
    userId?: number;
    authToken?: string;
    message?: string;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    const router = useRouter();

    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [countryCode] = useState("+91");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendIn, setResendIn] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const googleBtnRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);


    useEffect(() => {
        if (resendIn <= 0) return;
        const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendIn]);

    const completeLogin = useCallback(
        (data: LoginResponse) => {
            if (data?.userId != null) setCookie("userId", String(data.userId), 30);
            if (data?.authToken) setCookie("authToken", data.authToken, 30);
            onClose();
            router.push(HOME_URL);
            router.refresh();
        },
        [onClose, router]
    );

    // ---------- phone step ----------
    const isPhoneValid = /^[6-9]\d{9}$/.test(phone);

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid) {
            setError("Enter a valid 10-digit mobile number");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await apiClient.post("/api/auth/send-otp", {
                phone: `${countryCode}${phone}`,
                channel: "phone",
            });
            setStep("otp");
            setResendIn(RESEND_SECONDS);
            setOtp(["", "", "", ""]);
            setTimeout(() => otpRefs.current[0]?.focus(), 0);
        } catch (err) {
            const apiErr = err as InstanceType<typeof apiClient.ApiError>;
            setError((apiErr.data as LoginResponse)?.message || "Could not send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendIn > 0) return;
        setError("");
        try {
            await apiClient.post("/api/auth/send-otp", {
                phone: `${countryCode}${phone}`,
                channel: "phone",
            });
            setResendIn(RESEND_SECONDS);
        } catch (err) {
            const apiErr = err as InstanceType<typeof apiClient.ApiError>;
            setError((apiErr.data as LoginResponse)?.message || "Could not resend OTP.");
        }
    };

    // ---------- otp step ----------
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);

        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
        if (next.every((d) => d !== "")) {
            handleVerifyOtp(next.join(""));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (code: string) => {
        setError("");
        setLoading(true);
        try {
            const data = await apiClient.post<LoginResponse>("/api/auth/verify-otp", {
                phone: `${countryCode}${phone}`,
                otp: code,
            });
            completeLogin(data);
        } catch (err) {
            const apiErr = err as InstanceType<typeof apiClient.ApiError>;
            setError((apiErr.data as LoginResponse)?.message || "Incorrect OTP. Try again.");
            setOtp(["", "", "", ""]);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // ---------- google login ----------
    const handleGoogleCredential = useCallback(
        async (response: { credential: string }) => {
            setError("");
            setLoading(true);
            try {
                const data = await apiClient.post<LoginResponse>("/api/auth/google", {
                    credential: response.credential,
                });
                completeLogin(data);
            } catch (err) {
                const apiErr = err as InstanceType<typeof apiClient.ApiError>;
                setError((apiErr.data as LoginResponse)?.message || "Google sign-in failed. Try again.");
            } finally {
                setLoading(false);
            }
        },
        [completeLogin]
    );

    useEffect(() => {
        if (step !== "phone" || !GOOGLE_CLIENT_ID) return;

        const scriptId = "google-identity-script";

        const renderButton = () => {
            const google = (window as any).google;
            if (!google || !googleBtnRef.current) return;
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredential,
            });
            google.accounts.id.renderButton(googleBtnRef.current, {
                theme: "outline",
                size: "large",
                width: 320,
                text: "continue_with",
            });
        };

        if (document.getElementById(scriptId)) {
            renderButton();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = renderButton;
        document.body.appendChild(script);
    }, [step, handleGoogleCredential]);

    return (
        <div
            className="loginModal__overlay"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="loginModal">
                <button className="loginModal__close" aria-label="Close" onClick={onClose}>
                    ✕
                </button>

                <div className="loginModal__brandPanel">
                    <div className="loginModal__brandIcon">✈️</div>
                    <p className="loginModal__brandText">
                        Log in for faster, personalised flight booking
                    </p>
                </div>

                <div className="loginModal__formPanel">
                    {step === "phone" ? (
                        <form onSubmit={handleGetOtp}>
                            <h2 className="loginModal__title">Log in or sign up</h2>

                            <div className="loginModal__phoneRow">
                                <select className="loginModal__countryCode" defaultValue={countryCode} >
                                    <option value="+91">+91</option>
                                </select>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter mobile number"
                                    autoFocus
                                    className="loginModal__phoneInput"
                                />
                            </div>

                            {error && <p className="loginModal__error">{error}</p>}

                            <button type="submit" disabled={loading} className="loginModal__primaryBtn">
                                {loading ? "Sending OTP..." : "Get OTP"}
                            </button>

                            {GOOGLE_CLIENT_ID && (
                                <>
                                    <div className="loginModal__divider">
                                        <span className="loginModal__dividerLine" />
                                        <span className="loginModal__dividerText">OR</span>
                                        <span className="loginModal__dividerLine" />
                                    </div>
                                    <div ref={googleBtnRef} className="loginModal__googleBtn" />
                                </>
                            )}

                            <p className="loginModal__terms">
                                By continuing, you agree to our Terms of Use and Privacy Policy.
                            </p>
                        </form>
                    ) : (
                        <div>
                            <button className="loginModal__backBtn" onClick={() => setStep("phone")}>
                                ← Change number
                            </button>

                            <h2 className="loginModal__title">Enter OTP</h2>
                            <p className="loginModal__subtitle">
                                Sent to {countryCode} {phone}
                            </p>

                            <div className="loginModal__otpRow">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            otpRefs.current[i] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="loginModal__otpInput"
                                    />
                                ))}
                            </div>

                            {error && <p className="loginModal__error">{error}</p>}
                            {loading && <p className="loginModal__status">Verifying...</p>}

                            <button
                                className="loginModal__resendBtn"
                                onClick={handleResend}
                                disabled={resendIn > 0}
                            >
                                {resendIn > 0 ? `Resend OTP in ${resendIn}s` : (
                                    <>
                                        Haven&apos;t received OTP?{" "}
                                        <span className="resendOtp">Resend</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}