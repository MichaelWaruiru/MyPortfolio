import React from "react";
import './WhatsApp.css';

function WhatsAppChat() {
  return (
    <a
      href="https://wa.me/254719453367?text=Hi%20Michael,%20I%20would%20like%20to%20chat%20with%20you!"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with me on WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="whatsapp-icon"
      />
    </a>
  );
}

export default WhatsAppChat;