import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./inventory.css";
import { Delete, Edit, Trash } from "lucide-react";

const API_URL = "http://192.168.1.8:1100/api/v1/Product";

const Inventory = () => {
    const [products, setProducts] = useState([]);

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [selectedProductId, setSelectedProductId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const token = localStorage.getItem("token");

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getProducts = async () => {
        try {
            setLoading(true);

            const response = await axios.get(API_URL, axiosConfig);

            setProducts(response.data.data || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message || "Unable to load products"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const resetForm = () => {
        setCode("");
        setName("");
        setPrice("");
        setQuantity("");
        setDescription("");
        setIsActive(true);
        setSelectedProductId(null);
        setError("");
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setSelectedProductId(product.id);

        setCode(product.code || "");
        setName(product.name || "");
        setPrice(product.price ?? "");
        setQuantity(product.quantity ?? "");
        setDescription(product.description || "");
        setIsActive(product.isActive);

        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const validateForm = () => {
        if (!code.trim()) {
            setError("Product code is required");
            return false;
        }

        if (!name.trim()) {
            setError("Product name is required");
            return false;
        }

        if (Number(price) <= 0) {
            setError("Price must be greater than 0");
            return false;
        }

        if (Number(quantity) < 0) {
            setError("Quantity cannot be negative");
            return false;
        }

        return true;
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            setError("");

            await axios.post(
                API_URL,
                {
                    Code: code.trim(),
                    Name: name.trim(),
                    Price: Number(price),
                    Quantity: Number(quantity),
                    Description: description.trim(),
                    IsActive: isActive,
                },
                axiosConfig
            );

            await getProducts();

            closeModal();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                "Unable to add product"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (e) => {
        e.preventDefault();

        if (!selectedProductId) {
            setError("Product ID not found");
            return;
        }

        if (!validateForm()) return;

        try {
            setLoading(true);
            setError("");

            await axios.put(
                API_URL,
                {
                    id: selectedProductId,
                    Code: code.trim(),
                    Name: name.trim(),
                    Price: Number(price),
                    Quantity: Number(quantity),
                    Description: description.trim(),
                    IsActive: isActive,
                },
                axiosConfig
            );

            await getProducts();

            closeModal();
        } catch (error) {
            console.error("Update Error:", error.response?.data);

            setError(
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                "Unable to update product"
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`, axiosConfig);

            await getProducts();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message || "Unable to delete product"
            );
        }
    };

    // Search
    const filteredProducts = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        if (!searchValue) return products;

        return products.filter((product) => {
            return (
                product.name?.toLowerCase().includes(searchValue) ||
                product.code?.toLowerCase().includes(searchValue) ||
                product.description?.toLowerCase().includes(searchValue) ||
                String(product.price).includes(searchValue) ||
                String(product.quantity).includes(searchValue)
            );
        });
    }, [products, search]);

    // Pagination
    const totalPages = Math.ceil(
        filteredProducts.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;

    const displayedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="inventory-page">
            <div className="navbar">
                <div className="brand">
                    <div className="brand-icon">◇</div>
                    <span>StockMaster</span>
                </div>

                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                >
                    ⇥ Logout
                </button>
            </div>

            <div className="inventory-header">
                <div>
                    <h1>Inventory</h1>
                    <p>Manage and track your products in real-time.</p>
                </div>

                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Search by name, code and price"
                        value={search}
                        onChange={handleSearch}
                        className="search-input"
                    />

                    <button
                        className="add-btn"
                        onClick={openAddModal}
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>PRODUCT DETAILS</th>
                            <th>PRICE</th>
                            <th>STOCK QTY</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-message">
                                    Loading products...
                                </td>
                            </tr>
                        ) : displayedProducts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-message">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            displayedProducts.map((product) => (
                                <tr key={product.id}>

                                    {/* Product */}
                                    <td>
                                        <div className="product-details">
                                            <div className="product-icon">
                                                ◇
                                            </div>

                                            <div>
                                                <h4>{product.name}</h4>

                                                <span>
                                                    Code: {product.code}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="price">
                                        ₹{Number(product.price).toFixed(2)}
                                    </td>

                                    {/* Quantity */}
                                    <td>
                                        <span className="quantity">
                                            {product.quantity}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        <span
                                            className={
                                                product.isActive
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            <span className="status-dot"></span>

                                            {product.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-button edit"
                                                onClick={() =>
                                                    openEditModal(product)
                                                }
                                                title="Edit"
                                            >
                                                <Edit size={16} color="blue" />
                                            </button>

                                            <button
                                                className="icon-button delete"
                                                onClick={() =>
                                                    deleteProduct(product.id)
                                                }
                                                title="Delete"
                                            >
                                                <Trash size={16} color="red" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.max(page - 1, 1)
                            )
                        }
                    >
                        ‹
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            className={
                                currentPage === page
                                    ? "active-page"
                                    : ""
                            }
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(page + 1, totalPages)
                            )
                        }
                    >
                        ›
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="product-modal">

                        <div className="modal-header">
                            <div>
                                <h2>
                                    {selectedProductId
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>

                                <p>
                                    {selectedProductId
                                        ? "Update product information."
                                        : "Enter the product information."}
                                </p>
                            </div>

                            <button
                                className="close-btn"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={
                                selectedProductId
                                    ? updateProduct
                                    : addProduct
                            }
                        >
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Product Name</label>

                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Code</label>

                                <input
                                    type="text"
                                    placeholder="Enter product code"
                                    value={code}
                                    onChange={(e) =>
                                        setCode(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price</label>

                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>

                                <textarea
                                    placeholder="Enter product description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>

                            <div className="active-section">
                                <div>
                                    <strong>Active Product</strong>
                                    <p>
                                        Product will be available in inventory.
                                    </p>
                                </div>

                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) =>
                                            setIsActive(e.target.checked)
                                        }
                                    />

                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : selectedProductId
                                            ? "Update Product"
                                            : "Add Product"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;