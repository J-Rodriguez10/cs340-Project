import { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';
import { formatColumnName, formatDateTime } from '../helper/formattingHelper';
import GenericCreateForm from './helper-genericlist/GenericCreateForm';
import DateTimePicker from './DateTimePicker'; // Import the DateTimePicker component
import WideButton from './WideButton';
import { PlusSignIcon } from '../icons/MiscellaneousIcons';
import { PencilIcon, TrashbinIcon } from '../icons/GenericListIcons';
import GenericListHeader from './helper-genericlist/GenericListHeader';

/**
 * GenericList.jsx
 *
 * Component generated with assistance from OpenAI's ChatGPT on May 4, 2025.
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
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [movieDetails, setMovieDetails] = useState({});

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

   // List of fields treated as foreign keys
  const foreignKeyFields = ['movieID', 'employeeID', 'customerID', 'roleID', 'screeningID'];


   // Helper function to check if a column is a foreign key
   const isForeignKey = (column) => foreignKeyFields.includes(column);

  // Determine if a field should use DateTimePicker
  const isDateTimeField = (column) => {
    const dateTimeFields = ['startTime', 'endTime', 'purchaseDate'];
    return dateTimeFields.includes(column);
  };

  // Fetch movie details for screenings - datetime picker
  const fetchMovieDetails = async (movieID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieID}`);
      if (response.ok) {
        const movie = await response.json();
        setMovieDetails(movie);
      }
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
    }
  };

  // Calculate end time based on start time and movie runtime - datetime picker
  const calculateEndTime = (startTime, runtime) => {
    if (!startTime || !runtime) return '';
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (runtime * 60000)); // runtime in minutes
    return end.toISOString();
  };

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

  const fetchDropdownOptions = async () => {
    try {
      const promises = foreignKeyFields.map(async (field) => {
        try {
          // ✅ Special case for roleID → maps to /employeeRoles/options
          let path = `${field.replace('ID', '')}s`;
          if (field === 'roleID') path = 'employeeRoles';

          const response = await fetch(`${API_BASE_URL}/${path}/options`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return [field, data]; // Return key-value pair: [fieldName, options[]]
        } catch (err) {
          console.error(`Failed to fetch options for ${field}:`, err);
          return [field, []];
        }
      });

      const results = await Promise.all(promises);
      const mapped = Object.fromEntries(results);
      setDropdownOptions(mapped);
    } catch (err) {
      console.error('Failed to fetch dropdown options:', err);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Only fetch dropdown options if there are foreign keys to display
    if (foreignKeyFields.length > 0) {
      fetchDropdownOptions();
    }
  }, [endpoint]);

  // Fetch movie details when editing a screening - datetime picker
  useEffect(() => {
    if (endpoint === '/screenings' && editFormData.movieID) {
      fetchMovieDetails(editFormData.movieID);
    }
  }, [editFormData.movieID, endpoint]);

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
    const formData = {...row};
    
    // For foreign key fields that might be concatenated strings like "1 - Movie Title",
    // Extract just the ID part for the form data
    Object.keys(formData).forEach(key => {
      if (isForeignKey(key) && typeof formData[key] === 'string' && formData[key].includes(' - ')) {
        // Extract just the ID part (before the " - ")
        const idPart = formData[key].split(' - ')[0];
        if (!isNaN(Number(idPart))) {
          formData[key] = idPart;
        }
      }
    });

    setEditFormData(formData);
  };

  // Handle form input changes when editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...editFormData,
      [name]: value
    };
    
    // Special handling for screenings - datetime picker
    if (endpoint === '/screenings') {
      if (name === 'startTime' && movieDetails.runtime) {
        // Auto-calculate end time when start time changes
        const endTime = calculateEndTime(value, movieDetails.runtime);
        newFormData.endTime = endTime;
      } else if (name === 'movieID') {
        // Clear end time when movie changes
        newFormData.endTime = '';
      }
    }
    
    setEditFormData(newFormData);
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

  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    // Special case for movie runtime since this is not a timestamp
    if (column === 'runtime') {
      // Convert minutes to hours and minutes format
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    }

    // Format date/time fields
    if (
      column.toLowerCase().includes('time') || 
      column.toLowerCase().includes('date') ||
      column !== 'runtime' &&  // Excludes runtime
      (typeof value === 'string' && 
        (value.includes('T') && value.includes('Z') && value.includes('-')))
    ) {
      try {
        return formatDateTime(value);
      } catch (e) {
        // If the formatting fails, return the original value
        return value;
      }
    }
    
    return value;
  };

  // Render input field based on type (text input, dropdown, or datetime picker)
  const renderEditInputField = (col, value) => {
    if (isForeignKey(col)) {
      // Render dropdown for foreign keys
      return (
        <select
          name={col}
          value={value || ""}
          onChange={handleEditInputChange}
          disabled={col === idField}
          style={{ width: '100%', padding: '4px', borderRadius: '3px', border: '1px solid #ccc' }}
        >
          <option value="">Select {formatColumnName(col)}</option>
          {(dropdownOptions[col] || []).map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    } else if (isDateTimeField(col)) {
      // Render DateTimePicker for datetime fields - datetime picker
      return (
        <DateTimePicker
          name={col}
          value={value || ""}
          onChange={handleEditInputChange}
          style={{ width: '100%', padding: '4px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
      );
    } else {
      // Render text input for regular fields
      return (
        <input
          type="text"
          name={col}
          value={value || ""}
          onChange={handleEditInputChange}
          disabled={col === idField} // Disables the editing of the ID field
          style={{ width: '100%', padding: '4px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
      );
    }
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
    <div className="generic-list-cont">
      <div className="generic-list-top-section">
        {/* Create Form */}
        {!showCreateForm ? (
          <WideButton icon={PlusSignIcon} onClick={toggleCreateForm}>Create New {title.slice(0, -1)}</WideButton>
        ) : (
          <GenericCreateForm
            columns={columns}
            newFormData={newFormData}
            idField={idField}
            handleCreateInputChange={handleCreateInputChange}
            handleCreate={handleCreate}
            toggleCreateForm={toggleCreateForm}
            foreignKeyFields={foreignKeyFields}     // Added: Pass the array of foreign key fields
            isForeignKey={isForeignKey}             // Added: Pass the helper function
            dropdownOptions={dropdownOptions}       // Added: Pass the already fetched options
            endpoint={endpoint}                     // Added: Pass endpoint to determine special behavior - datetime picker
          />
        )}
      </div>

      {/* Entity-Cont = Entity-header + Entity-Table */}
      <div className="entity-cont">
        {/* Entity Header */}
        <GenericListHeader title={title}/>

        {/* Entity Table */}
        {data.length > 0 && (
          <table className="entity-table" style={{ width: '100%' }}>
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
                          {renderEditInputField(col, editFormData[col])}
                        </td>
                      ))}
                      <td>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                        {/* Show movie runtime info for screenings - datetime picker enhancement */}
                        {endpoint === '/screenings' && movieDetails.runtime && (
                          <div style={{ fontSize: '11px', color: '#4a90e2', marginTop: '4px' }}>
                            Runtime: {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    // Displays the mode row
                    <>
                      {columns.map(col => <td key={col}>{formatCellValue(row[col], col)}</td>)}
                      <td className="generic-list-buttons">
                        <button onClick={() => handleEdit(row)}>{PencilIcon}</button>
                        <button onClick={() => handleDelete(row[idField])}>{TrashbinIcon}</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>   
    </div>
  );
}