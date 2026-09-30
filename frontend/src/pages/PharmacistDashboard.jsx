import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/PharmacistDashboard.css";

function PharmacistDashboard() {
    const navigate = useNavigate();

    const [medicines, setMedicines] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const pharmacistName =
        user.firstName ||
        user.name ||
        "Pharmacist";

    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                medicinesResponse,
                inventoryResponse,
                prescriptionsResponse
            ] = await Promise.all([
                api.get("/medicines"),
                api.get("/pharmacy-inventory"),
                api.get("/prescriptions")
            ]);

            setMedicines(
                medicinesResponse.data?.data ||
                medicinesResponse.data ||
                []
            );

            setInventory(
                inventoryResponse.data?.data ||
                inventoryResponse.data ||
                []
            );

            setPrescriptions(
                prescriptionsResponse.data?.data ||
                prescriptionsResponse.data ||
                []
            );

        } catch (err) {
            console.error("Pharmacist dashboard error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load pharmacist dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // =========================
    // DASHBOARD COUNTS
    // =========================

    const lowStockItems = useMemo(() => {
        return inventory.filter(
            (item) => item.lowStock === true
        );
    }, [inventory]);

    const expiredItems = useMemo(() => {
        return inventory.filter(
            (item) => item.expired === true
        );
    }, [inventory]);

    const totalQuantity = useMemo(() => {
        return inventory.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    }, [inventory]);

    const recentPrescriptions = useMemo(() => {
        return [...prescriptions]
            .slice(-5)
            .reverse();
    }, [prescriptions]);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginResponse");

        navigate("/login");
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        try {
            return new Date(date).toLocaleDateString();
        } catch {
            return date;
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="pharmacist-page">
                <div className="pharmacist-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading pharmacist dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pharmacist-page">

            {/* =========================
                HEADER
            ========================= */}

            <header className="pharmacist-header">

                <div className="header-left">

                    <div className="pharmacist-logo">
                        💊
                    </div>

                    <div>
                        <h1>Pharmacist Dashboard</h1>
                        <p>
                            Welcome back, {pharmacistName}
                        </p>
                    </div>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="dashboard-error">
                    <span>⚠️</span>
                    <div>
                        <strong>Unable to load some dashboard data</strong>
                        <p>{error}</p>
                    </div>

                    <button
                        onClick={fetchDashboardData}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <section className="pharmacist-summary">

                <div className="summary-card medicines-card">
                    <div className="summary-icon">
                        💊
                    </div>

                    <div className="summary-content">
                        <span>Total Medicines</span>
                        <strong>{medicines.length}</strong>
                        <small>
                            Medicine records
                        </small>
                    </div>
                </div>

                <div className="summary-card inventory-card">
                    <div className="summary-icon">
                        📦
                    </div>

                    <div className="summary-content">
                        <span>Inventory Items</span>
                        <strong>{inventory.length}</strong>
                        <small>
                            {totalQuantity} total units
                        </small>
                    </div>
                </div>

                <div className="summary-card low-stock-card">
                    <div className="summary-icon">
                        ⚠️
                    </div>

                    <div className="summary-content">
                        <span>Low Stock</span>
                        <strong>{lowStockItems.length}</strong>
                        <small>
                            Need attention
                        </small>
                    </div>
                </div>

                <div className="summary-card expired-card">
                    <div className="summary-icon">
                        ⏰
                    </div>

                    <div className="summary-content">
                        <span>Expired</span>
                        <strong>{expiredItems.length}</strong>
                        <small>
                            Inventory records
                        </small>
                    </div>
                </div>

            </section>

            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <section className="dashboard-section">

                <div className="section-heading">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>
                            Manage pharmacy operations
                        </p>
                    </div>
                </div>

                <div className="quick-actions">

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/pharmacist/medicines")
                        }
                    >
                        <span className="action-icon">
                            💊
                        </span>

                        <div>
                            <strong>Medicine Management</strong>
                            <span>
                                Manage medicine records
                            </span>
                        </div>

                        <b>→</b>
                    </button>

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/pharmacist/inventory")
                        }
                    >
                        <span className="action-icon">
                            📦
                        </span>

                        <div>
                            <strong>Pharmacy Inventory</strong>
                            <span>
                                Manage stock and expiry
                            </span>
                        </div>

                        <b>→</b>
                    </button>

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/pharmacist/prescriptions")
                        }
                    >
                        <span className="action-icon">
                            📋
                        </span>

                        <div>
                            <strong>Prescriptions</strong>
                            <span>
                                View patient prescriptions
                            </span>
                        </div>

                        <b>→</b>
                    </button>

                </div>

            </section>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="dashboard-grid">

                {/* =========================
                    LOW STOCK
                ========================= */}

                <section className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Low Stock Medicines</h2>
                            <p>
                                Medicines below minimum stock level
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/pharmacist/inventory")
                            }
                        >
                            View All
                        </button>

                    </div>

                    {lowStockItems.length === 0 ? (

                        <div className="empty-panel">
                            <div>✓</div>
                            <h3>No Low Stock Items</h3>
                            <p>
                                All inventory items are currently
                                above their minimum stock level.
                            </p>
                        </div>

                    ) : (

                        <div className="stock-list">

                            {lowStockItems
                                .slice(0, 5)
                                .map((item) => (

                                    <div
                                        className="stock-item"
                                        key={item.id}
                                    >

                                        <div className="stock-medicine-icon">
                                            💊
                                        </div>

                                        <div className="stock-info">
                                            <strong>
                                                {item.medicineName ||
                                                    "Unknown Medicine"}
                                            </strong>

                                            <span>
                                                Batch:{" "}
                                                {item.batchNumber ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                        <div className="stock-quantity">
                                            <strong>
                                                {item.quantity ?? 0}
                                            </strong>

                                            <span>
                                                /{" "}
                                                {item.minimumStockLevel ??
                                                    0}
                                            </span>

                                            <small>
                                                units
                                            </small>
                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>

                {/* =========================
                    INVENTORY ALERTS
                ========================= */}

                <section className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Inventory Alerts</h2>
                            <p>
                                Items requiring attention
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/pharmacist/inventory")
                            }
                        >
                            Inventory
                        </button>

                    </div>

                    <div className="alert-list">

                        <div className="alert-item warning">

                            <div className="alert-icon">
                                ⚠️
                            </div>

                            <div>
                                <strong>
                                    Low Stock
                                </strong>

                                <span>
                                    {lowStockItems.length} item
                                    {lowStockItems.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    below minimum level
                                </span>
                            </div>

                        </div>

                        <div className="alert-item danger">

                            <div className="alert-icon">
                                ⏰
                            </div>

                            <div>
                                <strong>
                                    Expired Medicines
                                </strong>

                                <span>
                                    {expiredItems.length} expired
                                    inventory record
                                    {expiredItems.length !== 1
                                        ? "s"
                                        : ""}
                                </span>
                            </div>

                        </div>

                        <div className="alert-item info">

                            <div className="alert-icon">
                                📦
                            </div>

                            <div>
                                <strong>
                                    Total Stock
                                </strong>

                                <span>
                                    {totalQuantity} units currently
                                    recorded
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

            </div>

            {/* =========================
                RECENT PRESCRIPTIONS
            ========================= */}

            <section className="dashboard-panel recent-prescriptions">

                <div className="panel-header">

                    <div>
                        <h2>Recent Prescriptions</h2>
                        <p>
                            Recently issued prescriptions
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/pharmacist/prescriptions")
                        }
                    >
                        View All
                    </button>

                </div>

                {recentPrescriptions.length === 0 ? (

                    <div className="empty-panel">
                        <div>📋</div>
                        <h3>No Prescriptions</h3>
                        <p>
                            No prescriptions are currently available.
                        </p>
                    </div>

                ) : (

                    <div className="prescription-table-wrapper">

                        <table className="prescription-table">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                            </tr>
                            </thead>

                            <tbody>

                            {recentPrescriptions.map(
                                (prescription) => (

                                    <tr
                                        key={prescription.id}
                                    >

                                        <td>
                                            <strong>
                                                #{prescription.id}
                                            </strong>
                                        </td>

                                        <td>
                                            {prescription.patientName ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {prescription.doctorName ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {prescription.medicineName ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {prescription.dosage ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {prescription.frequency ||
                                                "N/A"}
                                        </td>

                                        <td>
                                            {prescription.duration ||
                                                "N/A"}
                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* =========================
                PHARMACIST INFORMATION
            ========================= */}

            <section className="pharmacist-info">

                <div className="info-icon">
                    👨‍⚕️
                </div>

                <div className="info-content">

                    <h2>Pharmacist Information</h2>

                    <div className="info-details">

                        <div>
                            <span>Name</span>
                            <strong>
                                {pharmacistName}
                            </strong>
                        </div>

                        <div>
                            <span>Role</span>
                            <strong>
                                Pharmacist
                            </strong>
                        </div>

                        <div>
                            <span>Medicines</span>
                            <strong>
                                {medicines.length}
                            </strong>
                        </div>

                        <div>
                            <span>Prescriptions</span>
                            <strong>
                                {prescriptions.length}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default PharmacistDashboard;