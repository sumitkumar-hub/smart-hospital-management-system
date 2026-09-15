import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/DoctorPrescriptions.css";

const DoctorPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [doctorId, setDoctorId] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",
        medicalRecordId: "",
        medicineId: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    });

    useEffect(() => {
        loadDoctor();
    }, []);

    const loadDoctor = () => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedLogin = localStorage.getItem("loginResponse");

            const user = storedUser ? JSON.parse(storedUser) : null;
            const loginResponse = storedLogin
                ? JSON.parse(storedLogin)
                : null;

            const id =
                user?.doctorId ||
                loginResponse?.doctorId ||
                loginResponse?.data?.doctorId;

            if (!id) {
                setError(
                    "Doctor information not found. Please login again."
                );
                setLoading(false);
                return;
            }

            setDoctorId(id);

            loadPatients();
            loadMedicalRecords();
            loadMedicines();
            loadPrescriptions(id);
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

    const loadMedicalRecords = async () => {
        try {
            const response = await api.get("/medical-records");

            const recordData = response.data?.data || [];

            setMedicalRecords(recordData);
        } catch (err) {
            console.error("Error loading medical records:", err);
        }
    };

    const loadMedicines = async () => {
        try {
            const response = await api.get("/medicines");

            const medicineData = response.data?.data || response.data || [];

            setMedicines(medicineData);
        } catch (err) {
            console.error("Error loading medicines:", err);
        }
    };

    const loadPrescriptions = async (id) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/prescriptions");

            const allPrescriptions =
                response.data?.data || response.data || [];

            const doctorPrescriptions = allPrescriptions.filter(
                (prescription) =>
                    Number(prescription.doctorId) === Number(id)
            );

            setPrescriptions(doctorPrescriptions);
        } catch (err) {
            console.error("Error loading prescriptions:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load prescriptions."
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

    const handleAddPrescription = () => {
        setSuccess("");
        setError("");

        setEditingId(null);

        setFormData({
            patientId: "",
            medicalRecordId: "",
            medicineId: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        });

        setShowForm(true);
    };

    const handleEdit = (prescription) => {
        setSuccess("");
        setError("");

        setEditingId(prescription.id);

        setFormData({
            patientId: prescription.patientId || "",
            medicalRecordId: prescription.medicalRecordId || "",
            medicineId: prescription.medicineId || "",
            dosage: prescription.dosage || "",
            frequency: prescription.frequency || "",
            duration: prescription.duration || "",
            instructions: prescription.instructions || ""
        });

        setShowForm(true);
    };

    const getPatientRecords = () => {
        if (!formData.patientId) {
            return [];
        }

        return medicalRecords.filter(
            (record) =>
                Number(record.patientId) ===
                Number(formData.patientId)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.patientId) {
            setError("Please select a patient.");
            return;
        }

        if (!formData.medicalRecordId) {
            setError("Please select a medical record.");
            return;
        }

        if (!formData.medicineId) {
            setError("Please select a medicine.");
            return;
        }

        if (!formData.dosage.trim()) {
            setError("Dosage is required.");
            return;
        }

        if (!formData.frequency.trim()) {
            setError("Frequency is required.");
            return;
        }

        if (!formData.duration.trim()) {
            setError("Duration is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                patientId: Number(formData.patientId),
                doctorId: Number(doctorId),
                medicalRecordId: Number(formData.medicalRecordId),
                medicineId: Number(formData.medicineId),
                dosage: formData.dosage.trim(),
                frequency: formData.frequency.trim(),
                duration: formData.duration.trim(),
                instructions: formData.instructions.trim()
            };

            if (editingId) {
                await api.put(
                    `/prescriptions/${editingId}`,
                    payload
                );

                setSuccess(
                    "Prescription updated successfully."
                );
            } else {
                await api.post("/prescriptions", payload);

                setSuccess(
                    "Prescription added successfully."
                );
            }

            resetForm();

            await loadPrescriptions(doctorId);
        } catch (err) {
            console.error(
                "Error saving prescription:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to save prescription."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(
        (prescription) => {
            const searchText = search.toLowerCase();

            return (
                prescription.patientName
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
                    .includes(searchText)
            );
        }
    );

    const uniquePatients = new Set(
        prescriptions.map(
            (prescription) => prescription.patientId
        )
    );

    const medicineCount = new Set(
        prescriptions.map(
            (prescription) => prescription.medicineName
        )
    );

    if (loading) {
        return (
            <div className="doctor-prescriptions-page">
                <div className="prescriptions-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading prescriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-prescriptions-page">

            {/* HEADER */}
            <div className="prescriptions-page-header">
                <div>
                    <h1>Prescriptions</h1>
                    <p>
                        Manage prescriptions for your patients.
                    </p>
                </div>

                <button
                    className="add-prescription-btn"
                    onClick={handleAddPrescription}
                >
                    + Add Prescription
                </button>
            </div>

            {/* ALERTS */}
            {error && (
                <div className="prescriptions-alert error-alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="prescriptions-alert success-alert">
                    {success}
                </div>
            )}

            {/* SUMMARY */}
            <div className="prescriptions-summary">

                <div className="summary-card">
                    <div className="summary-icon">💊</div>

                    <div>
                        <span>Total Prescriptions</span>
                        <strong>{prescriptions.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">👥</div>

                    <div>
                        <span>Patients</span>
                        <strong>{uniquePatients.size}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">🧴</div>

                    <div>
                        <span>Medicines Used</span>
                        <strong>{medicineCount.size}</strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="prescriptions-toolbar">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by patient, medicine, dosage or frequency..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <div className="prescription-count">
                    {filteredPrescriptions.length} prescription
                    {filteredPrescriptions.length !== 1
                        ? "s"
                        : ""}
                </div>

            </div>

            {/* FORM */}
            {showForm && (
                <div className="prescription-form-card">

                    <div className="form-header">
                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Prescription"
                                    : "Add Prescription"}
                            </h2>

                            <p>
                                Enter prescription details for the patient.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="close-form-btn"
                            onClick={resetForm}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* PATIENT */}
                            <div className="form-group">
                                <label>
                                    Patient <span>*</span>
                                </label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={(e) => {
                                        handleInputChange(e);

                                        setFormData((prev) => ({
                                            ...prev,
                                            medicalRecordId: ""
                                        }));
                                    }}
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

                            {/* MEDICAL RECORD */}
                            <div className="form-group">
                                <label>
                                    Medical Record <span>*</span>
                                </label>

                                <select
                                    name="medicalRecordId"
                                    value={formData.medicalRecordId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.patientId}
                                >
                                    <option value="">
                                        {formData.patientId
                                            ? "Select Medical Record"
                                            : "Select Patient First"}
                                    </option>

                                    {getPatientRecords().map(
                                        (record) => (
                                            <option
                                                key={record.id}
                                                value={record.id}
                                            >
                                                {record.visitDate} -{" "}
                                                {record.diagnosis}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* MEDICINE */}
                            <div className="form-group">
                                <label>
                                    Medicine <span>*</span>
                                </label>

                                <select
                                    name="medicineId"
                                    value={formData.medicineId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">
                                        Select Medicine
                                    </option>

                                    {medicines.map((medicine) => (
                                        <option
                                            key={medicine.id}
                                            value={medicine.id}
                                        >
                                            {medicine.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DOSAGE */}
                            <div className="form-group">
                                <label>
                                    Dosage <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="dosage"
                                    placeholder="Example: 1 tablet"
                                    value={formData.dosage}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* FREQUENCY */}
                            <div className="form-group">
                                <label>
                                    Frequency <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="frequency"
                                    placeholder="Example: Twice a day"
                                    value={formData.frequency}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* DURATION */}
                            <div className="form-group">
                                <label>
                                    Duration <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="Example: 7 days"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* INSTRUCTIONS */}
                            <div className="form-group full-width">
                                <label>Instructions</label>

                                <textarea
                                    name="instructions"
                                    placeholder="Example: Take after meals"
                                    value={formData.instructions}
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
                                className="save-prescription-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Prescription"
                                        : "Save Prescription"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* PRESCRIPTIONS */}
            <div className="prescriptions-container">

                {filteredPrescriptions.length === 0 ? (

                    <div className="empty-prescriptions">

                        <div className="empty-prescription-icon">
                            💊
                        </div>

                        <h2>No Prescriptions</h2>

                        <p>
                            {search
                                ? "No prescriptions match your search."
                                : "You have not created any prescriptions yet."}
                        </p>

                        {!search && (
                            <button
                                className="empty-add-btn"
                                onClick={handleAddPrescription}
                            >
                                + Add Prescription
                            </button>
                        )}

                    </div>

                ) : (

                    filteredPrescriptions.map(
                        (prescription) => (

                            <div
                                className="prescription-card"
                                key={prescription.id}
                            >

                                <div className="prescription-card-header">

                                    <div className="patient-info">

                                        <div className="patient-avatar">
                                            {prescription.patientName
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <h2>
                                                {prescription.patientName}
                                            </h2>

                                            <p>
                                                Patient ID:{" "}
                                                {prescription.patientId}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="prescription-id">
                                        <span>
                                            Prescription ID
                                        </span>

                                        <strong>
                                            #{prescription.id}
                                        </strong>
                                    </div>

                                </div>

                                <div className="prescription-doctor">
                                    <span>Doctor</span>

                                    <strong>
                                        {prescription.doctorName}
                                    </strong>

                                    <small>
                                        Medical Record ID:{" "}
                                        {prescription.medicalRecordId}
                                    </small>
                                </div>

                                <div className="prescription-details">

                                    <div className="detail-section">
                                        <h3>Medicine</h3>

                                        <p>
                                            💊{" "}
                                            {prescription.medicineName}
                                        </p>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Dosage</h3>

                                        <p>
                                            {prescription.dosage}
                                        </p>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Frequency</h3>

                                        <p>
                                            {prescription.frequency}
                                        </p>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Duration</h3>

                                        <p>
                                            {prescription.duration}
                                        </p>
                                    </div>

                                    {prescription.instructions && (
                                        <div className="detail-section full-detail">
                                            <h3>Instructions</h3>

                                            <p>
                                                {
                                                    prescription.instructions
                                                }
                                            </p>
                                        </div>
                                    )}

                                </div>

                                <div className="prescription-actions">

                                    <button
                                        className="edit-prescription-btn"
                                        onClick={() =>
                                            handleEdit(
                                                prescription
                                            )
                                        }
                                    >
                                        ✏️ Edit
                                    </button>

                                </div>

                            </div>

                        )
                    )
                )}

            </div>

        </div>
    );
};

export default DoctorPrescriptions;