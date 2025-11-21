import React from 'react';

const HealthStatus = ({ healthStatus }) => {
  if (!healthStatus) {
    return (
      <div className="card">
        <h2>🏥 Estado del Sistema</h2>
        <div className="loading">Cargando estado de los servicios...</div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    if (status === 'healthy') return 'status-healthy';
    if (status === 'unhealthy') return 'status-unhealthy';
    return 'status-unreachable';
  };

  const getStatusText = (status) => {
    if (status === 'healthy') return 'Saludable';
    if (status === 'unhealthy') return 'No Saludable';
    return 'Inaccesible';
  };

  return (
    <div className="card">
      <h2>🏥 Estado del Sistema</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Estado General</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={`status-badge ${getStatusClass(healthStatus.gateway)}`}>
            Gateway: {getStatusText(healthStatus.gateway)}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Estado de Microservicios</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(healthStatus.services || {}).map(([service, status]) => (
            <div
              key={service}
              style={{
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {service.replace('-', ' ')}
              </span>
              <span className={`status-badge ${getStatusClass(status)}`}>
                {getStatusText(status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#004085' }}>
          <strong>ℹ️ Información:</strong> El estado se actualiza automáticamente cada 30 segundos.
        </p>
      </div>
    </div>
  );
};

export default HealthStatus;

