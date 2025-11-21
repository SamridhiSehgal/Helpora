import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthForm from '../components/AuthForm';
import {
  HeartHandshake,
  ArrowLeftCircle,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (ngoData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(ngoData);
      setSuccess('🎉 Registration successful! Redirecting to login...');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #f9d2e4, #fef9f5, #f2f2fc)',
        padding: '40px',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          width: '100%',
          maxWidth: '1050px',
        }}
      >
        {/* Left Side - Branding Panel */}
        <div
          style={{
            flex: 1,
            background:
              'linear-gradient(135deg, #7810d3ff 0%, #921cc9ff 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <HeartHandshake size={52} color="#fff" />
          <h1
            style={{
              fontSize: '2.6rem',
              fontWeight: 700,
              marginTop: '20px',
              marginBottom: '15px',
            }}
          >
            Helpora
          </h1>
          <p
            style={{
              maxWidth: '360px',
              fontSize: '1rem',
              lineHeight: '1.6',
              opacity: 0.9,
            }}
          >
            Empower your NGO with Helpora — join a community dedicated
            to spreading hope, compassion, and real impact.
          </p>
        </div>

        {/* Right Side - Register Form */}
        <div
          style={{
            flex: 1.2,
            padding: '60px 50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: '#777',
                fontSize: '0.9rem',
                marginBottom: '10px',
              }}
            >
              <ArrowLeftCircle size={20} />
              <span>Back</span>
            </Link>

            <h2
              style={{
                fontSize: '1.8rem',
                color: '#222',
                fontWeight: 700,
                marginTop: '5px',
              }}
            >
              Create NGO Account
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '6px' }}>
              Get started in just a few steps
            </p>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffe6e6',
                color: '#d90429',
                border: '1px solid #ffb3b3',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '15px',
                fontSize: '0.9rem',
              }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#eaffea',
                color: '#1b8a5a',
                border: '1px solid #b7efc5',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '15px',
                fontSize: '0.9rem',
              }}
            >
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
            showRegisterFields
          />

          {isLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#555',
                fontSize: '0.9rem',
                marginTop: '8px',
              }}
            >
              <Loader2
                size={20}
                style={{
                  animation: 'spin 1s linear infinite',
                }}
              />
              Processing...
            </div>
          )}

          <p
            style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '0.95rem',
              color: '#444',
            }}
          >
            Already registered?{' '}
            <Link
              to="/login"
              style={{
                color: '#841bcaff',
                fontWeight: 600,
                textDecoration: 'none',
                marginLeft: '4px',
              }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Inline Animation for Loader */}
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;
