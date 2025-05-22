import React from 'react';

/**
DateTimePicker.jsx, GenericList.jsx, GenericCreateForm.jsx
* Date: May 21, 2025
Prompts used:
* 1. "Help me implement a date time picker in React when updating and adding in my tickets and screenings pages."
* 2. "How would I make it so that it can fetch the runtimes of the movies, so the end time would can be auto calculated based on the 
runtime and starting time."
 AI Source: https://claude.ai/new
*/

const DateTimePicker = ({ 
  name, 
  value, 
  onChange, 
  required = false, 
  style = {},
  min,
  max 
}) => {
  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
  const formatForDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Adjust for timezone offset to get the local time
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString().slice(0, 16);
  };

  // Convert datetime-local format back to ISO string
  const formatToISO = (dateTimeLocal) => {
    if (!dateTimeLocal) return '';
    return new Date(dateTimeLocal).toISOString();
  };

  const handleChange = (e) => {
    const isoValue = formatToISO(e.target.value);
    onChange({
      target: {
        name: name,
        value: isoValue
      }
    });
  };

  const defaultStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    ...style
  };

  return (
    <input
      type="datetime-local"
      name={name}
      value={formatForDateTimeLocal(value)}
      onChange={handleChange}
      required={required}
      style={defaultStyle}
      min={min ? formatForDateTimeLocal(min) : undefined}
      max={max ? formatForDateTimeLocal(max) : undefined}
    />
  );
};

export default DateTimePicker;