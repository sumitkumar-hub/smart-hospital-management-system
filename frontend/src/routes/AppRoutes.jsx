import AdminLayout from "../layouts/AdminLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";

import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import MedicalRecords from "../pages/MedicalRecords";
import Prescriptions from "../pages/Prescriptions";
import PharmacyInventory from "../pages/PharmacyInventory";
import Billing from "../pages/Billing";

import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";
import ReceptionistDashboard from "../pages/ReceptionistDashboard";
import PharmacistDashboard from "../pages/PharmacistDashboard";
import LaboratoryDashboard from "../pages/LaboratoryDashboard";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<h1>Register Page</h1>}
                />


                {/* =========================
                    ADMIN ROUTES
                ========================= */}

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

                    {/* =========================
                        ADMIN DASHBOARD
                    ========================= */}

                    <Route
                        index
                        element={<AdminDashboard />}
                    />


                    {/* =========================
                        PATIENT MANAGEMENT
                    ========================= */}

                    <Route
                        path="patients"
                        element={<Patients />}
                    />


                    {/* =========================
                        DOCTOR MANAGEMENT
                    ========================= */}

                    <Route
                        path="doctors"
                        element={<Doctors />}
                    />


                    {/* =========================
                        APPOINTMENT MANAGEMENT
                    ========================= */}

                    <Route
                        path="appointments"
                        element={<Appointments />}
                    />


                    {/* =========================
                        MEDICAL RECORDS
                    ========================= */}

                    <Route
                        path="medical-records"
                        element={<MedicalRecords />}
                    />


                    {/* =========================
                        PRESCRIPTION MANAGEMENT
                    ========================= */}

                    <Route
                        path="prescriptions"
                        element={<Prescriptions />}
                    />


                    {/* =========================
                        PHARMACY INVENTORY
                    ========================= */}

                    <Route
                        path="pharmacy-inventory"
                        element={<PharmacyInventory />}
                    />


                    {/* =========================
                        BILLING MANAGEMENT
                    ========================= */}

                    <Route
                        path="billing"
                        element={<Billing />}
                    />

                </Route>


                {/* =========================
                    DOCTOR DASHBOARD
                ========================= */}

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


                {/* =========================
                    PATIENT DASHBOARD
                ========================= */}

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


                {/* =========================
                    RECEPTIONIST DASHBOARD
                ========================= */}

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


                {/* =========================
                    PHARMACIST DASHBOARD
                ========================= */}

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


                {/* =========================
                    LABORATORY DASHBOARD
                ========================= */}

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


                {/* =========================
                    DEFAULT ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;