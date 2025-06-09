
/* 
  Citation for the following DurationPicker component:
  AI Source: https://claude.ai/new
  Prompt: Can you help me build a custom input that lets users pick a duration using hours and minutes, but
  stores it as total minutes?
*/
const DurationPicker = ({ 
  name, 
  value, 
  onChange, 
  required = false, 
  style = {},
  disabled = false
}) => {
  // Convert total minutes to hours and minutes
  const minutesToHoursAndMins = (totalMinutes) => {
    if (!totalMinutes || isNaN(totalMinutes)) return { hours: 0, minutes: 0 };
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  // Convert hours and minutes to total minutes
  const hoursAndMinsToMinutes = (hours, minutes) => {
    return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  };

  const { hours, minutes } = minutesToHoursAndMins(value);

  const handleHoursChange = (e) => {
    const newHours = e.target.value;
    const totalMinutes = hoursAndMinsToMinutes(newHours, minutes);
    onChange({
      target: {
        name: name,
        value: totalMinutes
      }
    });
  };

  const handleMinutesChange = (e) => {
    const newMinutes = e.target.value;
    const totalMinutes = hoursAndMinsToMinutes(hours, newMinutes);
    onChange({
      target: {
        name: name,
        value: totalMinutes
      }
    });
  };

  const defaultStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    ...style
  };

  const inputStyle = {
    width: '60px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    textAlign: 'center'
  };

  return (
    <div style={defaultStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number"
          min="0"
          max="10"
          value={hours || ''}
          onChange={handleHoursChange}
          disabled={disabled}
          required={required}
          style={inputStyle}
          placeholder="0"
        />
        <span style={{ fontSize: '14px', color: '#4a90e2' }}>h</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes || ''}
          onChange={handleMinutesChange}
          disabled={disabled}
          style={inputStyle}
          placeholder="0"
        />
        <span style={{ fontSize: '14px', color: '#4a90e2' }}>m</span>
      </div>
      
      <span style={{ fontSize: '12px', color: '#4a90e2', marginLeft: '8px' }}>
        ({value || 0} minutes total)
      </span>
    </div>
  );
};

export default DurationPicker;