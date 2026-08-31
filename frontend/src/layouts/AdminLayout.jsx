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

            {/* Sidebar */}
            <aside className="sidebar">

                <h2>Smart Hospital</h2>

                <nav>

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

                    <Link to="/admin/pharmacy">
                        Pharmacy
                    </Link>

                    <Link to="/admin/laboratory">
                        Laboratory
                    </Link>

                    <Link to="/admin/billing">
                        Billing
                    </Link>

                </nav>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </aside>


            {/* Main Content */}
            <main className="admin-main">

                {/* Header */}
                <header className="admin-header">

                    <div>
                        <h2>Admin Dashboard</h2>
                    </div>

                    <div>
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