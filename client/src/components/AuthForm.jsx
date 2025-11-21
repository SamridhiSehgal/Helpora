// src/components/AuthForm.jsx
import React, { useState } from 'react';

const AuthForm = ({ type, onSubmit, isLoading, showRegisterFields }) => {
    const isRegister = type === 'register';
    const buttonText = isLoading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        latitude: '', 
        longitude: '', 
        regno: '', 
        address: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let dataToSubmit;
        if (isRegister) {
             dataToSubmit = {
                 ...formData,
                 latitude: parseFloat(formData.latitude),
                 longitude: parseFloat(formData.longitude),
             };
        } else {
             dataToSubmit = { email: formData.email, password: formData.password };
        }
            
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && showRegisterFields && (
                <>
                    <input
                        type="text"
                        name="name"
                        placeholder="NGO Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <div className="flex space-x-4">
                        <input
                            type="number" 
                            name="latitude"
                            placeholder="Latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            required
                            step="any" 
                            className="auth-input"
                        />
                        <input
                            type="number"
                            name="longitude"
                            placeholder="Longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            required
                            step="any"
                            className="auth-input"
                        />
                    </div>
                    <input
                        type="text"
                        name="address"
                        placeholder="Full Postal Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <input
                        type="text"
                        name="regno"
                        placeholder="Registration Number"
                        value={formData.regno}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </>
            )}

            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
            />
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="auth-button"
            >
                {buttonText}
            </button>
        </form>
    );
};

export default AuthForm;
