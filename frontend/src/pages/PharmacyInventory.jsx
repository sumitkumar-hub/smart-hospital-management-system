import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/PharmacyInventory.css";

function PharmacyInventory() {
    const [inventory, setInventory] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState("ALL");

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        medicineId: "",
        quantity: "",
        minimumStockLevel: "",
        batchNumber: "",
        expiryDate: "",
        receivedDate: ""
    });

    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                inventoryResponse,
                medicinesResponse
            ] = await Promise.all([
                api.get("/pharmacy-inventory"),
                api.get("/medicines")
            ]);

            setInventory(
                inventoryResponse.data?.data || []
            );

            setMedicines(
                medicinesResponse.data?.data || []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load pharmacy inventory"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            medicineId: "",
            quantity: "",
            minimumStockLevel: "",
            batchNumber: "",
            expiryDate: "",
            receivedDate: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    // =========================
    // ADD
    // =========================

    const handleAdd = () => {
        setError("");
        setSuccess("");

        setFormData({
            medicineId: "",
            quantity: "",
            minimumStockLevel: "",
            batchNumber: "",
            expiryDate: "",
            receivedDate: ""
        });

        setEditingId(null);
        setShowForm(true);
    };

    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                medicineId: Number(formData.medicineId),
                quantity: Number(formData.quantity),
                minimumStockLevel: Number(
                    formData.minimumStockLevel
                ),
                batchNumber: formData.batchNumber || null,
                expiryDate: formData.expiryDate || null,
                receivedDate: formData.receivedDate || null
            };

            if (editingId) {
                await api.put(
                    `/pharmacy-inventory/${editingId}`,
                    payload
                );

                setSuccess(
                    "Inventory updated successfully"
                );
            } else {
                await api.post(
                    "/pharmacy-inventory",
                    payload
                );

                setSuccess(
                    "Inventory added successfully"
                );
            }

            resetForm();
            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save inventory"
            );
        } finally {
            setFormLoading(false);
        }
    };

    // =========================
    // VIEW
    // =========================

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/pharmacy-inventory/${id}`
            );

            setSelectedItem(
                response.data?.data || null
            );

            setShowView(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch inventory"
            );
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = async (id) => {
        try {
            setError("");
            setSuccess("");

            const response = await api.get(
                `/pharmacy-inventory/${id}`
            );

            const item = response.data?.data;

            if (!item) {
                setError("Inventory record not found");
                return;
            }

            setFormData({
                medicineId: item.medicineId || "",
                quantity: item.quantity ?? "",
                minimumStockLevel:
                    item.minimumStockLevel ?? "",
                batchNumber: item.batchNumber || "",
                expiryDate: item.expiryDate || "",
                receivedDate: item.receivedDate || ""
            });

            setEditingId(id);
            setShowForm(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch inventory"
            );
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this inventory record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/pharmacy-inventory/${id}`
            );

            setSuccess(
                "Inventory deleted successfully"
            );

            await fetchData();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete inventory"
            );
        }
    };

    // =========================
    // FILTER
    // =========================

    const filteredInventory = inventory.filter(
        (item) => {

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                item.medicineName
                    ?.toLowerCase()
                    .includes(searchText) ||

                item.batchNumber
                    ?.toLowerCase()
                    .includes(searchText);

            let matchesStock = true;

            if (stockFilter === "LOW") {
                matchesStock = item.lowStock === true;
            }

            if (stockFilter === "EXPIRED") {
                matchesStock = item.expired === true;
            }

            if (stockFilter === "AVAILABLE") {
                matchesStock =
                    item.quantity > 0 &&
                    !item.expired;
            }

            return matchesSearch && matchesStock;
        }
    );

    // =========================
    // STATUS
    // =========================

    const getStockStatus = (item) => {
        if (item.expired) {
            return (
                <span className="stock-badge expired">
                    Expired
                </span>
            );
        }

        if (item.lowStock) {
            return (
                <span className="stock-badge low">
                    Low Stock
                </span>
            );
        }

        return (
            <span className="stock-badge available">
                Available
            </span>
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="pharmacy-page">
                <div className="loading">
                    Loading pharmacy inventory...
                </div>
            </div>
        );
    }

    return (
        <div className="pharmacy-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="pharmacy-header">

                <div>
                    <h1>Pharmacy Inventory</h1>

                    <p>
                        Manage medicines, stock levels and expiry dates
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleAdd}
                >
                    + Add Inventory
                </button>

            </div>

            {/* =========================
                ALERTS
            ========================= */}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="inventory-summary">

                <div className="summary-card">
                    <span>Total Items</span>
                    <strong>
                        {inventory.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Low Stock</span>
                    <strong>
                        {
                            inventory.filter(
                                (item) => item.lowStock
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Expired</span>
                    <strong>
                        {
                            inventory.filter(
                                (item) => item.expired
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Total Quantity</span>
                    <strong>
                        {
                            inventory.reduce(
                                (total, item) =>
                                    total +
                                    (item.quantity || 0),
                                0
                            )
                        }
                    </strong>
                </div>

            </div>

            {/* =========================
                FILTERS
            ========================= */}

            <div className="filters-container">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search medicine or batch..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="filter-select"
                    value={stockFilter}
                    onChange={(e) =>
                        setStockFilter(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Inventory
                    </option>

                    <option value="AVAILABLE">
                        Available
                    </option>

                    <option value="LOW">
                        Low Stock
                    </option>

                    <option value="EXPIRED">
                        Expired
                    </option>
                </select>

            </div>

            {/* =========================
                TABLE
            ========================= */}

            <div className="table-container">

                {filteredInventory.length === 0 ? (

                    <div className="empty-state">
                        No inventory records found.
                    </div>

                ) : (

                    <table className="inventory-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Medicine</th>
                            <th>Quantity</th>
                            <th>Minimum Stock</th>
                            <th>Batch Number</th>
                            <th>Expiry Date</th>
                            <th>Received Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredInventory.map(
                            (item) => (

                                <tr key={item.id}>

                                    <td>
                                        #{item.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {item.medicineName}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.quantity}
                                    </td>

                                    <td>
                                        {item.minimumStockLevel}
                                    </td>

                                    <td>
                                        {item.batchNumber ||
                                            "N/A"}
                                    </td>

                                    <td>
                                        {item.expiryDate ||
                                            "N/A"}
                                    </td>

                                    <td>
                                        {item.receivedDate ||
                                            "N/A"}
                                    </td>

                                    <td>
                                        {getStockStatus(item)}
                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="btn-view"
                                                onClick={() =>
                                                    handleView(
                                                        item.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    handleEdit(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <h2>
                                {editingId
                                    ? "Edit Inventory"
                                    : "Add Inventory"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={resetForm}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="inventory-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Medicine */}

                            <div className="form-group">

                                <label>
                                    Medicine
                                </label>

                                <select
                                    name="medicineId"
                                    value={
                                        formData.medicineId
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Medicine
                                    </option>

                                    {medicines.map(
                                        (medicine) => (

                                            <option
                                                key={medicine.id}
                                                value={medicine.id}
                                            >
                                                {medicine.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Quantity */}

                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="0"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    required
                                />

                            </div>

                            {/* Minimum Stock */}

                            <div className="form-group">

                                <label>
                                    Minimum Stock Level
                                </label>

                                <input
                                    type="number"
                                    name="minimumStockLevel"
                                    min="0"
                                    value={
                                        formData.minimumStockLevel
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter minimum stock"
                                    required
                                />

                            </div>

                            {/* Batch */}

                            <div className="form-group">

                                <label>
                                    Batch Number
                                </label>

                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={
                                        formData.batchNumber
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter batch number"
                                />

                            </div>

                            {/* Expiry */}

                            <div className="form-group">

                                <label>
                                    Expiry Date
                                </label>

                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={
                                        formData.expiryDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Received */}

                            <div className="form-group">

                                <label>
                                    Received Date
                                </label>

                                <input
                                    type="date"
                                    name="receivedDate"
                                    value={
                                        formData.receivedDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Buttons */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={resetForm}
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Inventory"
                                            : "Add Inventory"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================
                VIEW MODAL
            ========================= */}

            {showView && selectedItem && (

                <div className="modal-overlay">

                    <div className="modal view-modal">

                        <div className="modal-header">

                            <h2>
                                Inventory Details
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowView(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="details-grid">

                            <div className="detail-item">
                                <span>
                                    Inventory ID
                                </span>

                                <strong>
                                    #{selectedItem.id}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Medicine
                                </span>

                                <strong>
                                    {
                                        selectedItem.medicineName
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    {
                                        selectedItem.quantity
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Minimum Stock
                                </span>

                                <strong>
                                    {
                                        selectedItem.minimumStockLevel
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Batch Number
                                </span>

                                <strong>
                                    {
                                        selectedItem.batchNumber ||
                                        "N/A"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Expiry Date
                                </span>

                                <strong>
                                    {
                                        selectedItem.expiryDate ||
                                        "N/A"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Received Date
                                </span>

                                <strong>
                                    {
                                        selectedItem.receivedDate ||
                                        "N/A"
                                    }
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Status
                                </span>

                                {getStockStatus(
                                    selectedItem
                                )}
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                className="btn-secondary"
                                onClick={() =>
                                    setShowView(false)
                                }
                            >
                                Close
                            </button>

                            <button
                                className="btn-edit"
                                onClick={() => {
                                    setShowView(false);
                                    handleEdit(
                                        selectedItem.id
                                    );
                                }}
                            >
                                Edit
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default PharmacyInventory;