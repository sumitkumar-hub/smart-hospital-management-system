import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/DoctorMedicalRecords.css";

const DoctorMedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        visitDate: ""
    });

    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        loadDoctor();
    }, []);

    const loadDoctor = () => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedLogin = localStorage.getItem("loginResponse");

            let user = storedUser ? JSON.parse(storedUser) : null;
            let loginResponse = storedLogin ? JSON.parse(storedLogin) : null;

            const id =
                user?.doctorId ||
                loginResponse?.doctorId ||
                loginResponse?.data?.doctorId;

            if (!id) {
                setError("Doctor information not found. Please login again.");
                setLoading(false);
                return;
            }

            setDoctorId(id);

            loadPatients();
            loadRecords(id);
        } catch (err) {
            console.error(err);
            setError("Unable to load doctor information.");
            setLoading(false);
        }
    };

    const loadPatients = async () => {
        try {
            const response = await api.get("/patients");

            const patientData = response.data?.data || [];

            setPatients(patientData);
        } catch (err) {
            console.error("Error loading patients:", err);
        }
    };

    const loadRecords = async (id) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/medical-records");

            const allRecords = response.data?.data || [];

            const doctorRecords = allRecords.filter(
                (record) => Number(record.doctorId) === Number(id)
            );

            setRecords(doctorRecords);
        } catch (err) {
            console.error("Error loading medical records:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load medical records."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            patientId: "",
            diagnosis: "",
            prescription: "",
            notes: "",
            visitDate: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleAddRecord = () => {
        setSuccess("");
        setError("");

        setEditingId(null);

        setFormData({
            patientId: "",
            diagnosis: "",
            prescription: "",
            notes: "",
            visitDate: new Date().toISOString().split("T")[0]
        });

        setShowForm(true);
    };

    const handleEdit = (record) => {
        setSuccess("");
        setError("");

        setEditingId(record.id);

        setFormData({
            patientId: record.patientId || "",
            diagnosis: record.diagnosis || "",
            prescription: record.prescription || "",
            notes: record.notes || "",
            visitDate: record.visitDate || ""
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.patientId) {
            setError("Please select a patient.");
            return;
        }

        if (!formData.diagnosis.trim()) {
            setError("Diagnosis is required.");
            return;
        }

        if (!formData.prescription.trim()) {
            setError("Prescription is required.");
            return;
        }

        if (!formData.visitDate) {
            setError("Visit date is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                patientId: Number(formData.patientId),
                doctorId: Number(doctorId),
                diagnosis: formData.diagnosis.trim(),
                prescription: formData.prescription.trim(),
                notes: formData.notes.trim(),
                visitDate: formData.visitDate
            };

            if (editingId) {
                await api.put(
                    `/medical-records/${editingId}`,
                    payload
                );

                setSuccess("Medical record updated successfully.");
            } else {
                await api.post("/medical-records", payload);

                setSuccess("Medical record added successfully.");
            }

            resetForm();

            await loadRecords(doctorId);
        } catch (err) {
            console.error("Error saving medical record:", err);

            setError(
                err.response?.data?.message ||
                "Unable to save medical record."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this medical record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/medical-records/${id}`);

            setSuccess("Medical record deleted successfully.");

            await loadRecords(doctorId);
        } catch (err) {
            console.error("Error deleting medical record:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete medical record."
            );
        }
    };

    const filteredRecords = records.filter((record) => {
        const searchText = search.toLowerCase();

        return (
            record.patientName?.toLowerCase().includes(searchText) ||
            record.diagnosis?.toLowerCase().includes(searchText) ||
            record.prescription?.toLowerCase().includes(searchText) ||
            record.visitDate?.toLowerCase().includes(searchText)
        );
    });

    const today = new Date().toISOString().split("T")[0];

    const todayRecords = records.filter(
        (record) => record.visitDate === today
    );

    const uniquePatients = new Set(
        records.map((record) => record.patientId)
    );

    if (loading) {
        return (
            <div className="doctor-medical-records-page">
                <div className="records-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading medical records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-medical-records-page">

            {/* HEADER */}
            <div className="records-page-header">
                <div>
                    <h1>Medical Records</h1>
                    <p>
                        Manage and maintain your patients' medical records.
                    </p>
                </div>

                <button
                    className="add-record-btn"
                    onClick={handleAddRecord}
                >
                    + Add Medical Record
                </button>
            </div>

            {/* ALERTS */}
            {error && (
                <div className="records-alert error-alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="records-alert success-alert">
                    {success}
                </div>
            )}

            {/* SUMMARY */}
            <div className="records-summary">

                <div className="summary-card">
                    <div className="summary-icon">📋</div>

                    <div>
                        <span>Total Records</span>
                        <strong>{records.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">📅</div>

                    <div>
                        <span>Today's Records</span>
                        <strong>{todayRecords.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">👥</div>

                    <div>
                        <span>Patients</span>
                        <strong>{uniquePatients.size}</strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="records-toolbar">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by patient, diagnosis or prescription..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="record-count">
                    {filteredRecords.length} record
                    {filteredRecords.length !== 1 ? "s" : ""}
                </div>

            </div>

            {/* FORM */}
            {showForm && (
                <div className="record-form-card">

                    <div className="form-header">
                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Medical Record"
                                    : "Add Medical Record"}
                            </h2>

                            <p>
                                Enter the patient's medical information.
                            </p>
                        </div>

                        <button
                            className="close-form-btn"
                            onClick={resetForm}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Patient <span>*</span>
                                </label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map((patient) => (
                                        <option
                                            key={patient.id}
                                            value={patient.id}
                                        >
                                            {patient.firstName}{" "}
                                            {patient.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Visit Date <span>*</span>
                                </label>

                                <input
                                    type="date"
                                    name="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    Diagnosis <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    placeholder="Enter diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    Prescription <span>*</span>
                                </label>

                                <textarea
                                    name="prescription"
                                    placeholder="Enter prescription details"
                                    value={formData.prescription}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group full-width">
                                <label>Notes</label>

                                <textarea
                                    name="notes"
                                    placeholder="Enter additional notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="4"
                                ></textarea>
                            </div>

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
                                className="save-record-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Record"
                                        : "Save Record"}
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* RECORDS */}
            <div className="records-container">

                {filteredRecords.length === 0 ? (
                    <div className="empty-records">

                        <div className="empty-record-icon">
                            🩺
                        </div>

                        <h2>No Medical Records</h2>

                        <p>
                            {search
                                ? "No records match your search."
                                : "You have not created any medical records yet."}
                        </p>

                        {!search && (
                            <button
                                className="empty-add-btn"
                                onClick={handleAddRecord}
                            >
                                + Add Medical Record
                            </button>
                        )}

                    </div>
                ) : (
                    filteredRecords.map((record) => (
                        <div
                            className="medical-record-card"
                            key={record.id}
                        >

                            <div className="record-card-header">

                                <div className="patient-info">

                                    <div className="patient-avatar">
                                        {record.patientName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h2>
                                            {record.patientName}
                                        </h2>

                                        <p>
                                            Patient ID: {record.patientId}
                                        </p>
                                    </div>

                                </div>

                                <div className="record-date">
                                    <span>Visit Date</span>
                                    <strong>
                                        {record.visitDate}
                                    </strong>
                                </div>

                            </div>

                            <div className="record-doctor">
                                <span>Doctor</span>

                                <strong>
                                    {record.doctorName}
                                </strong>

                                {record.specialization && (
                                    <small>
                                        {record.specialization}
                                    </small>
                                )}
                            </div>

                            <div className="record-details">

                                <div className="detail-section">
                                    <h3>Diagnosis</h3>

                                    <p>
                                        {record.diagnosis}
                                    </p>
                                </div>

                                <div className="detail-section">
                                    <h3>Prescription</h3>

                                    <p>
                                        {record.prescription}
                                    </p>
                                </div>

                                {record.notes && (
                                    <div className="detail-section">
                                        <h3>Notes</h3>

                                        <p>
                                            {record.notes}
                                        </p>
                                    </div>
                                )}

                            </div>

                            <div className="record-actions">

                                <button
                                    className="edit-record-btn"
                                    onClick={() =>
                                        handleEdit(record)
                                    }
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    className="delete-record-btn"
                                    onClick={() =>
                                        handleDelete(record.id)
                                    }
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
};

export default DoctorMedicalRecords;