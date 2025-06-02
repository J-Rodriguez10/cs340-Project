import { useEffect, useState } from "react";
import { formatColumnName } from "../../helper/formattingHelper";
import { API_BASE_URL } from "../../config";
import DateTimePicker from "../DateTimePicker";
import DurationPicker from "../DurationPicker";

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
  dropdownOptions,          // Object containing dropdown options for foreign keys
  endpoint                  // Endpoint to determine special behavior - datetime picker enhancement
}) {
  // Local state for dropdown options - only used if props.dropdownOptions isn't provided
  const [localDropdownOptions, setLocalDropdownOptions] = useState({});
  const [movieDetails, setMovieDetails] = useState({}); // Store movie runtime for calculating end time - datetime picker enhancement

  // Use the provided dropdownOptions prop if available, otherwise use local state
  const options = dropdownOptions || localDropdownOptions;

  // Helper function to convert minutes to HH:MM format
  const minutesToTimeString = (minutes) => {
    if (!minutes || isNaN(minutes)) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Helper function to convert HH:MM format to minutes
  const timeStringToMinutes = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '';
    return (hours * 60) + minutes;
  };

  // Fetch movie details when movieID changes (for screenings) - datetime picker enhancement
  useEffect(() => {
    if (endpoint === '/screenings' && newFormData.movieID) {
      fetchMovieDetails(newFormData.movieID);
    }
  }, [newFormData.movieID, endpoint]);

  // Set current time for purchase date when creating tickets - datetime picker enhancement
  useEffect(() => {
    if (endpoint === '/tickets' && !newFormData.purchaseDate) {
      const currentTime = new Date().toISOString();
      handleCreateInputChange({
        target: {
          name: 'purchaseDate',
          value: currentTime
        }
      });
    }
  }, [endpoint]);

  const fetchMovieDetails = async (movieID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }
      const movie = await response.json();
      
      // Validate that movie has runtime for calculations
      if (!movie.runtime || isNaN(movie.runtime)) {
        console.warn('Movie runtime is missing or invalid');
        setMovieDetails({ ...movie, runtime: null });
      } else {
        setMovieDetails(movie);
      }
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      // Provide user feedback
      alert('Warning: Could not the load movie details for runtime calculation');
      setMovieDetails({});
    }
  };

  // Calculate end time based on start time and movie runtime - datetime picker enhancement
  const calculateEndTime = (startTime, runtime) => {
    if (!startTime || !runtime) return '';
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (runtime * 60000)); // runtime in minutes
    return end.toISOString();
  };

  // Enhanced input change handler for special cases - datetime picker enhancement
  const handleEnhancedInputChange = (e) => {
    const { name, value } = e.target;
    
    // Create updated form data
    const updatedFormData = {
      ...newFormData,
      [name]: value
    };

    // Call the original handler first
    handleCreateInputChange(e);

    // Special handling for screenings - datetime picker enhancement
    if (endpoint === '/screenings' && name === 'startTime' && movieDetails.runtime) {
      const endTime = calculateEndTime(value, movieDetails.runtime);
      if (endTime) {
        // Immediately update end time
        handleCreateInputChange({
          target: { name: 'endTime', value: endTime }
        });
      }
    }
  };

  // Update end time when movie details are loaded - datetime picker enhancement
  useEffect(() => {
    if (endpoint === '/screenings' && movieDetails.runtime && newFormData.startTime) {
      const endTime = calculateEndTime(newFormData.startTime, movieDetails.runtime);
      if (endTime && endTime !== newFormData.endTime) {
        handleCreateInputChange({
          target: { name: 'endTime', value: endTime }
        });
      }
    }
  }, [movieDetails.runtime, newFormData.startTime]);

  // Only fetch options if they weren't provided as props
  useEffect(() => {
    // Skip fetching if options were provided as props
    if (dropdownOptions && Object.keys(dropdownOptions).length > 0) {
      return;
    }

    const fetchDropdowns = async () => {
      const promises = (foreignKeyFields || []).map(async (field) => {
        try {
          // Special case for roleID → maps to /employeeRoles/options
          let path = `${field.replace('ID', '')}s`;
          if (field === 'roleID') path = 'employeeRoles';
          
          const response = await fetch(`${API_BASE_URL}/${path}/options`);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
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
    ((column) => (foreignKeyFields || ['movieID', 'employeeID', 'customerID', 'roleID', 'screeningID']).includes(column));

  // Determine if a field should use DateTimePicker - datetime picker enhancement
  const isDateTimeField = (column) => {
    const dateTimeFields = ['startTime', 'endTime', 'purchaseDate'];
    return dateTimeFields.includes(column);
  };

  // Render appropriate input field based on type - for datetime picker and runtime
  const renderInputField = (col) => {
    if (checkIsForeignKey(col)) {
      // Render dropdown for foreign keys
      return (
        <select
          name={col}
          value={newFormData[col] || ""}
          onChange={handleEnhancedInputChange}
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
      );
    } else if (isDateTimeField(col)) {
      // Render DateTimePicker for datetime fields - datetime picker enhancement
      return (
        <DateTimePicker
          name={col}
          value={newFormData[col] || ""}
          onChange={handleEnhancedInputChange}
          required={col !== 'endTime'} // endTime is auto-calculated for screenings
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      );
    } else if (col === 'runtime') {
      // Special handling for runtime - use duration picker
      return (
        <DurationPicker
          name={col}
          value={newFormData[col] || ""}
          onChange={handleEnhancedInputChange}
          required
          style={{ width: '100%' }}
        />
      );
    } else {
      // Render regular text input
      return (
        <input
          type="text"
          name={col}
          value={newFormData[col] || ""}
          onChange={handleEnhancedInputChange}
          // Optional fields like phoneNumber or endTime are not required
          required={col !== 'phoneNumber' && col !== 'endTime'}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      );
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
      <h3>Create New Entry</h3>
      <form onSubmit={handleCreate}>
        {/* Loop through columns except ID field to render form inputs */}
        {columns.filter(col => col !== idField).map(col => (
          <div key={col} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {formatColumnName(col)}:
              {/* Show additional info for auto-calculated fields - datetime picker*/}
              {endpoint === '/screenings' && col === 'endTime' && (
                <span style={{ fontSize: '12px', color: '#4a90e2', fontStyle: 'italic' }}>
                  {' '}(Auto-calculated based on start time and movie runtime - No need to fill)
                </span>
              )}
              {endpoint === '/tickets' && col === 'purchaseDate' && (
                <span style={{ fontSize: '12px', color: '#4a90e2', fontStyle: 'italic' }}>
                  {' '}(Defaults to current time)
                </span>
              )}
            </label>

            {/* Render <select> if column is a foreign key, <DateTimePicker> for datetime fields, <time> for runtime, otherwise <input> */}
            {renderInputField(col)}
          </div>
        ))}

        {/* Show selected movie runtime for reference in screenings - datetime picker*/}
        {endpoint === '/screenings' && movieDetails.runtime && (
          <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <small style={{ color: '#4a90e2' }}>
              Selected movie runtime: {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
            </small>
          </div>
        )}

        {/* Submit and cancel buttons */}
        <div>
          <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>Save</button>
          <button type="button" onClick={toggleCreateForm} style={{ padding: '8px 16px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}