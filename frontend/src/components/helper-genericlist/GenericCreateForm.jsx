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
  columns,                  // List of column names for the entity
  newFormData,              // Current state of form data
  idField,                  // Primary key field to exclude from the form
  handleCreateInputChange,  // Handler for input changes
  handleCreate,             // Form submission handler
  toggleCreateForm,         // Toggles form visibility
  foreignKeyFields,         // Array of field names that are foreign keys
  isForeignKey,             // Function to check if a field is a foreign key
  dropdownOptions           // Object containing dropdown options for foreign keys
}) {
  // Local state for dropdown options - only used if props.dropdownOptions isn't provided
  const [localDropdownOptions, setLocalDropdownOptions] = useState({});

  // Use the provided dropdownOptions prop if available, otherwise use local state
  const options = dropdownOptions || localDropdownOptions;

  // Only fetch options if they weren't provided as props
  useEffect(() => {
    // Skip fetching if options were provided as props
    if (dropdownOptions && Object.keys(dropdownOptions).length > 0) {
      return;
    }

    const fetchDropdowns = async () => {
      const promises = (foreignKeyFields || []).map(async (field) => {
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
      setLocalDropdownOptions(mapped);
    };

    // Only fetch if we have foreign key fields and no options provided as props
    if ((foreignKeyFields || []).length > 0 && (!dropdownOptions || Object.keys(dropdownOptions).length === 0)) {
      fetchDropdowns();
    }
  }, [foreignKeyFields, dropdownOptions]);

  // For backward compatibility, if isForeignKey isn't provided, use a local version
  const checkIsForeignKey = isForeignKey || 
    ((column) => (foreignKeyFields || ['movieID', 'employeeID', 'customerID', 'employeeRoleID', 'screeningID']).includes(column));

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
            {checkIsForeignKey(col) ? (
              <select
                name={col}
                value={newFormData[col] || ""}
                onChange={handleCreateInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select {formatColumnName(col)}</option>
                {(options[col] || []).map(opt => (
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
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            )}
          </div>
        ))}

        {/* Submit and cancel buttons */}
        <div>
          <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>Save</button>
          <button type="button" onClick={toggleCreateForm} style={{ padding: '8px 16px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}