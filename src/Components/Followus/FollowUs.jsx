
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./FollowUs.css";

const FollowUs = () => {
  return (
    <div className="chat-bubble-container">
      {/* Instagram Bubble */}
      <a
        href="https://www.instagram.com/m.y.qmulticarehealthcenter?igsh=c2ExdnlsMjV0am85"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-bubble instagram"
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>

      {/* WhatsApp Bubble */}
      <a
        href="https://wa.me/9397997196"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-bubble whatsapp"
        aria-label="WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default FollowUs;
