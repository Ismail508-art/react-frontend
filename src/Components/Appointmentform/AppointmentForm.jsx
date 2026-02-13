import { useState, useEffect, useContext } from "react";
import "./AppointmentForm.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../Common/Alert";
import upi from "../Assets/upi.png";

function AppointmentForm() {
  const navigate = useNavigate();
  const { user, canBookAppointment, getAppointmentUserDetails } =
    useContext(AuthContext);

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    treatment: "",

    physioType: "",

    cuppingType: "",
    cuppingOption: "",

    dietPlan: "",

    labPackage: "",

    price: 0,
    date: "",
    time: "",
    reason: "",
    transactionId: ""

  });

  const [errors, setErrors] = useState({});

  // 🔐 Auth check
  useEffect(() => {
    if (!canBookAppointment()) {
      setAlert({
        message: "Please login to book an appointment",
        type: "warning",
      });
      setTimeout(() => navigate("/login"), 1200);
    }
  }, []);

  // Autofill name & email
  useEffect(() => {
    if (user) {
      const details = getAppointmentUserDetails();
      setFormData((prev) => ({
        ...prev,
        name: details.name,
        email: details.email,
      }));
    }
  }, [user]);

  // Reverse geocoding
  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  // Detect location
  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const place = await fetchLocationName(
          pos.coords.latitude,
          pos.coords.longitude
        );
        setFormData((prev) => ({ ...prev, location: place }));
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // Physiotherapy pricing
    if (name === "physioType") {
      updated.price = value === "Home" ? 800 : value === "Clinic" ? 400 : 0;
    }

    // Cupping – head options
    if (name === "cuppingOption") {
      updated.price =
        value === "With Hair"
          ? 50
          : value === "Without Hair"
          ? 100
          : value === "Body"
          ? 800
          : 0;
    }

    // ✅ FIX: Body cupping price
    if (name === "cuppingType" && value === "Body") {
      updated.cuppingOption = "Body";
      updated.price = 800;
    }
    //diet
    if (name === "dietPlan") {
  updated.price =
    value === "General"
      ? 1500
      : value === "Monthly"
      ? 4000
      : value === "Quarterly"
      ? 10500
      : 0;
}


    // Lab packages pricing
    if (name === "labPackage") {
      updated.price =
        value === "Basic"
          ? 1900
          : value === "Advance"
          ? 2500
          : value === "Executive"
          ? 6800
          : 0;
    }

    // Reset logic when treatment changes
    if (name === "treatment") {
      updated.physioType = "";
      updated.cuppingType = "";
      updated.cuppingOption = "";
      updated.dietPlan = "";
      updated.labPackage = "";
      updated.price = 0;
    }

    setFormData(updated);
    setErrors({});
  };

  const validate = () => {
    let err = {};

    if (!/^[0-9]{10}$/.test(formData.contact))
      err.contact = "Valid 10-digit number required";

    if (!formData.location) err.location = "Location required";
    if (!formData.treatment) err.treatment = "Select treatment";
    if (!formData.date) err.date = "Select date";
    if (!formData.time) err.time = "Select time";
    if (!formData.reason) err.reason = "Reason required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  if (formData.price <= 0) {
    setAlert({ message: "Please select a valid service", type: "error" });
    return;
  }

  try {
    // Save appointment with payment PENDING
    const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, paymentStatus: "PENDING" }),
    });

    const appointment = await saveRes.json();

    // Allow popup to access alert & navigate
    window.setAlert = setAlert;
    window.navigate = navigate;

    // Open UPI Payment popup
    const qrWindow = window.open("", "UPI Payment", "width=420,height=650");

    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

    qrWindow.document.write(`
      <html>
        <head>
          <title>UPI Payment</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; font-family: Arial, sans-serif; }
            body { margin: 0; padding: 20px; background: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .card { background: #fff; width: 100%; max-width: 380px; padding: 25px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); text-align: center; }
            h3 { margin-bottom: 5px; color: #111827; }
            .amount { font-size: 18px; font-weight: 600; color: #16a34a; margin-bottom: 15px; }
            img { width: 220px; max-width: 100%; margin: 15px 0; }
            input { width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
            button { width: 100%; margin-top: 20px; padding: 12px; background: #16a34a; color: white; border: none; border-radius: 6px; font-size: 15px; cursor: pointer; }
            button:hover { background: #15803d; }
            .note { font-size: 12px; color: #6b7280; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>UPI Payment</h3>
            <div class="amount">Scan & Pay ₹${formData.price}</div>
            <img id="upiImg" src="${upi}" alt="UPI QR">
            <label><strong>UPI Transaction ID *</strong></label>
            <input type="text" id="txnId" placeholder="Enter Transaction ID after payment" required>
            <button id="payBtn">Payment Done</button>
            <div class="note">
              After completing payment, enter the Transaction ID and click Payment Done.
            </div>
          </div>

          <script>
            const SECRET_KEY = "${SECRET_KEY}";
            document.getElementById('payBtn').onclick = function() {
              const txnId = document.getElementById('txnId').value.trim();
              if(!txnId){ alert('Enter a valid Transaction ID'); return; }

              fetch("${import.meta.env.VITE_API_URL}/api/appointments/${appointment.id}", {
                method: 'PATCH',
                headers: { 
                  'Content-Type': 'application/json',
                  'X-SECRET-KEY': SECRET_KEY
                },
                body: JSON.stringify({ transactionId: txnId })
              })
              .then(res => { 
                if(!res.ok){ throw new Error('Payment update failed'); } 
                return res.json(); 
              })
              .then(() => {
                // Open PDF slip
                window.open("${import.meta.env.VITE_API_URL}/api/appointments/slip/${appointment.id}");
                
                // ✅ Show alert on main page
                window.opener.setAlert({
                  message: "Appointment booked successfully! Payment confirmed.",
                  type: "success",
                });

                // ✅ Redirect main page after 1.5s
                setTimeout(() => window.opener.navigate("/"), 1500);

                // Close popup
                window.close();
              })
              .catch(() => alert('Payment update failed. Try again.'));
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    setAlert({
      message: "Something went wrong. Please try again.",
      type: "error",
    });
  }
};




  // 🕒 Time slots (7 AM – 10 PM)
const allTimeSlots = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00","22:00",
];

const filterTimeSlots = () => {
  if (!formData.date) return [];

  const selectedDate = new Date(formData.date);
  const now = new Date();

  const isToday =
    selectedDate.toDateString() === now.toDateString();

  const day = selectedDate.getDay(); // 0=Sun, 4=Thu, 5=Fri

  // Thu & Fri close at 7 PM, others at 10 PM
  const closingHour = day === 4 || day === 5 ? 19 : 22;

  return allTimeSlots.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);

    // Clinic hours check
    if (hour < 7 || hour > closingHour) return false;

    if (isToday) {
      const slotTime = new Date();
      slotTime.setHours(hour, minute, 0, 0);

      // remove past times
      if (slotTime <= now) return false;
    }

    return true;
  });
};

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="appointment-container">
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />

      <h2>Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Name</label>
        <input value={formData.name} readOnly />

        <label>Email</label>
        <input value={formData.email} readOnly />

        <label>Contact</label>
        <input name="contact" value={formData.contact} onChange={handleChange} />
        <p className="error-text">{errors.contact}</p>

        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={
            loadingLocation ? "Detecting location..." : "Enter location"
          }
        />

        <label>Treatment</label>
        <select name="treatment" value={formData.treatment} onChange={handleChange}>
          <option value="">-- Select --</option>
          <option value="Physiotherapy">Physiotherapy</option>
          <option value="Cupping">Cupping</option>
          <option value="Dietician & Nutrition">Dietician & Nutrition</option>
          <option value="Lab & Diagnostics">Lab & Diagnostics</option>
        </select>

        {/* Physiotherapy */}
        {formData.treatment === "Physiotherapy" && (
          <>
            <label>Session Type</label>
            <select
              name="physioType"
              value={formData.physioType}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Clinic">Clinic Session (₹400)</option>
              <option value="Home">Home Visit (₹800)</option>
            </select>
            <input value={`₹ ${formData.price}`} readOnly />
          </>
        )}

        {/* Cupping */}
        {formData.treatment === "Cupping" && (
          <>
            <label>Cupping Type</label>
            <select
              name="cuppingType"
              value={formData.cuppingType}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Head">Head</option>
              <option value="Body">Body (₹800)</option>
            </select>

            {formData.cuppingType === "Head" && (
              <>
                <label>Head Cupping Options</label>
                <select
                  name="cuppingOption"
                  value={formData.cuppingOption}
                  onChange={handleChange}
                >
                  <option value="">-- Select --</option>
                  <option value="With Hair">With Hair (₹50)</option>
                  <option value="Without Hair">Without Hair (₹100)</option>
                </select>
              </>
            )}

            <input value={`₹ ${formData.price}`} readOnly />
          </>
        )}

        {/* Dietician */}
       {formData.treatment === "Dietician & Nutrition" && (
  <>
    <label>Diet Plan</label>
    <select
      name="dietPlan"
      value={formData.dietPlan}
      onChange={handleChange}
    >
      <option value="">-- Select --</option>
      <option value="General">General Diet Consult (₹1500)</option>
      <option value="Monthly">One Month Plan (₹4000)</option>
      <option value="Quarterly">Quarterly Plan (₹10500)</option>
    </select>

    {/* Package Details */}
    {formData.dietPlan === "General" && (
      <div>
        <strong>Package Includes:</strong>
        <ul>
          <li>✔ One-time consultation</li>
          <li>✔ Basic diet chart with meal options</li>
          <li>✔ Body composition analysis</li>
          <li>✖ Follow-ups</li>
          <li>✖ WhatsApp assistance</li>
          <li>✖ Plan upgrade</li>
        </ul>
      </div>
    )}

    {formData.dietPlan === "Monthly" && (
      <div>
        <strong>Package Includes:</strong>
        <ul>
          <li>✔ Duration: 1 Month</li>
          <li>✔ Customized daily diet plan</li>
          <li>✔ 4 weekly follow-ups</li>
          <li>✔ Body composition analysis</li>
          <li>✔ WhatsApp assistance</li>
          <li>✔ Plan upgrade available</li>
        </ul>
      </div>
    )}

    {formData.dietPlan === "Quarterly" && (
      <div>
        <strong>Package Includes:</strong>
        <ul>
          <li>✔ Duration: 3 Months</li>
          <li>✔ Customized daily diet plan</li>
          <li>✔ 12 weekly follow-ups</li>
          <li>✔ Body composition analysis</li>
          <li>✔ WhatsApp assistance</li>
          <li>✔ Plan upgrade available</li>
        </ul>
      </div>
    )}

    <label>Amount</label>
    <input value={`₹ ${formData.price}`} readOnly />
  </>
)}


        {/* Lab & Diagnostics */}
        {formData.treatment === "Lab & Diagnostics" && (
          <>
            <label>Package</label>
            <select
              name="labPackage"
              value={formData.labPackage}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Basic">Basic Package (₹1900)</option>
              <option value="Advance">Advance Package (₹2500)</option>
              <option value="Executive">Executive Package (₹6800)</option>
            </select>

            {formData.labPackage && (
              <div>
                <strong>Tests Included:</strong>

                {formData.labPackage === "Basic" && (
                  <ul>
                    <li>CBC</li>
                    <li>Blood Sugar (Fasting)</li>
                    <li>Lipid Profile</li>
                    <li>TSH</li>
                    <li>Urine Routine</li>
                  </ul>
                )}

                {formData.labPackage === "Advance" && (
                  <ul>
                    <li>CBC</li>
                    <li>FBS + PPBS</li>
                    <li>LFT</li>
                    <li>KFT</li>
                    <li>Thyroid Profile</li>
                  </ul>
                )}

                {formData.labPackage === "Executive" && (
                  <ul>
                    <li>CBC</li>
                    <li>HbA1c</li>
                    <li>LFT + KFT</li>
                    <li>Vitamin D & B12</li>
                    <li>ECG</li>
                  </ul>
                )}

                <small>
                  Tests will be conducted at our lab after appointment confirmation.
                  <br />
                  🔄 Free rescheduling allowed up to 12 hours before appointment.
                </small>
              </div>
            )}

            <input value={`₹ ${formData.price}`} readOnly />
          </>
        )}

        <label>Date</label>
        <input type="date" min={today} name="date" value={formData.date} onChange={handleChange} />

       <label>Time</label>
        <select name="time" value={formData.time} onChange={handleChange}>
        <option value="">-- Select Time --</option>
           {filterTimeSlots().map((time) => (
       <option key={time} value={time}>
         {time}
       </option>
    ))}
      </select>
    <p className="error-text">{errors.time}</p>

        <div className="appointment-note">
          <p><strong>Important:</strong></p>
          <ul>
            <li>❌ Appointments are <strong>non-refundable</strong>.</li>
            <li>📅 Appointment is valid for <strong>5 days</strong> from the booked date.</li>
          </ul>
         </div>

        <label>Reason</label>
        <textarea name="reason" rows="3" value={formData.reason} onChange={handleChange} />

        <button type="submit" className="appointment-btn">
          {formData.price > 0 ? `Pay ₹${formData.price}` : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;



