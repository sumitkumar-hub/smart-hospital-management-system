import AdminLayout from "../layouts/AdminLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ================= PUBLIC =================
import Login from "../pages/Login";
import Register from "../pages/Register";

// ================= ADMIN =================
import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import MedicalRecords from "../pages/MedicalRecords";
import Prescriptions from "../pages/Prescriptions";
import PharmacyInventory from "../pages/PharmacyInventory";
import Billing from "../pages/Billing";

import LabTests from "../pages/LabTests";
import LabOrders from "../pages/LabOrders";
import LabReports from "../pages/LabReports";
import AdminDashboard from "../pages/AdminDashboard";

// ================= DOCTOR =================
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorAppointments from "../pages/DoctorAppointments";
import DoctorPatients from "../pages/DoctorPatients";
import DoctorMedicalRecords from "../pages/DoctorMedicalRecords";
import DoctorPrescriptions from "../pages/DoctorPrescriptions";

// ================= PATIENT =================
import PatientDashboard from "../pages/PatientDashboard";
import PatientAppointments from "../pages/PatientAppointments";
import PatientMedicalRecords from "../pages/PatientMedicalRecords";
import PatientPrescriptions from "../pages/PatientPrescriptions";
import PatientLabReports from "../pages/PatientLabReports";

// ================= RECEPTIONIST =================
import ReceptionistDashboard from "../pages/ReceptionistDashboard";
import ReceptionistPatients from "../pages/ReceptionistPatients";
import ReceptionistBilling from "../pages/ReceptionistBilling";

// ================= OTHER ROLES =================
import PharmacistDashboard from "../pages/PharmacistDashboard";
import LaboratoryDashboard from "../pages/LaboratoryDashboard";

// ================= ROUTE SECURITY =================
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";


function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    PUBLIC ROUTES
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================================================
                    ADMIN ROUTES
                ================================================== */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                                <AdminLayout />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="patients"
                        element={<Patients />}
                    />

                    <Route
                        path="doctors"
                        element={<Doctors />}
                    />

                    <Route
                        path="appointments"
                        element={<Appointments />}
                    />

                    <Route
                        path="medical-records"
                        element={<MedicalRecords />}
                    />

                    <Route
                        path="prescriptions"
                        element={<Prescriptions />}
                    />

                    <Route
                        path="pharmacy-inventory"
                        element={<PharmacyInventory />}
                    />

                    <Route
                        path="billing"
                        element={<Billing />}
                    />

                    <Route
                        path="lab-tests"
                        element={<LabTests />}
                    />

                    <Route
                        path="lab-orders"
                        element={<LabOrders />}
                    />

                    <Route
                        path="lab-reports"
                        element={<LabReports />}
                    />
                </Route>


                {/* ==================================================
                    DOCTOR ROUTES
                ================================================== */}

                <Route
                    path="/doctor"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["DOCTOR"]}>
                                <DoctorDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/appointments"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["DOCTOR"]}>
                                <DoctorAppointments />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/patients"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["DOCTOR"]}>
                                <DoctorPatients />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/medical-records"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["DOCTOR"]}>
                                <DoctorMedicalRecords />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/prescriptions"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["DOCTOR"]}>
                                <DoctorPrescriptions />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    PATIENT ROUTES
                ================================================== */}

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PATIENT"]}>
                                <PatientDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/appointments"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PATIENT"]}>
                                <PatientAppointments />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/medical-records"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PATIENT"]}>
                                <PatientMedicalRecords />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/prescriptions"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PATIENT"]}>
                                <PatientPrescriptions />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/lab-reports"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PATIENT"]}>
                                <PatientLabReports />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    RECEPTIONIST ROUTES
                ================================================== */}

                <Route
                    path="/receptionist"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["RECEPTIONIST"]}>
                                <ReceptionistDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/receptionist/patients"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["RECEPTIONIST"]}>
                                <ReceptionistPatients />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/receptionist/billing"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["RECEPTIONIST"]}>
                                <ReceptionistBilling />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    PHARMACIST ROUTES
                ================================================== */}

                <Route
                    path="/pharmacist"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PHARMACIST"]}>
                                <PharmacistDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    LABORATORY ROUTES
                ================================================== */}

                <Route
                    path="/laboratory"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["LABORATORY"]}>
                                <LaboratoryDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    DEFAULT ROUTES
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;