import { useEffect, useState } from "react";
import api from "../services/api";

import AppointmentChart from "../components/AppointmentChart";
import LabOrderChart from "../components/LabOrderChart";
import PharmacyChart from "../components/PharmacyChart";

import "../Styles/AdminDashboard.css";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalPatients: 0,
        activePatients: 0,

        totalDoctors: 0,
        activeDoctors: 0,

        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,

        totalLabOrders: 0,
        pendingLabOrders: 0,
        completedLabOrders: 0,

        totalPrescriptions: 0,

        totalInventoryItems: 0,
        lowStockItems: 0,
        expiredInventoryItems: 0,
    });

    const [appointmentData, setAppointmentData] = useState([]);
    const [labOrderData, setLabOrderData] = useState([]);
    const [pharmacyData, setPharmacyData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const dashboardResponse =
                await api.get("/dashboard");

            setStats(dashboardResponse.data);

            const appointmentResponse =
                await api.get("/dashboard/appointments/chart");

            setAppointmentData(
                appointmentResponse.data
            );

            const labResponse =
                await api.get("/dashboard/lab-orders/chart");

            setLabOrderData(
                labResponse.data
            );

            const pharmacyResponse =
                await api.get("/dashboard/pharmacy/chart");

            setPharmacyData(
                pharmacyResponse.data
            );

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                "Unable to load dashboard statistics"
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

        return (
            <div className="admin-dashboard">

                <h2 className="dashboard-loading">
                    Loading dashboard...
                </h2>

            </div>
        );
    }

    return (

        <div className="admin-dashboard">

            <div className="dashboard-title">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Hospital overview and statistics
                </p>

            </div>


            {error && (
                <p className="dashboard-error">
                    {error}
                </p>
            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Patients</h3>
                    <h2>{stats.totalPatients}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Active Patients</h3>
                    <h2>{stats.activePatients}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Total Doctors</h3>
                    <h2>{stats.totalDoctors}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Active Doctors</h3>
                    <h2>{stats.activeDoctors}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Total Appointments</h3>
                    <h2>{stats.totalAppointments}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Total Lab Orders</h3>
                    <h2>{stats.totalLabOrders}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Total Prescriptions</h3>
                    <h2>{stats.totalPrescriptions}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Inventory Items</h3>
                    <h2>{stats.totalInventoryItems}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Low Stock Items</h3>
                    <h2>{stats.lowStockItems}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Expired Medicines</h3>
                    <h2>{stats.expiredInventoryItems}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Pending Appointments</h3>
                    <h2>{stats.pendingAppointments}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Completed Appointments</h3>
                    <h2>{stats.completedAppointments}</h2>
                </div>

            </div>


            {/* =========================
                CHARTS
            ========================= */}

            <div className="dashboard-charts">

                <AppointmentChart
                    data={appointmentData}
                />

                <LabOrderChart
                    data={labOrderData}
                />

                <PharmacyChart
                    data={pharmacyData}
                />

            </div>

        </div>
    );
}

export default AdminDashboard;