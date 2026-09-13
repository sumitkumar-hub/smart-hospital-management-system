import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/DoctorDashboard.css";

function DoctorDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        setUser(storedUser);
    }, []);

    const doctorName =
        user.firstName || user.name || "Doctor";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginResponse");

        navigate("/login");
    };

    return (
        <div className="doctor-dashboard">

            {/* ================= HEADER ================= */}

            <header className="doctor-header">

                <div className="doctor-brand">
                    <div className="doctor-logo">
                        🏥
                    </div>

                    <div>
                        <h2>Smart Hospital</h2>
                        <p>Doctor Portal</p>
                    </div>
                </div>

                <div className="doctor-header-right">

                    <div className="doctor-profile">

                        <div className="doctor-avatar">
                            {doctorName.charAt(0).toUpperCase()}
                        </div>

                        <div className="doctor-profile-info">
                            <strong>Dr. {doctorName}</strong>
                            <span>Doctor</span>
                        </div>

                    </div>

                    <button
                        className="doctor-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ================= WELCOME ================= */}

            <section className="doctor-welcome">

                <div>
                    <h1>
                        Welcome, Dr. {doctorName} 👋
                    </h1>

                    <p>
                        Manage your appointments, patients,
                        medical records and prescriptions.
                    </p>
                </div>

            </section>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="doctor-section">

                <div className="section-heading">
                    <h2>Quick Actions</h2>
                    <p>
                        Quickly access your frequently used features.
                    </p>
                </div>

                <div className="doctor-quick-actions">

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/doctor/appointments")
                        }
                    >
                        <div className="quick-icon">
                            📅
                        </div>

                        <div>
                            <h3>Appointments</h3>
                            <p>
                                View and manage appointments
                            </p>
                        </div>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/doctor/patients")
                        }
                    >
                        <div className="quick-icon">
                            👥
                        </div>

                        <div>
                            <h3>My Patients</h3>
                            <p>
                                View your assigned patients
                            </p>
                        </div>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/doctor/medical-records")
                        }
                    >
                        <div className="quick-icon">
                            📋
                        </div>

                        <div>
                            <h3>Medical Records</h3>
                            <p>
                                Manage patient medical records
                            </p>
                        </div>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/doctor/prescriptions")
                        }
                    >
                        <div className="quick-icon">
                            💊
                        </div>

                        <div>
                            <h3>Prescriptions</h3>
                            <p>
                                Create and manage prescriptions
                            </p>
                        </div>
                    </button>

                </div>

            </section>


            {/* ================= SUMMARY ================= */}

            <section className="doctor-section">

                <div className="section-heading">
                    <h2>Today's Overview</h2>
                    <p>
                        Summary of your current activities.
                    </p>
                </div>

                <div className="doctor-summary">

                    <div className="doctor-summary-card">
                        <div className="summary-card-icon">
                            📅
                        </div>

                        <div>
                            <span>Today's Appointments</span>
                            <h3>0</h3>
                        </div>
                    </div>


                    <div className="doctor-summary-card">
                        <div className="summary-card-icon">
                            👥
                        </div>

                        <div>
                            <span>Total Patients</span>
                            <h3>0</h3>
                        </div>
                    </div>


                    <div className="doctor-summary-card">
                        <div className="summary-card-icon">
                            📋
                        </div>

                        <div>
                            <span>Medical Records</span>
                            <h3>0</h3>
                        </div>
                    </div>


                    <div className="doctor-summary-card">
                        <div className="summary-card-icon">
                            💊
                        </div>

                        <div>
                            <span>Prescriptions</span>
                            <h3>0</h3>
                        </div>
                    </div>

                </div>

            </section>


            {/* ================= MAIN CONTENT ================= */}

            <section className="doctor-content-grid">

                {/* Upcoming Appointments */}

                <div className="doctor-dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Upcoming Appointments</h2>
                            <p>
                                Your scheduled appointments
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/doctor/appointments")
                            }
                        >
                            View All
                        </button>

                    </div>

                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            📅
                        </div>

                        <h3>No Upcoming Appointments</h3>

                        <p>
                            Your upcoming appointments will
                            appear here.
                        </p>

                    </div>

                </div>


                {/* Recent Patients */}

                <div className="doctor-dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Recent Patients</h2>
                            <p>
                                Recently treated patients
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/doctor/patients")
                            }
                        >
                            View All
                        </button>

                    </div>

                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            👥
                        </div>

                        <h3>No Patient Records</h3>

                        <p>
                            Recently treated patients will
                            appear here.
                        </p>

                    </div>

                </div>


                {/* Recent Prescriptions */}

                <div className="doctor-dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Recent Prescriptions</h2>
                            <p>
                                Recently created prescriptions
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/doctor/prescriptions")
                            }
                        >
                            View All
                        </button>

                    </div>

                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            💊
                        </div>

                        <h3>No Prescriptions</h3>

                        <p>
                            Your recent prescriptions will
                            appear here.
                        </p>

                    </div>

                </div>


                {/* Medical Records */}

                <div className="doctor-dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Recent Medical Records</h2>
                            <p>
                                Recently updated patient records
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/doctor/medical-records")
                            }
                        >
                            View All
                        </button>

                    </div>

                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            📋
                        </div>

                        <h3>No Medical Records</h3>

                        <p>
                            Recent medical records will
                            appear here.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= INFORMATION ================= */}

            <section className="doctor-information">

                <div className="section-heading">
                    <h2>Doctor Information</h2>
                    <p>
                        Your account information.
                    </p>
                </div>

                <div className="doctor-info-card">

                    <div className="doctor-info-item">
                        <span>Name</span>
                        <strong>
                            Dr. {doctorName}
                        </strong>
                    </div>

                    <div className="doctor-info-item">
                        <span>Email</span>
                        <strong>
                            {user.email || "Not available"}
                        </strong>
                    </div>

                    <div className="doctor-info-item">
                        <span>Phone</span>
                        <strong>
                            {user.phone || "Not available"}
                        </strong>
                    </div>

                    <div className="doctor-info-item">
                        <span>Role</span>
                        <strong>
                            Doctor
                        </strong>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default DoctorDashboard;