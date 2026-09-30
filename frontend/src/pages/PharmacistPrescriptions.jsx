import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../Styles/PharmacistPrescriptions.css";

function PharmacistPrescriptions() {

    const [prescriptions, setPrescriptions] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState("ALL");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const [prescriptionResponse, medicineResponse] =
                await Promise.all([
                    api.get("/prescriptions"),
                    api.get("/medicines")
                ]);

            setPrescriptions(
                prescriptionResponse.data?.data || []
            );

            setMedicines(
                medicineResponse.data?.data || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load prescription data."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // FIND MEDICINE
    // =========================

    const getMedicine = (medicineName) => {

        return medicines.find(
            medicine =>
                medicine.name?.toLowerCase() ===
                medicineName?.toLowerCase()
        );

    };


    // =========================
    // STOCK STATUS
    // =========================

    const getStockStatus = (medicineName) => {

        const medicine = getMedicine(medicineName);

        if (!medicine) {
            return {
                label: "Medicine Not Found",
                className: "stock-missing",
                quantity: "-"
            };
        }

        const quantity = Number(medicine.stockQuantity || 0);

        if (quantity <= 0) {
            return {
                label: "Out of Stock",
                className: "stock-out",
                quantity
            };
        }

        if (quantity <= 10) {
            return {
                label: "Low Stock",
                className: "stock-low",
                quantity
            };
        }

        return {
            label: "In Stock",
            className: "stock-good",
            quantity
        };

    };


    // =========================
    // FILTER
    // =========================

    const filteredPrescriptions = useMemo(() => {

        return prescriptions.filter(prescription => {

            const searchText = search.toLowerCase();

            const matchesSearch =
                prescription.patientName
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.doctorName
                    ?.toLowerCase()
                    .includes(searchText) ||

                prescription.medicineName
                    ?.toLowerCase()
                    .includes(searchText);


            const stockStatus =
                getStockStatus(prescription.medicineName);


            let matchesStock = true;

            if (stockFilter === "IN_STOCK") {
                matchesStock =
                    stockStatus.className === "stock-good";
            }

            if (stockFilter === "LOW") {
                matchesStock =
                    stockStatus.className === "stock-low";
            }

            if (stockFilter === "OUT") {
                matchesStock =
                    stockStatus.className === "stock-out";
            }


            return matchesSearch && matchesStock;

        });

    }, [prescriptions, medicines, search, stockFilter]);


    // =========================
    // SUMMARY
    // =========================

    const totalPrescriptions = prescriptions.length;

    const inStockCount = prescriptions.filter(
        prescription =>
            getStockStatus(
                prescription.medicineName
            ).className === "stock-good"
    ).length;

    const lowStockCount = prescriptions.filter(
        prescription =>
            getStockStatus(
                prescription.medicineName
            ).className === "stock-low"
    ).length;

    const outOfStockCount = prescriptions.filter(
        prescription =>
            getStockStatus(
                prescription.medicineName
            ).className === "stock-out"
    ).length;


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="pharmacist-prescriptions-page">

                <div className="loading-state">
                    Loading prescriptions...
                </div>

            </div>
        );

    }


    return (

        <div className="pharmacist-prescriptions-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <h1>Prescription Management</h1>

                    <p>
                        Review patient prescriptions and medicine availability
                    </p>

                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchData}
                >
                    Refresh
                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="summary-grid">

                <div className="summary-card">

                    <div className="summary-icon">
                        📋
                    </div>

                    <div>

                        <h3>
                            {totalPrescriptions}
                        </h3>

                        <p>
                            Total Prescriptions
                        </p>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">
                        ✅
                    </div>

                    <div>

                        <h3>
                            {inStockCount}
                        </h3>

                        <p>
                            Medicine Available
                        </p>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">
                        ⚠️
                    </div>

                    <div>

                        <h3>
                            {lowStockCount}
                        </h3>

                        <p>
                            Low Stock
                        </p>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">
                        🚫
                    </div>

                    <div>

                        <h3>
                            {outOfStockCount}
                        </h3>

                        <p>
                            Out of Stock
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                FILTERS
            ========================= */}

            <div className="filter-section">

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search patient, doctor or medicine..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="filter-box">

                    <select
                        value={stockFilter}
                        onChange={(e) =>
                            setStockFilter(e.target.value)
                        }
                    >

                        <option value="ALL">
                            All Stock
                        </option>

                        <option value="IN_STOCK">
                            In Stock
                        </option>

                        <option value="LOW">
                            Low Stock
                        </option>

                        <option value="OUT">
                            Out of Stock
                        </option>

                    </select>

                </div>

            </div>


            {/* =========================
                PRESCRIPTIONS
            ========================= */}

            <div className="prescription-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Prescription Queue
                        </h2>

                        <p>
                            {filteredPrescriptions.length}
                            {" "}prescriptions found
                        </p>

                    </div>

                </div>


                {filteredPrescriptions.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            💊
                        </div>

                        <h3>
                            No prescriptions found
                        </h3>

                        <p>
                            No prescriptions match the current search or filter.
                        </p>

                    </div>

                ) : (

                    <div className="prescription-table-wrapper">

                        <table className="prescription-table">

                            <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Patient
                                </th>

                                <th>
                                    Doctor
                                </th>

                                <th>
                                    Medicine
                                </th>

                                <th>
                                    Dosage
                                </th>

                                <th>
                                    Frequency
                                </th>

                                <th>
                                    Duration
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Instructions
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {filteredPrescriptions.map(
                                prescription => {

                                    const stock =
                                        getStockStatus(
                                            prescription.medicineName
                                        );

                                    return (

                                        <tr
                                            key={prescription.id}
                                        >

                                            <td>
                                                #{prescription.id}
                                            </td>

                                            <td>

                                                <strong>
                                                    {prescription.patientName ||
                                                        "Unknown Patient"}
                                                </strong>

                                            </td>

                                            <td>
                                                {prescription.doctorName ||
                                                    "Unknown Doctor"}
                                            </td>

                                            <td>

                                                <strong>
                                                    {prescription.medicineName ||
                                                        "Unknown Medicine"}
                                                </strong>

                                            </td>

                                            <td>
                                                {prescription.dosage}
                                            </td>

                                            <td>
                                                {prescription.frequency}
                                            </td>

                                            <td>
                                                {prescription.duration}
                                            </td>

                                            <td>

                                                <div
                                                    className={`stock-info ${stock.className}`}
                                                >

                                                        <span>
                                                            {stock.label}
                                                        </span>

                                                    <small>
                                                        Qty: {stock.quantity}
                                                    </small>

                                                </div>

                                            </td>

                                            <td>

                                                    <span className="instructions">

                                                        {prescription.instructions ||
                                                            "No special instructions"}

                                                    </span>

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default PharmacistPrescriptions;