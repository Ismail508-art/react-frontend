import "./AboutUs.css";
import cuppingImage from '../Assets/cuppingImage.png'
import posterImage from '../Assets/posterImage.png'
const AboutUs = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>About M.Y.Q. Multicare Health Center</h1>
          <p>Your trusted center for Physiotherapy, Cupping Therapy & Diagnostics</p>
        </div>
        <div className="hero-img-wrapper">
          <img src={cuppingImage} alt="Cupping therapy" className="hero-img" />
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          M.Y.Q. Multicare Health Center is dedicated to providing holistic and 
          evidence-based healthcare services including Physiotherapy, Cupping 
          Therapy (Hijama), and Lab & Diagnostic facilities. Our mission is to deliver 
          high-quality, affordable, and accessible health solutions to the community.
        </p>
      </section>

      {/* Services */}
      <section className="services-section">
        <h2>Our Core Services</h2>

        <div className="services-grid">
          <div className="service-card">
            <h3>Physiotherapy</h3>
            <p>
              Rehabilitation for pain, injuries, joint issues, sports recovery, 
              post-surgery therapy & mobility strengthening.
            </p>
          </div>

          <div className="service-card">
            <h3>Cupping (Hijama) Therapy</h3>
            <p>
              Certified dry & wet cupping, facial cupping, detox therapy, 
              pain relief, and overall wellness support.
            </p>
          </div>

          <div className="service-card">
            <h3>Lab & Diagnostics</h3>
            <p>
              Reliable blood tests, health screenings, and essential diagnostic 
              evaluations for accurate treatment.
            </p>
          </div>
        </div>
      </section>

      {/* Poster Image */}
      <section className="poster-section">
        <img src={posterImage} alt="Cupping Therapy Poster" className="poster-img" />
      </section>

      {/* Mission */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To promote long-term wellness through personalized care, combining 
          traditional healing methods with modern therapeutic practices.
        </p>
      </section>

      <footer className="about-footer">
        © {new Date().getFullYear()} M.Y.Q. Multicare Health Center — All Rights Reserved
      </footer>

    </div>
  );
};

export default AboutUs;
