import React, { useState } from 'react';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      type: 'Medical Aid',
      description: 'Need emergency medical supplies and first aid',
      status: 'fulfilled',
      priority: 'high',
      requestDate: '2024-10-05',
      fulfilledDate: '2024-10-06',
      ngoName: 'Red Cross Society',
      responseTime: '1 day',
      criteria: {
        urgency: 'Met',
        documentation: 'Met',
        eligibility: 'Met'
      }
    },
    {
      id: 'REQ002',
      type: 'Food & Water',
      description: 'Food supplies for family of 5 for 1 week',
      status: 'in-progress',
      priority: 'high',
      requestDate: '2024-10-08',
      fulfilledDate: null,
      ngoName: 'Food Bank India',
      responseTime: '4 days (pending)',
      criteria: {
        urgency: 'Met',
        documentation: 'Met',
        eligibility: 'Met'
      }
    },
    {
      id: 'REQ003',
      type: 'Shelter',
      description: 'Temporary shelter assistance',
      status: 'pending',
      priority: 'medium',
      requestDate: '2024-10-10',
      fulfilledDate: null,
      ngoName: 'Pending Assignment',
      responseTime: '2 days (pending)',
      criteria: {
        urgency: 'Under Review',
        documentation: 'Met',
        eligibility: 'Under Review'
      }
    },
    {
      id: 'REQ004',
      type: 'Financial Aid',
      description: 'Emergency financial assistance for rent',
      status: 'rejected',
      priority: 'low',
      requestDate: '2024-09-28',
      fulfilledDate: '2024-09-30',
      ngoName: 'Relief Fund Organization',
      responseTime: '2 days',
      criteria: {
        urgency: 'Not Met',
        documentation: 'Met',
        eligibility: 'Not Met'
      }
    },
    {
      id: 'REQ005',
      type: 'Medical Aid',
      description: 'Prescription medicines for chronic condition',
      status: 'fulfilled',
      priority: 'medium',
      requestDate: '2024-09-20',
      fulfilledDate: '2024-09-25',
      ngoName: 'Health Aid Foundation',
      responseTime: '5 days',
      criteria: {
        urgency: 'Met',
        documentation: 'Met',
        eligibility: 'Met'
      }
    }
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'fulfilled': 
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0'
        };
      case 'in-progress': 
        return {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        };
      case 'pending': 
        return {
          backgroundColor: '#fef9c3',
          color: '#854d0e',
          border: '1px solid #fef08a'
        };
      case 'rejected': 
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca'
        };
      default: 
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #e5e7eb'
        };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'fulfilled': return '✓';
      case 'in-progress': return '⏳';
      case 'pending': return '⚠';
      case 'rejected': return '✗';
      default: return '•';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#ea580c';
      case 'low': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getCriteriaIcon = (status) => {
    if (status === 'Met') return '✓';
    if (status === 'Not Met') return '✗';
    return '⋯';
  };

  const getCriteriaColor = (status) => {
    if (status === 'Met') return '#16a34a';
    if (status === 'Not Met') return '#dc2626';
    return '#6b7280';
  };

  const stats = {
    total: requests.length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    pending: requests.filter(r => r.status === 'pending').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>My Requests</h1>
          <p style={{ color: '#6b7280' }}>Track all your assistance requests and their status</p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            borderLeft: '4px solid #6366f1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Requests</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</p>
              </div>
              <span style={{ fontSize: '32px' }}>📦</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            borderLeft: '4px solid #22c55e'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Fulfilled</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.fulfilled}</p>
              </div>
              <span style={{ fontSize: '32px' }}>✓</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>In Progress</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{stats.inProgress}</p>
              </div>
              <span style={{ fontSize: '32px' }}>⏳</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            borderLeft: '4px solid #eab308'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Pending</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>{stats.pending}</p>
              </div>
              <span style={{ fontSize: '32px' }}>⚠</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Rejected</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{stats.rejected}</p>
              </div>
              <span style={{ fontSize: '32px' }}>✗</span>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((request) => (
            <div key={request.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px',
              transition: 'box-shadow 0.3s'
            }}>
              {/* Request Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>{request.type}</h3>
                    <span style={{
                      ...getStatusStyle(request.status),
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{getStatusIcon(request.status)}</span>
                      {request.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getPriorityColor(request.priority)
                    }}>
                      {request.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>{request.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Request ID</p>
                  <p style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#4b5563'
                  }}>{request.id}</p>
                </div>
              </div>

              {/* Request Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Request Date</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
                      {request.requestDate}
                    </p>
                  </div>
                </div>

                {request.fulfilledDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <div>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>Fulfilled Date</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
                        {request.fulfilledDate}
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Assigned NGO</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
                      {request.ngoName}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>⏱️</span>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Response Time</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>
                      {request.responseTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Criteria Check */}
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4b5563',
                  marginBottom: '8px'
                }}>Eligibility Criteria:</p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {Object.entries(request.criteria).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f9fafb',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <span style={{
                        fontSize: '18px',
                        color: getCriteriaColor(value)
                      }}>
                        {getCriteriaIcon(value)}
                      </span>
                      <div>
                        <p style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          textTransform: 'capitalize'
                        }}>{key}</p>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: getCriteriaColor(value)
                        }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}