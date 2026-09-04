import { useEffect, useState } from "react";
import api from "../services/api";
import "../Styles/LabTests.css";

function LabTests() {
    const [labTests, setLabTests] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        testName: "",
        category: "",
        price: "",
        normalRange: "",
        description: ""
    });

    const fetchLabTests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/lab-tests");

            setLabTests(response.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch laboratory tests"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabTests();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            testName: "",
            category: "",
            price: "",
            normalRange: "",
            description: ""
        });

        setEditingId(null);
    };

    const handleAdd = () => {
        resetForm();
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                testName: formData.testName,
                category: formData.category,
                price: Number(formData.price),
                normalRange: formData.normalRange,
                description: formData.description
            };

            if (editingId) {
                await api.put(
                    `/lab-tests/${editingId}`,
                    payload
                );

                setSuccess("Lab test updated successfully");
            } else {
                await api.post(
                    "/lab-tests",
                    payload
                );

                setSuccess("Lab test created successfully");
            }

            setShowForm(false);
            resetForm();

            await fetchLabTests();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save lab test"
            );
        } finally {
            setFormLoading(false);
        }
    };

    const handleView = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/lab-tests/${id}`
            );

            setSelectedTest(response.data);
            setShowView(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch lab test"
            );
        }
    };

    const handleEdit = async (id) => {
        try {
            setError("");

            const response = await api.get(
                `/lab-tests/${id}`
            );

            const test = response.data;

            if (!test) {
                setError("Lab test not found");
                return;
            }

            setEditingId(id);

            setFormData({
                testName: test.testName || "",
                category: test.category || "",
                price: test.price ?? "",
                normalRange: test.normalRange || "",
                description: test.description || ""
            });

            setShowForm(true);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch lab test"
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this lab test?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(`/lab-tests/${id}`);

            setSuccess("Lab test deleted successfully");

            await fetchLabTests();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete lab test"
            );
        }
    };

    const categories = [
        ...new Set(
            labTests
                .map((test) => test.category)
                .filter(Boolean)
        )
    ];

    const filteredLabTests = labTests.filter((test) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            String(test.id || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(test.testName || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(test.category || "")
                .toLowerCase()
                .includes(searchValue);

        const matchesCategory =
            categoryFilter === "ALL" ||
            test.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const totalTests = labTests.length;

    const totalCategories = categories.length;

    const averagePrice =
        totalTests > 0
            ? labTests.reduce(
            (sum, test) =>
                sum + Number(test.price || 0),
            0
        ) / totalTests
            : 0;

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="lab-tests-page">
                <div className="loading">
                    Loading laboratory tests...
                </div>
            </div>
        );
    }

    return (
        <div className="lab-tests-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="lab-tests-header">

                <div>
                    <h1>Lab Test Management</h1>

                    <p>
                        Manage laboratory tests, categories,
                        prices and normal ranges
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleAdd}
                >
                    + Add Lab Test
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

            <div className="lab-tests-summary">

                <div className="summary-card">
                    <span>Total Tests</span>
                    <strong>{totalTests}</strong>
                </div>

                <div className="summary-card">
                    <span>Categories</span>
                    <strong>{totalCategories}</strong>
                </div>

                <div className="summary-card">
                    <span>Average Price</span>
                    <strong>
                        {formatAmount(averagePrice)}
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
                    placeholder="Search by test name, category or ID..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="filter-select"
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

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="table-container">

                {filteredLabTests.length === 0 ? (
                    <div className="empty-state">
                        No laboratory tests found.
                    </div>
                ) : (
                    <table className="lab-tests-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Test Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Normal Range</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredLabTests.map((test) => (
                            <tr key={test.id}>

                                <td>
                                    #{test.id}
                                </td>

                                <td>
                                    <strong>
                                        {test.testName}
                                    </strong>
                                </td>

                                <td>
                                        <span className="category-badge">
                                            {test.category}
                                        </span>
                                </td>

                                <td>
                                    <strong>
                                        {formatAmount(
                                            test.price
                                        )}
                                    </strong>
                                </td>

                                <td>
                                    {test.normalRange || "-"}
                                </td>

                                <td className="description-cell">
                                    {test.description || "-"}
                                </td>

                                <td>

                                    <div className="action-buttons">

                                        <button
                                            className="btn-view"
                                            onClick={() =>
                                                handleView(test.id)
                                            }
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                handleEdit(test.id)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDelete(test.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        ))}

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
                                    ? "Edit Lab Test"
                                    : "Add Lab Test"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="lab-test-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    Test Name *
                                </label>

                                <input
                                    type="text"
                                    name="testName"
                                    value={formData.testName}
                                    onChange={handleChange}
                                    placeholder="Enter test name"
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
                                    onChange={handleChange}
                                    placeholder="e.g. Blood, Urine, Imaging"
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
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Normal Range *
                                </label>

                                <input
                                    type="text"
                                    name="normalRange"
                                    value={formData.normalRange}
                                    onChange={handleChange}
                                    placeholder="e.g. 70-100 mg/dL"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter test description"
                                    rows="4"
                                />

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
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
                                            ? "Update Test"
                                            : "Create Test"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                VIEW MODAL
            ========================= */}

            {showView && selectedTest && (

                <div className="modal-overlay">

                    <div className="modal view-modal">

                        <div className="modal-header">

                            <h2>
                                Lab Test #{selectedTest.id}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowView(false);
                                    setSelectedTest(null);
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div className="details-grid">

                            <div className="detail-item">
                                <span>Test Name</span>
                                <strong>
                                    {selectedTest.testName}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Category</span>
                                <strong>
                                    {selectedTest.category}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Price</span>
                                <strong>
                                    {formatAmount(
                                        selectedTest.price
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Normal Range</span>
                                <strong>
                                    {selectedTest.normalRange || "-"}
                                </strong>
                            </div>

                            <div className="detail-item full-width">
                                <span>Description</span>
                                <strong>
                                    {selectedTest.description || "-"}
                                </strong>
                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setShowView(false);
                                    setSelectedTest(null);
                                }}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default LabTests;