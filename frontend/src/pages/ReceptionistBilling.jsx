import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/ReceptionistBilling.css";

const ReceptionistBilling = () => {
    const navigate = useNavigate();

    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [formData, setFormData] = useState({
        patientId: "",
        consultationFee: "",
        medicineCharges: "",
        labCharges: "",
        otherCharges: "",
        paymentStatus: "UNPAID",
        paymentMethod: "CASH",
        billDate: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [billsResponse, patientsResponse] = await Promise.all([
                api.get("/billings"),
                api.get("/patients"),
            ]);

            setBills(billsResponse.data?.data || []);
            setPatients(patientsResponse.data?.data || []);
        } catch (err) {
            console.error("Error loading billing data:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load billing information."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            patientId: "",
            consultationFee: "",
            medicineCharges: "",
            labCharges: "",
            otherCharges: "",
            paymentStatus: "UNPAID",
            paymentMethod: "CASH",
            billDate: new Date().toISOString().split("T")[0],
        });

        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                patientId: Number(formData.patientId),
                consultationFee: Number(formData.consultationFee || 0),
                medicineCharges: Number(formData.medicineCharges || 0),
                labCharges: Number(formData.labCharges || 0),
                otherCharges: Number(formData.otherCharges || 0),
                paymentStatus: formData.paymentStatus,
                paymentMethod: formData.paymentMethod,
                billDate: formData.billDate,
            };

            await api.post("/billings", payload);

            alert("Bill created successfully.");

            resetForm();
            fetchData();
        } catch (err) {
            console.error("Error creating bill:", err);

            alert(
                err.response?.data?.message ||
                "Failed to create bill."
            );
        }
    };

    const handlePaymentStatus = async (id, status) => {
        try {
            await api.patch(
                `/billings/${id}/payment-status?paymentStatus=${encodeURIComponent(
                    status
                )}`
            );

            alert("Payment status updated successfully.");

            fetchData();
        } catch (err) {
            console.error(
                "Error updating payment status:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update payment status."
            );
        }
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(
            (item) => Number(item.id) === Number(patientId)
        );

        if (!patient) {
            return "Unknown Patient";
        }

        return `${patient.firstName || ""} ${
            patient.lastName || ""
        }`.trim();
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        const normalized = String(status || "").toUpperCase();

        if (normalized === "PAID") {
            return "payment-paid";
        }

        if (normalized === "PARTIAL") {
            return "payment-partial";
        }

        if (normalized === "UNPAID") {
            return "payment-unpaid";
        }

        return "payment-default";
    };

    const filteredBills = useMemo(() => {
        return bills.filter((bill) => {
            const patientName = getPatientName(
                bill.patientId || bill.patient?.id
            ).toLowerCase();

            const billId = String(bill.id || "").toLowerCase();

            const searchMatch =
                patientName.includes(search.toLowerCase()) ||
                billId.includes(search.toLowerCase());

            const statusMatch =
                statusFilter === "ALL" ||
                String(bill.paymentStatus || "").toUpperCase() ===
                statusFilter;

            return searchMatch && statusMatch;
        });
    }, [bills, patients, search, statusFilter]);

    const totalRevenue = bills.reduce(
        (sum, bill) => sum + Number(bill.totalAmount || 0),
        0
    );

    const paidAmount = bills
        .filter(
            (bill) =>
                String(bill.paymentStatus || "").toUpperCase() ===
                "PAID"
        )
        .reduce(
            (sum, bill) => sum + Number(bill.totalAmount || 0),
            0
        );

    const unpaidAmount = bills
        .filter(
            (bill) =>
                String(bill.paymentStatus || "").toUpperCase() ===
                "UNPAID"
        )
        .reduce(
            (sum, bill) => sum + Number(bill.totalAmount || 0),
            0
        );

    const partialBills = bills.filter(
        (bill) =>
            String(bill.paymentStatus || "").toUpperCase() ===
            "PARTIAL"
    ).length;

    const paidBills = bills.filter(
        (bill) =>
            String(bill.paymentStatus || "").toUpperCase() ===
            "PAID"
    ).length;

    const unpaidBills = bills.filter(
        (bill) =>
            String(bill.paymentStatus || "").toUpperCase() ===
            "UNPAID"
    ).length;

    const calculatedTotal =
        Number(formData.consultationFee || 0) +
        Number(formData.medicineCharges || 0) +
        Number(formData.labCharges || 0) +
        Number(formData.otherCharges || 0);

    if (loading) {
        return (
            <div className="receptionist-billing-page">
                <div className="billing-loading">
                    Loading billing information...
                </div>
            </div>
        );
    }

    return (
        <div className="receptionist-billing-page">
            {/* Header */}
            <div className="billing-header">
                <div>
                    <h1>Billing Management</h1>
                    <p>
                        Create bills and manage patient payment
                        information.
                    </p>
                </div>

                <button
                    className="billing-dashboard-btn"
                    onClick={() => navigate("/receptionist")}
                >
                    ← Dashboard
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="billing-error">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className="billing-summary">
                <div className="billing-summary-card">
                    <span>Total Bills</span>
                    <strong>{bills.length}</strong>
                </div>

                <div className="billing-summary-card">
                    <span>Total Amount</span>
                    <strong>
                        ₹{totalRevenue.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div className="billing-summary-card">
                    <span>Paid Amount</span>
                    <strong>
                        ₹{paidAmount.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div className="billing-summary-card">
                    <span>Unpaid Amount</span>
                    <strong>
                        ₹{unpaidAmount.toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            {/* Create Bill */}
            <div className="billing-form-section">
                <div className="billing-section-header">
                    <div>
                        <h2>Create New Bill</h2>
                        <p>
                            Generate a bill for a registered
                            patient.
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            className="create-bill-btn"
                            onClick={() => setShowForm(true)}
                        >
                            + Create Bill
                        </button>
                    )}
                </div>

                {showForm && (
                    <form
                        className="billing-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="billing-form-group">
                            <label>Patient</label>

                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Patient
                                </option>

                                {patients.map((patient) => (
                                    <option
                                        key={patient.id}
                                        value={patient.id}
                                    >
                                        {patient.firstName}{" "}
                                        {patient.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="billing-form-group">
                            <label>Bill Date</label>

                            <input
                                type="date"
                                name="billDate"
                                value={formData.billDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="billing-form-group">
                            <label>Consultation Fee</label>

                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>

                        <div className="billing-form-group">
                            <label>Medicine Charges</label>

                            <input
                                type="number"
                                name="medicineCharges"
                                value={formData.medicineCharges}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>

                        <div className="billing-form-group">
                            <label>Lab Charges</label>

                            <input
                                type="number"
                                name="labCharges"
                                value={formData.labCharges}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>

                        <div className="billing-form-group">
                            <label>Other Charges</label>

                            <input
                                type="number"
                                name="otherCharges"
                                value={formData.otherCharges}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>

                        <div className="billing-form-group">
                            <label>Payment Status</label>

                            <select
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                            >
                                <option value="UNPAID">
                                    Unpaid
                                </option>
                                <option value="PARTIAL">
                                    Partial
                                </option>
                                <option value="PAID">
                                    Paid
                                </option>
                            </select>
                        </div>

                        <div className="billing-form-group">
                            <label>Payment Method</label>

                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="CASH">
                                    Cash
                                </option>
                                <option value="CARD">
                                    Card
                                </option>
                                <option value="UPI">
                                    UPI
                                </option>
                                <option value="ONLINE">
                                    Online
                                </option>
                                <option value="OTHER">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="billing-total-preview">
                            <span>Calculated Total</span>

                            <strong>
                                ₹
                                {calculatedTotal.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>

                        <div className="billing-form-actions">
                            <button
                                type="submit"
                                className="save-bill-btn"
                            >
                                Create Bill
                            </button>

                            <button
                                type="button"
                                className="cancel-bill-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Bills */}
            <div className="billing-table-section">
                <div className="billing-section-header">
                    <div>
                        <h2>Patient Bills</h2>
                        <p>
                            Search and manage patient billing
                            records.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="billing-filters">
                    <input
                        type="text"
                        placeholder="Search by patient name or bill ID..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Payment Status
                        </option>
                        <option value="PAID">Paid</option>
                        <option value="PARTIAL">
                            Partial
                        </option>
                        <option value="UNPAID">
                            Unpaid
                        </option>
                    </select>
                </div>

                {/* Status counts */}
                <div className="billing-status-counts">
                    <span>
                        Paid: <strong>{paidBills}</strong>
                    </span>

                    <span>
                        Partial: <strong>{partialBills}</strong>
                    </span>

                    <span>
                        Unpaid: <strong>{unpaidBills}</strong>
                    </span>

                    <span>
                        Showing:{" "}
                        <strong>{filteredBills.length}</strong>
                    </span>
                </div>

                {filteredBills.length === 0 ? (
                    <div className="empty-bills">
                        <h3>No bills found</h3>
                        <p>
                            No billing records match the
                            current filters.
                        </p>
                    </div>
                ) : (
                    <div className="billing-table-container">
                        <table className="billing-table">
                            <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Patient</th>
                                <th>Bill Date</th>
                                <th>Consultation</th>
                                <th>Medicine</th>
                                <th>Lab</th>
                                <th>Other</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredBills.map((bill) => (
                                <tr key={bill.id}>
                                    <td>
                                        <strong>
                                            #{bill.id}
                                        </strong>
                                    </td>

                                    <td>
                                        {getPatientName(
                                            bill.patientId ||
                                            bill.patient?.id
                                        )}
                                    </td>

                                    <td>
                                        {formatDate(
                                            bill.billDate
                                        )}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            bill.consultationFee ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            bill.medicineCharges ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            bill.labCharges ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            bill.otherCharges ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td className="bill-total">
                                        ₹
                                        {Number(
                                            bill.totalAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                            <span
                                                className={`payment-status ${getStatusClass(
                                                    bill.paymentStatus
                                                )}`}
                                            >
                                                {bill.paymentStatus ||
                                                    "UNKNOWN"}
                                            </span>
                                    </td>

                                    <td>
                                        {bill.paymentMethod ||
                                            "-"}
                                    </td>

                                    <td>
                                        <div className="payment-actions">
                                            {String(
                                                    bill.paymentStatus
                                                ).toUpperCase() !==
                                                "PAID" && (
                                                    <button
                                                        className="mark-paid-btn"
                                                        onClick={() =>
                                                            handlePaymentStatus(
                                                                bill.id,
                                                                "PAID"
                                                            )
                                                        }
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}

                                            {String(
                                                    bill.paymentStatus
                                                ).toUpperCase() ===
                                                "PAID" && (
                                                    <span className="paid-label">
                                                        Paid
                                                    </span>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionistBilling;