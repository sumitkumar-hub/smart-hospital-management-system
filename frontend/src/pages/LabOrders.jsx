import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/LabOrders.css";

function LabOrders() {

    const [orders, setOrders] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [labTests, setLabTests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        labTestId: "",
        remarks: ""
    });

    // =========================
    // FETCH DATA
    // =========================

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await api.get("/lab-orders");

            setOrders(response.data);
            setError("");

        } catch (err) {
            console.error(err);
            setError("Failed to load lab orders.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get("/patients");
            setPatients(response.data);
        } catch (err) {
            console.error("Failed to load patients", err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/doctors");
            setDoctors(response.data);
        } catch (err) {
            console.error("Failed to load doctors", err);
        }
    };

    const fetchLabTests = async () => {
        try {
            const response = await api.get("/lab-tests");
            setLabTests(response.data);
        } catch (err) {
            console.error("Failed to load lab tests", err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchPatients();
        fetchDoctors();
        fetchLabTests();
    }, []);

    // =========================
    // FORM HANDLING
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // =========================
    // OPEN ADD MODAL
    // =========================

    const handleAdd = () => {

        setEditingOrder(null);

        setFormData({
            patientId: "",
            doctorId: "",
            labTestId: "",
            remarks: ""
        });

        setShowModal(true);
    };

    // =========================
    // OPEN EDIT MODAL
    // =========================

    const handleEdit = (order) => {

        setEditingOrder(order);

        setFormData({
            patientId: order.patientId,
            doctorId: order.doctorId,
            labTestId: order.labTestId,
            remarks: order.remarks || ""
        });

        setShowModal(true);
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const requestData = {
                patientId: Number(formData.patientId),
                doctorId: Number(formData.doctorId),
                labTestId: Number(formData.labTestId),
                remarks: formData.remarks
            };

            if (editingOrder) {

                await api.put(
                    `/lab-orders/${editingOrder.id}`,
                    requestData
                );

            } else {

                await api.post(
                    "/lab-orders",
                    requestData
                );
            }

            setShowModal(false);

            fetchOrders();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to save lab order."
            );
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this lab order?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/lab-orders/${id}`);

            fetchOrders();

        } catch (err) {

            console.error(err);

            alert("Failed to delete lab order.");
        }
    };

    // =========================
    // STATUS BADGE
    // =========================

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "status-pending";

            case "IN_PROGRESS":
                return "status-progress";

            case "COMPLETED":
                return "status-completed";

            case "CANCELLED":
                return "status-cancelled";

            default:
                return "";
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="lab-orders-page">
                <h1>Lab Orders</h1>
                <p className="loading-text">
                    Loading lab orders...
                </p>
            </div>
        );
    }

    return (
        <div className="lab-orders-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="lab-orders-header">

                <div>
                    <h1>Lab Orders</h1>

                    <p>
                        Manage laboratory test orders
                    </p>
                </div>

                <button
                    className="add-order-btn"
                    onClick={handleAdd}
                >
                    + Add Lab Order
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

            <div className="lab-orders-summary">

                <div className="summary-card">
                    <h3>Total Orders</h3>
                    <strong>
                        {orders.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <h3>Pending</h3>
                    <strong>
                        {
                            orders.filter(
                                order => order.status === "PENDING"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <h3>In Progress</h3>
                    <strong>
                        {
                            orders.filter(
                                order => order.status === "IN_PROGRESS"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <h3>Completed</h3>
                    <strong>
                        {
                            orders.filter(
                                order => order.status === "COMPLETED"
                            ).length
                        }
                    </strong>
                </div>

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="lab-orders-table-container">

                <table className="lab-orders-table">

                    <thead>
                    <tr>

                        <th>ID</th>

                        <th>Patient</th>

                        <th>Doctor</th>

                        <th>Lab Test</th>

                        <th>Price</th>

                        <th>Order Date</th>

                        <th>Status</th>

                        <th>Remarks</th>

                        <th>Actions</th>

                    </tr>
                    </thead>

                    <tbody>

                    {orders.length === 0 ? (

                        <tr>
                            <td
                                colSpan="9"
                                className="no-data"
                            >
                                No lab orders found.
                            </td>
                        </tr>

                    ) : (

                        orders.map((order) => (

                            <tr key={order.id}>

                                <td>
                                    #{order.id}
                                </td>

                                <td>
                                    {order.patientName}
                                </td>

                                <td>
                                    {order.doctorName}
                                </td>

                                <td>
                                    {order.testName}
                                </td>

                                <td>
                                    ₹{order.price}
                                </td>

                                <td>
                                    {order.orderDate}
                                </td>

                                <td>
                                        <span
                                            className={`status-badge ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                </td>

                                <td>
                                    {order.remarks || "-"}
                                </td>

                                <td className="action-buttons">

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(order)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(order.id)
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
                MODAL
            ========================= */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="lab-order-modal">

                        <div className="modal-header">

                            <h2>
                                {editingOrder
                                    ? "Edit Lab Order"
                                    : "Add Lab Order"}
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

                            {/* Patient */}

                            <div className="form-group">

                                <label>
                                    Patient
                                </label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Patient
                                    </option>

                                    {patients.map((patient) => (

                                        <option
                                            key={patient.id}
                                            value={patient.id}
                                        >
                                            {patient.firstName}{" "}
                                            {patient.lastName}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Doctor */}

                            <div className="form-group">

                                <label>
                                    Doctor
                                </label>

                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map((doctor) => (

                                        <option
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            {doctor.firstName}{" "}
                                            {doctor.lastName}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Lab Test */}

                            <div className="form-group">

                                <label>
                                    Lab Test
                                </label>

                                <select
                                    name="labTestId"
                                    value={formData.labTestId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Lab Test
                                    </option>

                                    {labTests.map((test) => (

                                        <option
                                            key={test.id}
                                            value={test.id}
                                        >
                                            {test.testName} - ₹{test.price}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Remarks */}

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


                            {/* Buttons */}

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
                                    {editingOrder
                                        ? "Update Order"
                                        : "Create Order"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default LabOrders;