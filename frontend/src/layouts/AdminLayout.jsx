import { Link, Outlet, useNavigate } from "react-router-dom";
import authService from "../services/authService";

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

                <h2>Smart Hospital</h2>

                <nav>

                    {/* Dashboard */}
                    <Link to="/admin">
                        Dashboard
                    </Link>

                    {/* Patients */}
                    <Link to="/admin/patients">
                        Patients
                    </Link>

                    {/* Doctors */}
                    <Link to="/admin/doctors">
                        Doctors
                    </Link>

                    {/* Appointments */}
                    <Link to="/admin/appointments">
                        Appointments
                    </Link>

                    {/* Medical Records */}
                    <Link to="/admin/medical-records">
                        Medical Records
                    </Link>

                    {/* Prescriptions */}
                    <Link to="/admin/prescriptions">
                        Prescriptions
                    </Link>

                    {/* Pharmacy Inventory */}
                    <Link to="/admin/pharmacy-inventory">
                        Pharmacy Inventory
                    </Link>

                    {/* Billing */}
                    <Link to="/admin/billing">
                        Billing
                    </Link>

                    {/* Lab Tests */}
                    <Link to="/admin/lab-tests">
                        Lab Tests
                    </Link>

                </nav>

                {/* Logout */}
                <button onClick={handleLogout}>
                    Logout
                </button>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-main">

                {/* Header */}
                <header className="admin-header">

                    <div>
                        <h2>Admin Dashboard</h2>
                    </div>

                    <div className="admin-user">

                        <span>
                            {user?.firstName} {user?.lastName}
                        </span>

                        <span>
                            {" "}({user?.role})
                        </span>

                    </div>

                </header>


                {/* Page Content */}
                <section className="admin-content">

                    <Outlet />

                </section>

            </main>

        </div>
    );
}

export default AdminLayout;