import React, { useState } from 'react';
import { LogIn, Mail, Lock, Heart, ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // AuthContext handles redirection on success
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-20%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite',
          animationDelay: '5s',
        }}
      ></div>

      <div style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 10 }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <Heart
              size={64}
              color="#ef4444"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Zap
              size={32}
              color="#fbbf24"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))',
                animation: 'bounce 2s ease-in-out infinite',
              }}
            />
          </div>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: 'white',
              textShadow: '0 0 30px rgba(255,255,255,0.5)',
              marginBottom: '16px',
              letterSpacing: '0.05em',
            }}
          >
            Helpora
          </h1>
          <p
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            NGO Partner Portal
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
        >
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              marginBottom: '12px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              marginBottom: '32px',
              fontWeight: '500',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            Sign in to access your dashboard
          </p>

          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
                color: 'white',
                fontWeight: '700',
                textAlign: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              {error}
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Email Address
            </label>
            <div
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <Mail
                size={22}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@organization.com"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 56px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Password
            </label>
            <div
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <Lock
                size={22}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 56px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontSize: '20px',
              fontWeight: '900',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.5)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {isLoading ? (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '4px solid white',
                  borderTop: '4px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
            ) : (
              <>
                <LogIn size={24} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Footer Links */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p
              style={{
                color: 'white',
                fontWeight: '500',
                marginBottom: '16px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#fbbf24',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                }}
              >
                Register Here →
              </Link>
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowLeft size={18} />
              <span>Back to Main Page</span>
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 10px) scale(1.02); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Login;
