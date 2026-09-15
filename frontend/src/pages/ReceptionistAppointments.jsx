import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/ReceptionistAppointments.css";

const ReceptionistAppointments = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [appointmentsRes, patientsRes, doctorsRes] =
                await Promise.all([
                    api.get("/appointments"),
                    api.get("/patients"),
                    api.get("/doctors"),
                ]);

            setAppointments(appointmentsRes.data?.data || []);
            setPatients(patientsRes.data?.data || []);
            setDoctors(doctorsRes.data?.data || []);
        } catch (err) {
            console.error("Error fetching appointment data:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load appointment data."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            patientId: "",
            doctorId: "",
            appointmentDate: "",
            appointmentTime: "",
            reason: "",
        });

        setEditingAppointment(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                patientId: Number(formData.patientId),
                doctorId: Number(formData.doctorId),
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                reason: formData.reason,
            };

            await api.post("/appointments", payload);

            alert("Appointment booked successfully.");

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Error booking appointment:", err);

            alert(
                err.response?.data?.message ||
                "Failed to book appointment."
            );
        }
    };

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            await api.put(`/appointments/${id}/cancel`);

            alert("Appointment cancelled successfully.");

            fetchData();
        } catch (err) {
            console.error("Error cancelling appointment:", err);

            alert(
                err.response?.data?.message ||
                "Failed to cancel appointment."
            );
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(
                `/appointments/${id}/status?status=${encodeURIComponent(
                    status
                )}`
            );

            fetchData();
        } catch (err) {
            console.error("Error updating appointment status:", err);

            alert(
                err.response?.data?.message ||
                "Failed to update appointment status."
            );
        }
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(
            (item) => Number(item.id) === Number(patientId)
        );

        if (!patient) {
            return "Unknown Patient";
        }

        return `${patient.firstName || ""} ${
            patient.lastName || ""
        }`.trim();
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(
            (item) => Number(item.id) === Number(doctorId)
        );

        if (!doctor) {
            return "Unknown Doctor";
        }

        return `Dr. ${doctor.firstName || ""} ${
            doctor.lastName || ""
        }`.trim();
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        if (!status) {
            return "status-default";
        }

        return `status-${status.toLowerCase()}`;
    };

    if (loading) {
        return (
            <div className="receptionist-appointments-page">
                <div className="appointments-loading">
                    Loading appointments...
                </div>
            </div>
        );
    }

    return (
        <div className="receptionist-appointments-page">
            {/* Header */}
            <div className="appointments-header">
                <div>
                    <h1>Appointment Management</h1>
                    <p>
                        Manage patient appointments, doctors and
                        appointment status.
                    </p>
                </div>

                <button
                    className="back-btn"
                    onClick={() => navigate("/receptionist")}
                >
                    ← Dashboard
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="appointments-error">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className="appointment-summary">
                <div className="summary-card">
                    <span>Total Appointments</span>
                    <strong>{appointments.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Scheduled</span>
                    <strong>
                        {
                            appointments.filter(
                                (a) =>
                                    String(a.status).toUpperCase() ===
                                    "SCHEDULED"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Completed</span>
                    <strong>
                        {
                            appointments.filter(
                                (a) =>
                                    String(a.status).toUpperCase() ===
                                    "COMPLETED"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Cancelled</span>
                    <strong>
                        {
                            appointments.filter(
                                (a) =>
                                    String(a.status).toUpperCase() ===
                                    "CANCELLED"
                            ).length
                        }
                    </strong>
                </div>
            </div>

            {/* Add Appointment */}
            <div className="appointment-form-section">
                <div className="section-title-row">
                    <div>
                        <h2>
                            {editingAppointment
                                ? "Edit Appointment"
                                : "Book New Appointment"}
                        </h2>
                        <p>
                            Create an appointment for a patient.
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            className="add-appointment-btn"
                            onClick={() => setShowForm(true)}
                        >
                            + Book Appointment
                        </button>
                    )}
                </div>

                {showForm && (
                    <form
                        className="appointment-form"
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
                                        Dr. {doctor.firstName}{" "}
                                        {doctor.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Appointment Date</label>

                            <input
                                type="date"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Appointment Time</label>

                            <input
                                type="time"
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group form-group-full">
                            <label>Reason</label>

                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter reason for appointment"
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="save-appointment-btn"
                            >
                                Book Appointment
                            </button>

                            <button
                                type="button"
                                className="cancel-form-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Appointment Table */}
            <div className="appointments-table-section">
                <div className="section-title-row">
                    <div>
                        <h2>All Appointments</h2>
                        <p>
                            View and manage hospital appointments.
                        </p>
                    </div>
                </div>

                {appointments.length === 0 ? (
                    <div className="empty-appointments">
                        <h3>No appointments found</h3>
                        <p>
                            There are currently no appointments
                            available.
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="appointments-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>
                                        #{appointment.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {getPatientName(
                                                appointment.patientId ||
                                                appointment.patient?.id
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        {getDoctorName(
                                            appointment.doctorId ||
                                            appointment.doctor?.id
                                        )}
                                    </td>

                                    <td>
                                        {formatDate(
                                            appointment.appointmentDate
                                        )}
                                    </td>

                                    <td>
                                        {appointment.appointmentTime ||
                                            "-"}
                                    </td>

                                    <td>
                                        {appointment.reason || "-"}
                                    </td>

                                    <td>
                                            <span
                                                className={`appointment-status ${getStatusClass(
                                                    appointment.status
                                                )}`}
                                            >
                                                {appointment.status ||
                                                    "UNKNOWN"}
                                            </span>
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            {String(
                                                    appointment.status
                                                ).toUpperCase() ===
                                                "SCHEDULED" && (
                                                    <>
                                                        <button
                                                            className="complete-btn"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    appointment.id,
                                                                    "COMPLETED"
                                                                )
                                                            }
                                                        >
                                                            Complete
                                                        </button>

                                                        <button
                                                            className="cancel-appointment-btn"
                                                            onClick={() =>
                                                                handleCancel(
                                                                    appointment.id
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                            {String(
                                                    appointment.status
                                                ).toUpperCase() ===
                                                "COMPLETED" && (
                                                    <span className="action-done">
                                                        Completed
                                                    </span>
                                                )}

                                            {String(
                                                    appointment.status
                                                ).toUpperCase() ===
                                                "CANCELLED" && (
                                                    <span className="action-done">
                                                        Cancelled
                                                    </span>
                                                )}
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
};

export default ReceptionistAppointments;