import { Link } from "react-router-dom";
// Import your downloaded copyright-free images
import physioImg from "../assets/physiotherapy.png";
import cuppingImg from "../assets/cupping.png";
import labImg from "../assets/lab.png";
import dieticianImg from "../assets/dietician.png";

import "./WhatWeOffer.css";

const WhatWeOffer = () => {
    
  return (
    <section className="offer-section">
      <h2 className="offer-title">What We Offer</h2>
      <p className="offer-subtitle">
        Comprehensive healthcare services under one roof
      </p>

      <div className="offer-grid">
        {/* Physiotherapy */}
        <div className="offer-card">
          <img src={physioImg} alt="Physiotherapy service" />
          <h3>Physiotherapy</h3>
          <p>Pain relief, rehabilitation, and movement improvement.</p>
        </div>

        {/* Cupping */}
        <div className="offer-card">
          <img src={cuppingImg} alt="Cupping therapy service" />
          <h3>Cupping Therapy</h3>
          <p>Traditional therapy to improve blood flow and reduce pain.</p>
        </div>

        {/* Lab & Diagnostics */}
        <div className="offer-card">
          <img src={labImg} alt="Lab and diagnostic services" />
          <h3>Lab & Diagnostics</h3>
          <p>Accurate lab tests and reliable reporting.</p>
        </div>

        {/* Dietician & Nutrition */}
        <div className="offer-card">
          <img src={dieticianImg} alt="Dietician and nutrition service" />
          <h3>Dietician & Nutrition</h3>
          <p>Personalized diet plans for healthy living and wellness.</p>
        </div>
      </div>

      {/* Book Now Button */}
      
       
         <Link to="/appointment" className="book-btn " >
             Book Now
         </Link>
       

      
    </section>
  );
};

export default WhatWeOffer;
