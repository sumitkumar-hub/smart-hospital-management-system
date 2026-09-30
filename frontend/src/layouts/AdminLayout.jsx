import { Link, Outlet, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../Styles/AdminLayout.css";

function AdminLayout() {
    const navigate = useNavigate();

    const user = authService.getUser();

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <h2>Smart Hospital</h2>
                </div>

                <nav className="sidebar-nav">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/patients">
                        Patients
                    </Link>

                    <Link to="/admin/doctors">
                        Doctors
                    </Link>

                    <Link to="/admin/appointments">
                        Appointments
                    </Link>

                    <Link to="/admin/medical-records">
                        Medical Records
                    </Link>

                    <Link to="/admin/prescriptions">
                        Prescriptions
                    </Link>

                    <Link to="/admin/pharmacy-inventory">
                        Pharmacy Inventory
                    </Link>

                    <Link to="/admin/billing">
                        Billing
                    </Link>

                    <Link to="/admin/lab-tests">
                        Lab Tests
                    </Link>

                    <Link to="/admin/lab-orders">
                        Lab Orders
                    </Link>

                    <Link to="/admin/lab-reports">
                        Lab Reports
                    </Link>

                    <Link to="/admin/staff">
                        Staff Management
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <div className="sidebar-user">
                        <span>
                            {user?.firstName} {user?.lastName}
                        </span>

                        <small>
                            {user?.role}
                        </small>
                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-main">

                <header className="admin-header">

                    <div>
                        <h2>Admin Dashboard</h2>
                    </div>

                    <div className="admin-user">

                        <span>
                            {user?.firstName} {user?.lastName}
                        </span>

                        <span>
                            ({user?.role})
                        </span>

                    </div>

                </header>


                <section className="admin-content">

                    <Outlet />

                </section>

            </main>

        </div>
    );
}

export default AdminLayout;