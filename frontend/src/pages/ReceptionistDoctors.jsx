import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/ReceptionistDoctors.css";

function ReceptionistDoctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/doctors");

            const data =
                response.data?.data ||
                response.data ||
                [];

            setDoctors(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Error fetching doctors:",
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
                "Failed to load doctor information."
            );
        } finally {
            setLoading(false);
        }
    };

    const getDoctorName = (doctor) => {
        if (doctor.name) {
            return doctor.name;
        }

        const fullName =
            `${doctor.firstName || ""} ${
                doctor.lastName || ""
            }`.trim();

        return fullName
            ? `Dr. ${fullName}`
            : `Doctor #${doctor.id || "-"}`;
    };

    const filteredDoctors = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        return doctors.filter((doctor) => {
            const doctorName =
                getDoctorName(doctor).toLowerCase();

            const specialization =
                doctor.specialization
                    ?.toLowerCase() || "";

            const qualification =
                doctor.qualification
                    ?.toLowerCase() || "";

            const email =
                doctor.email
                    ?.toLowerCase() || "";

            const matchesSearch =
                !query ||
                doctorName.includes(query) ||
                specialization.includes(query) ||
                qualification.includes(query) ||
                email.includes(query);

            const isAvailable =
                doctor.available === true ||
                doctor.isAvailable === true;

            const matchesAvailability =
                !availableOnly ||
                isAvailable;

            return (
                matchesSearch &&
                matchesAvailability
            );
        });
    }, [
        doctors,
        search,
        availableOnly,
    ]);

    const availableDoctors = doctors.filter(
        (doctor) =>
            doctor.available === true ||
            doctor.isAvailable === true
    ).length;

    return (
        <div className="receptionist-doctors-page">

            {/* ================= HEADER ================= */}

            <header className="receptionist-doctors-header">

                <div className="receptionist-doctors-header-left">

                    <button
                        className="receptionist-doctors-back"
                        onClick={() =>
                            navigate("/receptionist")
                        }
                        title="Back to dashboard"
                    >
                        ←
                    </button>

                    <div>
                        <h1>
                            Doctor Information
                        </h1>

                        <p>
                            View available doctors and
                            their professional details.
                        </p>
                    </div>

                </div>

                <button
                    className="receptionist-doctors-refresh"
                    onClick={fetchDoctors}
                >
                    ↻ Refresh
                </button>

            </header>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="receptionist-doctors-error">

                    <span>⚠</span>

                    <p>{error}</p>

                </div>
            )}

            {/* ================= SUMMARY ================= */}

            <section className="receptionist-doctors-summary">

                <div className="receptionist-doctors-summary-card">

                    <div className="doctor-summary-icon">
                        👨‍⚕️
                    </div>

                    <div>
                        <span>
                            Total Doctors
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : doctors.length}
                        </strong>
                    </div>

                </div>

                <div className="receptionist-doctors-summary-card">

                    <div className="doctor-summary-icon available">
                        ✓
                    </div>

                    <div>
                        <span>
                            Available Doctors
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : availableDoctors}
                        </strong>
                    </div>

                </div>

                <div className="receptionist-doctors-summary-card">

                    <div className="doctor-summary-icon showing">
                        #
                    </div>

                    <div>
                        <span>
                            Doctors Showing
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : filteredDoctors.length}
                        </strong>
                    </div>

                </div>

            </section>

            {/* ================= DOCTORS SECTION ================= */}

            <section className="receptionist-doctors-section">

                <div className="receptionist-doctors-toolbar">

                    <div>
                        <h2>
                            Doctors
                        </h2>

                        <p>
                            Search and view doctor
                            information.
                        </p>
                    </div>

                    <div className="receptionist-doctors-filters">

                        <div className="doctor-search-wrapper">

                            <span className="doctor-search-icon">
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <label className="available-filter">

                            <input
                                type="checkbox"
                                checked={
                                    availableOnly
                                }
                                onChange={(e) =>
                                    setAvailableOnly(
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                Available only
                            </span>

                        </label>

                    </div>

                </div>

                {/* ================= LOADING ================= */}

                {loading ? (
                    <div className="receptionist-doctors-empty">

                        <div className="doctor-loading-spinner"></div>

                        <p>
                            Loading doctors...
                        </p>

                    </div>
                ) : filteredDoctors.length === 0 ? (

                    /* ================= EMPTY ================= */

                    <div className="receptionist-doctors-empty">

                        <div className="doctor-empty-icon">
                            👨‍⚕️
                        </div>

                        <h3>
                            No doctors found
                        </h3>

                        <p>
                            Try changing your search
                            or availability filter.
                        </p>

                    </div>

                ) : (

                    /* ================= TABLE ================= */

                    <div className="receptionist-doctors-table-wrapper">

                        <table className="receptionist-doctors-table">

                            <thead>

                            <tr>

                                <th>
                                    Doctor
                                </th>

                                <th>
                                    Specialization
                                </th>

                                <th>
                                    Qualification
                                </th>

                                <th>
                                    Experience
                                </th>

                                <th>
                                    Consultation Fee
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {filteredDoctors.map(
                                (doctor) => {

                                    const isAvailable =
                                        doctor.available ===
                                        true ||
                                        doctor.isAvailable ===
                                        true;

                                    return (
                                        <tr
                                            key={
                                                doctor.id
                                            }
                                        >

                                            {/* Doctor */}

                                            <td>

                                                <div className="receptionist-doctor-name">

                                                    <div className="receptionist-doctor-avatar">

                                                        {(
                                                            doctor.firstName ||
                                                            doctor.name ||
                                                            "D"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {getDoctorName(
                                                                doctor
                                                            )}
                                                        </strong>

                                                        <span>
                                                                {doctor.email ||
                                                                    "Email not available"}
                                                            </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Specialization */}

                                            <td>
                                                {doctor.specialization ||
                                                    "—"}
                                            </td>

                                            {/* Qualification */}

                                            <td>
                                                {doctor.qualification ||
                                                    "—"}
                                            </td>

                                            {/* Experience */}

                                            <td>

                                                {doctor.experience !=
                                                null
                                                    ? `${doctor.experience} years`
                                                    : "—"}

                                            </td>

                                            {/* Consultation Fee */}

                                            <td>

                                                {doctor.consultationFee !=
                                                null
                                                    ? `₹${doctor.consultationFee}`
                                                    : "—"}

                                            </td>

                                            {/* Status */}

                                            <td>

                                                    <span
                                                        className={
                                                            isAvailable
                                                                ? "receptionist-doctor-status available"
                                                                : "receptionist-doctor-status unavailable"
                                                        }
                                                    >
                                                        {isAvailable
                                                            ? "Available"
                                                            : "Unavailable"}
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

            </section>

        </div>
    );
}

export default ReceptionistDoctors;