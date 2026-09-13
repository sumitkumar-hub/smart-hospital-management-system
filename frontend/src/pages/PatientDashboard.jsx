import { useNavigate } from "react-router-dom";
import "../Styles/PatientDashboard.css";

function PatientDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Patient";

    return (
        <div className="patient-dashboard">

            {/* ================= HEADER ================= */}

            <header className="patient-header">

                <div>
                    <h1>Patient Dashboard</h1>
                    <p>
                        Welcome back, <strong>{fullName}</strong>
                    </p>
                </div>

                <div className="patient-profile">

                    <div className="profile-avatar">
                        {user.firstName
                            ? user.firstName.charAt(0).toUpperCase()
                            : "P"}
                    </div>

                    <div>
                        <strong>{fullName}</strong>
                        <span>{user.email || "Patient"}</span>
                    </div>

                </div>

            </header>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="quick-actions">

                <button
                    onClick={() => navigate("/patient/appointments")}
                    className="action-card"
                >
                    <span className="action-icon">📅</span>

                    <div>
                        <h3>Appointments</h3>
                        <p>View your appointments</p>
                    </div>
                </button>


                <button
                    onClick={() => navigate("/patient/medical-records")}
                    className="action-card"
                >
                    <span className="action-icon">🩺</span>

                    <div>
                        <h3>Medical Records</h3>
                        <p>View your medical history</p>
                    </div>
                </button>


                <button
                    onClick={() => navigate("/patient/prescriptions")}
                    className="action-card"
                >
                    <span className="action-icon">💊</span>

                    <div>
                        <h3>Prescriptions</h3>
                        <p>View your medicines</p>
                    </div>
                </button>


                <button
                    onClick={() => navigate("/patient/lab-reports")}
                    className="action-card"
                >
                    <span className="action-icon">🧪</span>

                    <div>
                        <h3>Lab Reports</h3>
                        <p>View your test reports</p>
                    </div>
                </button>

            </section>


            {/* ================= SUMMARY CARDS ================= */}

            <section className="summary-section">

                <div className="summary-card">

                    <div className="summary-icon">📅</div>

                    <div>
                        <span>Upcoming Appointments</span>
                        <strong>0</strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">🩺</div>

                    <div>
                        <span>Medical Records</span>
                        <strong>0</strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">💊</div>

                    <div>
                        <span>Active Prescriptions</span>
                        <strong>0</strong>
                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">💰</div>

                    <div>
                        <span>Pending Bills</span>
                        <strong>0</strong>
                    </div>

                </div>

            </section>


            {/* ================= MAIN CONTENT ================= */}

            <section className="dashboard-grid">

                {/* Upcoming Appointments */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Upcoming Appointments</h2>
                            <p>Your next scheduled visits</p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/patient/appointments")
                            }
                        >
                            View All
                        </button>

                    </div>


                    <div className="empty-state">

                        <div className="empty-icon">📅</div>

                        <h3>No upcoming appointments</h3>

                        <p>
                            You don't have any upcoming appointments.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/patient/appointments")
                            }
                        >
                            Book Appointment
                        </button>

                    </div>

                </div>


                {/* Prescriptions */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Active Prescriptions</h2>
                            <p>Your current medications</p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/patient/prescriptions")
                            }
                        >
                            View All
                        </button>

                    </div>


                    <div className="empty-state">

                        <div className="empty-icon">💊</div>

                        <h3>No active prescriptions</h3>

                        <p>
                            Your active prescriptions will appear here.
                        </p>

                    </div>

                </div>


                {/* Medical Records */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Recent Medical Records</h2>
                            <p>Your latest medical information</p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/patient/medical-records")
                            }
                        >
                            View All
                        </button>

                    </div>


                    <div className="empty-state">

                        <div className="empty-icon">🩺</div>

                        <h3>No medical records</h3>

                        <p>
                            Your medical records will appear here.
                        </p>

                    </div>

                </div>


                {/* Lab Reports */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Recent Lab Reports</h2>
                            <p>Your latest laboratory results</p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/patient/lab-reports")
                            }
                        >
                            View All
                        </button>

                    </div>


                    <div className="empty-state">

                        <div className="empty-icon">🧪</div>

                        <h3>No lab reports</h3>

                        <p>
                            Your laboratory reports will appear here.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= PROFILE ================= */}

            <section className="patient-information">

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>My Information</h2>
                            <p>Your account information</p>
                        </div>

                    </div>


                    <div className="patient-details">

                        <div className="detail-item">
                            <span>First Name</span>
                            <strong>
                                {user.firstName || "Not available"}
                            </strong>
                        </div>


                        <div className="detail-item">
                            <span>Last Name</span>
                            <strong>
                                {user.lastName || "Not available"}
                            </strong>
                        </div>


                        <div className="detail-item">
                            <span>Email</span>
                            <strong>
                                {user.email || "Not available"}
                            </strong>
                        </div>


                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>
                                {user.phone || "Not available"}
                            </strong>
                        </div>


                        <div className="detail-item">
                            <span>Role</span>
                            <strong>
                                {user.role || "PATIENT"}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default PatientDashboard;