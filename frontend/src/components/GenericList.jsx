import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

/**
 * GenericList.jsx
 *
 * Component generated with assistance from OpenAI’s ChatGPT on May 4, 2025.
 * Responsible for fetching and displaying data from a given API endpoint.
 */

export default function GenericList({ endpoint, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Fetch ${endpoint} failed:`, err);
        setError(err);
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) return <p>Loading {title}…</p>;
  if (error)   return <p>Error loading {title}.</p>;
  if (!data.length) return <p>No {title.toLowerCase()} found.</p>;

  const columns = Object.keys(data[0]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{title}</h1>
      <table>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => <td key={col}>{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
