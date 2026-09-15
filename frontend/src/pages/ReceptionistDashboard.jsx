import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/ReceptionistDashboard.css";

function ReceptionistDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [patientsResponse, appointmentsResponse] = await Promise.all([
                api.get("/patients"),
                api.get("/appointments")
            ]);

            const patientsData =
                patientsResponse.data?.data || patientsResponse.data || [];

            const appointmentsData =
                appointmentsResponse.data?.data || appointmentsResponse.data || [];

            setPatients(Array.isArray(patientsData) ? patientsData : []);
            setAppointments(
                Array.isArray(appointmentsData) ? appointmentsData : []
            );
        } catch (error) {
            console.error("Error loading receptionist dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTodayAppointments = () => {
        const today = new Date().toISOString().split("T")[0];

        return appointments.filter((appointment) => {
            const appointmentDate =
                appointment.appointmentDate ||
                appointment.date;

            return appointmentDate === today;
        });
    };

    const getPendingAppointments = () => {
        return appointments.filter((appointment) => {
            const status = appointment.status?.toUpperCase();
            return status === "PENDING" || status === "SCHEDULED";
        });
    };

    const getCompletedAppointments = () => {
        return appointments.filter((appointment) => {
            return appointment.status?.toUpperCase() === "COMPLETED";
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginResponse");

        navigate("/login");
    };

    const todayAppointments = getTodayAppointments();
    const pendingAppointments = getPendingAppointments();
    const completedAppointments = getCompletedAppointments();

    return (
        <div className="receptionist-dashboard">

            {/* ================= HEADER ================= */}
            <header className="receptionist-header">
                <div>
                    <h1>Receptionist Dashboard</h1>
                    <p>Manage patients, appointments and hospital operations.</p>
                </div>

                <div className="receptionist-header-right">
                    <div className="receptionist-user">
                        <div className="receptionist-avatar">
                            {user?.firstName?.charAt(0)?.toUpperCase() || "R"}
                        </div>

                        <div>
                            <strong>
                                {user?.firstName
                                    ? `${user.firstName} ${user.lastName || ""}`
                                    : "Receptionist"}
                            </strong>
                            <span>Receptionist</span>
                        </div>
                    </div>

                    <button
                        className="receptionist-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ================= SUMMARY ================= */}
            <section className="receptionist-summary">

                <div className="receptionist-summary-card">
                    <div className="summary-icon">👥</div>
                    <div>
                        <span>Total Patients</span>
                        <h2>{loading ? "..." : patients.length}</h2>
                    </div>
                </div>

                <div className="receptionist-summary-card">
                    <div className="summary-icon">📅</div>
                    <div>
                        <span>Today's Appointments</span>
                        <h2>{loading ? "..." : todayAppointments.length}</h2>
                    </div>
                </div>

                <div className="receptionist-summary-card">
                    <div className="summary-icon">⏳</div>
                    <div>
                        <span>Pending Appointments</span>
                        <h2>{loading ? "..." : pendingAppointments.length}</h2>
                    </div>
                </div>

                <div className="receptionist-summary-card">
                    <div className="summary-icon">✅</div>
                    <div>
                        <span>Completed Appointments</span>
                        <h2>{loading ? "..." : completedAppointments.length}</h2>
                    </div>
                </div>

            </section>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="receptionist-section">
                <div className="receptionist-section-header">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Frequently used receptionist operations.</p>
                    </div>
                </div>

                <div className="receptionist-actions">

                    <button
                        className="receptionist-action-card"
                        onClick={() => navigate("/receptionist/patients")}
                    >
                        <div className="action-icon">👤</div>
                        <div>
                            <h3>Manage Patients</h3>
                            <p>View and manage patient information</p>
                        </div>
                        <span>→</span>
                    </button>

                    <button
                        className="receptionist-action-card"
                        onClick={() => navigate("/receptionist/appointments")}
                    >
                        <div className="action-icon">📅</div>
                        <div>
                            <h3>Manage Appointments</h3>
                            <p>Schedule and manage appointments</p>
                        </div>
                        <span>→</span>
                    </button>

                    <button
                        className="receptionist-action-card"
                        onClick={() => navigate("/admin/billing")}
                    >
                        <div className="action-icon">💳</div>
                        <div>
                            <h3>Billing</h3>
                            <p>View and manage patient billing</p>
                        </div>
                        <span>→</span>
                    </button>

                    <button
                        className="receptionist-action-card"
                        onClick={() => navigate("/doctor")}
                    >
                        <div className="action-icon">🩺</div>
                        <div>
                            <h3>Doctor Information</h3>
                            <p>View available doctor information</p>
                        </div>
                        <span>→</span>
                    </button>

                </div>
            </section>

            {/* ================= TODAY'S APPOINTMENTS ================= */}
            <section className="receptionist-section">

                <div className="receptionist-section-header">
                    <div>
                        <h2>Today's Appointments</h2>
                        <p>Appointments scheduled for today.</p>
                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() => navigate("/receptionist/appointments")}
                    >
                        View All
                    </button>
                </div>

                <div className="receptionist-table-wrapper">

                    {loading ? (
                        <div className="receptionist-empty">
                            Loading appointments...
                        </div>
                    ) : todayAppointments.length === 0 ? (
                        <div className="receptionist-empty">
                            <div className="empty-icon">📅</div>
                            <h3>No appointments today</h3>
                            <p>There are no appointments scheduled for today.</p>
                        </div>
                    ) : (
                        <table className="receptionist-table">
                            <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {todayAppointments.map((appointment) => (
                                <tr key={appointment.id}>

                                    <td>
                                        <strong>
                                            {appointment.patientName ||
                                            appointment.patient?.firstName
                                                ? `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`
                                                : `Patient #${appointment.patientId || "-"}`}
                                        </strong>
                                    </td>

                                    <td>
                                        {appointment.doctorName ||
                                        appointment.doctor?.firstName
                                            ? `Dr. ${appointment.doctor?.firstName || ""} ${appointment.doctor?.lastName || ""}`
                                            : `Doctor #${appointment.doctorId || "-"}`}
                                    </td>

                                    <td>
                                        {appointment.appointmentDate ||
                                            appointment.date ||
                                            "-"}
                                    </td>

                                    <td>
                                        {appointment.appointmentTime ||
                                            appointment.time ||
                                            "-"}
                                    </td>

                                    <td>
                                            <span
                                                className={`appointment-status ${
                                                    appointment.status
                                                        ?.toLowerCase()
                                                        .replace(/\s+/g, "-") ||
                                                    "pending"
                                                }`}
                                            >
                                                {appointment.status || "PENDING"}
                                            </span>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                </div>

            </section>

            {/* ================= INFORMATION ================= */}
            <section className="receptionist-info-card">

                <div className="info-icon">🧑‍💼</div>

                <div className="info-content">
                    <h2>Receptionist Information</h2>

                    <div className="info-grid">

                        <div>
                            <span>Name</span>
                            <strong>
                                {user?.firstName
                                    ? `${user.firstName} ${user.lastName || ""}`
                                    : "Receptionist"}
                            </strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>
                                {user?.email || "Not available"}
                            </strong>
                        </div>

                        <div>
                            <span>Role</span>
                            <strong>RECEPTIONIST</strong>
                        </div>

                        <div>
                            <span>Account Status</span>
                            <strong className="active-status">
                                Active
                            </strong>
                        </div>

                    </div>
                </div>

            </section>

        </div>
    );
}

export default ReceptionistDashboard;