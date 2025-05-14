import { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';
import { formatColumnName } from '../helper/formattingHelper';
/**
 * GenericList.jsx
 *
 * Component generated with assistance from OpenAI’s ChatGPT on May 4, 2025.
 * Responsible for fetching and displaying data from a given API endpoint.
 */

/**
GenericList.jsx
* Date: May 7, 2025
Prompts used:
* 1. "Create a React component that fetches data from a given API endpoint and displays it in a table format.
 The component should also allow for editing, creating and deleting entries."
 AI Source: https://claude.ai/new
*/

export default function GenericList({ endpoint, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormData, setNewFormData] = useState({});

  // Determine the ID field based on the endpoint
  const getIdField = () => {
    // Endpoints to their corresponding ID fields based on the DB schema
    const idFieldMap = {
      '/customers': 'customerID',
      '/employees': 'employeeID',
      '/employeeRoles': 'roleID',
      '/movies': 'movieID',
      '/screenings': 'screeningID',
      '/tickets': 'ticketID'
    };
    return idFieldMap[endpoint] || 'id'; // default to 'id' if not found
  };

  // Stores the ID field
  const idField = getIdField();

  // Fetch data from API, updated to use try-catch for error handling
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(`Fetch ${endpoint} failed:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // Handle delete operation
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${title.slice(0, -1)}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Refreshes data after successful delete and shows success or error message.
      await fetchData();
      alert(`${title.slice(0, -1)} Deleted Successfully`);
    } catch (err) {
      console.error(`Delete ${endpoint}/${id} failed:`, err);
      alert(`Error deleting ${title.slice(0, -1)}`);
    }
  };

  // Handles the edit operation
  const handleEdit = (row) => {
    setEditingId(row[idField]);
    setEditFormData({...row});
  };

  // Handle form input changes when editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle form input changes when creating
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData({
      ...newFormData,
      [name]: value
    });
  };

  // Saves the edited data
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Refreshes data and shows success or error message. 
      await fetchData();
      setEditingId(null);
      alert(`${title.slice(0, -1)} Updated Successfully`);
    } catch (err) {
      console.error(`Update ${endpoint}/${editingId} failed:`, err);
      alert(`Error updating ${title.slice(0, -1)}`);
    }
  };

  // Creates a new entry
  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFormData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Refreshes data and shows success or error message.
      await fetchData();
      setNewFormData({});
      setShowCreateForm(false);
      alert(`${title.slice(0, -1)} Created Successfully`);
    } catch (err) {
      console.error(`Create ${endpoint} failed:`, err);
      alert(`Error creating ${title.slice(0, -1)}`);
    }
  };

  // Cancels from being in editing mode
  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Toggles the create form
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setNewFormData({});
  };

  if (loading) return <p>Loading {title}…</p>;
  if (error) return <p>Error loading {title}.</p>;
  if (!data.length && !showCreateForm) return (
    <div>
      <p>No {title.toLowerCase()} found.</p>
      <button onClick={toggleCreateForm}>Create New {title.slice(0, -1)}</button>
    </div>
  );

  const columns = data.length ? Object.keys(data[0]) : [];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{title}</h2>
      
      {/* Create Form */}
      {!showCreateForm ? (
        <button onClick={toggleCreateForm}>Create New {title.slice(0, -1)}</button>
      ) : (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h3>Create New {title.slice(0, -1)}</h3>
          <form onSubmit={handleCreate}>
            {columns.filter(col => col !== idField).map(col => (
              <div key={col} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{col}:</label>
                <input
                  type="text"
                  name={col}
                  value={newFormData[col] || ""}
                  onChange={handleCreateInputChange}
                  required={col !== 'phoneNumber' && col !== 'endTime'}
                />
              </div>
            ))}
            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={toggleCreateForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Data Table */}
      {data.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              {columns.map(col => <th key={col}>{formatColumnName(col)}</th>)}
              <th>Add/Edit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[idField]}>
                {editingId === row[idField] ? (
                  // Edits the mode row to show the edit form
                  <>
                    {columns.map(col => (
                      <td key={col}>
                        <input
                          type="text"
                          name={col}
                          value={editFormData[col] || ""}
                          onChange={handleEditInputChange}
                          disabled={col === idField} // Disable editing of the ID field when editing
                        />
                      </td>
                    ))}
                    <td>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  // Displays the mode row
                  <>
                    {columns.map(col => <td key={col}>{row[col]}</td>)}
                    <td>
                      <button onClick={() => handleEdit(row)}>Edit</button>
                      <button onClick={() => handleDelete(row[idField])}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
