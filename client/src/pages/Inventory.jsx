import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { Plus, Edit, Trash2, Loader, Box, MapPin, X } from "lucide-react";

const RESOURCE_CATEGORIES = [
  "Food",
  "Water",
  "Medical Supplies",
  "Clothing",
  "Shelter Equipment",
  "Other",
];
const STATUS_OPTIONS = ["Available", "Low Stock", "Reserved", "Out of Stock"];

// --- Sub-Component: Inventory Form Modal (for Create/Update) ---
const InventoryFormModal = ({ itemToEdit, onClose, onSave }) => {
  const isEditing = !!itemToEdit;
  const [formData, setFormData] = useState({
    name: itemToEdit?.name || "",
    category: itemToEdit?.category || RESOURCE_CATEGORIES[0],
    quantity: itemToEdit?.quantity || 1,
    unit: itemToEdit?.unit || "units",
    status: itemToEdit?.status || "Available",
    expiryDate: itemToEdit?.expiryDate
      ? itemToEdit.expiryDate.split("T")[0]
      : "",
    longitude: itemToEdit?.location?.coordinates?.[0] || "",
    latitude: itemToEdit?.location?.coordinates?.[1] || "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity),
      location: {
        type: "Point",
        coordinates: [
          parseFloat(formData.longitude),
          parseFloat(formData.latitude),
        ],
      },
    };

    try {
      const baseUrl = "/ngo/inventory";
      if (isEditing) {
        await axiosInstance.put(`${baseUrl}/${itemToEdit._id}`, payload);
      } else {
        await axiosInstance.post(baseUrl, payload);
      }
      setStatus("Item saved successfully!");
      setTimeout(() => onSave(), 1000);
    } catch (err) {
      setStatus(
        "Error: " +
          (err.response?.data?.message || "Check server connection.")
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? "✏️ Edit Inventory Item" : "🌈 Add New Item"}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="grid-2">
            <div>
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div>
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <fieldset className="fieldset">
            <legend>📍 Storage Location</legend>
            <div className="grid-2">
              <div>
                <label>Longitude *</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  step="any"
                />
              </div>
              <div>
                <label>Latitude *</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  step="any"
                />
              </div>
            </div>
          </fieldset>

          <p className={status.startsWith("Error") ? "error" : "success"}>
            {status}
          </p>

          <button type="submit" disabled={status.includes("Saving")}>
            {status.includes("Saving") ? (
              <Loader size={18} className="spin" />
            ) : (
              "💾 Save Item"
            )}
          </button>
        </form>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fadeIn 0.3s ease;
        }
        .modal {
          background: linear-gradient(135deg, #ffffff, #e3f2fd);
          padding: 2rem;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          animation: slideUp 0.4s ease;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #ddd;
          margin-bottom: 1rem;
        }
        .modal-header h2 {
          font-size: 1.4rem;
          color: #333;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #e53935;
          transition: transform 0.2s;
        }
        .close-btn:hover {
          transform: rotate(90deg);
        }
        .modal-form label {
          font-weight: 600;
          color: #444;
          margin-bottom: 0.3rem;
          display: block;
        }
        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #bbb;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
        }
        input:focus, select:focus {
          border-color: #2196f3;
          box-shadow: 0 0 5px #2196f3;
          transform: scale(1.02);
        }
        .fieldset {
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
        }
        .fieldset legend {
          font-weight: 600;
          color: #1976d2;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        button {
          background: linear-gradient(45deg, #ff512f, #dd2476);
          border: none;
          padding: 0.8rem;
          width: 100%;
          color: #fff;
          font-size: 1rem;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        button:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 15px rgba(255,81,47,0.4);
        }
        .error { color: #e53935; font-weight: 600; }
        .success { color: #388e3c; font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        @keyframes slideUp { from {transform:translateY(20px);opacity:0} to {transform:translateY(0);opacity:1} }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
};

// --- Main Component: Inventory List ---
const Inventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const hasFetched = useRef(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/ngo/inventory");
      setInventoryList(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to retrieve inventory list. Check network/auth.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchInventory();
    }
  }, []);

  const handleSaveAndClose = () => {
    setIsModalOpen(false);
    fetchInventory();
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    try {
      await axiosInstance.delete(`/ngo/inventory/${id}`);
      fetchInventory();
    } catch {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="inventory-container">
      <style>{`
        .inventory-container {
          background: linear-gradient(135deg, #74ebd5, #ACB6E5);
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
          animation: fadeIn 0.6s ease;
        }
        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .add-btn {
          background: linear-gradient(45deg, #00c6ff, #0072ff);
          color: white;
          padding: 0.7rem 1.2rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .add-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        table {
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          margin-top: 1rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        th {
          background: #e3f2fd;
          text-align: left;
          padding: 12px;
          font-size: 0.9rem;
          color: #444;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        tr:hover {
          background: #f1faff;
          transition: 0.3s;
        }
        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          margin: 0 4px;
        }
      `}</style>

      <header className="flex justify-between items-center mb-6">
        <h1>
          <Box size={28} /> Inventory Management
        </h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Add New Item
        </button>
      </header>

      {loading ? (
        <div className="text-center text-white">⏳ Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.length > 0 ? (
              inventoryList.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>{item.status}</td>
                  <td>
                    <MapPin size={14} />{" "}
                    {item.location?.coordinates?.[1]?.toFixed(2)},{" "}
                    {item.location?.coordinates?.[0]?.toFixed(2)}
                  </td>
                  <td className="actions">
                    <button onClick={() => setItemToEdit(item)}>
                      <Edit color="#0072ff" size={18} />
                    </button>
                    <button onClick={() => handleDeleteItem(item._id)}>
                      <Trash2 color="#ff1744" size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <InventoryFormModal
          itemToEdit={itemToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAndClose}
        />
      )}
    </div>
  );
};

export default Inventory;
