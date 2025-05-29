import { DownloadIcon } from "../icons/MiscellaneousIcons";

/* 
  Citation for the following component modification:
  Date: 2025-05-23
  Based on design intent and AI-assisted implementation.
  Prompt: How do I make it so when the user clicks on my component, a download event is triggered?
*/

function HomeCard({ title, description, imageSrc, imageAlt, onDownloadClick, variant = "blue" }) {
  const cardClass = `home-card home-card-${variant}`;

  return (
    // If the user clicks anywhere on the card, it will trigger the download
    <div className={cardClass} onClick={onDownloadClick}>

      {/* Image Preview - Left */}
      <div className="card-img-wrapper">
        <img src={imageSrc} alt={imageAlt} className="card-img" />
      </div>

      {/* Card Details - Right*/}
      <div className="card-details">
        <span>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{description}</p>
        </span>

        {/* Donwload Button */}
        {onDownloadClick && (
          <button className="card-download-btn">
            {DownloadIcon}
          </button>
        )}
      </div>
    </div>
  );
}

export default HomeCard;
