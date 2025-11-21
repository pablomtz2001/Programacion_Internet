import React, { useState, useEffect } from 'react';
import './App.css';
import AISuggestions from './components/AISuggestions';
import UserManagement from './components/UserManagement';
import HealthStatus from './components/HealthStatus';

function App() {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000); // Actualizar cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/health`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Error fetching health status:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Micro-IA Platform</h1>
        <p>Plataforma de Microservicios con Inteligencia Artificial</p>
      </header>

      <nav className="App-nav">
        <button
          className={activeTab === 'suggestions' ? 'active' : ''}
          onClick={() => setActiveTab('suggestions')}
        >
          💡 Sugerencias IA
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        <button
          className={activeTab === 'health' ? 'active' : ''}
          onClick={() => setActiveTab('health')}
        >
          🏥 Estado del Sistema
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'suggestions' && <AISuggestions />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'health' && <HealthStatus healthStatus={healthStatus} />}
      </main>

      <footer className="App-footer">
        <p>Micro-IA Platform © 2024 - Arquitectura de Microservicios</p>
      </footer>
    </div>
  );
}

export default App;

