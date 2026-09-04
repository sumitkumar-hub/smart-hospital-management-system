import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/Doctors.css";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [viewDoctor, setViewDoctor] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        qualification: "",
        consultationFee: "",
        available: true
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/doctors");

            setDoctors(response.data?.data || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load doctors."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            specialization: "",
            experience: "",
            qualification: "",
            consultationFee: "",
            available: true
        });

        setEditingDoctor(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            const data = {
                ...formData,
                experience: Number(formData.experience),
                consultationFee: Number(formData.consultationFee)
            };

            if (editingDoctor) {
                await api.put(`/doctors/${editingDoctor.id}`, data);
                setSuccess("Doctor updated successfully.");
            } else {
                await api.post("/doctors", data);
                setSuccess("Doctor added successfully.");
            }

            resetForm();
            fetchDoctors();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save doctor."
            );
        }
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);

        setFormData({
            firstName: doctor.firstName || "",
            lastName: doctor.lastName || "",
            email: doctor.email || "",
            phone: doctor.phone || "",
            specialization: doctor.specialization || "",
            experience: doctor.experience ?? "",
            qualification: doctor.qualification || "",
            consultationFee: doctor.consultationFee ?? "",
            available: doctor.available ?? true
        });

        setShowForm(true);
        setViewDoctor(null);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this doctor?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/doctors/${id}`);

            setSuccess("Doctor deleted successfully.");
            fetchDoctors();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete doctor."
            );
        }
    };

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(`/doctors/${id}`);

            setViewDoctor(response.data?.data);
            setShowForm(false);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load doctor details."
            );
        }
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const fullName =
            `${doctor.firstName} ${doctor.lastName}`.toLowerCase();

        const matchesSearch =
            fullName.includes(search.toLowerCase()) ||
            doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
            doctor.phone?.includes(search);

        const matchesSpecialization =
            specialization === "" ||
            doctor.specialization?.toLowerCase() ===
            specialization.toLowerCase();

        const matchesAvailability =
            !showAvailableOnly || doctor.available === true;

        return (
            matchesSearch &&
            matchesSpecialization &&
            matchesAvailability
        );
    });

    const specializations = [
        ...new Set(
            doctors
                .map((doctor) => doctor.specialization)
                .filter(Boolean)
        )
    ];

    return (
        <div className="doctors-page">

            <div className="doctors-header">
                <div>
                    <h1>Doctor Management</h1>
                    <p>Manage doctors and their information</p>
                </div>

                <button
                    className="add-doctor-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                        setViewDoctor(null);
                    }}
                >
                    + Add Doctor
                </button>
            </div>

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="doctor-filters">

                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={specialization}
                    onChange={(e) =>
                        setSpecialization(e.target.value)
                    }
                >
                    <option value="">All Specializations</option>

                    {specializations.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <label className="available-filter">
                    <input
                        type="checkbox"
                        checked={showAvailableOnly}
                        onChange={(e) =>
                            setShowAvailableOnly(e.target.checked)
                        }
                    />
                    Available only
                </label>

            </div>

            {showForm && (
                <div className="doctor-form-card">

                    <div className="form-header">
                        <h2>
                            {editingDoctor
                                ? "Edit Doctor"
                                : "Add Doctor"}
                        </h2>

                        <button
                            className="close-btn"
                            onClick={resetForm}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
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
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiology"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. MBBS, MD"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Consultation Fee</label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                        </div>

                        <div className="availability-checkbox">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                                id="available"
                            />

                            <label htmlFor="available">
                                Doctor is currently available
                            </label>
                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {editingDoctor
                                    ? "Update Doctor"
                                    : "Add Doctor"}
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {viewDoctor && (
                <div className="doctor-details-card">

                    <div className="form-header">
                        <h2>Doctor Details</h2>

                        <button
                            className="close-btn"
                            onClick={() => setViewDoctor(null)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="doctor-details-grid">

                        <div>
                            <strong>Full Name</strong>
                            <span>
                                {viewDoctor.firstName}{" "}
                                {viewDoctor.lastName}
                            </span>
                        </div>

                        <div>
                            <strong>Email</strong>
                            <span>{viewDoctor.email}</span>
                        </div>

                        <div>
                            <strong>Phone</strong>
                            <span>{viewDoctor.phone}</span>
                        </div>

                        <div>
                            <strong>Specialization</strong>
                            <span>{viewDoctor.specialization}</span>
                        </div>

                        <div>
                            <strong>Experience</strong>
                            <span>
                                {viewDoctor.experience} years
                            </span>
                        </div>

                        <div>
                            <strong>Qualification</strong>
                            <span>{viewDoctor.qualification}</span>
                        </div>

                        <div>
                            <strong>Consultation Fee</strong>
                            <span>
                                ₹{viewDoctor.consultationFee}
                            </span>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <span
                                className={
                                    viewDoctor.available
                                        ? "status-available"
                                        : "status-unavailable"
                                }
                            >
                                {viewDoctor.available
                                    ? "Available"
                                    : "Unavailable"}
                            </span>
                        </div>

                    </div>

                </div>
            )}

            <div className="doctors-table-card">

                <div className="table-header">
                    <h2>Doctors</h2>

                    <span>
                        {filteredDoctors.length} doctor
                        {filteredDoctors.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>

                {loading ? (
                    <div className="loading">
                        Loading doctors...
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="empty-state">
                        No doctors found.
                    </div>
                ) : (
                    <div className="table-container">

                        <table>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Experience</th>
                                <th>Qualification</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>

                            {filteredDoctors.map((doctor) => (

                                <tr key={doctor.id}>

                                    <td>#{doctor.id}</td>

                                    <td>
                                        <div className="doctor-name">
                                            <div className="doctor-avatar">
                                                {doctor.firstName
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    Dr.{" "}
                                                    {doctor.firstName}{" "}
                                                    {doctor.lastName}
                                                </strong>

                                                <small>
                                                    {doctor.email}
                                                </small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {doctor.specialization}
                                    </td>

                                    <td>
                                        {doctor.experience} years
                                    </td>

                                    <td>
                                        {doctor.qualification}
                                    </td>

                                    <td>
                                        ₹{doctor.consultationFee}
                                    </td>

                                    <td>
                                            <span
                                                className={
                                                    doctor.available
                                                        ? "status-available"
                                                        : "status-unavailable"
                                                }
                                            >
                                                {doctor.available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                    </td>

                                    <td>
                                        <div className="action-buttons">

                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleView(
                                                        doctor.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(
                                                        doctor
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        doctor.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Doctors;