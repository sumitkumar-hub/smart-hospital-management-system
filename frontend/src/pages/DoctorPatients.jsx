import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/DoctorPatients.css";

const DoctorPatients = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const getDoctorId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const loginResponse = JSON.parse(
                localStorage.getItem("loginResponse")
            );

            return (
                user?.doctorId ||
                loginResponse?.doctorId ||
                loginResponse?.data?.doctorId ||
                null
            );
        } catch (error) {
            console.error("Error reading doctor information:", error);
            return null;
        }
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const doctorId = getDoctorId();

            if (!doctorId) {
                setError(
                    "Doctor information not found. Please login again."
                );
                setLoading(false);
                return;
            }

            // Get appointments belonging to this doctor
            const appointmentResponse = await api.get(
                `/appointments/doctor/${doctorId}`
            );

            const appointmentData =
                appointmentResponse.data?.data ??
                appointmentResponse.data ??
                [];

            const appointments = Array.isArray(appointmentData)
                ? appointmentData
                : [];

            // Get unique patient IDs from appointments
            const patientIds = [
                ...new Set(
                    appointments
                        .map((appointment) => appointment.patientId)
                        .filter((id) => id !== null && id !== undefined)
                ),
            ];

            // Fetch patient details
            const patientResults = await Promise.all(
                patientIds.map(async (patientId) => {
                    try {
                        const response = await api.get(
                            `/patients/${patientId}`
                        );

                        return (
                            response.data?.data ??
                            response.data ??
                            null
                        );
                    } catch (err) {
                        console.error(
                            `Error fetching patient ${patientId}:`,
                            err
                        );

                        return null;
                    }
                })
            );

            const validPatients = patientResults.filter(
                (patient) => patient !== null
            );

            setPatients(validPatients);
        } catch (err) {
            console.error("Error fetching doctor patients:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("loginResponse");

                navigate("/login");
            } else if (err.response?.status === 404) {
                setPatients([]);
            } else {
                setError(
                    err.response?.data?.message ||
                    "Failed to load patients."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const getPatientName = (patient) => {
        return `${patient.firstName || ""} ${
            patient.lastName || ""
        }`.trim() || "Unknown Patient";
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const formattedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(formattedDate.getTime())) {
            return date;
        }

        return formattedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredPatients = patients.filter((patient) => {
        const name = getPatientName(patient).toLowerCase();
        const email = (patient.email || "").toLowerCase();
        const phone = (patient.phone || "").toLowerCase();
        const patientId = String(patient.id || "").toLowerCase();

        const searchValue = search.toLowerCase().trim();

        return (
            name.includes(searchValue) ||
            email.includes(searchValue) ||
            phone.includes(searchValue) ||
            patientId.includes(searchValue)
        );
    });

    if (loading) {
        return (
            <div className="doctor-patients-page">
                <div className="doctor-patients-loading">
                    <div className="doctor-patients-spinner"></div>
                    <p>Loading patients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-patients-page">

            {/* ================= HEADER ================= */}

            <header className="doctor-patients-header">

                <div className="doctor-patients-header-left">

                    <button
                        className="doctor-patients-back-button"
                        onClick={() => navigate("/doctor")}
                    >
                        ←
                    </button>

                    <div>
                        <h1>My Patients</h1>
                        <p>
                            Patients associated with your appointments
                        </p>
                    </div>

                </div>

                <button
                    className="doctor-patients-refresh-button"
                    onClick={fetchPatients}
                >
                    ↻ Refresh
                </button>

            </header>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="doctor-patients-error">
                    <span>⚠</span>
                    <p>{error}</p>
                </div>
            )}


            {/* ================= SUMMARY ================= */}

            <section className="doctor-patients-summary">

                <div className="doctor-patients-summary-card">

                    <div className="doctor-patients-summary-icon">
                        👥
                    </div>

                    <div>
                        <span>Total Patients</span>
                        <strong>{patients.length}</strong>
                    </div>

                </div>

                <div className="doctor-patients-summary-card">

                    <div className="doctor-patients-summary-icon active">
                        ✓
                    </div>

                    <div>
                        <span>Active Patients</span>
                        <strong>
                            {
                                patients.filter(
                                    (patient) => patient.active === true
                                ).length
                            }
                        </strong>
                    </div>

                </div>

                <div className="doctor-patients-summary-card">

                    <div className="doctor-patients-summary-icon blood">
                        🩸
                    </div>

                    <div>
                        <span>Patients With Blood Group</span>
                        <strong>
                            {
                                patients.filter(
                                    (patient) =>
                                        patient.bloodGroup &&
                                        patient.bloodGroup.trim() !== ""
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </section>


            {/* ================= PATIENT SECTION ================= */}

            <section className="doctor-patients-section">

                <div className="doctor-patients-section-header">

                    <div>
                        <h2>Patient List</h2>
                        <p>
                            View information about your patients
                        </p>
                    </div>

                    <div className="doctor-patients-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= EMPTY ================= */}

                {filteredPatients.length === 0 ? (
                    <div className="doctor-patients-empty">

                        <div className="doctor-patients-empty-icon">
                            👥
                        </div>

                        <h3>
                            {search
                                ? "No patients found"
                                : "No patients yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try searching with a different name, phone number, email, or patient ID."
                                : "Patients who have appointments with you will appear here."}
                        </p>

                    </div>
                ) : (

                    /* ================= PATIENT CARDS ================= */

                    <div className="doctor-patients-grid">

                        {filteredPatients.map((patient) => (

                            <div
                                className="doctor-patient-card"
                                key={patient.id}
                            >

                                {/* Patient Header */}

                                <div className="doctor-patient-card-header">

                                    <div className="doctor-patient-avatar">
                                        {patient.firstName
                                            ?.charAt(0)
                                            ?.toUpperCase() || "P"}
                                    </div>

                                    <div className="doctor-patient-name">

                                        <h3>
                                            {getPatientName(patient)}
                                        </h3>

                                        <p>
                                            Patient ID:{" "}
                                            {patient.id || "—"}
                                        </p>

                                    </div>

                                    <span
                                        className={`doctor-patient-active-status ${
                                            patient.active
                                                ? "active"
                                                : "inactive"
                                        }`}
                                    >
                                        {patient.active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>


                                {/* Patient Information */}

                                <div className="doctor-patient-info">

                                    <div className="doctor-patient-info-item">

                                        <span>📅 Date of Birth</span>

                                        <strong>
                                            {formatDate(
                                                patient.dateOfBirth
                                            )}
                                        </strong>

                                    </div>


                                    <div className="doctor-patient-info-item">

                                        <span>⚥ Gender</span>

                                        <strong>
                                            {patient.gender || "—"}
                                        </strong>

                                    </div>


                                    <div className="doctor-patient-info-item">

                                        <span>🩸 Blood Group</span>

                                        <strong>
                                            {patient.bloodGroup || "—"}
                                        </strong>

                                    </div>


                                    <div className="doctor-patient-info-item">

                                        <span>📞 Phone</span>

                                        <strong>
                                            {patient.phone || "—"}
                                        </strong>

                                    </div>


                                    <div className="doctor-patient-info-item full">

                                        <span>✉ Email</span>

                                        <strong>
                                            {patient.email || "—"}
                                        </strong>

                                    </div>


                                    <div className="doctor-patient-info-item full">

                                        <span>📍 Address</span>

                                        <strong>
                                            {patient.address || "—"}
                                        </strong>

                                    </div>

                                </div>


                                {/* Emergency Contact */}

                                <div className="doctor-patient-emergency">

                                    <h4>
                                        Emergency Contact
                                    </h4>

                                    <div>

                                        <span>
                                            {
                                                patient.emergencyContactName ||
                                                "—"
                                            }
                                        </span>

                                        <span>
                                            📞{" "}
                                            {
                                                patient.emergencyContactPhone ||
                                                "—"
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
};

export default DoctorPatients;