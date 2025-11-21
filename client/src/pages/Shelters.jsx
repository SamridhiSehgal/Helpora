import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ShieldCheck, UserPlus, UserMinus, Loader, MapPin, Plus, Edit, Trash2, X } from 'lucide-react';

const SHELTER_STATUSES = ['Open', 'Closed', 'Emergency', 'Maintenance'];

// --- Sub-Component: Shelter Form Modal ---
const ShelterFormModal = ({ shelterToEdit, onClose, onSave }) => {
  const isEditing = !!shelterToEdit;
  const [formData, setFormData] = useState({
    name: shelterToEdit?.name || '',
    contactPerson: shelterToEdit?.contactPerson || '',
    contactPhone: shelterToEdit?.contactPhone || '',
    totalCapacity: shelterToEdit?.totalCapacity || 1,
    status: shelterToEdit?.status || 'Open',
    longitude: shelterToEdit?.location?.coordinates?.[0] || '',
    latitude: shelterToEdit?.location?.coordinates?.[1] || '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    const payload = {
      ...formData,
      totalCapacity: parseInt(formData.totalCapacity),
      location: {
        type: 'Point',
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      },
    };

    try {
      const baseUrl = '/ngo/shelters';
      if (isEditing) await axiosInstance.put(`${baseUrl}/${shelterToEdit._id}`, payload);
      else await axiosInstance.post(baseUrl, payload);

      setStatus('✅ Shelter saved successfully!');
      setTimeout(() => onSave(), 1000);
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.message || 'Server connection failed.'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Shelter' : 'Register New Shelter'}</h2>
          <button className="close-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Shelter Name*" required />
          <input name="totalCapacity" type="number" value={formData.totalCapacity} onChange={handleChange} placeholder="Total Capacity*" min="1" required />
          <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Contact Person" />
          <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Contact Phone" />
          <select name="status" value={formData.status} onChange={handleChange}>
            {SHELTER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Longitude*" required />
          <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="Latitude*" required />
          
          <p className="status">{status}</p>
          <button className="submit-btn" type="submit">{isEditing ? 'Save Changes' : 'Add Shelter'}</button>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
const Shelters = () => {
  const hasFetched = useRef(false);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shelterToEdit, setShelterToEdit] = useState(null);

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/ngo/shelters');
      setShelters(res.data.shelters || []);
    } catch {
      setMessage({ type: 'error', text: '⚠️ Could not load shelters. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchShelters();
    }
  }, []);

  const handleAllocation = async (id, type) => {
    try {
      await axiosInstance.put(`/ngo/shelters/${id}/${type}`, { people: 1 });
      setShelters((prev) =>
        prev.map((s) =>
          s._id === id
            ? { ...s, currentOccupancy: s.currentOccupancy + (type === 'allocate' ? 1 : -1) }
            : s
        )
      );
      setMessage({ type: 'success', text: `✅ ${type === 'allocate' ? 'Check-in successful' : 'Check-out successful'}` });
    } catch {
      setMessage({ type: 'error', text: 'Action failed. Please try again.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shelter?')) return;
    try {
      await axiosInstance.delete(`/ngo/shelters/${id}`);
      fetchShelters();
      setMessage({ type: 'success', text: '🗑️ Shelter deleted successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete shelter.' });
    }
  };

  const getColor = (cap, occ) => {
    const ratio = occ / cap;
    if (ratio >= 1) return '#ff4d4d';
    if (ratio >= 0.8) return '#ffb347';
    return '#38b000';
  };

  if (loading) return <div className="loading"><Loader className="spin" size={34} /> Loading Shelters...</div>;

  return (
    <div className="shelter-page">
      <style>{`
        .shelter-page {
          background: linear-gradient(120deg, #89f7fe, #66a6ff);
          min-height: 100vh;
          padding: 40px;
          font-family: 'Poppins', sans-serif;
        }
        h1 {
          font-size: 2.4rem;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .add-btn {
          background: linear-gradient(45deg, #ff6a88, #ff99ac);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .add-btn:hover { transform: scale(1.05); }
        .grid {
          margin-top: 35px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 25px;
        }
        .card {
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.9);
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transition: 0.3s;
          overflow: hidden;
        }
        .card:hover { transform: translateY(-5px); }
        .card-header {
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        .card h3 { color: #222; font-weight: 700; font-size: 1.1rem; }
        .card p { margin: 5px 20px; color: #555; font-size: 0.95rem; }
        .card-footer { display: flex; }
        .btn {
          flex: 1;
          border: none;
          padding: 12px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.95rem;
        }
        .btn:hover { opacity: 0.9; }
        .btn-green { background: #38b000; }
        .btn-red { background: #ff4d4d; }
        .edit-delete {
          padding: 10px 15px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }
        .edit-btn { color: #007aff; }
        .delete-btn { color: #ff4d4d; }
        .edit-btn:hover, .delete-btn:hover { transform: scale(1.1); }
        .status { text-align: center; margin-top: 10px; font-weight: 500; }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        .modal-box {
          background: #fff;
          border-radius: 15px;
          width: 90%;
          max-width: 600px;
          padding: 25px;
          animation: pop 0.3s ease-in-out;
        }
        @keyframes pop { from {transform: scale(0.8); opacity: 0;} to {transform: scale(1); opacity: 1;} }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .modal-header h2 { font-size: 1.5rem; color: #333; }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #777;
          transition: 0.3s;
        }
        .close-btn:hover { color: #ff4d4d; }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 15px;
        }
        input, select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          width: 100%;
        }
        .submit-btn {
          margin-top: 15px;
          width: 100%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .submit-btn:hover {
          transform: scale(1.03);
          background: linear-gradient(45deg, #764ba2, #667eea);
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #fff;
          font-size: 1.2rem;
        }
        .spin { animation: spin 1s linear infinite; margin-right: 10px; }
        @keyframes spin { from {transform: rotate(0);} to {transform: rotate(360deg);} }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1><ShieldCheck /> Shelter Management</h1>
        <button className="add-btn" onClick={() => { setShelterToEdit(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Shelter
        </button>
      </div>

      {message && <p className="status" style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>}

      <div className="grid">
        {shelters.map((s) => (
          <div className="card" key={s._id}>
            <div className="card-header">
              <h3>{s.name}</h3>
              <span style={{ background: getColor(s.totalCapacity, s.currentOccupancy), color: '#fff', padding: '4px 10px', borderRadius: '15px', fontWeight: '600' }}>
                {s.currentOccupancy}/{s.totalCapacity}
              </span>
            </div>
            <p><MapPin size={14} /> {s.contactPerson || 'N/A'} | {s.contactPhone || 'N/A'}</p>
            <p>Status: <strong>{s.status}</strong> | Remaining: {s.totalCapacity - s.currentOccupancy}</p>

            <div className="card-footer">
              <button className="btn btn-green" onClick={() => handleAllocation(s._id, 'allocate')} disabled={s.currentOccupancy >= s.totalCapacity}>
                <UserPlus size={16} /> Check-in
              </button>
              <button className="btn btn-red" onClick={() => handleAllocation(s._id, 'deallocate')} disabled={s.currentOccupancy <= 0}>
                <UserMinus size={16} /> Check-out
              </button>
            </div>

            <div className="edit-delete">
              <button className="edit-btn" onClick={() => { setShelterToEdit(s); setIsModalOpen(true); }}><Edit size={16} /> Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(s._id)}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ShelterFormModal
          shelterToEdit={shelterToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={() => { setIsModalOpen(false); fetchShelters(); }}
        />
      )}
    </div>
  );
};

export default Shelters;
