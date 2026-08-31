import { useEffect, useState } from "react";
import api from "../services/api";

import AppointmentChart from "../components/AppointmentChart";
import LabOrderChart from "../components/LabOrderChart";
import PharmacyChart from "../components/PharmacyChart";

import "../styles/AdminDashboard.css";

function AdminDashboard() {

    // =========================
    // DASHBOARD STATISTICS
    // =========================

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


    // =========================
    // CHART DATA
    // =========================

    const [appointmentData, setAppointmentData] = useState([]);
    const [labOrderData, setLabOrderData] = useState([]);
    const [pharmacyData, setPharmacyData] = useState([]);


    // =========================
    // STATES
    // =========================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD DASHBOARD
    // =========================

    useEffect(() => {
        fetchDashboard();
    }, []);


    // =========================
    // API CALLS
    // =========================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            // -------------------------
            // DASHBOARD STATISTICS
            // -------------------------

            const dashboardResponse =
                await api.get("/dashboard");

            console.log(
                "Dashboard response:",
                dashboardResponse.data
            );

            setStats(dashboardResponse.data);


            // -------------------------
            // APPOINTMENT CHART
            // -------------------------

            const appointmentResponse =
                await api.get("/dashboard/appointments/chart");

            console.log(
                "Appointment chart:",
                appointmentResponse.data
            );

            setAppointmentData(
                appointmentResponse.data
            );


            // -------------------------
            // LAB ORDER CHART
            // -------------------------

            const labResponse =
                await api.get("/dashboard/lab-orders/chart");

            console.log(
                "Lab chart:",
                labResponse.data
            );

            setLabOrderData(
                labResponse.data
            );


            // -------------------------
            // PHARMACY CHART
            // -------------------------

            const pharmacyResponse =
                await api.get("/dashboard/pharmacy/chart");

            console.log(
                "Pharmacy chart:",
                pharmacyResponse.data
            );

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


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="admin-dashboard">

                <h2>
                    Loading dashboard...
                </h2>

            </div>
        );
    }


    // =========================
    // UI
    // =========================

    return (

        <div className="admin-dashboard">

            <h1>
                Admin Dashboard
            </h1>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* =========================
                STATISTICS CARDS
            ========================= */}

            <div className="dashboard-cards">


                {/* PATIENTS */}

                <div className="dashboard-card">

                    <h3>
                        Total Patients
                    </h3>

                    <h2>
                        {stats.totalPatients}
                    </h2>

                </div>


                <div className="dashboard-card">

                    <h3>
                        Active Patients
                    </h3>

                    <h2>
                        {stats.activePatients}
                    </h2>

                </div>


                {/* DOCTORS */}

                <div className="dashboard-card">

                    <h3>
                        Total Doctors
                    </h3>

                    <h2>
                        {stats.totalDoctors}
                    </h2>

                </div>


                <div className="dashboard-card">

                    <h3>
                        Active Doctors
                    </h3>

                    <h2>
                        {stats.activeDoctors}
                    </h2>

                </div>


                {/* APPOINTMENTS */}

                <div className="dashboard-card">

                    <h3>
                        Total Appointments
                    </h3>

                    <h2>
                        {stats.totalAppointments}
                    </h2>

                </div>


                {/* LAB */}

                <div className="dashboard-card">

                    <h3>
                        Total Lab Orders
                    </h3>

                    <h2>
                        {stats.totalLabOrders}
                    </h2>

                </div>


                {/* PRESCRIPTIONS */}

                <div className="dashboard-card">

                    <h3>
                        Total Prescriptions
                    </h3>

                    <h2>
                        {stats.totalPrescriptions}
                    </h2>

                </div>


                {/* INVENTORY */}

                <div className="dashboard-card">

                    <h3>
                        Inventory Items
                    </h3>

                    <h2>
                        {stats.totalInventoryItems}
                    </h2>

                </div>


                {/* LOW STOCK */}

                <div className="dashboard-card">

                    <h3>
                        Low Stock Items
                    </h3>

                    <h2>
                        {stats.lowStockItems}
                    </h2>

                </div>


                {/* EXPIRED */}

                <div className="dashboard-card">

                    <h3>
                        Expired Medicines
                    </h3>

                    <h2>
                        {stats.expiredInventoryItems}
                    </h2>

                </div>


                {/* PENDING APPOINTMENTS */}

                <div className="dashboard-card">

                    <h3>
                        Pending Appointments
                    </h3>

                    <h2>
                        {stats.pendingAppointments}
                    </h2>

                </div>


                {/* COMPLETED APPOINTMENTS */}

                <div className="dashboard-card">

                    <h3>
                        Completed Appointments
                    </h3>

                    <h2>
                        {stats.completedAppointments}
                    </h2>

                </div>

            </div>


            {/* =========================
                CHARTS
            ========================= */}

            <div className="dashboard-charts">


                {/* APPOINTMENT CHART */}

                <AppointmentChart
                    data={appointmentData}
                />


                {/* LAB ORDER CHART */}

                <LabOrderChart
                    data={labOrderData}
                />


                {/* PHARMACY CHART */}

                <PharmacyChart
                    data={pharmacyData}
                />

            </div>

        </div>
    );
}

export default AdminDashboard;