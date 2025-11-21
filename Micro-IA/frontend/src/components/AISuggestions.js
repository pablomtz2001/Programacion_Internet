import React, { useState } from 'react';
import axios from 'axios';

const AISuggestions = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [maxSuggestions, setMaxSuggestions] = useState(5);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const response = await axios.post(`${API_URL}/api/ai/suggestions`, {
        prompt,
        context: context || undefined,
        max_suggestions: maxSuggestions
      });

      setSuggestions(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al obtener sugerencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>💡 Sugerencias de Inteligencia Artificial</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">¿Sobre qué necesitas sugerencias? *</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Cómo mejorar mi productividad, estrategias de negocio, etc."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="context">Contexto adicional (opcional)</label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Proporciona más detalles sobre tu situación o necesidades..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxSuggestions">Número de sugerencias</label>
          <input
            id="maxSuggestions"
            type="number"
            min="1"
            max="10"
            value={maxSuggestions}
            onChange={(e) => setMaxSuggestions(parseInt(e.target.value))}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generando sugerencias...' : 'Obtener Sugerencias'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">⏳ Generando sugerencias inteligentes...</div>}

      {suggestions && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>
            Sugerencias Generadas
          </h3>
          {suggestions.reasoning && (
            <p style={{ marginBottom: '1rem', color: '#666', fontStyle: 'italic' }}>
              {suggestions.reasoning}
            </p>
          )}
          <ul className="suggestions-list">
            {suggestions.suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">
                <strong>{index + 1}.</strong> {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;

