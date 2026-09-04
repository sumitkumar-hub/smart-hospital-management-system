import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/MedicalRecords.css";

function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [search, setSearch] = useState("");
    const [patientFilter, setPatientFilter] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        visitDate: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [recordsResponse, patientsResponse, doctorsResponse] =
                await Promise.all([
                    api.get("/medical-records"),
                    api.get("/patients"),
                    api.get("/doctors")
                ]);

            setRecords(recordsResponse.data?.data || []);
            setPatients(patientsResponse.data?.data || []);
            setDoctors(doctorsResponse.data?.data || []);

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load medical records."
            );
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
            patientId: "",
            doctorId: "",
            diagnosis: "",
            prescription: "",
            notes: "",
            visitDate: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                patientId: Number(formData.patientId),
                doctorId: Number(formData.doctorId),
                diagnosis: formData.diagnosis,
                prescription: formData.prescription,
                notes: formData.notes,
                visitDate: formData.visitDate
            };

            if (editingId) {
                await api.put(
                    `/medical-records/${editingId}`,
                    payload
                );

                setSuccess("Medical record updated successfully.");
            } else {
                await api.post(
                    "/medical-records",
                    payload
                );

                setSuccess("Medical record added successfully.");
            }

            resetForm();
            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save medical record."
            );
        } finally {
            setFormLoading(false);
        }
    };

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/medical-records/${id}`
            );

            setSelectedRecord(response.data?.data || null);
            setShowView(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load medical record."
            );
        }
    };

    const handleEdit = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/medical-records/${id}`
            );

            const record = response.data?.data;

            if (!record) {
                setError("Medical record not found.");
                return;
            }

            setFormData({
                patientId: record.patientId || "",
                doctorId: record.doctorId || "",
                diagnosis: record.diagnosis || "",
                prescription: record.prescription || "",
                notes: record.notes || "",
                visitDate: record.visitDate || ""
            });

            setEditingId(id);
            setShowForm(true);
            setShowView(false);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load medical record."
            );
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

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete medical record."
            );
        }
    };

    const filteredRecords = records.filter((record) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            record.patientName?.toLowerCase().includes(searchText) ||
            record.doctorName?.toLowerCase().includes(searchText) ||
            record.diagnosis?.toLowerCase().includes(searchText) ||
            record.prescription?.toLowerCase().includes(searchText);

        const matchesPatient =
            !patientFilter ||
            String(record.patientId) === String(patientFilter);

        return matchesSearch && matchesPatient;
    });

    return (
        <div className="medical-records-page">

            <div className="medical-records-header">
                <div>
                    <h1>Medical Records</h1>
                    <p>Manage patient medical records</p>
                </div>

                <button
                    className="add-record-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    + Add Medical Record
                </button>
            </div>

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert success-alert">
                    {success}
                </div>
            )}

            {/* Filters */}

            <div className="records-filters">

                <input
                    type="text"
                    placeholder="Search patient, doctor, diagnosis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={patientFilter}
                    onChange={(e) => setPatientFilter(e.target.value)}
                >
                    <option value="">All Patients</option>

                    {patients.map((patient) => (
                        <option
                            key={patient.id}
                            value={patient.id}
                        >
                            {patient.firstName} {patient.lastName}
                        </option>
                    ))}
                </select>

            </div>

            {/* Loading */}

            {loading ? (
                <div className="loading">
                    Loading medical records...
                </div>
            ) : (

                <div className="records-table-container">

                    <table className="records-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Specialization</th>
                            <th>Diagnosis</th>
                            <th>Visit Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredRecords.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="7"
                                    className="no-records"
                                >
                                    No medical records found.
                                </td>
                            </tr>

                        ) : (

                            filteredRecords.map((record) => (

                                <tr key={record.id}>

                                    <td>{record.id}</td>

                                    <td>
                                        {record.patientName}
                                    </td>

                                    <td>
                                        {record.doctorName}
                                    </td>

                                    <td>
                                        {record.specialization}
                                    </td>

                                    <td>
                                        {record.diagnosis}
                                    </td>

                                    <td>
                                        {record.visitDate}
                                    </td>

                                    <td className="action-buttons">

                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                handleView(record.id)
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(record.id)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(record.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            )}

            {/* Add / Edit Form */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="medical-record-modal">

                        <div className="modal-header">

                            <h2>
                                {editingId
                                    ? "Edit Medical Record"
                                    : "Add Medical Record"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={resetForm}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="medical-record-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label>Patient</label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
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

                                <label>Doctor</label>

                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map((doctor) => (
                                        <option
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            {doctor.firstName}{" "}
                                            {doctor.lastName}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div className="form-group">

                                <label>Visit Date</label>

                                <input
                                    type="date"
                                    name="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Diagnosis</label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    placeholder="Enter diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Prescription</label>

                                <textarea
                                    name="prescription"
                                    placeholder="Enter prescription"
                                    value={formData.prescription}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Notes</label>

                                <textarea
                                    name="notes"
                                    placeholder="Enter additional notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />

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
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Record"
                                            : "Add Record"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* View Modal */}

            {showView && selectedRecord && (

                <div className="modal-overlay">

                    <div className="view-record-modal">

                        <div className="modal-header">

                            <h2>Medical Record Details</h2>

                            <button
                                className="close-btn"
                                onClick={() => setShowView(false)}
                            >
                                ×
                            </button>

                        </div>

                        <div className="record-details">

                            <div className="detail-row">
                                <strong>Record ID:</strong>
                                <span>{selectedRecord.id}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Patient:</strong>
                                <span>
                                    {selectedRecord.patientName}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Doctor:</strong>
                                <span>
                                    {selectedRecord.doctorName}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Specialization:</strong>
                                <span>
                                    {selectedRecord.specialization}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Visit Date:</strong>
                                <span>
                                    {selectedRecord.visitDate}
                                </span>
                            </div>

                            <div className="detail-section">

                                <strong>Diagnosis</strong>

                                <p>
                                    {selectedRecord.diagnosis}
                                </p>

                            </div>

                            <div className="detail-section">

                                <strong>Prescription</strong>

                                <p>
                                    {selectedRecord.prescription}
                                </p>

                            </div>

                            <div className="detail-section">

                                <strong>Notes</strong>

                                <p>
                                    {selectedRecord.notes || "No notes"}
                                </p>

                            </div>

                        </div>

                        <div className="view-actions">

                            <button
                                className="edit-btn"
                                onClick={() =>
                                    handleEdit(selectedRecord.id)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="close-modal-btn"
                                onClick={() =>
                                    setShowView(false)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MedicalRecords;