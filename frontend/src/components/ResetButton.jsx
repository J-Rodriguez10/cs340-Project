import { API_BASE_URL } from "../config";

function ResetButton() {
  const handleReset = async () => {
    const confirmReset = window.confirm("HOLD ON: Are you sure you want to RESET the entire database?");

    if (!confirmReset) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reset-db`);
      if (response.ok) {
        alert("Database reset successfully!");
        window.location.reload();
      } else {
        alert("Reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during reset:", error);
      alert("An error occurred during reset.");
    }
  };

  return (
    <button className="reset-button" onClick={handleReset}>
      Reset Database
    </button>
  );
}

export default ResetButton;
