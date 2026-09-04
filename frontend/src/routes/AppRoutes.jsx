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
import LabTests from "../pages/LabTests";
import LabOrders from "../pages/LabOrders";

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

                {/* PUBLIC ROUTES */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<h1>Register Page</h1>}
                />


                {/* ADMIN ROUTES */}

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

                </Route>


                {/* ROLE DASHBOARDS */}

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
                    path="/pharmacist"
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["PHARMACIST"]}>
                                <PharmacistDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

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


                {/* DEFAULT ROUTES */}

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