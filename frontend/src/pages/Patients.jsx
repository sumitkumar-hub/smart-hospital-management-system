import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Patients.css";

function Patients() {

    // =========================
    // PATIENT LIST
    // =========================

    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // ADD / EDIT FORM
    // =========================

    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [saving, setSaving] = useState(false);

    // =========================
    // VIEW PATIENT
    // =========================

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // =========================
    // DELETE
    // =========================

    const [deletingId, setDeletingId] = useState(null);


    // =========================
    // FORM DATA
    // =========================

    const emptyForm = {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        bloodGroup: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        active: true,
    };

    const [formData, setFormData] = useState(emptyForm);


    // =========================
    // LOAD PATIENTS
    // =========================

    useEffect(() => {
        fetchPatients();
    }, []);


    const fetchPatients = async () => {

        try {

            setError("");

            const response = await api.get("/patients");

            console.log("Patients response:", response.data);

            const data = response.data?.data;

            setPatients(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Patients error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load patients"
            );

            setPatients([]);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================
    // OPEN ADD FORM
    // =========================

    const handleAddPatient = () => {

        setEditingPatient(null);

        setFormData(emptyForm);

        setError("");

        setShowForm(true);

    };


    // =========================
    // OPEN EDIT FORM
    // =========================

    const handleEditPatient = (patient) => {

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
            emergencyContactName:
                patient.emergencyContactName || "",
            emergencyContactPhone:
                patient.emergencyContactPhone || "",
            active:
                patient.active !== undefined
                    ? patient.active
                    : true,
        });

        setError("");

        setShowForm(true);

    };


    // =========================
    // CLOSE FORM
    // =========================

    const handleCancelForm = () => {

        setShowForm(false);

        setEditingPatient(null);

        setFormData(emptyForm);

    };


    // =========================
    // ADD / UPDATE PATIENT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        setError("");

        try {

            if (editingPatient) {

                // =========================
                // UPDATE
                // =========================

                const response = await api.put(
                    `/patients/${editingPatient.id}`,
                    formData
                );

                console.log(
                    "Patient updated:",
                    response.data
                );

            } else {

                // =========================
                // CREATE
                // =========================

                const response = await api.post(
                    "/patients",
                    formData
                );

                console.log(
                    "Patient created:",
                    response.data
                );

            }

            handleCancelForm();

            await fetchPatients();

        } catch (error) {

            console.error(
                "Save patient error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to save patient"
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // VIEW PATIENT
    // =========================

    const handleViewPatient = async (id) => {

        setViewLoading(true);

        setError("");

        try {

            const response = await api.get(
                `/patients/${id}`
            );

            console.log(
                "Patient details:",
                response.data
            );

            setSelectedPatient(
                response.data?.data
            );

        } catch (error) {

            console.error(
                "View patient error:",
                error
            );

            // Use existing patient data
            // if individual endpoint fails.

            const patient = patients.find(
                (item) => item.id === id
            );

            if (patient) {

                setSelectedPatient(patient);

            } else {

                setError(
                    error.response?.data?.message ||
                    "Unable to load patient details"
                );

            }

        } finally {

            setViewLoading(false);

        }
    };


    // =========================
    // CLOSE VIEW
    // =========================

    const closePatientView = () => {

        setSelectedPatient(null);

    };


    // =========================
    // DELETE / DEACTIVATE
    // =========================

    const handleDeletePatient = async (patient) => {

        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${patient.firstName} ${patient.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(patient.id);

        setError("");

        try {

            /*
             * Try DELETE endpoint.
             */

            await api.delete(
                `/patients/${patient.id}`
            );

            console.log(
                "Patient deleted/deactivated:",
                patient.id
            );

            await fetchPatients();

        } catch (error) {

            console.error(
                "Delete patient error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete patient"
            );

        } finally {

            setDeletingId(null);

        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="patients-page">

                <h2>
                    Loading patients...
                </h2>

            </div>
        );

    }


    return (

        <div className="patients-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="patients-header">

                <div>

                    <h1>
                        Patient Management
                    </h1>

                    <p>
                        Manage hospital patients
                    </p>

                </div>


                <button
                    type="button"
                    className="add-patient-btn"
                    onClick={handleAddPatient}
                >
                    + Add Patient
                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="patients-error">

                    {error}

                </div>

            )}


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (

                <div className="patient-form-card">

                    <div className="patient-form-header">

                        <div>

                            <h2>
                                {editingPatient
                                    ? "Edit Patient"
                                    : "Add New Patient"}
                            </h2>

                            {editingPatient && (
                                <p>
                                    Patient ID:{" "}
                                    {editingPatient.id}
                                </p>
                            )}

                        </div>


                        <button
                            type="button"
                            className="close-btn"
                            onClick={handleCancelForm}
                        >
                            ×
                        </button>

                    </div>


                    <form
                        className="patient-form"
                        onSubmit={handleSubmit}
                    >

                        {/* FIRST NAME */}

                        <div className="form-group">

                            <label>
                                First Name *
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />

                        </div>


                        {/* LAST NAME */}

                        <div className="form-group">

                            <label>
                                Last Name *
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />

                        </div>


                        {/* DATE OF BIRTH */}

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


                        {/* GENDER */}

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


                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone *
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group form-group-full">

                            <label>
                                Address *
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                rows="3"
                                required
                            />

                        </div>


                        {/* BLOOD GROUP */}

                        <div className="form-group">

                            <label>
                                Blood Group *
                            </label>

                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Blood Group
                                </option>

                                <option value="A+">
                                    A+
                                </option>

                                <option value="A-">
                                    A-
                                </option>

                                <option value="B+">
                                    B+
                                </option>

                                <option value="B-">
                                    B-
                                </option>

                                <option value="AB+">
                                    AB+
                                </option>

                                <option value="AB-">
                                    AB-
                                </option>

                                <option value="O+">
                                    O+
                                </option>

                                <option value="O-">
                                    O-
                                </option>

                            </select>

                        </div>


                        {/* EMERGENCY CONTACT NAME */}

                        <div className="form-group">

                            <label>
                                Emergency Contact Name *
                            </label>

                            <input
                                type="text"
                                name="emergencyContactName"
                                value={
                                    formData.emergencyContactName
                                }
                                onChange={handleChange}
                                placeholder="Emergency contact name"
                                required
                            />

                        </div>


                        {/* EMERGENCY CONTACT PHONE */}

                        <div className="form-group">

                            <label>
                                Emergency Contact Phone *
                            </label>

                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={
                                    formData.emergencyContactPhone
                                }
                                onChange={handleChange}
                                placeholder="Emergency contact phone"
                                required
                            />

                        </div>


                        {/* ACTIVE */}

                        {editingPatient && (

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="active"
                                    value={
                                        formData.active
                                            ? "true"
                                            : "false"
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            active:
                                                e.target.value ===
                                                "true",
                                        })
                                    }
                                >

                                    <option value="true">
                                        Active
                                    </option>

                                    <option value="false">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        )}


                        {/* FORM BUTTONS */}

                        <div className="patient-form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-patient-btn"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : editingPatient
                                        ? "Update Patient"
                                        : "Save Patient"}

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================
                PATIENT LIST
            ========================= */}

            <div className="patients-card">

                <div className="patients-card-header">

                    <h2>
                        Patients
                    </h2>

                    <span>
                        Total: {patients.length}
                    </span>

                </div>


                {patients.length === 0 ? (

                    <div className="no-patients">

                        No patients found

                    </div>

                ) : (

                    <div className="patients-table-container">

                        <table className="patients-table">

                            <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Date of Birth</th>

                                <th>Gender</th>

                                <th>Phone</th>

                                <th>Email</th>

                                <th>Blood Group</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                            </thead>


                            <tbody>

                            {patients.map((patient) => (

                                <tr key={patient.id}>

                                    <td>
                                        {patient.id}
                                    </td>


                                    <td>

                                        <strong>
                                            {patient.firstName}{" "}
                                            {patient.lastName}
                                        </strong>

                                    </td>


                                    <td>
                                        {patient.dateOfBirth ||
                                            "-"}
                                    </td>


                                    <td>
                                        {patient.gender ||
                                            "-"}
                                    </td>


                                    <td>
                                        {patient.phone ||
                                            "-"}
                                    </td>


                                    <td>
                                        {patient.email ||
                                            "-"}
                                    </td>


                                    <td>
                                        {patient.bloodGroup ||
                                            "-"}
                                    </td>


                                    <td>

                                            <span
                                                className={
                                                    patient.active
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >

                                                {patient.active
                                                    ? "Active"
                                                    : "Inactive"}

                                            </span>

                                    </td>


                                    <td>

                                        <div className="patient-actions">

                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                className="view-btn"
                                                onClick={() =>
                                                    handleViewPatient(
                                                        patient.id
                                                    )
                                                }
                                                disabled={
                                                    viewLoading
                                                }
                                            >
                                                View
                                            </button>


                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEditPatient(
                                                        patient
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDeletePatient(
                                                        patient
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    patient.id
                                                }
                                            >

                                                {deletingId ===
                                                patient.id
                                                    ? "Deleting..."
                                                    : "Delete"}

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


            {/* =========================
                VIEW PATIENT MODAL
            ========================= */}

            {selectedPatient && (

                <div
                    className="patient-modal-overlay"
                    onClick={closePatientView}
                >

                    <div
                        className="patient-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="patient-modal-header">

                            <div>

                                <h2>
                                    Patient Details
                                </h2>

                                <p>
                                    Patient ID:{" "}
                                    {selectedPatient.id}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-btn"
                                onClick={closePatientView}
                            >
                                ×
                            </button>

                        </div>


                        <div className="patient-details">

                            {/* NAME */}

                            <div className="detail-item">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {selectedPatient.firstName}{" "}
                                    {selectedPatient.lastName}
                                </strong>

                            </div>


                            {/* DOB */}

                            <div className="detail-item">

                                <span>
                                    Date of Birth
                                </span>

                                <strong>
                                    {selectedPatient.dateOfBirth ||
                                        "-"}
                                </strong>

                            </div>


                            {/* GENDER */}

                            <div className="detail-item">

                                <span>
                                    Gender
                                </span>

                                <strong>
                                    {selectedPatient.gender ||
                                        "-"}
                                </strong>

                            </div>


                            {/* PHONE */}

                            <div className="detail-item">

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {selectedPatient.phone ||
                                        "-"}
                                </strong>

                            </div>


                            {/* EMAIL */}

                            <div className="detail-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {selectedPatient.email ||
                                        "-"}
                                </strong>

                            </div>


                            {/* BLOOD GROUP */}

                            <div className="detail-item">

                                <span>
                                    Blood Group
                                </span>

                                <strong>
                                    {selectedPatient.bloodGroup ||
                                        "-"}
                                </strong>

                            </div>


                            {/* ADDRESS */}

                            <div className="detail-item detail-full">

                                <span>
                                    Address
                                </span>

                                <strong>
                                    {selectedPatient.address ||
                                        "-"}
                                </strong>

                            </div>


                            {/* EMERGENCY CONTACT */}

                            <div className="detail-item">

                                <span>
                                    Emergency Contact
                                </span>

                                <strong>
                                    {selectedPatient.emergencyContactName ||
                                        "-"}
                                </strong>

                            </div>


                            {/* EMERGENCY PHONE */}

                            <div className="detail-item">

                                <span>
                                    Emergency Phone
                                </span>

                                <strong>
                                    {selectedPatient.emergencyContactPhone ||
                                        "-"}
                                </strong>

                            </div>


                            {/* STATUS */}

                            <div className="detail-item">

                                <span>
                                    Status
                                </span>

                                <strong
                                    className={
                                        selectedPatient.active
                                            ? "status-active"
                                            : "status-inactive"
                                    }
                                >

                                    {selectedPatient.active
                                        ? "Active"
                                        : "Inactive"}

                                </strong>

                            </div>

                        </div>


                        <div className="patient-modal-footer">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closePatientView}
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

export default Patients;