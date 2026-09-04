import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/Appointments.css";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [doctorFilter, setDoctorFilter] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [viewAppointment, setViewAppointment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: ""
    });

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
        fetchDoctors();
    }, []);

    // =========================
    // FETCH APPOINTMENTS
    // =========================

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/appointments");

            setAppointments(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load appointments."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FETCH PATIENTS
    // =========================

    const fetchPatients = async () => {
        try {
            const response = await api.get("/patients");

            setPatients(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load patients."
            );
        }
    };

    // =========================
    // FETCH DOCTORS
    // =========================

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/doctors");

            setDoctors(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load doctors."
            );
        }
    };

    // =========================
    // HANDLE FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            patientId: "",
            doctorId: "",
            appointmentDate: "",
            appointmentTime: "",
            reason: ""
        });

        setShowForm(false);
    };

    // =========================
    // BOOK APPOINTMENT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const data = {
                patientId: Number(formData.patientId),
                doctorId: Number(formData.doctorId),
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                reason: formData.reason
            };

            await api.post("/appointments", data);

            setSuccess("Appointment booked successfully.");

            resetForm();
            fetchAppointments();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to book appointment."
            );
        } finally {
            setFormLoading(false);
        }
    };

    // =========================
    // VIEW APPOINTMENT
    // =========================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(`/appointments/${id}`);

            setViewAppointment(response.data?.data);
            setShowForm(false);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load appointment details."
            );
        }
    };

    // =========================
    // UPDATE STATUS
    // =========================

    const handleStatusChange = async (id, status) => {
        try {
            setError("");
            setSuccess("");

            await api.put(
                `/appointments/${id}/status`,
                null,
                {
                    params: {
                        status: status
                    }
                }
            );

            setSuccess("Appointment status updated successfully.");

            if (viewAppointment?.id === id) {
                setViewAppointment({
                    ...viewAppointment,
                    status: status
                });
            }

            fetchAppointments();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to update appointment status."
            );
        }
    };

    // =========================
    // CANCEL APPOINTMENT
    // =========================

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(`/appointments/${id}/cancel`);

            setSuccess("Appointment cancelled successfully.");

            if (viewAppointment?.id === id) {
                setViewAppointment({
                    ...viewAppointment,
                    status: "CANCELLED"
                });
            }

            fetchAppointments();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to cancel appointment."
            );
        }
    };

    // =========================
    // DELETE APPOINTMENT
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this appointment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/appointments/${id}`);

            setSuccess("Appointment deleted successfully.");

            if (viewAppointment?.id === id) {
                setViewAppointment(null);
            }

            fetchAppointments();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete appointment."
            );
        }
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parts = date.split("-");

        if (parts.length !== 3) {
            return date;
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (time) => {
        if (!time) {
            return "-";
        }

        return time.substring(0, 5);
    };

    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {
        switch (status) {
            case "BOOKED":
                return "status-booked";

            case "CONFIRMED":
                return "status-confirmed";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
                return "status-cancelled";

            default:
                return "status-default";
        }
    };

    // =========================
    // FILTER APPOINTMENTS
    // =========================

    const filteredAppointments = appointments.filter(
        (appointment) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                appointment.patientName
                    ?.toLowerCase()
                    .includes(searchText) ||
                appointment.doctorName
                    ?.toLowerCase()
                    .includes(searchText) ||
                appointment.specialization
                    ?.toLowerCase()
                    .includes(searchText) ||
                appointment.reason
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "" ||
                appointment.status === statusFilter;

            const matchesDoctor =
                doctorFilter === "" ||
                String(appointment.doctorId) === doctorFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDoctor
            );
        }
    );

    return (
        <div className="appointments-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="appointments-header">

                <div>
                    <h1>Appointment Management</h1>
                    <p>
                        Manage hospital appointments and schedules
                    </p>
                </div>

                <button
                    className="add-appointment-btn"
                    onClick={() => {
                        setError("");
                        setSuccess("");
                        setShowForm(true);
                        setViewAppointment(null);
                    }}
                >
                    + Book Appointment
                </button>

            </div>

            {/* =========================
                MESSAGES
            ========================= */}

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

            {/* =========================
                BOOK APPOINTMENT FORM
            ========================= */}

            {showForm && (
                <div className="appointment-form-card">

                    <div className="form-header">

                        <div>
                            <h2>Book Appointment</h2>
                            <p>
                                Enter appointment details below
                            </p>
                        </div>

                        <button
                            className="close-btn"
                            onClick={resetForm}
                        >
                            ×
                        </button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

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

                                    {doctors.map((doctor) => (
                                        <option
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            Dr.{" "}
                                            {doctor.firstName}{" "}
                                            {doctor.lastName}
                                            {" - "}
                                            {doctor.specialization}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* Date */}

                            <div className="form-group">

                                <label>
                                    Appointment Date
                                </label>

                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    required
                                />

                            </div>

                            {/* Time */}

                            <div className="form-group">

                                <label>
                                    Appointment Time
                                </label>

                                <input
                                    type="time"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Reason */}

                            <div className="form-group full-width">

                                <label>
                                    Reason
                                </label>

                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Enter reason for appointment"
                                    rows="4"
                                    required
                                />

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
                                className="save-btn"
                                disabled={formLoading}
                            >
                                {formLoading
                                    ? "Booking..."
                                    : "Book Appointment"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =========================
                VIEW APPOINTMENT
            ========================= */}

            {viewAppointment && (
                <div className="appointment-details-card">

                    <div className="form-header">

                        <div>
                            <h2>Appointment Details</h2>
                            <p>
                                Appointment #{viewAppointment.id}
                            </p>
                        </div>

                        <button
                            className="close-btn"
                            onClick={() =>
                                setViewAppointment(null)
                            }
                        >
                            ×
                        </button>

                    </div>

                    <div className="appointment-details-grid">

                        <div>
                            <strong>Patient</strong>
                            <span>
                                {viewAppointment.patientName}
                            </span>
                        </div>

                        <div>
                            <strong>Doctor</strong>
                            <span>
                                Dr. {viewAppointment.doctorName}
                            </span>
                        </div>

                        <div>
                            <strong>Specialization</strong>
                            <span>
                                {viewAppointment.specialization}
                            </span>
                        </div>

                        <div>
                            <strong>Date</strong>
                            <span>
                                {formatDate(
                                    viewAppointment.appointmentDate
                                )}
                            </span>
                        </div>

                        <div>
                            <strong>Time</strong>
                            <span>
                                {formatTime(
                                    viewAppointment.appointmentTime
                                )}
                            </span>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <span
                                className={getStatusClass(
                                    viewAppointment.status
                                )}
                            >
                                {viewAppointment.status}
                            </span>
                        </div>

                        <div className="detail-full-width">
                            <strong>Reason</strong>
                            <span>
                                {viewAppointment.reason}
                            </span>
                        </div>

                    </div>

                    <div className="details-actions">

                        {viewAppointment.status !==
                            "CANCELLED" && (
                                <button
                                    className="cancel-appointment-btn"
                                    onClick={() =>
                                        handleCancel(
                                            viewAppointment.id
                                        )
                                    }
                                >
                                    Cancel Appointment
                                </button>
                            )}

                        <button
                            className="delete-appointment-btn"
                            onClick={() =>
                                handleDelete(
                                    viewAppointment.id
                                )
                            }
                        >
                            Delete
                        </button>

                    </div>

                </div>
            )}

            {/* =========================
                FILTERS
            ========================= */}

            <div className="appointment-filters">

                <input
                    type="text"
                    placeholder="Search patient, doctor, specialization..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Statuses
                    </option>

                    <option value="BOOKED">
                        Booked
                    </option>

                    <option value="CONFIRMED">
                        Confirmed
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>

                </select>

                <select
                    value={doctorFilter}
                    onChange={(e) =>
                        setDoctorFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Doctors
                    </option>

                    {doctors.map((doctor) => (
                        <option
                            key={doctor.id}
                            value={doctor.id}
                        >
                            Dr. {doctor.firstName}{" "}
                            {doctor.lastName}
                        </option>
                    ))}

                </select>

            </div>

            {/* =========================
                APPOINTMENT TABLE
            ========================= */}

            <div className="appointments-table-card">

                <div className="table-header">

                    <div>
                        <h2>Appointments</h2>
                        <span>
                            {filteredAppointments.length} appointment
                            {filteredAppointments.length !== 1
                                ? "s"
                                : ""}
                        </span>
                    </div>

                </div>

                {loading ? (
                    <div className="loading">
                        Loading appointments...
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="empty-state">
                        No appointments found.
                    </div>
                ) : (
                    <div className="table-container">

                        <table>

                            <thead>

                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                            </thead>

                            <tbody>

                            {filteredAppointments.map(
                                (appointment) => (
                                    <tr
                                        key={
                                            appointment.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                appointment.id
                                            }
                                        </td>

                                        <td>
                                            <div className="person-name">

                                                <div className="person-avatar patient-avatar">
                                                    {appointment.patientName
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {
                                                            appointment.patientName
                                                        }
                                                    </strong>

                                                    <small>
                                                        Patient ID:{" "}
                                                        {
                                                            appointment.patientId
                                                        }
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <div className="person-name">

                                                <div className="person-avatar doctor-avatar">
                                                    {appointment.doctorName
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        Dr.{" "}
                                                        {
                                                            appointment.doctorName
                                                        }
                                                    </strong>

                                                    <small>
                                                        Doctor ID:{" "}
                                                        {
                                                            appointment.doctorId
                                                        }
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {
                                                appointment.specialization
                                            }
                                        </td>

                                        <td>
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </td>

                                        <td>
                                            {formatTime(
                                                appointment.appointmentTime
                                            )}
                                        </td>

                                        <td>
                                            <select
                                                className={`status-select ${getStatusClass(
                                                    appointment.status
                                                )}`}
                                                value={
                                                    appointment.status
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        appointment.id,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    appointment.status ===
                                                    "CANCELLED"
                                                }
                                            >

                                                <option value="BOOKED">
                                                    BOOKED
                                                </option>

                                                <option value="CONFIRMED">
                                                    CONFIRMED
                                                </option>

                                                <option value="COMPLETED">
                                                    COMPLETED
                                                </option>

                                                <option value="CANCELLED">
                                                    CANCELLED
                                                </option>

                                            </select>
                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        handleView(
                                                            appointment.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {appointment.status !==
                                                    "CANCELLED" && (
                                                        <button
                                                            className="cancel-btn-small"
                                                            onClick={() =>
                                                                handleCancel(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            appointment.id
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

                    </div>
                )}

            </div>

        </div>
    );
}

export default Appointments;