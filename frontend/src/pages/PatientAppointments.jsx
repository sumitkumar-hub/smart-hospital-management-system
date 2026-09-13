import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/PatientAppointments.css";

function PatientAppointments() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [form, setForm] = useState({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: ""
    });

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || {};

    /*
     * LoginResponseDTO now contains patientId for PATIENT users.
     * We support both locations so this works with the current
     * localStorage structure without changing the login page.
     */
    const patientId =
        user.patientId ||
        JSON.parse(localStorage.getItem("loginResponse") || "null")?.patientId;

    useEffect(() => {
        loadDoctors();
        loadAppointments();
    }, []);

    const loadDoctors = async () => {
        try {
            const response = await api.get("/doctors");
            const data = response.data?.data ?? response.data ?? [];
            setDoctors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load doctors:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load doctors. Please try again."
            );
        }
    };

    const loadAppointments = async () => {
        if (!patientId) {
            setLoading(false);
            setError(
                "Patient information was not found. Please log out and log in again."
            );
            return;
        }

        try {
            const response = await api.get(
                `/appointments/patient/${patientId}`
            );

            const data = response.data?.data ?? response.data ?? [];
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load appointments:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load your appointments."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!patientId) {
            setError(
                "Patient information was not found. Please log out and log in again."
            );
            return;
        }

        if (
            !form.doctorId ||
            !form.appointmentDate ||
            !form.appointmentTime ||
            !form.reason.trim()
        ) {
            setError("Please fill in all appointment details.");
            return;
        }

        setBooking(true);
        setError("");
        setSuccess("");

        try {
            await api.post("/appointments", {
                patientId: Number(patientId),
                doctorId: Number(form.doctorId),
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime,
                reason: form.reason.trim()
            });

            setSuccess("Appointment booked successfully.");

            setForm({
                doctorId: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: ""
            });

            await loadAppointments();
        } catch (err) {
            console.error("Failed to book appointment:", err);
            setError(
                err.response?.data?.message ||
                "Unable to book the appointment. Please try again."
            );
        } finally {
            setBooking(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "-";

        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusClass = (status) => {
        const value = status?.toLowerCase();

        if (value === "confirmed") return "status-confirmed";
        if (value === "completed") return "status-completed";
        if (value === "cancelled" || value === "canceled") {
            return "status-cancelled";
        }

        return "status-pending";
    };

    return (
        <div className="patient-appointments">

            <div className="appointments-header">
                <div>
                    <h1>My Appointments</h1>
                    <p>Book and manage your doctor appointments.</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/patient")}
                >
                    ← Dashboard
                </button>
            </div>

            {error && (
                <div className="appointment-message error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="appointment-message success-message">
                    {success}
                </div>
            )}

            <div className="appointment-layout">

                {/* BOOK APPOINTMENT */}

                <section className="appointment-card booking-card">

                    <div className="card-title">
                        <div className="title-icon">📅</div>

                        <div>
                            <h2>Book Appointment</h2>
                            <p>Schedule a visit with a doctor.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="doctorId">Select Doctor</label>

                            <select
                                id="doctorId"
                                name="doctorId"
                                value={form.doctorId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose a doctor</option>

                                {doctors.map((doctor) => (
                                    <option
                                        key={doctor.id}
                                        value={doctor.id}
                                    >
                                        Dr. {doctor.firstName} {doctor.lastName}
                                        {doctor.specialization
                                            ? ` - ${doctor.specialization}`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            {doctors.length === 0 && !loading && (
                                <small className="field-hint">
                                    No doctors are currently available.
                                </small>
                            )}
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="appointmentDate">
                                    Date
                                </label>

                                <input
                                    id="appointmentDate"
                                    type="date"
                                    name="appointmentDate"
                                    value={form.appointmentDate}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="appointmentTime">
                                    Time
                                </label>

                                <input
                                    id="appointmentTime"
                                    type="time"
                                    name="appointmentTime"
                                    value={form.appointmentTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label htmlFor="reason">
                                Reason for Visit
                            </label>

                            <textarea
                                id="reason"
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                placeholder="Describe the reason for your appointment..."
                                rows="5"
                                maxLength="500"
                                required
                            />

                            <small className="field-hint">
                                {form.reason.length}/500 characters
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="book-button"
                            disabled={booking || doctors.length === 0}
                        >
                            {booking ? "Booking..." : "Book Appointment"}
                        </button>

                    </form>

                </section>


                {/* APPOINTMENT LIST */}

                <section className="appointment-card appointments-list-card">

                    <div className="card-title">
                        <div className="title-icon">🗓️</div>

                        <div>
                            <h2>My Appointments</h2>
                            <p>Your scheduled appointments.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="appointment-empty">
                            <div className="loading-spinner"></div>
                            <p>Loading appointments...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="appointment-empty">
                            <div className="empty-appointment-icon">
                                📅
                            </div>

                            <h3>No appointments yet</h3>

                            <p>
                                Your booked appointments will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="appointments-table-wrapper">

                            <table className="appointments-table">

                                <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>

                                        <td>
                                            <strong>
                                                Dr.{" "}
                                                {appointment.doctorName ||
                                                    "Doctor"}
                                            </strong>
                                        </td>

                                        <td>
                                            {appointment.specialization ||
                                                "-"}
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
                                                <span
                                                    className={`appointment-status ${getStatusClass(
                                                        appointment.status
                                                    )}`}
                                                >
                                                    {appointment.status ||
                                                        "PENDING"}
                                                </span>
                                        </td>

                                    </tr>
                                ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
}

export default PatientAppointments;
