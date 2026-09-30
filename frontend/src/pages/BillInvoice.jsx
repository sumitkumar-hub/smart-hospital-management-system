import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../Styles/BillInvoice.css";

function BillInvoice() {

    const { id } = useParams();
    const navigate = useNavigate();

    const invoiceRef = useRef(null);

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH BILL
    // =========================================================

    const fetchBill = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(`/billings/${id}`);

            console.log("Invoice response:", response.data);

            const billData =
                response.data?.data ||
                response.data;

            setBill(billData);

        } catch (err) {

            console.error("Invoice loading error:", err);

            if (err.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("loginResponse");

                navigate("/login", { replace: true });

                return;
            }

            if (err.response?.status === 403) {

                setError(
                    "You are not authorized to view this invoice."
                );

                return;
            }

            if (err.response?.status === 404) {

                setError(
                    "Invoice not found."
                );

                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load invoice."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchBill();

    }, [id]);


    // =========================================================
    // FORMAT AMOUNT
    // =========================================================

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const formattedDate =
            new Date(`${date}T00:00:00`);

        if (Number.isNaN(formattedDate.getTime())) {
            return date;
        }

        return formattedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================================================
    // PAYMENT STATUS
    // =========================================================

    const getStatusClass = (status) => {

        const normalized =
            String(status || "").toUpperCase();

        if (normalized === "PAID") {
            return "invoice-status-paid";
        }

        if (normalized === "PARTIAL") {
            return "invoice-status-partial";
        }

        if (normalized === "UNPAID") {
            return "invoice-status-unpaid";
        }

        return "invoice-status-default";
    };


    // =========================================================
    // PRINT
    // =========================================================

    const handlePrint = () => {

        window.print();

    };


    // =========================================================
    // DOWNLOAD PDF
    // =========================================================

    const handleDownloadPDF = async () => {

        if (!invoiceRef.current) {
            return;
        }

        try {

            const html2pdf =
                (await import("html2pdf.js")).default;

            const element = invoiceRef.current;

            const options = {

                margin: 10,

                filename:
                    `Navira-Hospital-Invoice-${bill.id}.pdf`,

                image: {
                    type: "jpeg",
                    quality: 0.98,
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },

            };

            await html2pdf()
                .set(options)
                .from(element)
                .save();

        } catch (err) {

            console.error(
                "PDF download error:",
                err
            );

            alert(
                "Unable to download PDF."
            );

        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="bill-invoice-page">

                <div className="invoice-loading">

                    <div className="invoice-spinner"></div>

                    <h3>
                        Loading invoice...
                    </h3>

                    <p>
                        Please wait.
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="bill-invoice-page">

                <div className="invoice-error">

                    <div className="invoice-error-icon">
                        ⚠
                    </div>

                    <h2>
                        Unable to load invoice
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="invoice-back-button"
                        onClick={() =>
                            navigate(
                                "/receptionist/billing"
                            )
                        }
                    >
                        ← Back to Billing
                    </button>

                </div>

            </div>

        );

    }


    if (!bill) {

        return null;

    }


    // =========================================================
    // RENDER INVOICE
    // =========================================================

    return (

        <div className="bill-invoice-page">

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="invoice-actions no-print">

                <button
                    className="invoice-back-btn"
                    onClick={() =>
                        navigate(
                            "/receptionist/billing"
                        )
                    }
                >
                    ← Back to Billing
                </button>


                <div className="invoice-action-right">

                    <button
                        className="invoice-print-btn"
                        onClick={handlePrint}
                    >
                        🖨 Print Bill
                    </button>


                    <button
                        className="invoice-download-btn"
                        onClick={handleDownloadPDF}
                    >
                        ↓ Download PDF
                    </button>

                </div>

            </div>


            {/* =================================================
                INVOICE
            ================================================= */}

            <div
                className="invoice-container"
                ref={invoiceRef}
            >

                {/* =================================================
                    HOSPITAL HEADER
                ================================================= */}

                <div className="invoice-header">

                    <div className="hospital-invoice-brand">

                        <div className="invoice-logo">
                            ❤
                        </div>

                        <div>

                            <h1>
                                NAVIRA
                            </h1>

                            <p>
                                MULTISPECIALITY HOSPITAL
                            </p>

                        </div>

                    </div>


                    <div className="invoice-title">

                        <h2>
                            INVOICE
                        </h2>

                        <span>
                            Healing with heart.
                        </span>

                    </div>

                </div>


                {/* =================================================
                    HOSPITAL INFORMATION
                ================================================= */}

                <div className="hospital-info">

                    <p>
                        <strong>
                            Navira Multispeciality Hospital
                        </strong>
                    </p>

                    <p>
                        Healing with heart.
                    </p>

                    <p>
                        Healthcare Management System
                    </p>

                </div>


                {/* =================================================
                    PATIENT + BILL INFORMATION
                ================================================= */}

                <div className="invoice-info-grid">

                    <div className="invoice-info-box">

                        <h3>
                            Patient Information
                        </h3>

                        <div className="invoice-info-row">

                            <span>
                                Patient Name
                            </span>

                            <strong>
                                {bill.patientName ||
                                    bill.patient?.firstName ||
                                    "Unknown Patient"}
                            </strong>

                        </div>


                        <div className="invoice-info-row">

                            <span>
                                Patient ID
                            </span>

                            <strong>
                                {bill.patientId ||
                                    bill.patient?.id ||
                                    "-"}
                            </strong>

                        </div>

                    </div>


                    <div className="invoice-info-box">

                        <h3>
                            Invoice Information
                        </h3>

                        <div className="invoice-info-row">

                            <span>
                                Invoice No.
                            </span>

                            <strong>
                                #{bill.id}
                            </strong>

                        </div>


                        <div className="invoice-info-row">

                            <span>
                                Bill Date
                            </span>

                            <strong>
                                {formatDate(
                                    bill.billDate
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CHARGES
                ================================================= */}

                <div className="invoice-section">

                    <h3>
                        Bill Details
                    </h3>

                    <table className="invoice-table">

                        <thead>

                        <tr>

                            <th>
                                Description
                            </th>

                            <th className="amount-column">
                                Amount
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        <tr>

                            <td>
                                Consultation Fee
                            </td>

                            <td className="amount-column">
                                ₹
                                {formatAmount(
                                    bill.consultationFee
                                )}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Medicine Charges
                            </td>

                            <td className="amount-column">
                                ₹
                                {formatAmount(
                                    bill.medicineCharges
                                )}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Laboratory Charges
                            </td>

                            <td className="amount-column">
                                ₹
                                {formatAmount(
                                    bill.labCharges
                                )}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Other Charges
                            </td>

                            <td className="amount-column">
                                ₹
                                {formatAmount(
                                    bill.otherCharges
                                )}
                            </td>

                        </tr>

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    PAYMENT INFORMATION
                ================================================= */}

                <div className="payment-information">

                    <div>

                        <h3>
                            Payment Information
                        </h3>

                        <div className="payment-detail">

                            <span>
                                Payment Status
                            </span>

                            <strong
                                className={`invoice-payment-status ${getStatusClass(
                                    bill.paymentStatus
                                )}`}
                            >
                                {bill.paymentStatus ||
                                    "UNKNOWN"}
                            </strong>

                        </div>


                        <div className="payment-detail">

                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {bill.paymentMethod ||
                                    "-"}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        AMOUNT SUMMARY
                    ================================================= */}

                    <div className="invoice-amount-summary">

                        <div className="amount-row">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹
                                {formatAmount(
                                    bill.totalAmount
                                )}
                            </strong>

                        </div>


                        <div className="amount-row">

                            <span>
                                Amount Paid
                            </span>

                            <strong>
                                ₹
                                {formatAmount(
                                    bill.amountPaid
                                )}
                            </strong>

                        </div>


                        <div className="amount-row remaining-row">

                            <span>
                                Remaining Amount
                            </span>

                            <strong>
                                ₹
                                {formatAmount(
                                    bill.remainingAmount
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="invoice-footer">

                    <div>

                        <strong>
                            Thank you for choosing
                            Navira Multispeciality Hospital.
                        </strong>

                        <p>
                            Please keep this invoice
                            for your records.
                        </p>

                    </div>


                    <div className="invoice-footer-right">

                        <p>
                            Computer generated invoice
                        </p>

                        <p>
                            No signature required
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default BillInvoice;