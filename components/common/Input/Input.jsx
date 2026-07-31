"use client";
import "./Input.css";

export default function Input({
    type = "text",
    label,
    placeholder,
    icon,
    value,
    onChange,
    onClick,
    width = "100%",
    height,
    readOnly = false,
    disabled = false,
    name,
    maxLength,
    minLength,
    required = false,
    className = "",
    children,
}) {
    // "date" fields are always read-only — they're driven by CalendarModal, not typed
    const isDateType = type === "date";

    return (
        <div className={`tk-input-wrapper ${onClick ? "tk-input-clickable" : ""} ${className} ${disabled ? "tk-input-disabled" : ""}`} style={{ width, height }} onClick={!disabled ? onClick : undefined} >
            {icon && <span className="tk-input-icon">{icon}</span>}
            <div className="tk-input-body">
                {label && <label className="tk-input-label">{label}</label>}
                <input
                    type={isDateType ? "text" : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly || isDateType}
                    disabled={disabled}
                    maxLength={maxLength}
                    minLength={minLength}
                    required={required}
                    className="tk-input-field"
                    autoComplete="off"
                />
            </div>

            {children && <span className="tk-input-suffix">{children}</span>}
        </div>
    );
}