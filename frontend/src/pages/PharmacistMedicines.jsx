import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Styles/PharmacistMedicines.css";

const emptyForm = {
    name: "",
    genericName: "",
    category: "",
    manufacturer: "",
    price: "",
    stockQuantity: "",
    expiryDate: "",
    description: "",
    active: true
};

function PharmacistMedicines() {
    const navigate = useNavigate();

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState(emptyForm);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const pharmacistName =
        user.firstName ||
        user.name ||
        "Pharmacist";

    // =========================
    // LOAD MEDICINES
    // =========================

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/medicines");

            const data =
                response.data?.data ||
                response.data ||
                [];

            setMedicines(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error loading medicines:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load medicines."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    // =========================
    // FORM HANDLING
    // =========================

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleAddMedicine = () => {
        setError("");
        setSuccess("");
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const handleEdit = (medicine) => {
        setError("");
        setSuccess("");

        setEditingId(medicine.id);

        setFormData({
            name: medicine.name || "",
            genericName: medicine.genericName || "",
            category: medicine.category || "",
            manufacturer: medicine.manufacturer || "",
            price: medicine.price ?? "",
            stockQuantity: medicine.stockQuantity ?? "",
            expiryDate: medicine.expiryDate || "",
            description: medicine.description || "",
            active: medicine.active !== false
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // SAVE MEDICINE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const payload = {
                name: formData.name.trim(),
                genericName: formData.genericName.trim(),
                category: formData.category.trim(),
                manufacturer: formData.manufacturer.trim(),
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                expiryDate: formData.expiryDate,
                description: formData.description.trim(),
                active: formData.active
            };

            if (editingId) {
                await api.put(
                    `/medicines/${editingId}`,
                    payload
                );

                setSuccess(
                    "Medicine updated successfully."
                );
            } else {
                await api.post(
                    "/medicines",
                    payload
                );

                setSuccess(
                    "Medicine added successfully."
                );
            }

            resetForm();
            await fetchMedicines();

        } catch (err) {
            console.error("Error saving medicine:", err);

            setError(
                err.response?.data?.message ||
                "Unable to save medicine."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE MEDICINE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this medicine?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/medicines/${id}`);

            setSuccess(
                "Medicine deleted successfully."
            );

            await fetchMedicines();

        } catch (err) {
            console.error("Error deleting medicine:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete medicine."
            );
        }
    };

    // =========================
    // CATEGORIES
    // =========================

    const categories = useMemo(() => {
        return [
            ...new Set(
                medicines
                    .map((medicine) => medicine.category)
                    .filter(Boolean)
            )
        ].sort();
    }, [medicines]);

    // =========================
    // FILTER MEDICINES
    // =========================

    const filteredMedicines = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return medicines.filter((medicine) => {

            const matchesSearch =
                !searchValue ||
                medicine.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                medicine.genericName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                medicine.manufacturer
                    ?.toLowerCase()
                    .includes(searchValue) ||
                medicine.category
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                categoryFilter === "ALL" ||
                medicine.category === categoryFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" &&
                    medicine.active === true) ||
                (statusFilter === "INACTIVE" &&
                    medicine.active === false);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [
        medicines,
        search,
        categoryFilter,
        statusFilter
    ]);

    // =========================
    // SUMMARY
    // =========================

    const activeCount = medicines.filter(
        (medicine) => medicine.active === true
    ).length;

    const inactiveCount = medicines.filter(
        (medicine) => medicine.active === false
    ).length;

    const lowStockCount = medicines.filter(
        (medicine) =>
            Number(medicine.stockQuantity || 0) <= 10
    ).length;

    const expiredCount = medicines.filter((medicine) => {

        if (!medicine.expiryDate) {
            return false;
        }

        return (
            new Date(medicine.expiryDate) <
            new Date()
        );
    }).length;

    // =========================
    // DATE FORMAT
    // =========================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const isExpired = (date) => {
        if (!date) {
            return false;
        }

        return new Date(date) < new Date();
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginResponse");

        navigate("/login");
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="pharmacist-medicines-page">

                <div className="medicine-loading">

                    <div className="medicine-spinner"></div>

                    <p>
                        Loading medicines...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="pharmacist-medicines-page">

            {/* =========================
                HEADER
            ========================= */}

            <header className="medicine-header">

                <div className="medicine-header-left">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/pharmacist")
                        }
                    >
                        ←
                    </button>

                    <div className="medicine-title-icon">
                        💊
                    </div>

                    <div>
                        <h1>
                            Medicine Management
                        </h1>

                        <p>
                            Manage medicines and pharmacy records
                        </p>
                    </div>

                </div>

                <div className="medicine-header-right">

                    <span className="pharmacist-name">
                        {pharmacistName}
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* =========================
                ALERTS
            ========================= */}

            {error && (
                <div className="medicine-alert error">

                    <span>⚠️</span>

                    <div>
                        <strong>
                            Error
                        </strong>

                        <p>
                            {error}
                        </p>
                    </div>

                    <button
                        onClick={() => setError("")}
                    >
                        ×
                    </button>

                </div>
            )}

            {success && (
                <div className="medicine-alert success">

                    <span>✓</span>

                    <div>
                        <strong>
                            Success
                        </strong>

                        <p>
                            {success}
                        </p>
                    </div>

                    <button
                        onClick={() => setSuccess("")}
                    >
                        ×
                    </button>

                </div>
            )}

            {/* =========================
                SUMMARY
            ========================= */}

            <section className="medicine-summary">

                <div className="medicine-summary-card">

                    <div className="summary-card-icon">
                        💊
                    </div>

                    <div>
                        <span>
                            Total Medicines
                        </span>

                        <strong>
                            {medicines.length}
                        </strong>
                    </div>

                </div>

                <div className="medicine-summary-card">

                    <div className="summary-card-icon active-icon">
                        ✓
                    </div>

                    <div>
                        <span>
                            Active Medicines
                        </span>

                        <strong>
                            {activeCount}
                        </strong>
                    </div>

                </div>

                <div className="medicine-summary-card">

                    <div className="summary-card-icon warning-icon">
                        ⚠️
                    </div>

                    <div>
                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {lowStockCount}
                        </strong>
                    </div>

                </div>

                <div className="medicine-summary-card">

                    <div className="summary-card-icon danger-icon">
                        ⏰
                    </div>

                    <div>
                        <span>
                            Expired
                        </span>

                        <strong>
                            {expiredCount}
                        </strong>
                    </div>

                </div>

            </section>

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <section className="medicine-form-section">

                    <div className="form-section-header">

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Medicine"
                                    : "Add New Medicine"}
                            </h2>

                            <p>
                                Enter medicine information below
                            </p>
                        </div>

                        <button
                            className="close-form-button"
                            onClick={resetForm}
                            type="button"
                        >
                            ×
                        </button>

                    </div>

                    <form
                        className="medicine-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Medicine Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter medicine name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Generic Name *
                                </label>

                                <input
                                    type="text"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleInputChange}
                                    placeholder="Enter generic name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Category *
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Antibiotic"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Manufacturer *
                                </label>

                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleInputChange}
                                    placeholder="Enter manufacturer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Price *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Stock Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Expiry Date *
                                </label>

                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group active-form-group">

                                <label>
                                    Status
                                </label>

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                    />

                                    <span>
                                        Medicine is active
                                    </span>

                                </label>

                            </div>

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter medicine description"
                                    rows="4"
                                    maxLength="500"
                                />

                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Medicine"
                                        : "Add Medicine"}
                            </button>

                        </div>

                    </form>

                </section>
            )}

            {/* =========================
                TOOLBAR
            ========================= */}

            <section className="medicine-list-section">

                <div className="medicine-list-header">

                    <div>
                        <h2>
                            Medicines
                        </h2>

                        <p>
                            {filteredMedicines.length} medicine
                            {filteredMedicines.length !== 1
                                ? "s"
                                : ""} found
                        </p>
                    </div>

                    <button
                        className="add-medicine-button"
                        onClick={handleAddMedicine}
                    >
                        + Add Medicine
                    </button>

                </div>

                <div className="medicine-filters">

                    <div className="search-box">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search medicine, generic name, manufacturer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}

                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Status
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                </div>

                {/* =========================
                    TABLE
                ========================= */}

                {filteredMedicines.length === 0 ? (

                    <div className="medicine-empty-state">

                        <div className="empty-icon">
                            💊
                        </div>

                        <h3>
                            No Medicines Found
                        </h3>

                        <p>
                            {medicines.length === 0
                                ? "There are no medicines in the system yet."
                                : "Try changing your search or filters."}
                        </p>

                        {medicines.length === 0 && (
                            <button
                                onClick={handleAddMedicine}
                            >
                                + Add First Medicine
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="medicine-table-wrapper">

                        <table className="medicine-table">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Medicine</th>
                                <th>Category</th>
                                <th>Manufacturer</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Expiry</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>

                            {filteredMedicines.map(
                                (medicine) => {

                                    const expired =
                                        isExpired(
                                            medicine.expiryDate
                                        );

                                    const lowStock =
                                        Number(
                                            medicine.stockQuantity || 0
                                        ) <= 10;

                                    return (
                                        <tr
                                            key={medicine.id}
                                        >

                                            <td>
                                                <strong>
                                                    #{medicine.id}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="medicine-name-cell">

                                                    <div className="medicine-small-icon">
                                                        💊
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {medicine.name}
                                                        </strong>

                                                        <span>
                                                            {medicine.genericName}
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="category-badge">
                                                    {medicine.category}
                                                </span>
                                            </td>

                                            <td>
                                                {medicine.manufacturer}
                                            </td>

                                            <td>
                                                <strong>
                                                    ₹
                                                    {Number(
                                                        medicine.price || 0
                                                    ).toFixed(2)}
                                                </strong>
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        lowStock
                                                            ? "stock-badge low"
                                                            : "stock-badge"
                                                    }
                                                >
                                                    {medicine.stockQuantity}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        expired
                                                            ? "expiry-text expired"
                                                            : "expiry-text"
                                                    }
                                                >
                                                    {formatDate(
                                                        medicine.expiryDate
                                                    )}
                                                </span>

                                                {expired && (
                                                    <small className="expired-label">
                                                        Expired
                                                    </small>
                                                )}

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        medicine.active
                                                            ? "status-badge active"
                                                            : "status-badge inactive"
                                                    }
                                                >
                                                    {medicine.active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                medicine
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                medicine.id
                                                            )
                                                        }
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

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

            {/* =========================
                FOOTER
            ========================= */}

            <div className="medicine-page-footer">

                <span>
                    Showing {filteredMedicines.length} of{" "}
                    {medicines.length} medicines
                </span>

                <span>
                    Inactive: {inactiveCount}
                </span>

            </div>

        </div>
    );
}

export default PharmacistMedicines;