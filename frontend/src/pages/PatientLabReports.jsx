import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/PatientLabReports.css";

function PatientLabReports() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const loginResponse = JSON.parse(
                localStorage.getItem("loginResponse") || "null"
            );

            const patientId =
                user.patientId ||
                loginResponse?.patientId;

            if (!patientId) {
                setError("Patient information not found.");
                return;
            }

            const response = await api.get(
                `/lab-reports/patient/${patientId}`
            );

            setReports(
                response.data?.data ||
                response.data ||
                []
            );
        } catch (err) {
            console.error("Error loading lab reports:", err);

            if (err.response?.status === 404) {
                setReports([]);
            } else {
                setError("Unable to load lab reports.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "report-status-default";

        switch (status.toUpperCase()) {
            case "COMPLETED":
                return "report-status-completed";

            case "PENDING":
                return "report-status-pending";

            case "CANCELLED":
                return "report-status-cancelled";

            case "IN_PROGRESS":
                return "report-status-progress";

            default:
                return "report-status-default";
        }
    };

    return (
        <div className="patient-lab-reports-page">

            {/* Header */}
            <div className="lab-reports-header">

                <div>
                    <h1>My Lab Reports</h1>

                    <p>
                        View your laboratory test reports and results.
                    </p>
                </div>

                <button
                    className="lab-back-button"
                    onClick={() => navigate("/patient")}
                >
                    ← Back to Dashboard
                </button>

            </div>

            {/* Summary Cards */}
            <div className="lab-summary">

                <div className="lab-summary-card">
                    <div className="lab-summary-icon">
                        🧪
                    </div>

                    <div>
                        <h3>{reports.length}</h3>
                        <p>Total Reports</p>
                    </div>
                </div>

                <div className="lab-summary-card">
                    <div className="lab-summary-icon">
                        ✓
                    </div>

                    <div>
                        <h3>
                            {
                                reports.filter(
                                    report =>
                                        report.status?.toUpperCase() ===
                                        "COMPLETED"
                                ).length
                            }
                        </h3>

                        <p>Completed</p>
                    </div>
                </div>

                <div className="lab-summary-card">
                    <div className="lab-summary-icon">
                        ⏳
                    </div>

                    <div>
                        <h3>
                            {
                                reports.filter(
                                    report =>
                                        report.status?.toUpperCase() ===
                                        "PENDING" ||
                                        report.status?.toUpperCase() ===
                                        "IN_PROGRESS"
                                ).length
                            }
                        </h3>

                        <p>Pending</p>
                    </div>
                </div>

            </div>

            {/* Loading */}
            {loading && (
                <div className="lab-report-message">

                    <div className="lab-loading-spinner"></div>

                    <p>
                        Loading lab reports...
                    </p>

                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="lab-report-message lab-error-message">

                    <div className="lab-message-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to Load Lab Reports
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        className="lab-retry-button"
                        onClick={loadReports}
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                reports.length === 0 && (
                    <div className="lab-report-message lab-empty-message">

                        <div className="lab-empty-icon">
                            🧪
                        </div>

                        <h2>
                            No Lab Reports Available
                        </h2>

                        <p>
                            Your laboratory test reports will
                            appear here after your tests are
                            completed.
                        </p>

                        <button
                            className="lab-dashboard-button"
                            onClick={() => navigate("/patient")}
                        >
                            Go to Dashboard
                        </button>

                    </div>
                )}

            {/* Reports */}
            {!loading &&
                !error &&
                reports.length > 0 && (

                    <div className="lab-reports-list">

                        {reports.map((report) => (

                            <div
                                className="lab-report-card"
                                key={report.id}
                            >

                                {/* Report Header */}
                                <div className="lab-report-card-header">

                                    <div>
                                        <h2>
                                            Lab Report #{report.id}
                                        </h2>

                                        <p>
                                            {
                                                report.reportDate ||
                                                report.testDate ||
                                                report.date ||
                                                "Date not available"
                                            }
                                        </p>
                                    </div>

                                    <span
                                        className={`lab-report-status ${getStatusClass(
                                            report.status
                                        )}`}
                                    >
                                        {report.status || "UNKNOWN"}
                                    </span>

                                </div>

                                {/* Report Details */}
                                <div className="lab-report-details">

                                    <div className="lab-detail-item">

                                        <span>
                                            Test
                                        </span>

                                        <strong>
                                            {
                                                report.testName ||
                                                report.labTestName ||
                                                report.test?.name ||
                                                "Not available"
                                            }
                                        </strong>

                                    </div>

                                    <div className="lab-detail-item">

                                        <span>
                                            Patient
                                        </span>

                                        <strong>
                                            {
                                                report.patientName ||
                                                "My Report"
                                            }
                                        </strong>

                                    </div>

                                    <div className="lab-detail-item">

                                        <span>
                                            Doctor
                                        </span>

                                        <strong>
                                            {
                                                report.doctorName ||
                                                report.doctor?.name ||
                                                "Not available"
                                            }
                                        </strong>

                                    </div>

                                </div>

                                {/* Results */}
                                {(report.result ||
                                    report.results ||
                                    report.findings) && (

                                    <div className="lab-results-section">

                                        <h3>
                                            Test Results
                                        </h3>

                                        <div className="lab-result-box">

                                            <p>
                                                {
                                                    report.result ||
                                                    report.results ||
                                                    report.findings
                                                }
                                            </p>

                                        </div>

                                    </div>
                                )}

                                {/* Normal Range */}
                                {report.normalRange && (

                                    <div className="lab-normal-range">

                                        <span>
                                            Normal Range
                                        </span>

                                        <strong>
                                            {report.normalRange}
                                        </strong>

                                    </div>
                                )}

                                {/* Remarks */}
                                {report.remarks && (

                                    <div className="lab-remarks">

                                        <h3>
                                            Remarks
                                        </h3>

                                        <p>
                                            {report.remarks}
                                        </p>

                                    </div>
                                )}

                                {/* Doctor Notes */}
                                {report.notes && (

                                    <div className="lab-notes">

                                        <h3>
                                            Doctor's Notes
                                        </h3>

                                        <p>
                                            {report.notes}
                                        </p>

                                    </div>
                                )}

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
}

export default PatientLabReports;