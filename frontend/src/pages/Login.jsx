import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../Styles/Login.css";

// Hospital image
import hospitalImage from "../assets/navira-hospital.png";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const user = await authService.login(
                formData.email,
                formData.password
            );

            if (!user || !user.role) {
                throw new Error("Invalid login response.");
            }

            switch (user.role.toUpperCase()) {
                case "ADMIN":
                    navigate("/admin");
                    break;

                case "DOCTOR":
                    navigate("/doctor");
                    break;

                case "PATIENT":
                    navigate("/patient");
                    break;

                case "RECEPTIONIST":
                    navigate("/receptionist");
                    break;

                case "PHARMACIST":
                    navigate("/pharmacist");
                    break;

                case "LABORATORY":
                    navigate("/laboratory");
                    break;

                default:
                    setError("Your account role is not supported.");
            }
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Invalid email or password.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-wrapper">

                {/* =====================================================
                    LEFT SIDE - NAVIRA HOSPITAL
                   ===================================================== */}

                <section className="login-info">

                    {/* Hospital Branding */}
                    <div className="hospital-brand">

                        <div className="hospital-logo">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 21s-7.5-4.35-9.5-9.2C.9 7.9 3.1 4 7.1 4c2.1 0 3.8 1.2 4.9 2.7C13.1 5.2 14.8 4 16.9 4c4 0 6.2 3.9 4.6 7.8C19.5 16.65 12 21 12 21Z"
                                    fill="white"
                                />

                                <path
                                    d="M12 8v6M9 11h6"
                                    stroke="#087FC1"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <div>
                            <h1>NAVIRA</h1>
                            <p>Multispeciality Hospital</p>
                        </div>

                    </div>


                    {/* Introduction */}
                    <div className="hospital-intro">

                        <h2>
                            Connected care,
                            <br />
                            made simple.
                        </h2>

                        <p>
                            A secure and integrated healthcare platform
                            designed to manage patients, doctors,
                            appointments, medical records, pharmacy,
                            laboratory services and billing in one place.
                        </p>

                    </div>


                    {/* =================================================
                        HOSPITAL IMAGE
                       ================================================= */}

                    <img
                        src={hospitalImage}
                        alt="Navira Multispeciality Hospital"
                        className="hospital-image"
                    />


                    {/* Features */}
                    <div className="hospital-features">

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Patient Care Management
                            </span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Appointments & Scheduling
                            </span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Laboratory Services
                            </span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Doctor Management
                            </span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Pharmacy & Inventory
                            </span>
                        </div>

                        <div className="feature-item">
                            <span className="feature-icon">
                                ✓
                            </span>
                            <span>
                                Medical Records & Billing
                            </span>
                        </div>

                    </div>


                    {/* Tagline */}
                    <div className="hospital-tagline">
                        <span>
                            “Healing with Heart.”
                        </span>
                    </div>

                </section>


                {/* =====================================================
                    RIGHT SIDE - LOGIN
                   ===================================================== */}

                <section className="login-form-section">

                    <div className="login-form-container">

                        {/* Heading */}
                        <div className="login-heading">

                            <span className="welcome-text">
                                WELCOME BACK
                            </span>

                            <h2>
                                Login to Your Account
                            </h2>

                            <p>
                                Access your dashboard and manage your
                                healthcare services with ease.
                            </p>

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="login-error">

                                <span>⚠</span>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}


                        {/* Login Form */}
                        <form onSubmit={handleSubmit}>

                            {/* =================================================
                                EMAIL
                               ================================================= */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            />

                                            <path
                                                d="M4 7l8 6 8-6"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                PASSWORD
                               ================================================= */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    {/* Lock Icon */}
                                    <span className="input-icon">

                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="5"
                                                y="10"
                                                width="14"
                                                height="10"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            />

                                            <path
                                                d="M8 10V7.5C8 5.57 9.79 4 12 4C14.21 4 16 5.57 16 7.5V10"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />

                                            <circle
                                                cx="12"
                                                cy="15"
                                                r="1"
                                                fill="currentColor"
                                            />
                                        </svg>

                                    </span>


                                    {/* Password Input */}
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />


                                    {/* Show / Hide Password */}
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <svg
                                                width="19"
                                                height="19"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M3 3l18 18"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M10.58 10.58A2 2 0 0013.42 13.42"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M9.88 5.08A10.9 10.9 0 0112 4.87c5 0 8.5 4.63 9.5 7.13a15.8 15.8 0 01-3.16 4.53"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M6.61 6.61C4.74 7.82 3.37 9.69 2.5 12c1 2.5 4.5 7.13 9.5 7.13 1.27 0 2.45-.27 3.5-.71"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="19"
                                                height="19"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M2.5 12S6 4.87 12 4.87 21.5 12 21.5 12 18 19.13 12 19.13 2.5 12 2.5 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                />
                                            </svg>
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Forgot Password */}
                            <div className="forgot-password">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            "Password recovery is currently unavailable."
                                        )
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>


                            {/* Login Button */}
                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    "Login"
                                )}

                            </button>

                        </form>


                        {/* =================================================
                            REGISTER
                           ================================================= */}

                        <div className="register-section">

                            <div className="register-divider">

                                <span></span>

                                <p>
                                    OR
                                </p>

                                <span></span>

                            </div>

                            <p className="register-text">

                                Don't have an account?{" "}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                >
                                    Register here
                                </button>

                            </p>

                        </div>


                        {/* =================================================
                            SECURITY MESSAGE
                           ================================================= */}

                        <div className="security-message">

                            <div className="security-icon">

                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M9 12l2 2 4-4"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </div>

                            <div>

                                <strong>
                                    Your data is safe with us
                                </strong>

                                <p>
                                    We use secure authentication and
                                    industry-standard security measures
                                    to protect your information.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Login;