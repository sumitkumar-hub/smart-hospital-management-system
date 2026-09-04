import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/Billing.css";

function Billing() {
    const [billings, setBillings] = useState([]);
    const [patients, setPatients] = useState([]);

    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("ALL");

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",
        consultationFee: "",
        medicineCharges: "",
        labCharges: "",
        otherCharges: "",
        paymentStatus: "PENDING",
        paymentMethod: ""
    });

    /* =========================
       FETCH DATA
    ========================= */

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [billingResponse, patientResponse] = await Promise.all([
                api.get("/billings"),
                api.get("/patients")
            ]);

            setBillings(billingResponse.data?.data || []);
            setPatients(patientResponse.data?.data || []);

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to fetch billing data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* =========================
       FORM HANDLING
    ========================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            patientId: "",
            consultationFee: "",
            medicineCharges: "",
            labCharges: "",
            otherCharges: "",
            paymentStatus: "PENDING",
            paymentMethod: ""
        });

        setEditingId(null);
    };

    const handleAdd = () => {
        resetForm();
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    /* =========================
       ADD / UPDATE BILL
    ========================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                patientId: Number(formData.patientId),
                consultationFee: Number(formData.consultationFee || 0),
                medicineCharges: Number(formData.medicineCharges || 0),
                labCharges: Number(formData.labCharges || 0),
                otherCharges: Number(formData.otherCharges || 0),
                paymentStatus: formData.paymentStatus,
                paymentMethod: formData.paymentMethod || null
            };

            if (editingId) {
                await api.put(`/billings/${editingId}`, payload);
                setSuccess("Bill updated successfully");
            } else {
                await api.post("/billings", payload);
                setSuccess("Bill created successfully");
            }

            setShowForm(false);
            resetForm();

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save bill"
            );
        } finally {
            setFormLoading(false);
        }
    };

    /* =========================
       VIEW BILL
    ========================= */

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(`/billings/${id}`);

            setSelectedBill(response.data?.data || null);
            setShowView(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch bill"
            );
        }
    };

    /* =========================
       EDIT BILL
    ========================= */

    const handleEdit = async (id) => {
        try {
            setError("");

            const response = await api.get(`/billings/${id}`);
            const bill = response.data?.data;

            if (!bill) {
                setError("Bill not found");
                return;
            }

            setEditingId(id);

            setFormData({
                patientId: bill.patientId || "",
                consultationFee: bill.consultationFee ?? "",
                medicineCharges: bill.medicineCharges ?? "",
                labCharges: bill.labCharges ?? "",
                otherCharges: bill.otherCharges ?? "",
                paymentStatus: bill.paymentStatus || "PENDING",
                paymentMethod: bill.paymentMethod || ""
            });

            setShowForm(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch bill"
            );
        }
    };

    /* =========================
       UPDATE PAYMENT STATUS
    ========================= */

    const handlePaymentStatus = async (id, paymentStatus) => {
        try {
            setError("");
            setSuccess("");

            await api.patch(
                `/billings/${id}/payment-status`,
                null,
                {
                    params: {
                        paymentStatus
                    }
                }
            );

            setSuccess("Payment status updated successfully");

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update payment status"
            );
        }
    };

    /* =========================
       DELETE BILL
    ========================= */

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this bill?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/billings/${id}`);

            setSuccess("Bill deleted successfully");

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete bill"
            );
        }
    };

    /* =========================
       FILTER BILLINGS
    ========================= */

    const filteredBillings = billings.filter((bill) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            String(bill.id || "").includes(searchValue) ||
            String(bill.patientId || "").includes(searchValue) ||
            String(bill.patientName || "")
                .toLowerCase()
                .includes(searchValue);

        const matchesPayment =
            paymentFilter === "ALL" ||
            bill.paymentStatus === paymentFilter;

        return matchesSearch && matchesPayment;
    });

    /* =========================
       SUMMARY
    ========================= */

    const totalBills = billings.length;

    const paidBills = billings.filter(
        (bill) => bill.paymentStatus === "PAID"
    ).length;

    const pendingBills = billings.filter(
        (bill) => bill.paymentStatus === "PENDING"
    ).length;

    const totalRevenue = billings.reduce(
        (sum, bill) => sum + Number(bill.totalAmount || 0),
        0
    );

    /* =========================
       HELPERS
    ========================= */

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();
    };

    const getPaymentClass = (status) => {
        switch (status) {
            case "PAID":
                return "paid";

            case "PENDING":
                return "pending";

            case "CANCELLED":
                return "cancelled";

            case "PARTIAL":
                return "partial";

            default:
                return "pending";
        }
    };

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="billing-page">
                <div className="loading">
                    Loading billing data...
                </div>
            </div>
        );
    }

    return (
        <div className="billing-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="billing-header">

                <div>
                    <h1>Billing Management</h1>

                    <p>
                        Manage hospital bills, payments and billing records
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleAdd}
                >
                    + Create Bill
                </button>

            </div>


            {/* =========================
                ALERTS
            ========================= */}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="billing-summary">

                <div className="summary-card">
                    <span>Total Bills</span>
                    <strong>{totalBills}</strong>
                </div>

                <div className="summary-card">
                    <span>Paid Bills</span>
                    <strong>{paidBills}</strong>
                </div>

                <div className="summary-card">
                    <span>Pending Bills</span>
                    <strong>{pendingBills}</strong>
                </div>

                <div className="summary-card">
                    <span>Total Revenue</span>
                    <strong>{formatAmount(totalRevenue)}</strong>
                </div>

            </div>


            {/* =========================
                FILTERS
            ========================= */}

            <div className="filters-container">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by bill ID, patient ID or patient name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={paymentFilter}
                    onChange={(e) =>
                        setPaymentFilter(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Payment Status
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="PAID">
                        Paid
                    </option>

                    <option value="PARTIAL">
                        Partial
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>
                </select>

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="table-container">

                {filteredBillings.length === 0 ? (

                    <div className="empty-state">
                        No billing records found.
                    </div>

                ) : (

                    <table className="billing-table">

                        <thead>
                        <tr>

                            <th>ID</th>

                            <th>Patient</th>

                            <th>Bill Date</th>

                            <th>Consultation</th>

                            <th>Medicine</th>

                            <th>Lab</th>

                            <th>Other</th>

                            <th>Total</th>

                            <th>Payment Status</th>

                            <th>Payment Method</th>

                            <th>Actions</th>

                        </tr>
                        </thead>

                        <tbody>

                        {filteredBillings.map((bill) => (

                            <tr key={bill.id}>

                                <td>
                                    #{bill.id}
                                </td>

                                <td>
                                    <strong>
                                        {bill.patientName ||
                                            `Patient #${bill.patientId}`}
                                    </strong>
                                </td>

                                <td>
                                    {formatDate(bill.billDate)}
                                </td>

                                <td>
                                    {formatAmount(
                                        bill.consultationFee
                                    )}
                                </td>

                                <td>
                                    {formatAmount(
                                        bill.medicineCharges
                                    )}
                                </td>

                                <td>
                                    {formatAmount(
                                        bill.labCharges
                                    )}
                                </td>

                                <td>
                                    {formatAmount(
                                        bill.otherCharges
                                    )}
                                </td>

                                <td>
                                    <strong>
                                        {formatAmount(
                                            bill.totalAmount
                                        )}
                                    </strong>
                                </td>

                                <td>

                                        <span
                                            className={`payment-badge ${getPaymentClass(
                                                bill.paymentStatus
                                            )}`}
                                        >
                                            {bill.paymentStatus ||
                                                "PENDING"}
                                        </span>

                                </td>

                                <td>
                                    {bill.paymentMethod || "-"}
                                </td>

                                <td>

                                    <div className="action-buttons">

                                        <button
                                            className="btn-view"
                                            onClick={() =>
                                                handleView(bill.id)
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                handleEdit(bill.id)
                                            }
                                        >
                                            Edit
                                        </button>

                                        {bill.paymentStatus !== "PAID" && (
                                            <button
                                                className="btn-paid"
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

                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDelete(bill.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>
                                {editingId
                                    ? "Edit Bill"
                                    : "Create Bill"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="billing-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Patient */}

                            <div className="form-group">

                                <label>
                                    Patient *
                                </label>

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


                            {/* Consultation Fee */}

                            <div className="form-group">

                                <label>
                                    Consultation Fee
                                </label>

                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />

                            </div>


                            {/* Medicine Charges */}

                            <div className="form-group">

                                <label>
                                    Medicine Charges
                                </label>

                                <input
                                    type="number"
                                    name="medicineCharges"
                                    value={formData.medicineCharges}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />

                            </div>


                            {/* Lab Charges */}

                            <div className="form-group">

                                <label>
                                    Lab Charges
                                </label>

                                <input
                                    type="number"
                                    name="labCharges"
                                    value={formData.labCharges}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />

                            </div>


                            {/* Other Charges */}

                            <div className="form-group">

                                <label>
                                    Other Charges
                                </label>

                                <input
                                    type="number"
                                    name="otherCharges"
                                    value={formData.otherCharges}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />

                            </div>


                            {/* Payment Status */}

                            <div className="form-group">

                                <label>
                                    Payment Status
                                </label>

                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                >

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="PARTIAL">
                                        Partial
                                    </option>

                                    <option value="PAID">
                                        Paid
                                    </option>

                                    <option value="CANCELLED">
                                        Cancelled
                                    </option>

                                </select>

                            </div>


                            {/* Payment Method */}

                            <div className="form-group">

                                <label>
                                    Payment Method
                                </label>

                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Payment Method
                                    </option>

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

                                    <option value="INSURANCE">
                                        Insurance
                                    </option>

                                </select>

                            </div>


                            {/* FORM ACTIONS */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Bill"
                                            : "Create Bill"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                VIEW MODAL
            ========================= */}

            {showView && selectedBill && (

                <div className="modal-overlay">

                    <div className="modal view-modal">

                        <div className="modal-header">

                            <h2>
                                Bill #{selectedBill.id}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowView(false);
                                    setSelectedBill(null);
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div className="details-grid">

                            <div className="detail-item">
                                <span>Patient</span>
                                <strong>
                                    {selectedBill.patientName ||
                                        `Patient #${selectedBill.patientId}`}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Bill Date</span>
                                <strong>
                                    {formatDate(
                                        selectedBill.billDate
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Consultation Fee</span>
                                <strong>
                                    {formatAmount(
                                        selectedBill.consultationFee
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Medicine Charges</span>
                                <strong>
                                    {formatAmount(
                                        selectedBill.medicineCharges
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Lab Charges</span>
                                <strong>
                                    {formatAmount(
                                        selectedBill.labCharges
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Other Charges</span>
                                <strong>
                                    {formatAmount(
                                        selectedBill.otherCharges
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Total Amount</span>
                                <strong>
                                    {formatAmount(
                                        selectedBill.totalAmount
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Payment Status</span>
                                <strong>
                                    <span
                                        className={`payment-badge ${getPaymentClass(
                                            selectedBill.paymentStatus
                                        )}`}
                                    >
                                        {selectedBill.paymentStatus ||
                                            "PENDING"}
                                    </span>
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Payment Method</span>
                                <strong>
                                    {selectedBill.paymentMethod || "-"}
                                </strong>
                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setShowView(false);
                                    setSelectedBill(null);
                                }}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Billing;