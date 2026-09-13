import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/PatientPrescriptions.css";

function PatientPrescriptions() {
    const navigate = useNavigate();

    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            setError("");

            const user = JSON.parse(localStorage.getItem("user") || "{}");

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
                `/prescriptions/patient/${patientId}`
            );

            setPrescriptions(response.data?.data || response.data || []);
        } catch (err) {
            console.error("Error loading prescriptions:", err);

            if (err.response?.status === 404) {
                setPrescriptions([]);
            } else {
                setError("Unable to load prescriptions.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "status-default";

        switch (status.toUpperCase()) {
            case "ACTIVE":
                return "status-active";
            case "COMPLETED":
                return "status-completed";
            case "CANCELLED":
                return "status-cancelled";
            case "PENDING":
                return "status-pending";
            default:
                return "status-default";
        }
    };

    return (
        <div className="patient-prescriptions-page">

            <div className="prescriptions-header">
                <div>
                    <h1>My Prescriptions</h1>
                    <p>
                        View your prescribed medicines and prescription details.
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/patient")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="prescription-summary">

                <div className="summary-card">
                    <div className="summary-icon">💊</div>
                    <div>
                        <h3>{prescriptions.length}</h3>
                        <p>Total Prescriptions</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">✓</div>
                    <div>
                        <h3>
                            {
                                prescriptions.filter(
                                    (item) =>
                                        item.status?.toUpperCase() === "ACTIVE"
                                ).length
                            }
                        </h3>
                        <p>Active Prescriptions</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">📋</div>
                    <div>
                        <h3>
                            {
                                prescriptions.filter(
                                    (item) =>
                                        item.status?.toUpperCase() === "COMPLETED"
                                ).length
                            }
                        </h3>
                        <p>Completed</p>
                    </div>
                </div>

            </div>

            {loading && (
                <div className="prescription-message">
                    <div className="loading-spinner"></div>
                    <p>Loading prescriptions...</p>
                </div>
            )}

            {!loading && error && (
                <div className="prescription-message error-message">
                    <div className="message-icon">⚠️</div>
                    <h3>Unable to Load Prescriptions</h3>
                    <p>{error}</p>

                    <button
                        className="retry-button"
                        onClick={loadPrescriptions}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && prescriptions.length === 0 && (
                <div className="prescription-message empty-message">
                    <div className="empty-icon">💊</div>

                    <h2>No Prescriptions Available</h2>

                    <p>
                        You don't have any prescriptions at the moment.
                        Prescriptions issued by your doctor will appear here.
                    </p>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/patient")}
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

            {!loading && !error && prescriptions.length > 0 && (
                <div className="prescriptions-list">

                    {prescriptions.map((prescription) => (
                        <div
                            className="prescription-card"
                            key={prescription.id}
                        >

                            <div className="prescription-card-header">
                                <div>
                                    <h2>
                                        Prescription #{prescription.id}
                                    </h2>

                                    <p>
                                        {prescription.prescriptionDate ||
                                            prescription.date ||
                                            "Date not available"}
                                    </p>
                                </div>

                                <span
                                    className={`prescription-status ${getStatusClass(
                                        prescription.status
                                    )}`}
                                >
                                    {prescription.status || "UNKNOWN"}
                                </span>
                            </div>

                            <div className="prescription-details">

                                <div className="detail-item">
                                    <span>Doctor</span>
                                    <strong>
                                        {prescription.doctorName ||
                                            prescription.doctor?.name ||
                                            "Not available"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Diagnosis</span>
                                    <strong>
                                        {prescription.diagnosis ||
                                            "Not available"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Instructions</span>
                                    <strong>
                                        {prescription.instructions ||
                                            "Follow doctor's instructions"}
                                    </strong>
                                </div>

                            </div>

                            {prescription.medicines &&
                                prescription.medicines.length > 0 && (
                                    <div className="medicines-section">

                                        <h3>Prescribed Medicines</h3>

                                        <div className="medicine-table">

                                            <div className="medicine-table-header">
                                                <span>Medicine</span>
                                                <span>Dosage</span>
                                                <span>Frequency</span>
                                                <span>Duration</span>
                                            </div>

                                            {prescription.medicines.map(
                                                (medicine, index) => (
                                                    <div
                                                        className="medicine-row"
                                                        key={
                                                            medicine.id ||
                                                            index
                                                        }
                                                    >
                                                        <span>
                                                            {medicine.medicineName ||
                                                                medicine.name ||
                                                                "Medicine"}
                                                        </span>

                                                        <span>
                                                            {medicine.dosage ||
                                                                "—"}
                                                        </span>

                                                        <span>
                                                            {medicine.frequency ||
                                                                "—"}
                                                        </span>

                                                        <span>
                                                            {medicine.duration ||
                                                                "—"}
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                            {prescription.notes && (
                                <div className="prescription-notes">
                                    <h3>Doctor's Notes</h3>
                                    <p>{prescription.notes}</p>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default PatientPrescriptions;