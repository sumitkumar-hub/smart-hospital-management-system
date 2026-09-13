import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodGroup: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");


        // Password match
        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match"
            );

            return;
        }


        // Password length
        if (formData.password.length < 8) {

            setError(
                "Password must be at least 8 characters"
            );

            return;
        }


        // Phone validation
        if (!/^[0-9]{10}$/.test(formData.phone)) {

            setError(
                "Phone number must be exactly 10 digits"
            );

            return;
        }


        // Emergency phone validation
        if (
            !/^[0-9]{10}$/.test(
                formData.emergencyContactPhone
            )
        ) {

            setError(
                "Emergency contact phone must be exactly 10 digits"
            );

            return;
        }


        setLoading(true);


        try {

            const response = await api.post(
                "/auth/register",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address,
                    bloodGroup: formData.bloodGroup,
                    emergencyContactName:
                    formData.emergencyContactName,
                    emergencyContactPhone:
                    formData.emergencyContactPhone,
                    password: formData.password,
                }
            );


            console.log(
                "Registration response:",
                response.data
            );


            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                gender: "",
                address: "",
                bloodGroup: "",
                emergencyContactName: "",
                emergencyContactPhone: "",
                password: "",
                confirmPassword: "",
            });


            setTimeout(() => {
                navigate("/login");
            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="register-container">

            <div className="register-box">

                <h1>Smart Hospital</h1>

                <h2>Create Patient Account</h2>

                <p className="register-subtitle">
                    Register as a new patient
                </p>


                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="register-success">
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* ================= BASIC INFORMATION ================= */}

                    <h3 className="form-section-title">
                        Basic Information
                    </h3>


                    <div className="form-row">

                        <div className="form-group">

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="10 digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="10"
                                required
                            />

                        </div>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>Date of Birth</label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Gender</label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="MALE">
                                    Male
                                </option>

                                <option value="FEMALE">
                                    Female
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ================= MEDICAL INFORMATION ================= */}

                    <h3 className="form-section-title">
                        Medical Information
                    </h3>


                    <div className="form-group">

                        <label>Blood Group</label>

                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Blood Group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>Address</label>

                        <textarea
                            name="address"
                            placeholder="Enter your complete address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            required
                        />

                    </div>


                    {/* ================= EMERGENCY CONTACT ================= */}

                    <h3 className="form-section-title">
                        Emergency Contact
                    </h3>


                    <div className="form-row">

                        <div className="form-group">

                            <label>Contact Name</label>

                            <input
                                type="text"
                                name="emergencyContactName"
                                placeholder="Emergency contact name"
                                value={
                                    formData.emergencyContactName
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Contact Phone</label>

                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                placeholder="10 digit phone number"
                                value={
                                    formData.emergencyContactPhone
                                }
                                onChange={handleChange}
                                maxLength="10"
                                required
                            />

                        </div>

                    </div>


                    {/* ================= PASSWORD ================= */}

                    <h3 className="form-section-title">
                        Account Security
                    </h3>


                    <div className="form-row">

                        <div className="form-group">

                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="8"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Patient Account"}

                    </button>

                </form>


                <p className="login-link">

                    Already have an account?

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Register;