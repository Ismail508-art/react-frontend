import CallButton from "./CallButton";
import './Address.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Address = () => {
  const address = "Opp Zeeshan Cafe, Besides Katora House, Golconda, Hyderabad, TG-08";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <>
      <div className="visit">
        <h2>Visit Our Clinic</h2>
        <p>{address}</p>
        <p>Open from 10.00am - 11.00pm</p>

        {/* Red location icon */}
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="location-icon"
        >
          <FontAwesomeIcon icon={faLocationDot} />
        </a>
      </div>
      <CallButton/>
    </>
  );
}

export default Address;
