/*
  Citation for the following helper function:
  Date: 2025-05-23
  Based on implementation guidance and AI-assisted support.
  ChatGpt Prompt: How do I create a reusable helper function in JavaScript that triggers a 
  browser download of a static file when called from a React component?
*/
export function downloadFile(filePath, filename) {
  const link = document.createElement("a");  // create a temporary anchor tag
  link.href = filePath;                      // set the URL to the file (must be public)
  link.download = filename;                  // set the name it will save as
  document.body.appendChild(link);           // attach it to the DOM (optional but safer)
  link.click();                              // trigger the click = download!
  document.body.removeChild(link);           // clean it up
}