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