import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/DoctorAppointments.css";

const DoctorAppointments = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const getDoctorId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const loginResponse = JSON.parse(
                localStorage.getItem("loginResponse")
            );

            return (
                user?.doctorId ||
                loginResponse?.doctorId ||
                loginResponse?.data?.doctorId ||
                null
            );
        } catch (error) {
            console.error("Error reading doctor information:", error);
            return null;
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const doctorId = getDoctorId();

            if (!doctorId) {
                setError(
                    "Doctor information not found. Please login again."
                );
                setLoading(false);
                return;
            }

            const response = await api.get(
                `/appointments/doctor/${doctorId}`
            );

            const data = response.data?.data ?? response.data ?? [];

            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching doctor appointments:", err);

            if (err.response?.status === 404) {
                setAppointments([]);
            } else if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("loginResponse");
                navigate("/login");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to load appointments."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (appointmentId, newStatus) => {
        try {
            setUpdatingId(appointmentId);
            setError("");

            await api.put(
                `/appointments/${appointmentId}/status`,
                {
                    status: newStatus,
                }
            );

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? {
                            ...appointment,
                            status: newStatus,
                        }
                        : appointment
                )
            );
        } catch (err) {
            console.error("Error updating appointment status:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("loginResponse");
                navigate("/login");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to update appointment status."
                );
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "status-default";

        switch (status.toUpperCase()) {
            case "SCHEDULED":
                return "status-scheduled";

            case "CONFIRMED":
                return "status-confirmed";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
            case "CANCELED":
                return "status-cancelled";

            case "PENDING":
                return "status-pending";

            default:
                return "status-default";
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const formattedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(formattedDate.getTime())) {
            return date;
        }

        return formattedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (time) => {
        if (!time) return "—";

        const parts = time.split(":");

        if (parts.length < 2) {
            return time;
        }

        const hours = parseInt(parts[0], 10);
        const minutes = parts[1];

        if (Number.isNaN(hours)) {
            return time;
        }

        const period = hours >= 12 ? "PM" : "AM";
        const displayHour = hours % 12 || 12;

        return `${displayHour}:${minutes} ${period}`;
    };

    const totalAppointments = appointments.length;

    const scheduledAppointments = appointments.filter(
        (appointment) =>
            appointment.status?.toUpperCase() === "SCHEDULED" ||
            appointment.status?.toUpperCase() === "PENDING"
    ).length;

    const confirmedAppointments = appointments.filter(
        (appointment) =>
            appointment.status?.toUpperCase() === "CONFIRMED"
    ).length;

    const completedAppointments = appointments.filter(
        (appointment) =>
            appointment.status?.toUpperCase() === "COMPLETED"
    ).length;

    if (loading) {
        return (
            <div className="doctor-appointments-page">
                <div className="doctor-appointments-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-appointments-page">

            {/* Header */}
            <header className="doctor-appointments-header">

                <div className="doctor-appointments-header-left">
                    <button
                        className="back-button"
                        onClick={() => navigate("/doctor")}
                    >
                        ←
                    </button>

                    <div>
                        <h1>My Appointments</h1>
                        <p>Manage your patient appointments</p>
                    </div>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchAppointments}
                >
                    ↻ Refresh
                </button>

            </header>

            {/* Error */}
            {error && (
                <div className="doctor-appointments-error">
                    <span>⚠</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Summary Cards */}
            <section className="appointment-summary">

                <div className="appointment-summary-card">
                    <div className="summary-icon total-icon">
                        📅
                    </div>

                    <div>
                        <span>Total Appointments</span>
                        <strong>{totalAppointments}</strong>
                    </div>
                </div>

                <div className="appointment-summary-card">
                    <div className="summary-icon scheduled-icon">
                        🕐
                    </div>

                    <div>
                        <span>Scheduled</span>
                        <strong>{scheduledAppointments}</strong>
                    </div>
                </div>

                <div className="appointment-summary-card">
                    <div className="summary-icon confirmed-icon">
                        ✓
                    </div>

                    <div>
                        <span>Confirmed</span>
                        <strong>{confirmedAppointments}</strong>
                    </div>
                </div>

                <div className="appointment-summary-card">
                    <div className="summary-icon completed-icon">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>{completedAppointments}</strong>
                    </div>
                </div>

            </section>

            {/* Appointments */}
            <section className="appointments-section">

                <div className="section-heading">
                    <div>
                        <h2>Appointment List</h2>
                        <p>
                            Appointments booked by your patients
                        </p>
                    </div>
                </div>

                {appointments.length === 0 ? (
                    <div className="empty-appointments">

                        <div className="empty-icon">
                            📅
                        </div>

                        <h3>No appointments found</h3>

                        <p>
                            You currently don't have any appointments.
                            New patient bookings will appear here.
                        </p>

                    </div>
                ) : (
                    <div className="appointments-list">

                        {appointments.map((appointment) => (
                            <div
                                className="appointment-card"
                                key={appointment.id}
                            >

                                {/* Appointment Top */}
                                <div className="appointment-card-top">

                                    <div className="patient-info">

                                        <div className="patient-avatar">
                                            {appointment.patientName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "P"}
                                        </div>

                                        <div>
                                            <h3>
                                                {appointment.patientName ||
                                                    "Unknown Patient"}
                                            </h3>

                                            <p>
                                                Patient ID:{" "}
                                                {appointment.patientId ||
                                                    "—"}
                                            </p>
                                        </div>

                                    </div>

                                    <span
                                        className={`appointment-status ${getStatusClass(
                                            appointment.status
                                        )}`}
                                    >
                                        {appointment.status ||
                                            "Unknown"}
                                    </span>

                                </div>

                                {/* Appointment Details */}
                                <div className="appointment-details">

                                    <div className="appointment-detail">

                                        <span className="detail-label">
                                            📅 Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </strong>

                                    </div>

                                    <div className="appointment-detail">

                                        <span className="detail-label">
                                            🕐 Time
                                        </span>

                                        <strong>
                                            {formatTime(
                                                appointment.appointmentTime
                                            )}
                                        </strong>

                                    </div>

                                    <div className="appointment-detail">

                                        <span className="detail-label">
                                            👨‍⚕️ Doctor
                                        </span>

                                        <strong>
                                            {appointment.doctorName ||
                                                "—"}
                                        </strong>

                                    </div>

                                    <div className="appointment-detail">

                                        <span className="detail-label">
                                            🏥 Specialization
                                        </span>

                                        <strong>
                                            {appointment.specialization ||
                                                "—"}
                                        </strong>

                                    </div>

                                </div>

                                {/* Reason */}
                                <div className="appointment-reason">

                                    <span>Reason for Visit</span>

                                    <p>
                                        {appointment.reason ||
                                            "No reason provided"}
                                    </p>

                                </div>

                                {/* Actions */}
                                <div className="appointment-actions">

                                    {appointment.status?.toUpperCase() !==
                                        "CONFIRMED" &&
                                        appointment.status?.toUpperCase() !==
                                        "COMPLETED" &&
                                        appointment.status?.toUpperCase() !==
                                        "CANCELLED" &&
                                        appointment.status?.toUpperCase() !==
                                        "CANCELED" && (
                                            <button
                                                className="action-button confirm-button"
                                                disabled={
                                                    updatingId ===
                                                    appointment.id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment.id,
                                                        "CONFIRMED"
                                                    )
                                                }
                                            >
                                                {updatingId ===
                                                appointment.id
                                                    ? "Updating..."
                                                    : "✓ Confirm"}
                                            </button>
                                        )}

                                    {appointment.status?.toUpperCase() ===
                                        "CONFIRMED" && (
                                            <button
                                                className="action-button complete-button"
                                                disabled={
                                                    updatingId ===
                                                    appointment.id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment.id,
                                                        "COMPLETED"
                                                    )
                                                }
                                            >
                                                {updatingId ===
                                                appointment.id
                                                    ? "Updating..."
                                                    : "✓ Complete"}
                                            </button>
                                        )}

                                    {appointment.status?.toUpperCase() !==
                                        "COMPLETED" &&
                                        appointment.status?.toUpperCase() !==
                                        "CANCELLED" &&
                                        appointment.status?.toUpperCase() !==
                                        "CANCELED" && (
                                            <button
                                                className="action-button cancel-button"
                                                disabled={
                                                    updatingId ===
                                                    appointment.id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment.id,
                                                        "CANCELLED"
                                                    )
                                                }
                                            >
                                                {updatingId ===
                                                appointment.id
                                                    ? "Updating..."
                                                    : "✕ Cancel"}
                                            </button>
                                        )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
};

export default DoctorAppointments;