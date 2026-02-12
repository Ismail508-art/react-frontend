import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import gel from "../assets/gel.png";
import oil from "../assets/oil.png";
import "./Products.css";

const items = [
  { id: 1, name: "Jointace Gel (50 gms)", price: 152, image: gel },
  { id: 2, name: "Pain Relief Oil (120ml)", price: 250, image: oil },
];

const Product = () => {
  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);

  // Get quantity of a product in the cart
  const getQuantity = (id) => {
    const item = cart.find(product => product.id === id);
    return item ? item.qty : 0;
  };

  return (
    <div className="container">
      <h2>Products</h2>
      <div className="products">
        {items.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>

            <div className="quantity-cart">
              <button onClick={() => decreaseQty(product.id)}>-</button>
              <span>{getQuantity(product.id)}</span>
              <button onClick={() => increaseQty(product.id)}>+</button>
              <button className="add-cart-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
