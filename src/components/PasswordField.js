import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordField({
    value,
    onChange,
    placeholder = "",
    className = "",
    isInvalid = false,
    autoComplete = "current-password",
    id,
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`input-group password-field ${className}`}>
            <input
                id={id}
                type={visible ? "text" : "password"}
                className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />
            <button
                type="button"
                className="btn btn-outline-secondary password-toggle-btn"
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {visible ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
            </button>
        </div>
    );
}

export default PasswordField;
