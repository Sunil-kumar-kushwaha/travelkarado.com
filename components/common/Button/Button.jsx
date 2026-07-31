"use client";
import "./Button.css";

export default function Button({
    text,
    onClick,
    type = "button",
    variant = "primary", // primary | secondary | outline | danger
    width,
    height,
    disabled = false,
    icon,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`tk-btn tk-btn-${variant} ${className}`}
            style={{ width, height }}
        >
            {icon && <span className="tk-btn-icon">{icon}</span>}
            {text}
        </button>
    );
}