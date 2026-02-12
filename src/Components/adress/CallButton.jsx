
import { FaPhoneAlt } from "react-icons/fa";
import "./CallButton.css";

function CallButton() {
  const phoneNumber = "+91 8790997196";

  const handleCall = () => {
    const confirmCall = window.confirm("Do you want to call this number?");
    if (confirmCall) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="call-container">
      <FaPhoneAlt
        className="call-icon"
        onClick={handleCall}
      />
      <span className="call-text">{phoneNumber}</span>
    </div>
  );
}

export default CallButton;
