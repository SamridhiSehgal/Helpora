// src/components/InventoryForm.jsx (Designed for POSTing a new item)

import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Plus, Loader, MapPin, Box, X, Calendar } from 'lucide-react';

const RESOURCE_CATEGORIES = ['Food', 'Water', 'Medical Supplies', 'Clothing', 'Shelter Equipment', 'Other'];
const STATUS_OPTIONS = ['Available', 'Low Stock', 'Reserved', 'Out of Stock']; // Assuming Status is an enum

const InventoryForm = ({ onClose, onSave }) => {
    
    // Initial state matching the document structure and form inputs
    const [formData, setFormData] = useState({
        name: '',
        category: RESOURCE_CATEGORIES[0],
        quantity: 1,
        unit: 'units',
        status: 'Available',
        expiryDate: '',
        longitude: '', // For GeoJSON Location
        latitude: '',  // For GeoJSON Location
    });
    const [submitStatus, setSubmitStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitStatus('Posting item...');
        
        // Prepare payload, including mandatory GeoJSON structure
        const payload = {
            ...formData,
            // Ensure numeric fields are correctly parsed (though handled by handleChange, this is a safety net)
            quantity: parseInt(formData.quantity), 
            
            // Construct the GeoJSON location object for the backend
            location: {
                type: 'Point',
                coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)], // [lon, lat]
            },
            // Remove temporary coordinate fields from payload
            longitude: undefined, 
            latitude: undefined,
        };
        
        try {
            // POST request to create a new item
            await axiosInstance.post('/inventory', payload); 
            
            setSubmitStatus('Item added successfully! List updating...');
            
            // Clear the form visually (or close the modal)
            setTimeout(() => {
                onSave(); // Trigger list refresh and modal close
            }, 1000); 

        } catch (err) {
            setIsLoading(false);
            setSubmitStatus('Error: ' + (err.response?.data?.message || 'Failed to connect to server.'));
        }
    };
    
    const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpora-blue/50 transition duration-150";

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full">
            <header className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-3xl font-extrabold text-helpora-blue">
                    <Plus size={28} className="inline mr-2 align-text-bottom" />
                    Stock New Inventory Item
                </h2>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={28} /></button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- Item Details Group --- */}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-gray-700 px-2">Resource Details</legend>
                    
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., 500ml Water Bottles" className={inputClass} />
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                            {RESOURCE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" className={inputClass} />
                    </div>
                    
                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                        <input type="text" name="unit" value={formData.unit} onChange={handleChange} required placeholder="bottles, kg, pieces" className={inputClass} />
                    </div>
                </fieldset>

                {/* --- Status & Expiry --- */}
                <fieldset className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-gray-700 px-2">Stock & Status</legend>
                    
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                            {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className={inputClass} />
                    </div>
                </fieldset>


                {/* --- GeoJSON Location Group --- */}
                <fieldset className="border p-4 rounded-lg space-y-3">
                    <legend className="text-lg font-semibold text-gray-700 px-2 flex items-center">
                        <MapPin size={20} className="mr-2" /> Storage Coordinates *
                    </legend>
                    <p className="text-xs text-gray-500">Provide the exact longitude and latitude of the item's storage location.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} required step="any" placeholder="Longitude (e.g., 77.2090)" className={inputClass} />
                        </div>
                        <div>
                            <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} required step="any" placeholder="Latitude (e.g., 28.6139)" className={inputClass} />
                        </div>
                    </div>
                </fieldset>
                
                {/* --- Action & Status --- */}
                <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="w-full bg-helpora-blue text-white p-3 rounded-lg hover:bg-blue-700 flex justify-center items-center space-x-2 text-lg font-semibold transition duration-200">
                        {isLoading && <Loader size={24} className="animate-spin" />}
                        <span>{isLoading ? 'Saving...' : 'Confirm & Add Item'}</span>
                    </button>
                    <p className={`mt-2 text-center text-sm ${submitStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{submitStatus}</p>
                </div>

            </form>
        </div>
    );
};

export default InventoryForm;