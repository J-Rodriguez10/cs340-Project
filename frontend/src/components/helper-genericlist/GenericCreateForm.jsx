import { useEffect, useState } from "react";
import { formatColumnName } from "../../helper/formattingHelper";
import { API_BASE_URL } from "../../config";


// Citation for the following code:
// Date: 2025-05-18
// ChatGPT
// Prompt: Build me a reusable React component that dynamically generates form fields,
// includes dropdowns for foreign key fields using async fetch from backend endpoints.
// Also make it handle form submission.
// Reusable form component to create new entries for any entity


export default function GenericCreateForm({
  columns,                // List of column names for the entity
  newFormData,            // Current state of form data
  idField,                // Primary key field to exclude from the form
  handleCreateInputChange, // Handler for input changes
  handleCreate,           // Form submission handler
  toggleCreateForm        // Toggles form visibility
}) {

  // Holds dropdown options for foreign key fields
  const [dropdownOptions, setDropdownOptions] = useState({});

  // List of fields treated as foreign keys
  const foreignKeyFields = ['movieID', 'employeeID', 'customerID', 'employeeRoleID', 'screeningID'];

  // Helper function to check if a column is a foreign key
  const isForeignKey = (column) => foreignKeyFields.includes(column);

  // Fetch dropdown options for all foreign key fields when component mounts
  useEffect(() => {
    const fetchDropdowns = async () => {
      const promises = foreignKeyFields.map(async (field) => {
        try {
          // Build URL and fetch options for each FK field
          const response = await fetch(`${API_BASE_URL}/${field.replace('ID', '')}s/options`);
          const data = await response.json();
          return [field, data]; // Return key-value pair: [fieldName, options[]]
        } catch (err) {
          console.error(`Failed to fetch options for ${field}:`, err);
          return [field, []]; // Fallback to empty array on error
        }
      });

      // Convert array of key-value pairs into an object for easier access
      const results = await Promise.all(promises);
      const mapped = Object.fromEntries(results);
      setDropdownOptions(mapped);
    };

    fetchDropdowns();
  }, []);

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
      <h3>Create New Entry</h3>
      <form onSubmit={handleCreate}>
        {/* Loop through columns except ID field to render form inputs */}
        {columns.filter(col => col !== idField).map(col => (
          <div key={col} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {formatColumnName(col)}:
            </label>

            {/* Render <select> if column is a foreign key, otherwise <input> */}
            {isForeignKey(col) ? (
              <select
                name={col}
                value={newFormData[col] || ""}
                onChange={handleCreateInputChange}
                required
              >
                <option value="">Select {formatColumnName(col)}</option>
                {(dropdownOptions[col] || []).map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={col}
                value={newFormData[col] || ""}
                onChange={handleCreateInputChange}
                // Optional fields like phoneNumber or endTime are not required
                required={col !== 'phoneNumber' && col !== 'endTime'}
              />
            )}
          </div>
        ))}

        {/* Submit and cancel buttons */}
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={toggleCreateForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}