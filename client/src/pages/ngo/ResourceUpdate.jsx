import React, { useState } from 'react';
import './NGO.css'; // Shared CSS

const initialResources = [
    { name: 'Food Kits', quantity: 150, unit: 'kits' },
    { name: 'Shelter Tents', quantity: 12, unit: 'units' },
    { name: 'Medical Staff', quantity: 25, unit: 'people' },
];

const ResourceUpdate = () => {
    const [resources, setResources] = useState(initialResources);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleQuantityChange = (index, event) => {
        const newResources = [...resources];
        // Ensure input is parsed as an integer, defaulting to 0 if invalid
        newResources[index].quantity = parseInt(event.target.value) || 0;
        setResources(newResources);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 🚨 In a real application, this is where you would make an API call (e.g., using Firestore)
        // The data in 'resources' would be sent to the database.

        // Simulate API saving delay
        setTimeout(() => {
            console.log('Updated Resources Saved:', resources);
            setMessage('Inventory successfully updated!');
            setLoading(false);
        }, 1000);
    };

    return (
        <form onSubmit={handleSave} className="resource-update-form">
            <h2>📦 Update Inventory & Capacity</h2>
            <p>Maintain accurate inventory to ensure effective aid deployment.</p>

            {resources.map((resource, index) => (
                <div key={resource.name} className="resource-item">
                    <label htmlFor={`resource-${index}`}>{resource.name} ({resource.unit})</label>
                    <input
                        id={`resource-${index}`}
                        type="number"
                        min="0"
                        value={resource.quantity}
                        onChange={(e) => handleQuantityChange(index, e)}
                        required
                    />
                </div>
            ))}
            
            <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Inventory Updates'}
            </button>
            
            {message && <p className="success-message">{message}</p>}
        </form>
    );
};

export default ResourceUpdate;
