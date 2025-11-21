import React, { useState, useEffect } from 'react';
import { Send, LogIn, UserPlus, Heart, Info, MapPin, Users, Shield, Truck, Zap, Globe, Clock } from 'lucide-react';

// Reusable button component with enhanced hover effects
const LandingButtonRaw = ({ children, to, icon: Icon, colorClass }) => (
  <a 
    href={to} 
    style={{
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      padding: '32px',
      borderRadius: '16px',
      color: 'white',
      fontWeight: '600',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      ...colorClass
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1) translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }}
  >
    <Icon size={56} style={{ marginBottom: '16px' }} />
    <span style={{ textAlign: 'center' }}>{children}</span>
  </a>
);

// "How it Works" step component
const HowItWorksStep = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        textAlign: 'center',
        padding: '32px',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        borderColor: isHovered ? '#93c5fd' : '#e5e7eb'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
        transition: 'all 0.3s ease'
      }}>
        <Icon size={40} color="white" />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
};

// Stats component
const StatCard = ({ icon: Icon, value, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        borderRadius: '50%',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={28} color="white" />
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>{value}</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #fae8ff 50%, #fce7f3 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', top: '-25%', left: '-25%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 20s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', bottom: '-25%', right: '-25%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 25s ease-in-out infinite', animationDelay: '5s' }}></div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          maxWidth: '1200px',
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'all 1s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <Heart size={80} color="#ef4444" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <h1 style={{
              fontSize: 'clamp(48px, 10vw, 96px)',
              fontWeight: '900',
              background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Helpora
            </h1>
            <MapPin size={40} color="#3b82f6" style={{ animation: 'bounce 2s ease-in-out infinite' }} />
          </div>
          
          <p style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: '#374151', fontWeight: '700', margin: '24px 0 12px' }}>
            Smart Disaster Relief & Resource Management
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 24px)', color: '#6b7280', marginBottom: '32px', maxWidth: '800px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Connecting NGOs and victims for <span style={{ color: '#3b82f6', fontWeight: '600' }}>timely, organized assistance</span> when it matters most
          </p>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto 40px' }}>
            <StatCard icon={Clock} value="24/7" label="Emergency Support" />
            <StatCard icon={Globe} value="Real-time" label="Location Matching" />
            <StatCard icon={Zap} value="Instant" label="Resource Allocation" />
          </div>

          <button 
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }}
          >
            <Info size={24} />
            {showDetails ? 'Hide Mission Details' : 'Explore Our Mission'}
            <span style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', display: 'inline-block' }}>▼</span>
          </button>

          {showDetails && (
            <div style={{
              marginTop: '32px',
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #93c5fd',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '32px auto 0',
              textAlign: 'left',
              animation: 'slideDown 0.5s ease'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '900',
                background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px'
              }}>
                Bridging the Aid Gap
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.8', fontSize: '18px' }}>
                Helpora uses <span style={{ fontWeight: '700', color: '#3b82f6' }}>real-time geo-location</span> and intelligent resource tracking to match aid requests from victims with the nearest and most relevant NGO resources. Our platform ensures that help reaches those who need it most, when they need it most.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', width: '100%', maxWidth: '1200px', marginBottom: '80px' }}>
          <LandingButtonRaw 
            to="/aid-request" 
            icon={Send} 
            colorClass={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}
          >
            <div>I Need Urgent Help</div>
            <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.9, marginTop: '8px' }}>(Victim Portal)</span>
          </LandingButtonRaw>
          <LandingButtonRaw 
            to="/login" 
            icon={LogIn} 
            colorClass={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
            }}
          >
            NGO Partner Login
          </LandingButtonRaw>
          <LandingButtonRaw 
            to="/register" 
            icon={UserPlus} 
            colorClass={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            }}
          >
            Register New NGO
          </LandingButtonRaw>
        </div>

        {/* How it Works Section */}
        <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '900',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '64px'
          }}>
            How Helpora Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <HowItWorksStep 
              icon={Users}
              title="1. Connect"
              description="Victims request aid, and NGOs register their resources and availability in our centralized platform."
            />
            <HowItWorksStep 
              icon={Shield}
              title="2. Match"
              description="Our intelligent system matches victims with the nearest, most suitable NGO support based on location and resources."
            />
            <HowItWorksStep 
              icon={Truck}
              title="3. Deliver"
              description="NGOs are instantly notified and dispatched to provide timely and efficient assistance to those in need."
            />
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          maxWidth: '700px'
        }}>
          <p style={{ fontSize: '18px', color: '#374151', fontWeight: '500' }}>
            NGO access provides <span style={{ color: '#3b82f6', fontWeight: '700' }}>Dashboard</span>, <span style={{ color: '#9333ea', fontWeight: '700' }}>Inventory</span>, and <span style={{ color: '#ec4899', fontWeight: '700' }}>Shelter Allocation</span> tools
          </p>
        </div>
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;