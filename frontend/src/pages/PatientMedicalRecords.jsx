import { useNavigate } from "react-router-dom";
import "../Styles/PatientMedicalRecords.css";

function PatientMedicalRecords() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Patient";

    return (
        <div className="patient-medical-records">

            {/* ================= HEADER ================= */}

            <header className="medical-records-header">

                <div>
                    <h1>Medical Records</h1>
                    <p>
                        View your medical history and health information.
                    </p>
                </div>

                <button
                    className="medical-records-back-button"
                    onClick={() => navigate("/patient")}
                >
                    ← Dashboard
                </button>

            </header>


            {/* ================= PATIENT INFO ================= */}

            <section className="patient-record-profile">

                <div className="record-profile-avatar">
                    {user.firstName
                        ? user.firstName.charAt(0).toUpperCase()
                        : "P"}
                </div>

                <div className="record-profile-details">
                    <h2>{fullName}</h2>
                    <p>{user.email || "Patient"}</p>
                </div>

            </section>


            {/* ================= SUMMARY ================= */}

            <section className="medical-record-summary">

                <div className="record-summary-card">
                    <div className="record-summary-icon">🩺</div>

                    <div>
                        <span>Total Records</span>
                        <strong>0</strong>
                    </div>
                </div>


                <div className="record-summary-card">
                    <div className="record-summary-icon">📋</div>

                    <div>
                        <span>Recent Visits</span>
                        <strong>0</strong>
                    </div>
                </div>


                <div className="record-summary-card">
                    <div className="record-summary-icon">💊</div>

                    <div>
                        <span>Diagnoses</span>
                        <strong>0</strong>
                    </div>
                </div>


                <div className="record-summary-card">
                    <div className="record-summary-icon">📅</div>

                    <div>
                        <span>Last Visit</span>
                        <strong>—</strong>
                    </div>
                </div>

            </section>


            {/* ================= MEDICAL RECORDS ================= */}

            <section className="medical-records-card">

                <div className="medical-records-card-header">

                    <div>
                        <h2>My Medical Records</h2>
                        <p>
                            Your medical consultations, diagnoses and treatment
                            information.
                        </p>
                    </div>

                </div>


                <div className="medical-records-empty">

                    <div className="medical-records-empty-icon">
                        🩺
                    </div>

                    <h3>No medical records available</h3>

                    <p>
                        Your medical records will appear here after your
                        doctor adds them to your account.
                    </p>

                </div>

            </section>


            {/* ================= INFORMATION ================= */}

            <section className="medical-information-card">

                <div className="medical-records-card-header">

                    <div>
                        <h2>What will appear here?</h2>
                        <p>
                            Your medical history will contain information such
                            as:
                        </p>
                    </div>

                </div>


                <div className="medical-information-grid">

                    <div className="medical-information-item">
                        <span>🩺</span>
                        <div>
                            <h3>Doctor Visits</h3>
                            <p>
                                Details of your consultations and hospital
                                visits.
                            </p>
                        </div>
                    </div>


                    <div className="medical-information-item">
                        <span>📋</span>
                        <div>
                            <h3>Diagnosis</h3>
                            <p>
                                Diagnoses recorded by your healthcare provider.
                            </p>
                        </div>
                    </div>


                    <div className="medical-information-item">
                        <span>💊</span>
                        <div>
                            <h3>Treatment</h3>
                            <p>
                                Treatment plans and medical instructions.
                            </p>
                        </div>
                    </div>


                    <div className="medical-information-item">
                        <span>📝</span>
                        <div>
                            <h3>Doctor Notes</h3>
                            <p>
                                Additional notes and observations from your
                                doctor.
                            </p>
                        </div>
                    </div>

                </div>

            </section>


            {/* ================= BACK ================= */}

            <div className="medical-records-footer">

                <button
                    onClick={() => navigate("/patient")}
                >
                    Back to Patient Dashboard
                </button>

            </div>

        </div>
    );
}

export default PatientMedicalRecords;
