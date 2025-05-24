// Citation for the following code:
// Date: 2025-05-19
// AI-assisted structure.
// Prompt: Can you help me create a reusable React component named `WideButton`
// that accepts props for click behavior, optional icon, styling variants, and custom
// dimensions, and renders a styled button element? I will handle the styling, just 
// give me the structure. 

function WideButton({
  onClick,
  children,
  icon = null,
  className = "",
  type = "button",
  variant = "blue",
  width,
  height,
}) {
  const variantClass =
    variant === "black" ? "wide-button-black" : "wide-button-blue";

  const style = {
    width: width || "",
    height: height || "",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`wide-button ${variantClass} ${className}`}
      style={style}
    >
      <div className="wide-button-content">
        <p>{children}</p>
        {icon && <span className="wide-button-icon">{icon}</span>}
      </div>
    </button>
  );
}

export default WideButton;
