import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const user = await authService.login(
                formData.email,
                formData.password
            );

            console.log("Logged in user:", user);

            // Navigate based on user role
            if (user.role === "ADMIN") {
                navigate("/admin");
            } else if (user.role === "DOCTOR") {
                navigate("/doctor");
            } else if (user.role === "PATIENT") {
                navigate("/patient");
            } else if (user.role === "RECEPTIONIST") {
                navigate("/receptionist");
            } else if (user.role === "PHARMACIST") {
                navigate("/pharmacist");
            } else if (user.role === "LABORATORY") {
                navigate("/laboratory");
            } else {
                navigate("/");
            }


        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Smart Hospital</h1>

                <h2>Login</h2>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div>
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p>
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;