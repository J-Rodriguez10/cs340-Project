// Converts camelCase to "Title Case"
export function formatColumnName(camelCase) {
  if (!camelCase) return "";

  const spaced = camelCase.replace(/([A-Z])/g, " $1");
  let formatted = spaced.charAt(0).toUpperCase() + spaced.slice(1);

  // Replace common acronyms
  formatted = formatted.replace(/\bI D\b/, "ID");
  formatted = formatted.replace(/\bU R L\b/, "URL");
  formatted = formatted.replace(/\bA P I\b/, "API");

  return formatted;
}

/**
formattingHelper.js
* Date: May 14, 2025
Prompts used:
* 1. "Help me reformat the time and date being displayed in our tables."
 AI Source: https://claude.ai/new
*/

export function formatDateTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleString('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}



export function formatTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleString('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}


// Format date only from datetime
export function formatDate(isoString) {
  if (!isoString) return "";
  
  const date = new Date(isoString);
  
  // Checks if the date is valid
  if (isNaN(date.getTime())) {
    return isoString; // Returns original string if not a valid date
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}