import { useEffect, useState } from "react";
import offers1 from "../Assets/offers.png";
import offers2 from "../Assets/slide2.png";
import offers3 from "../Assets/slide3.png";
import offers4 from "../Assets/slide4.png";
import offers5 from "../Assets/slide5.png";
import "./Offers.css";

const images = [offers1, offers2, offers3, offers4, offers5];

const Offers = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="offers">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt=""
          className={index === current ? "active" : ""}
        />
      ))}
    </div>
  );
};

export default Offers;
