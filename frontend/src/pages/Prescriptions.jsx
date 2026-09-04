import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/Prescriptions.css";

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [search, setSearch] = useState("");
    const [patientFilter, setPatientFilter] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        medicalRecordId: "",
        medicineId: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    });

    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                prescriptionsResponse,
                patientsResponse,
                doctorsResponse,
                medicalRecordsResponse,
                medicinesResponse
            ] = await Promise.all([
                api.get("/prescriptions"),
                api.get("/patients"),
                api.get("/doctors"),
                api.get("/medical-records"),
                api.get("/medicines")
            ]);

            setPrescriptions(
                prescriptionsResponse.data?.data || []
            );

            setPatients(
                patientsResponse.data?.data || []
            );

            setDoctors(
                doctorsResponse.data?.data || []
            );

            setMedicalRecords(
                medicalRecordsResponse.data?.data || []
            );

            setMedicines(
                medicinesResponse.data?.data || []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load prescription data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            patientId: "",
            doctorId: "",
            medicalRecordId: "",
            medicineId: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const handleAdd = () => {
        setError("");
        setSuccess("");

        setFormData({
            patientId: "",
            doctorId: "",
            medicalRecordId: "",
            medicineId: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        });

        setEditingId(null);
        setShowForm(true);
    };

    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                patientId: Number(formData.patientId),
                doctorId: Number(formData.doctorId),
                medicalRecordId: Number(formData.medicalRecordId),
                medicineId: Number(formData.medicineId),
                dosage: formData.dosage,
                frequency: formData.frequency,
                duration: formData.duration,
                instructions: formData.instructions
            };

            if (editingId) {
                await api.put(
                    `/prescriptions/${editingId}`,
                    payload
                );

                setSuccess(
                    "Prescription updated successfully"
                );
            } else {
                await api.post(
                    "/prescriptions",
                    payload
                );

                setSuccess(
                    "Prescription added successfully"
                );
            }

            resetForm();
            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save prescription"
            );
        } finally {
            setFormLoading(false);
        }
    };

    // =========================
    // VIEW
    // =========================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/prescriptions/${id}`
            );

            setSelectedPrescription(
                response.data?.data || null
            );

            setShowView(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch prescription"
            );
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = async (id) => {
        try {
            setError("");
            setSuccess("");

            const response = await api.get(
                `/prescriptions/${id}`
            );

            const prescription = response.data?.data;

            if (!prescription) {
                setError("Prescription not found");
                return;
            }

            setFormData({
                patientId: prescription.patientId || "",
                doctorId: prescription.doctorId || "",
                medicalRecordId:
                    prescription.medicalRecordId || "",
                medicineId: findMedicineId(
                    prescription.medicineName
                ),
                dosage: prescription.dosage || "",
                frequency: prescription.frequency || "",
                duration: prescription.duration || "",
                instructions:
                    prescription.instructions || ""
            });

            setEditingId(id);
            setShowForm(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch prescription"
            );
        }
    };

    // =========================
    // FIND MEDICINE ID
    // =========================

    const findMedicineId = (medicineName) => {
        const medicine = medicines.find(
            (item) => item.name === medicineName
        );

        return medicine?.id || "";
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this prescription?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/prescriptions/${id}`
            );

            setSuccess(
                "Prescription deleted successfully"
            );

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete prescription"
            );
        }
    };

    // =========================
    // FILTER
    // =========================

    const filteredPrescriptions =
        prescriptions.filter((prescription) => {

            const searchText = search.toLowerCase();

            const matchesSearch =
                prescription.patientName
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.doctorName
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.medicineName
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.dosage
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.frequency
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.duration
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesPatient =
                !patientFilter ||
                String(prescription.patientId) ===
                String(patientFilter);

            return matchesSearch && matchesPatient;
        });

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="prescriptions-page">
                <div className="loading">
                    Loading prescriptions...
                </div>
            </div>
        );
    }

    return (
        <div className="prescriptions-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="prescriptions-header">

                <div>
                    <h1>Prescription Management</h1>
                    <p>
                        Manage patient prescriptions and medicines
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleAdd}
                >
                    + Add Prescription
                </button>

            </div>

            {/* =========================
                MESSAGES
            ========================= */}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {/* =========================
                FILTERS
            ========================= */}

            <div className="filters-container">

                <input
                    type="text"
                    placeholder="Search patient, doctor, medicine..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-input"
                />

                <select
                    value={patientFilter}
                    onChange={(e) =>
                        setPatientFilter(e.target.value)
                    }
                    className="filter-select"
                >
                    <option value="">
                        All Patients
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

            {/* =========================
                TABLE
            ========================= */}

            <div className="table-container">

                {filteredPrescriptions.length === 0 ? (

                    <div className="empty-state">
                        No prescriptions found.
                    </div>

                ) : (

                    <table className="prescriptions-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredPrescriptions.map(
                            (prescription) => (

                                <tr
                                    key={prescription.id}
                                >

                                    <td>
                                        #{prescription.id}
                                    </td>

                                    <td>
                                        {prescription.patientName}
                                    </td>

                                    <td>
                                        {prescription.doctorName}
                                    </td>

                                    <td>
                                        {prescription.medicineName}
                                    </td>

                                    <td>
                                        {prescription.dosage}
                                    </td>

                                    <td>
                                        {prescription.frequency}
                                    </td>

                                    <td>
                                        {prescription.duration}
                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="btn-view"
                                                onClick={() =>
                                                    handleView(
                                                        prescription.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    handleEdit(
                                                        prescription.id
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        prescription.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>
                                {editingId
                                    ? "Edit Prescription"
                                    : "Add Prescription"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={resetForm}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="prescription-form"
                        >

                            {/* Patient */}

                            <div className="form-group">

                                <label>
                                    Patient
                                </label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map(
                                        (patient) => (

                                            <option
                                                key={patient.id}
                                                value={patient.id}
                                            >
                                                {patient.firstName}{" "}
                                                {patient.lastName}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Doctor */}

                            <div className="form-group">

                                <label>
                                    Doctor
                                </label>

                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map(
                                        (doctor) => (

                                            <option
                                                key={doctor.id}
                                                value={doctor.id}
                                            >
                                                Dr.{" "}
                                                {doctor.firstName}{" "}
                                                {doctor.lastName}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Medical Record */}

                            <div className="form-group">

                                <label>
                                    Medical Record
                                </label>

                                <select
                                    name="medicalRecordId"
                                    value={
                                        formData.medicalRecordId
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Medical Record
                                    </option>

                                    {medicalRecords.map(
                                        (record) => (

                                            <option
                                                key={record.id}
                                                value={record.id}
                                            >
                                                Record #{record.id}
                                                {" - "}
                                                {record.diagnosis}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Medicine */}

                            <div className="form-group">

                                <label>
                                    Medicine
                                </label>

                                <select
                                    name="medicineId"
                                    value={formData.medicineId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Medicine
                                    </option>

                                    {medicines.map(
                                        (medicine) => (

                                            <option
                                                key={medicine.id}
                                                value={medicine.id}
                                            >
                                                {medicine.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Dosage */}

                            <div className="form-group">

                                <label>
                                    Dosage
                                </label>

                                <input
                                    type="text"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleChange}
                                    placeholder="e.g. 500mg"
                                    required
                                />

                            </div>

                            {/* Frequency */}

                            <div className="form-group">

                                <label>
                                    Frequency
                                </label>

                                <input
                                    type="text"
                                    name="frequency"
                                    value={
                                        formData.frequency
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. Twice a day"
                                    required
                                />

                            </div>

                            {/* Duration */}

                            <div className="form-group">

                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={
                                        formData.duration
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 7 days"
                                    required
                                />

                            </div>

                            {/* Instructions */}

                            <div className="form-group full-width">

                                <label>
                                    Instructions
                                </label>

                                <textarea
                                    name="instructions"
                                    value={
                                        formData.instructions
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter medicine instructions..."
                                    rows="4"
                                />

                            </div>

                            {/* Buttons */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={resetForm}
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Prescription"
                                            : "Add Prescription"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================
                VIEW MODAL
            ========================= */}

            {showView &&
                selectedPrescription && (

                    <div className="modal-overlay">

                        <div className="modal view-modal">

                            <div className="modal-header">

                                <h2>
                                    Prescription Details
                                </h2>

                                <button
                                    className="close-btn"
                                    onClick={() =>
                                        setShowView(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="details-grid">

                                <div className="detail-item">
                                    <span>
                                        Prescription ID
                                    </span>
                                    <strong>
                                        #{selectedPrescription.id}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Patient
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.patientName
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Doctor
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.doctorName
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Medical Record
                                    </span>
                                    <strong>
                                        #
                                        {
                                            selectedPrescription.medicalRecordId
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Medicine
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.medicineName
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Dosage
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.dosage
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Frequency
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.frequency
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Duration
                                    </span>
                                    <strong>
                                        {
                                            selectedPrescription.duration
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item full-width">
                                    <span>
                                        Instructions
                                    </span>

                                    <p>
                                        {
                                            selectedPrescription.instructions ||
                                            "No instructions provided"
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    className="btn-secondary"
                                    onClick={() =>
                                        setShowView(false)
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    className="btn-edit"
                                    onClick={() => {
                                        setShowView(false);
                                        handleEdit(
                                            selectedPrescription.id
                                        );
                                    }}
                                >
                                    Edit
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}

export default Prescriptions;