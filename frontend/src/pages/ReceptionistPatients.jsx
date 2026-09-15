import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/ReceptionistPatients.css";

function ReceptionistPatients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        bloodGroup: "",
        emergencyContactName: "",
        emergencyContactPhone: ""
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/patients");

            const data = response.data?.data || response.data || [];

            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Failed to load patients.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            phone: "",
            email: "",
            address: "",
            bloodGroup: "",
            emergencyContactName: "",
            emergencyContactPhone: ""
        });

        setEditingPatient(null);
        setShowForm(false);
    };

    const handleAdd = () => {
        setEditingPatient(null);

        setFormData({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            phone: "",
            email: "",
            address: "",
            bloodGroup: "",
            emergencyContactName: "",
            emergencyContactPhone: ""
        });

        setShowForm(true);
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);

        setFormData({
            firstName: patient.firstName || "",
            lastName: patient.lastName || "",
            dateOfBirth: patient.dateOfBirth || "",
            gender: patient.gender || "",
            phone: patient.phone || "",
            email: patient.email || "",
            address: patient.address || "",
            bloodGroup: patient.bloodGroup || "",
            emergencyContactName: patient.emergencyContactName || "",
            emergencyContactPhone: patient.emergencyContactPhone || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (editingPatient) {
                await api.put(
                    `/patients/${editingPatient.id}`,
                    formData
                );
            } else {
                await api.post("/patients", formData);
            }

            resetForm();
            await fetchPatients();
        } catch (err) {
            console.error("Error saving patient:", err);

            const message =
                err.response?.data?.message ||
                err.response?.data?.data ||
                "Failed to save patient.";

            setError(message);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/patients/${id}`);

            await fetchPatients();
        } catch (err) {
            console.error("Error deleting patient:", err);

            const message =
                err.response?.data?.message ||
                "Failed to delete patient.";

            setError(message);
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const fullName =
            `${patient.firstName || ""} ${patient.lastName || ""}`
                .toLowerCase();

        const phone = (patient.phone || "").toLowerCase();
        const email = (patient.email || "").toLowerCase();

        const searchValue = search.toLowerCase();

        return (
            fullName.includes(searchValue) ||
            phone.includes(searchValue) ||
            email.includes(searchValue)
        );
    });

    return (
        <div className="receptionist-patients">

            {/* ================= HEADER ================= */}

            <div className="receptionist-patients-header">
                <div>
                    <h1>Patient Management</h1>
                    <p>
                        Register, search and manage hospital patients.
                    </p>
                </div>

                <button
                    className="add-patient-btn"
                    onClick={handleAdd}
                >
                    + Register Patient
                </button>
            </div>

            {/* ================= SUMMARY ================= */}

            <div className="patient-summary">

                <div className="patient-summary-card">
                    <span>Total Patients</span>
                    <strong>{patients.length}</strong>
                </div>

                <div className="patient-summary-card">
                    <span>Active Patients</span>
                    <strong>
                        {
                            patients.filter(
                                (patient) => patient.active !== false
                            ).length
                        }
                    </strong>
                </div>

                <div className="patient-summary-card">
                    <span>Search Results</span>
                    <strong>{filteredPatients.length}</strong>
                </div>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="patient-error">
                    {error}
                    <button onClick={() => setError("")}>×</button>
                </div>
            )}

            {/* ================= SEARCH ================= */}

            <div className="patient-toolbar">

                <div className="patient-search">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by name, phone or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    className="refresh-patients-btn"
                    onClick={fetchPatients}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ================= PATIENT TABLE ================= */}

            <div className="patients-table-container">

                {loading ? (
                    <div className="patients-message">
                        <div className="loading-spinner"></div>
                        <p>Loading patients...</p>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="patients-message">
                        <div className="patients-empty-icon">👥</div>
                        <h3>No patients found</h3>
                        <p>
                            {search
                                ? "Try changing your search."
                                : "No patients have been registered yet."}
                        </p>
                    </div>
                ) : (
                    <table className="patients-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Blood Group</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id}>

                                <td>
                                        <span className="patient-id">
                                            #{patient.id}
                                        </span>
                                </td>

                                <td>
                                    <div className="patient-name-cell">
                                        <div className="patient-avatar">
                                            {patient.firstName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "P"}
                                        </div>

                                        <div>
                                            <strong>
                                                {patient.firstName}{" "}
                                                {patient.lastName || ""}
                                            </strong>

                                            <small>
                                                {patient.email || "No email"}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    {patient.gender || "-"}
                                </td>

                                <td>
                                    {patient.dateOfBirth || "-"}
                                </td>

                                <td>
                                    {patient.phone || "-"}
                                </td>

                                <td>
                                    {patient.email || "-"}
                                </td>

                                <td>
                                        <span className="blood-group">
                                            {patient.bloodGroup || "-"}
                                        </span>
                                </td>

                                <td>
                                        <span
                                            className={
                                                patient.active === false
                                                    ? "status-inactive"
                                                    : "status-active"
                                            }
                                        >
                                            {patient.active === false
                                                ? "Inactive"
                                                : "Active"}
                                        </span>
                                </td>

                                <td>
                                    <div className="patient-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(patient)
                                            }
                                            title="Edit patient"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(patient.id)
                                            }
                                            title="Delete patient"
                                        >
                                            🗑️
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>

                    </table>
                )}

            </div>

            {/* ================= FORM MODAL ================= */}

            {showForm && (
                <div className="patient-modal-overlay">

                    <div className="patient-modal">

                        <div className="patient-modal-header">
                            <div>
                                <h2>
                                    {editingPatient
                                        ? "Edit Patient"
                                        : "Register New Patient"}
                                </h2>

                                <p>
                                    Enter patient information below.
                                </p>
                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={resetForm}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* PERSONAL INFORMATION */}

                            <div className="form-section">
                                <h3>Personal Information</h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            First Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
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
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Date of Birth *
                                        </label>

                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Gender *
                                        </label>

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
                            </div>

                            {/* CONTACT INFORMATION */}

                            <div className="form-section">
                                <h3>Contact Information</h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            Phone *
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Email *
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                        ></textarea>
                                    </div>

                                </div>
                            </div>

                            {/* MEDICAL INFORMATION */}

                            <div className="form-section">
                                <h3>Medical Information</h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            Blood Group
                                        </label>

                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
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

                                </div>
                            </div>

                            {/* EMERGENCY CONTACT */}

                            <div className="form-section">
                                <h3>Emergency Contact</h3>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            Contact Name
                                        </label>

                                        <input
                                            type="text"
                                            name="emergencyContactName"
                                            value={
                                                formData.emergencyContactName
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Contact Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="emergencyContactPhone"
                                            value={
                                                formData.emergencyContactPhone
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* FORM ACTIONS */}

                            <div className="patient-form-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-patient-btn"
                                >
                                    {editingPatient
                                        ? "Update Patient"
                                        : "Register Patient"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ReceptionistPatients;