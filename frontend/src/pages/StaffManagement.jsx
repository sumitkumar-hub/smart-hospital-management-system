import React, { useState } from "react";
import api from "../services/api";
import "../Styles/StaffManagement.css";

function StaffManagement() {

    const initialFormData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        specialization: "",
        experience: "",
        qualification: "",
        consultationFee: "",
        available: true
    };

    const [formData, setFormData] = useState(initialFormData);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [createdStaff, setCreatedStaff] = useState(null);


    // ==========================
    // HANDLE INPUT
    // ==========================

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setError("");
        setSuccess("");
    };


    // ==========================
    // RESET FORM
    // ==========================

    const resetForm = () => {

        setFormData(initialFormData);

        setCreatedStaff(null);
    };


    // ==========================
    // SUBMIT FORM
    // ==========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setCreatedStaff(null);


        // ==========================
        // BASIC VALIDATION
        // ==========================

        if (!formData.firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!formData.lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        if (!formData.password) {
            setError("Password is required.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (!formData.role) {
            setError("Please select a staff role.");
            return;
        }


        // ==========================
        // DOCTOR VALIDATION
        // ==========================

        if (formData.role === "DOCTOR") {

            if (!formData.specialization.trim()) {
                setError("Specialization is required for doctor.");
                return;
            }

            if (
                formData.experience === "" ||
                Number(formData.experience) < 0
            ) {
                setError("Valid experience is required for doctor.");
                return;
            }

            if (!formData.qualification.trim()) {
                setError("Qualification is required for doctor.");
                return;
            }

            if (
                formData.consultationFee === "" ||
                Number(formData.consultationFee) <= 0
            ) {
                setError(
                    "Consultation fee must be greater than 0."
                );
                return;
            }
        }


        try {

            setLoading(true);


            // ==========================
            // COMMON PAYLOAD
            // ==========================

            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
                role: formData.role
            };


            // ==========================
            // DOCTOR PAYLOAD
            // ==========================

            if (formData.role === "DOCTOR") {

                payload.specialization =
                    formData.specialization.trim();

                payload.experience =
                    Number(formData.experience);

                payload.qualification =
                    formData.qualification.trim();

                payload.consultationFee =
                    Number(formData.consultationFee);

                payload.available =
                    formData.available;
            }


            // ==========================
            // CREATE STAFF
            // ==========================

            const response =
                await api.post("/staff", payload);


            const created =
                response.data?.data;


            setCreatedStaff(created);

            setSuccess(
                "Staff account created successfully."
            );


            // Reset form
            setFormData(initialFormData);

        } catch (err) {

            console.error(
                "Error creating staff:",
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to create staff account.";


            setError(message);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="staff-management-page">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="staff-page-header">

                <div>
                    <h1>Staff Management</h1>

                    <p>
                        Create accounts for hospital staff members
                    </p>
                </div>

            </div>


            {/* ==========================
                ROLE INFO
            ========================== */}

            <div className="staff-role-grid">

                <div className="staff-role-card">
                    <div className="role-icon admin-icon">
                        A
                    </div>

                    <div>
                        <h3>Admin</h3>
                        <p>System administration</p>
                    </div>
                </div>


                <div className="staff-role-card">
                    <div className="role-icon doctor-icon">
                        D
                    </div>

                    <div>
                        <h3>Doctor</h3>
                        <p>Medical staff</p>
                    </div>
                </div>


                <div className="staff-role-card">
                    <div className="role-icon receptionist-icon">
                        R
                    </div>

                    <div>
                        <h3>Receptionist</h3>
                        <p>Front desk staff</p>
                    </div>
                </div>


                <div className="staff-role-card">
                    <div className="role-icon pharmacist-icon">
                        P
                    </div>

                    <div>
                        <h3>Pharmacist</h3>
                        <p>Pharmacy staff</p>
                    </div>
                </div>


                <div className="staff-role-card">
                    <div className="role-icon laboratory-icon">
                        L
                    </div>

                    <div>
                        <h3>Laboratory</h3>
                        <p>Laboratory staff</p>
                    </div>
                </div>

            </div>


            {/* ==========================
                SUCCESS MESSAGE
            ========================== */}

            {success && (

                <div className="staff-alert staff-success">
                    <span>✓</span>
                    {success}
                </div>

            )}


            {/* ==========================
                ERROR MESSAGE
            ========================== */}

            {error && (

                <div className="staff-alert staff-error">
                    <span>!</span>
                    {error}
                </div>

            )}


            {/* ==========================
                CREATED STAFF
            ========================== */}

            {createdStaff && (

                <div className="created-staff-card">

                    <div className="created-staff-header">
                        <div>
                            <h2>Account Created</h2>
                            <p>
                                Staff account has been created successfully.
                            </p>
                        </div>

                        <div className="created-badge">
                            {createdStaff.role}
                        </div>
                    </div>


                    <div className="created-staff-details">

                        <div>
                            <span>Staff ID</span>
                            <strong>
                                {createdStaff.id}
                            </strong>
                        </div>


                        {createdStaff.doctorId && (

                            <div>
                                <span>Doctor ID</span>
                                <strong>
                                    {createdStaff.doctorId}
                                </strong>
                            </div>

                        )}


                        <div>
                            <span>Name</span>
                            <strong>
                                {createdStaff.firstName}{" "}
                                {createdStaff.lastName}
                            </strong>
                        </div>


                        <div>
                            <span>Email</span>
                            <strong>
                                {createdStaff.email}
                            </strong>
                        </div>

                    </div>

                </div>

            )}


            {/* ==========================
                CREATE STAFF FORM
            ========================== */}

            <div className="staff-form-card">

                <div className="staff-form-header">

                    <div>
                        <h2>Create Staff Account</h2>

                        <p>
                            Enter the staff member's account details
                        </p>
                    </div>

                </div>


                <form
                    className="staff-form"
                    onSubmit={handleSubmit}
                >

                    {/* ==========================
                        BASIC INFORMATION
                    ========================== */}

                    <div className="form-section">

                        <h3>Basic Information</h3>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10 digit phone number"
                                    maxLength="10"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Staff Role
                                </label>

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select staff role
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                    <option value="DOCTOR">
                                        Doctor
                                    </option>

                                    <option value="RECEPTIONIST">
                                        Receptionist
                                    </option>

                                    <option value="PHARMACIST">
                                        Pharmacist
                                    </option>

                                    <option value="LABORATORY">
                                        Laboratory
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* ==========================
                        DOCTOR INFORMATION
                    ========================== */}

                    {formData.role === "DOCTOR" && (

                        <div className="form-section doctor-section">

                            <h3>Doctor Information</h3>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Specialization
                                    </label>

                                    <input
                                        type="text"
                                        name="specialization"
                                        value={
                                            formData.specialization
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. Cardiology"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        name="experience"
                                        value={
                                            formData.experience
                                        }
                                        onChange={handleChange}
                                        placeholder="Years of experience"
                                        min="0"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Qualification
                                    </label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        value={
                                            formData.qualification
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. MBBS, MD"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Consultation Fee
                                    </label>

                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={
                                            formData.consultationFee
                                        }
                                        onChange={handleChange}
                                        placeholder="Consultation fee"
                                        min="1"
                                        step="0.01"
                                    />

                                </div>


                                <div className="form-group doctor-availability">

                                    <label className="checkbox-label">

                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={
                                                formData.available
                                            }
                                            onChange={handleChange}
                                        />

                                        <span>
                                            Doctor is available
                                        </span>

                                    </label>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==========================
                        FORM ACTIONS
                    ========================== */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Reset
                        </button>


                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Staff Account"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default StaffManagement;