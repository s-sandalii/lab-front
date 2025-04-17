
import React, { useState } from 'react';

export default function ContaminationForm({ onSubmit }) {
  const [reason, setReason] = useState('MOLD');
  const [count, setCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (count > 0) {
      onSubmit({ reason, count });
      setCount(0);
      setReason('MOLD');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contamination-form">
      <div className="form-group">
        <label>Contaminated Count</label>
        <input
          type="number"
          min="0"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          required
        />
      </div>
      <div className="form-group">
        <label>Reason</label>
        <select value={reason} onChange={e => setReason(e.target.value)}>
          <option value="MOLD">Mold</option>
          <option value="BACTERIA">Bacteria</option>
          <option value="TEMPERATURE">Temperature</option>
          <option value="HUMIDITY">Humidity</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <button className="btn btn-primary" type="submit">Update Contamination</button>
    </form>
  );
}
