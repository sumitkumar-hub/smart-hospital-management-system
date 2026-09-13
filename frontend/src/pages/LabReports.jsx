import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/LabReports.css";

function LabReports() {

    const [reports, setReports] = useState([]);
    const [labOrders, setLabOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [viewReport, setViewReport] = useState(null);
    const [editingReport, setEditingReport] = useState(null);

    const [formData, setFormData] = useState({
        labOrderId: "",
        result: "",
        remarks: ""
    });


    // =========================
    // FETCH REPORTS
    // =========================

    const fetchReports = async () => {

        try {

            setLoading(true);

            const response = await api.get("/lab-reports");

            setReports(response.data);
            setError("");

        } catch (err) {

            console.error(err);

            setError("Failed to load lab reports.");

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // FETCH LAB ORDERS
    // =========================

    const fetchLabOrders = async () => {

        try {

            const response = await api.get("/lab-orders");

            setLabOrders(response.data);

        } catch (err) {

            console.error("Failed to load lab orders", err);

        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchReports();
        fetchLabOrders();

    }, []);


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // =========================
    // ADD REPORT
    // =========================

    const handleAdd = () => {

        setEditingReport(null);

        setFormData({
            labOrderId: "",
            result: "",
            remarks: ""
        });

        setShowModal(true);

    };


    // =========================
    // EDIT REPORT
    // =========================

    const handleEdit = (report) => {

        /*
         * The Lab Report response contains patient/doctor/test
         * information but does not contain labOrderId.
         *
         * Find the matching Lab Order using:
         * patientName + doctorName + labTestName
         */

        const matchingOrder = labOrders.find(
            (order) =>
                order.patientName === report.patientName &&
                order.doctorName === report.doctorName &&
                order.testName === report.labTestName
        );

        if (!matchingOrder) {

            alert(
                "Unable to find the Lab Order for this report."
            );

            return;
        }

        setEditingReport(report);

        setFormData({
            labOrderId: matchingOrder.id,
            result: report.result || "",
            remarks: report.remarks || ""
        });

        setShowModal(true);

    };


    // =========================
    // VIEW REPORT
    // =========================

    const handleView = (report) => {

        setViewReport(report);

    };


    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const requestData = {
                labOrderId: Number(formData.labOrderId),
                result: formData.result,
                remarks: formData.remarks
            };


            if (editingReport) {

                await api.put(
                    `/lab-reports/${editingReport.id}`,
                    requestData
                );

            } else {

                await api.post(
                    "/lab-reports",
                    requestData
                );

            }


            setShowModal(false);

            setEditingReport(null);

            fetchReports();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to save lab report."
            );

        }

    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this lab report?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/lab-reports/${id}`);

            fetchReports();

        } catch (err) {

            console.error(err);

            alert("Failed to delete lab report.");

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="lab-reports-page">

                <h1>Lab Reports</h1>

                <p className="loading-text">
                    Loading lab reports...
                </p>

            </div>
        );

    }


    return (
        <div className="lab-reports-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="lab-reports-header">

                <div>

                    <h1>Lab Reports</h1>

                    <p>
                        Manage laboratory test reports
                    </p>

                </div>


                <button
                    className="add-report-btn"
                    onClick={handleAdd}
                >
                    + Add Lab Report
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

            <div className="lab-reports-summary">

                <div className="summary-card">

                    <h3>Total Reports</h3>

                    <strong>
                        {reports.length}
                    </strong>

                </div>


                <div className="summary-card">

                    <h3>Today</h3>

                    <strong>
                        {
                            reports.filter(
                                report =>
                                    report.reportDate ===
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                            ).length
                        }
                    </strong>

                </div>


                <div className="summary-card">

                    <h3>With Remarks</h3>

                    <strong>
                        {
                            reports.filter(
                                report =>
                                    report.remarks &&
                                    report.remarks.trim() !== ""
                            ).length
                        }
                    </strong>

                </div>

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="lab-reports-table-container">

                <table className="lab-reports-table">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Patient</th>

                        <th>Doctor</th>

                        <th>Lab Test</th>

                        <th>Result</th>

                        <th>Report Date</th>

                        <th>Actions</th>

                    </tr>

                    </thead>


                    <tbody>

                    {reports.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="no-data"
                            >
                                No lab reports found.
                            </td>

                        </tr>

                    ) : (

                        reports.map((report) => (

                            <tr key={report.id}>

                                <td>
                                    #{report.id}
                                </td>

                                <td>
                                    {report.patientName}
                                </td>

                                <td>
                                    {report.doctorName}
                                </td>

                                <td>
                                    {report.labTestName}
                                </td>

                                <td className="result-cell">
                                    {report.result}
                                </td>

                                <td>
                                    {report.reportDate}
                                </td>

                                <td className="action-buttons">

                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            handleView(report)
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(report)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(report.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>


            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="lab-report-modal">


                        <div className="modal-header">

                            <h2>
                                {
                                    editingReport
                                        ? "Edit Lab Report"
                                        : "Add Lab Report"
                                }
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>


                            {/* LAB ORDER */}

                            <div className="form-group">

                                <label>
                                    Lab Order
                                </label>

                                <select
                                    name="labOrderId"
                                    value={formData.labOrderId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Lab Order
                                    </option>

                                    {labOrders.map((order) => (

                                        <option
                                            key={order.id}
                                            value={order.id}
                                        >

                                            #{order.id} -{" "}
                                            {order.patientName} -{" "}
                                            {order.testName}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* RESULT */}

                            <div className="form-group">

                                <label>
                                    Result
                                </label>

                                <textarea
                                    name="result"
                                    value={formData.result}
                                    onChange={handleChange}
                                    placeholder="Enter laboratory test result"
                                    maxLength="1000"
                                    required
                                />

                            </div>


                            {/* REMARKS */}

                            <div className="form-group">

                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="Enter remarks"
                                    maxLength="500"
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    {
                                        editingReport
                                            ? "Update Report"
                                            : "Create Report"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                VIEW MODAL
            ========================= */}

            {viewReport && (

                <div className="modal-overlay">

                    <div className="lab-report-modal">


                        <div className="modal-header">

                            <h2>
                                Lab Report Details
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setViewReport(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="report-details">

                            <div className="detail-row">
                                <strong>Report ID:</strong>
                                <span>
                                    #{viewReport.id}
                                </span>
                            </div>


                            <div className="detail-row">
                                <strong>Patient:</strong>
                                <span>
                                    {viewReport.patientName}
                                </span>
                            </div>


                            <div className="detail-row">
                                <strong>Doctor:</strong>
                                <span>
                                    {viewReport.doctorName}
                                </span>
                            </div>


                            <div className="detail-row">
                                <strong>Lab Test:</strong>
                                <span>
                                    {viewReport.labTestName}
                                </span>
                            </div>


                            <div className="detail-block">

                                <strong>
                                    Result
                                </strong>

                                <p>
                                    {viewReport.result}
                                </p>

                            </div>


                            <div className="detail-block">

                                <strong>
                                    Remarks
                                </strong>

                                <p>
                                    {viewReport.remarks || "-"}
                                </p>

                            </div>


                            <div className="detail-row">

                                <strong>
                                    Report Date:
                                </strong>

                                <span>
                                    {viewReport.reportDate}
                                </span>

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setViewReport(null)
                                }
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

export default LabReports;