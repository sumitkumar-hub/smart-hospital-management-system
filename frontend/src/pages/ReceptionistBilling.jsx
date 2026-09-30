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


    /* =========================================================
       FORM DATA
    ========================================================= */

    const [formData, setFormData] = useState({

        patientId: "",

        consultationFee: "",
        medicineCharges: "",
        labCharges: "",
        otherCharges: "",

        paymentStatus: "UNPAID",
        amountPaid: "",

        paymentMethod: "CASH",

        billDate:
            new Date().toISOString().split("T")[0],
    });


    /* =========================================================
       FETCH DATA
    ========================================================= */

    useEffect(() => {

        fetchData();

    }, []);


    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                billsResponse,
                patientsResponse
            ] = await Promise.all([
                api.get("/billings"),
                api.get("/patients"),
            ]);


            setBills(
                billsResponse.data?.data || []
            );

            setPatients(
                patientsResponse.data?.data || []
            );

        } catch (err) {

            console.error(
                "Error loading billing data:",
                err
            );

            if (err.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("loginResponse");

                navigate("/login");

                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to load billing information."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       HANDLE FORM CHANGE
    ========================================================= */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    /* =========================================================
       RESET FORM
    ========================================================= */

    const resetForm = () => {

        setFormData({

            patientId: "",

            consultationFee: "",
            medicineCharges: "",
            labCharges: "",
            otherCharges: "",

            paymentStatus: "UNPAID",
            amountPaid: "",

            paymentMethod: "CASH",

            billDate:
                new Date().toISOString().split("T")[0],

        });


        setShowForm(false);
    };


    /* =========================================================
       CALCULATE TOTAL
    ========================================================= */

    const calculatedTotal =

        Number(formData.consultationFee || 0) +

        Number(formData.medicineCharges || 0) +

        Number(formData.labCharges || 0) +

        Number(formData.otherCharges || 0);


    /* =========================================================
       CALCULATE PAYMENT
    ========================================================= */

    let calculatedAmountPaid = 0;


    if (formData.paymentStatus === "PAID") {

        calculatedAmountPaid =
            calculatedTotal;

    } else if (
        formData.paymentStatus === "PARTIAL"
    ) {

        calculatedAmountPaid =
            Number(formData.amountPaid || 0);

    }


    const calculatedRemaining = Math.max(
        calculatedTotal - calculatedAmountPaid,
        0
    );


    /* =========================================================
       CREATE BILL
    ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.patientId) {

            alert("Please select a patient.");

            return;
        }


        if (calculatedTotal <= 0) {

            alert(
                "Total bill amount must be greater than 0."
            );

            return;
        }


        if (
            formData.paymentStatus === "PARTIAL"
        ) {

            const amountPaid =
                Number(formData.amountPaid || 0);


            if (amountPaid <= 0) {

                alert(
                    "For partial payment, Amount Paid must be greater than 0."
                );

                return;
            }


            if (amountPaid >= calculatedTotal) {

                alert(
                    "For partial payment, Amount Paid must be less than the Total Amount."
                );

                return;
            }
        }


        try {

            const payload = {

                patientId:
                    Number(formData.patientId),

                consultationFee:
                    Number(
                        formData.consultationFee || 0
                    ),

                medicineCharges:
                    Number(
                        formData.medicineCharges || 0
                    ),

                labCharges:
                    Number(
                        formData.labCharges || 0
                    ),

                otherCharges:
                    Number(
                        formData.otherCharges || 0
                    ),

                paymentStatus:
                formData.paymentStatus,

                amountPaid:
                    formData.paymentStatus === "PARTIAL"
                        ? Number(
                            formData.amountPaid || 0
                        )
                        : formData.paymentStatus === "PAID"
                            ? calculatedTotal
                            : 0,

                paymentMethod:
                formData.paymentMethod,

                billDate:
                formData.billDate,
            };


            await api.post(
                "/billings",
                payload
            );


            alert(
                "Bill created successfully."
            );


            resetForm();

            fetchData();


        } catch (err) {

            console.error(
                "Error creating bill:",
                err
            );


            alert(
                err.response?.data?.message ||
                "Failed to create bill."
            );

        }

    };


    /* =========================================================
       UPDATE PAYMENT STATUS
    ========================================================= */

    const handlePaymentStatus = async (
        id,
        status
    ) => {

        try {

            await api.patch(
                `/billings/${id}/payment-status?paymentStatus=${encodeURIComponent(
                    status
                )}`
            );


            alert(
                "Payment status updated successfully."
            );


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


    /* =========================================================
       PATIENT NAME
    ========================================================= */

    const getPatientName = (patientId) => {

        const patient =
            patients.find(
                (item) =>
                    Number(item.id) ===
                    Number(patientId)
            );


        if (!patient) {

            return "Unknown Patient";

        }


        return `${patient.firstName || ""} ${
            patient.lastName || ""
        }`.trim();

    };


    /* =========================================================
       FORMAT DATE
    ========================================================= */

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /* =========================================================
       STATUS CLASS
    ========================================================= */

    const getStatusClass = (status) => {

        const normalized =
            String(status || "")
                .toUpperCase();


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


    /* =========================================================
       FILTER BILLS
    ========================================================= */

    const filteredBills = useMemo(() => {

        return bills.filter((bill) => {

            const patientName =
                getPatientName(
                    bill.patientId ||
                    bill.patient?.id
                ).toLowerCase();


            const billId =
                String(
                    bill.id || ""
                ).toLowerCase();


            const searchValue =
                search.toLowerCase();


            const searchMatch =
                patientName.includes(
                    searchValue
                ) ||
                billId.includes(
                    searchValue
                );


            const statusMatch =
                statusFilter === "ALL" ||
                String(
                    bill.paymentStatus || ""
                ).toUpperCase() ===
                statusFilter;


            return (
                searchMatch &&
                statusMatch
            );

        });

    }, [
        bills,
        patients,
        search,
        statusFilter
    ]);


    /* =========================================================
       SUMMARY VALUES
    ========================================================= */

    const totalRevenue = bills.reduce(
        (sum, bill) =>
            sum +
            Number(
                bill.totalAmount || 0
            ),
        0
    );


    const totalPaidAmount = bills.reduce(
        (sum, bill) =>
            sum +
            Number(
                bill.amountPaid || 0
            ),
        0
    );


    const totalRemainingAmount = bills.reduce(
        (sum, bill) =>
            sum +
            Number(
                bill.remainingAmount || 0
            ),
        0
    );


    const paidBills = bills.filter(
        (bill) =>
            String(
                bill.paymentStatus || ""
            ).toUpperCase() === "PAID"
    ).length;


    const partialBills = bills.filter(
        (bill) =>
            String(
                bill.paymentStatus || ""
            ).toUpperCase() === "PARTIAL"
    ).length;


    const unpaidBills = bills.filter(
        (bill) =>
            String(
                bill.paymentStatus || ""
            ).toUpperCase() === "UNPAID"
    ).length;


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <div className="receptionist-billing-page">

                <div className="billing-loading">

                    Loading billing information...

                </div>

            </div>

        );

    }


    /* =========================================================
       PAGE
    ========================================================= */

    return (

        <div className="receptionist-billing-page">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="billing-header">

                <div>

                    <h1>
                        Billing Management
                    </h1>

                    <p>
                        Create bills and manage
                        patient payment information.
                    </p>

                </div>


                <button
                    className="billing-dashboard-btn"
                    onClick={() =>
                        navigate(
                            "/receptionist"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* =================================================
               ERROR
            ================================================= */}

            {error && (

                <div className="billing-error">

                    {error}

                </div>

            )}


            {/* =================================================
               SUMMARY
            ================================================= */}

            <div className="billing-summary">


                <div className="billing-summary-card">

                    <span>
                        Total Bills
                    </span>

                    <strong>
                        {bills.length}
                    </strong>

                </div>


                <div className="billing-summary-card">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹
                        {totalRevenue.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div className="billing-summary-card">

                    <span>
                        Amount Paid
                    </span>

                    <strong>
                        ₹
                        {totalPaidAmount.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div className="billing-summary-card">

                    <span>
                        Remaining Amount
                    </span>

                    <strong>
                        ₹
                        {totalRemainingAmount.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


            </div>


            {/* =================================================
               CREATE BILL
            ================================================= */}

            <div className="billing-form-section">


                <div className="billing-section-header">

                    <div>

                        <h2>
                            Create New Bill
                        </h2>

                        <p>
                            Generate a bill for a
                            registered patient.
                        </p>

                    </div>


                    {!showForm && (

                        <button
                            className="create-bill-btn"
                            onClick={() =>
                                setShowForm(true)
                            }
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


                        {/* PATIENT */}

                        <div className="billing-form-group">

                            <label>
                                Patient
                            </label>

                            <select
                                name="patientId"
                                value={
                                    formData.patientId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Patient
                                </option>


                                {patients.map(
                                    (patient) => (

                                        <option
                                            key={
                                                patient.id
                                            }
                                            value={
                                                patient.id
                                            }
                                        >

                                            {
                                                patient.firstName
                                            }{" "}

                                            {
                                                patient.lastName
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="billing-form-group">

                            <label>
                                Bill Date
                            </label>

                            <input
                                type="date"
                                name="billDate"
                                value={
                                    formData.billDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* CONSULTATION */}

                        <div className="billing-form-group">

                            <label>
                                Consultation Fee
                            </label>

                            <input
                                type="number"
                                name="consultationFee"
                                value={
                                    formData.consultationFee
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />

                        </div>


                        {/* MEDICINE */}

                        <div className="billing-form-group">

                            <label>
                                Medicine Charges
                            </label>

                            <input
                                type="number"
                                name="medicineCharges"
                                value={
                                    formData.medicineCharges
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />

                        </div>


                        {/* LAB */}

                        <div className="billing-form-group">

                            <label>
                                Lab Charges
                            </label>

                            <input
                                type="number"
                                name="labCharges"
                                value={
                                    formData.labCharges
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />

                        </div>


                        {/* OTHER */}

                        <div className="billing-form-group">

                            <label>
                                Other Charges
                            </label>

                            <input
                                type="number"
                                name="otherCharges"
                                value={
                                    formData.otherCharges
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />

                        </div>


                        {/* PAYMENT STATUS */}

                        <div className="billing-form-group">

                            <label>
                                Payment Status
                            </label>

                            <select
                                name="paymentStatus"
                                value={
                                    formData.paymentStatus
                                }
                                onChange={
                                    handleChange
                                }
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


                        {/* PAYMENT METHOD */}

                        <div className="billing-form-group">

                            <label>
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={
                                    formData.paymentMethod
                                }
                                onChange={
                                    handleChange
                                }
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


                        {/* PARTIAL AMOUNT */}

                        {formData.paymentStatus ===
                            "PARTIAL" && (

                                <div className="billing-form-group">

                                    <label>
                                        Amount Paid
                                    </label>

                                    <input
                                        type="number"
                                        name="amountPaid"
                                        value={
                                            formData.amountPaid
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0.01"
                                        max={
                                            calculatedTotal > 0
                                                ? calculatedTotal -
                                                0.01
                                                : undefined
                                        }
                                        step="0.01"
                                        placeholder="Enter amount paid"
                                        required
                                    />

                                </div>

                            )}


                        {/* TOTAL */}

                        <div className="billing-total-preview">

                            <div>

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹
                                    {calculatedTotal.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Amount Paid
                                </span>

                                <strong>
                                    ₹
                                    {calculatedAmountPaid.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Remaining
                                </span>

                                <strong>
                                    ₹
                                    {calculatedRemaining.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* BUTTONS */}

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
                                onClick={
                                    resetForm
                                }
                            >
                                Cancel
                            </button>

                        </div>


                    </form>

                )}

            </div>


            {/* =================================================
               BILLS TABLE
            ================================================= */}

            <div className="billing-table-section">


                <div className="billing-section-header">

                    <div>

                        <h2>
                            Patient Bills
                        </h2>

                        <p>
                            Search and manage patient
                            billing records.
                        </p>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="billing-filters">

                    <input
                        type="text"
                        placeholder="Search by patient name or bill ID..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    <select
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Payment Status
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                        <option value="PARTIAL">
                            Partial
                        </option>

                        <option value="UNPAID">
                            Unpaid
                        </option>

                    </select>

                </div>


                {/* STATUS COUNTS */}

                <div className="billing-status-counts">

                    <span>
                        Paid:{" "}
                        <strong>
                            {paidBills}
                        </strong>
                    </span>


                    <span>
                        Partial:{" "}
                        <strong>
                            {partialBills}
                        </strong>
                    </span>


                    <span>
                        Unpaid:{" "}
                        <strong>
                            {unpaidBills}
                        </strong>
                    </span>


                    <span>
                        Showing:{" "}
                        <strong>
                            {filteredBills.length}
                        </strong>
                    </span>

                </div>


                {/* EMPTY */}

                {filteredBills.length === 0 ? (

                    <div className="empty-bills">

                        <h3>
                            No bills found
                        </h3>

                        <p>
                            No billing records match
                            the current filters.
                        </p>

                    </div>

                ) : (


                    <div className="billing-table-container">

                        <table className="billing-table">

                            <thead>

                            <tr>

                                <th>
                                    Bill ID
                                </th>

                                <th>
                                    Patient
                                </th>

                                <th>
                                    Bill Date
                                </th>

                                <th>
                                    Consultation
                                </th>

                                <th>
                                    Medicine
                                </th>

                                <th>
                                    Lab
                                </th>

                                <th>
                                    Other
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Paid
                                </th>

                                <th>
                                    Remaining
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Method
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {filteredBills.map(
                                (bill) => (

                                    <tr
                                        key={
                                            bill.id
                                        }
                                    >

                                        <td>

                                            <strong>
                                                #{bill.id}
                                            </strong>

                                        </td>


                                        <td>

                                            {
                                                getPatientName(
                                                    bill.patientId ||
                                                    bill.patient?.id
                                                )
                                            }

                                        </td>


                                        <td>

                                            {
                                                formatDate(
                                                    bill.billDate
                                                )
                                            }

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
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}

                                        </td>


                                        <td className="bill-paid">

                                            ₹
                                            {Number(
                                                bill.amountPaid ||
                                                0
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}

                                        </td>


                                        <td className="bill-remaining">

                                            ₹
                                            {Number(
                                                bill.remainingAmount ||
                                                0
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}

                                        </td>


                                        <td>

                                            <span
                                                className={`payment-status ${getStatusClass(
                                                    bill.paymentStatus
                                                )}`}
                                            >
                                                {
                                                    bill.paymentStatus ||
                                                    "UNKNOWN"
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            {
                                                bill.paymentMethod ||
                                                "-"
                                            }

                                        </td>


                                        <td>

                                            <div className="payment-actions">


                                                {/* VIEW INVOICE */}

                                                <button
                                                    className="view-invoice-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/receptionist/billing/invoice/${bill.id}`
                                                        )
                                                    }
                                                >
                                                    View Invoice
                                                </button>


                                                {/* MARK PAID */}

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

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default ReceptionistBilling;