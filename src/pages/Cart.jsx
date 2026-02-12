import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import upi from "../Components/Assets/upi.png";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart } = useContext(CartContext);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  // ✅ Validate customer info
  const validateCustomer = () => {
    const nameRegex = /^[A-Za-z ]+$/;       // only letters & spaces
    const phoneRegex = /^[1-9][0-9]{9}$/;   // 10 digits, cannot start with 0

    if (!customer.name.trim()) return "Name is required";
    if (!nameRegex.test(customer.name)) return "Name can contain only letters and spaces";
    if (!customer.phone.trim()) return "Phone number is required";
    if (!phoneRegex.test(customer.phone)) return "Enter a valid 10-digit phone number (cannot start with 0)";
    if (!customer.address.trim()) return "Address is required";

    return null;
  };

  // 🔹 Payment handler (UPI-style)
const handlePayment = () => {
  const error = validateCustomer();
  if (error) return alert(error);
  if (!cart.length || totalPrice <= 0) return alert("Cart is empty or total invalid");

  const apiUrl = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  // Open blank popup
  const paymentWindow = window.open("", "UPI Payment", "width=420,height=650");

  // Serialize cart items as strings for backend
  const itemsList = cart.map(item => JSON.stringify(item));

  // Pass data via window object
  paymentWindow.itemsList = itemsList;
  paymentWindow.totalPrice = totalPrice;
  paymentWindow.customer = customer;
  paymentWindow.apiUrl = apiUrl;
  paymentWindow.secretKey = SECRET_KEY;
  paymentWindow.upi = upi;

  paymentWindow.document.write(`
    <html>
      <head>
        <title>UPI Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { box-sizing: border-box; font-family: Arial, sans-serif; }
          body { margin:0; padding:20px; background:#f3f4f6; display:flex; justify-content:center; align-items:center; min-height:100vh; }
          .card { background:#fff; width:100%; max-width:380px; padding:25px; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,0.08); text-align:center; }
          h3 { margin-bottom:5px; color:#111827; }
          .amount { font-size:18px; font-weight:600; color:#16a34a; margin-bottom:15px; }
          img { width:220px; max-width:100%; margin:15px 0; }
          input { width:100%; padding:10px; margin-top:10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; }
          button { width:100%; margin-top:20px; padding:12px; background:#16a34a; color:white; border:none; border-radius:6px; font-size:15px; cursor:pointer; }
          button:hover { background:#15803d; }
          .note { font-size:12px; color:#6b7280; margin-top:10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h3>UPI Payment</h3>
          <div class="amount">Scan & Pay ₹<span id="amount"></span></div>
          <img id="upiImg" src="" alt="UPI QR">
          <label><strong>Transaction ID *</strong></label>
          <input type="text" placeholder="Enter Transaction ID after payment" id="txnid">
          <button id="payBtn">Payment Done</button>
          <div class="note">After completing payment, enter the transaction ID and click Payment Done.</div>
        </div>

        <script>
          const itemsList = window.itemsList;
          const customer = window.customer;
          const totalPrice = window.totalPrice;
          const apiUrl = window.apiUrl;
          const SECRET_KEY = window.secretKey;
          const upi = window.upi;

          document.getElementById('amount').textContent = totalPrice;
          document.getElementById('upiImg').src = upi;

          document.getElementById('payBtn').onclick = function() {
            const txnId = document.getElementById('txnid').value.trim();
            if (!txnId) { alert('Enter transaction ID'); return; }

            fetch(apiUrl + '/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-SECRET-KEY': SECRET_KEY
              },
              body: JSON.stringify({
                items: itemsList,
                totalAmount: totalPrice,
                transactionId: txnId,
                paymentStatus: 'PAID',
                customerName: customer.name,
                customerPhone: customer.phone,
                customerAddress: customer.address
              })
            })
            .then(res => {
              if (!res.ok) throw new Error('Order creation failed. Check backend logs');
              alert('Order placed successfully!');
              window.opener.location.href = '/'; // redirect to home
              window.close();
            })
            .catch(err => alert(err.message || 'Something went wrong'));
          };
        </script>
      </body>
    </html>
  `);
};



  return (
    <div className="cart-container">
      <h2>Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div className="cart-item" key={item.id}>
          <div className="cart-item-info">
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.qty}</p>
          </div>
          <div className="cart-item-actions">
            <button onClick={() => decreaseQty(item.id)}>-</button>
            <button onClick={() => increaseQty(item.id)}>+</button>
            <button onClick={() => removeFromCart(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {cart.length > 0 && !showCheckoutForm && (
        <div className="cart-footer">
          <h3>Total Price: ₹{totalPrice}</h3>
          <button className="pay-btn" onClick={() => setShowCheckoutForm(true)}>
            Proceed to Checkout
          </button>
        </div>
      )}

      {cart.length > 0 && showCheckoutForm && (
        <div className="checkout-form">
          <h3>Enter your details</h3>

          <label>Name</label>
          <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />

          <label>Phone</label>
          <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />

          <label>Address</label>
          <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />

          <button className="pay-btn" onClick={handlePayment}>
            Pay ₹{totalPrice}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
