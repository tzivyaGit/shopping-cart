import { useEffect, useState } from "react";

const Cart = () => {

const [products, setProducts] = useState([]);
const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
});

useEffect(() => {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => setProducts(data));

  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  setCart(savedCart);
}, []);

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
// Function to add a product to the cart
const addToCart = (product) => {
  console.log(product);

  setCart((prevCart) => {
    const itemExists = prevCart.find((item) => item.id === product.id);
    if (itemExists) {
      return prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      return [...prevCart, { ...product, quantity: 1 }];
    }
  });
};
// Function to reduce the amount of product in the cart
const decreaseQuantity = (id) => {
  console.log(id);
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
  );
};

// Function to increase the quantity of the product in the cart
const increaseQuantity = (id) => {
  console.log(id);
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};
// Function to delete a product from the cart
const removeFromCart = (id) => {
  console.log(id);
  setCart((prevCart) => prevCart.filter((item) => item.id !== id));
};

// Calculate the total price
const calculateTotalPrice = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Calculate shipping cost
const calculateShipping = () => {
  return cart.length > 4 ? 10 : 0; 
};

// Calculate the total price with shipping
const calculateTotal = () => {
  return calculateTotalPrice() + calculateShipping();
};



return (
  <div className="container mt-5">
    <h1 className="text-center mb-4">Shopping Cart</h1>
    <div className="row">
      <div className="col-md-8">
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-md-4 col-lg-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <img src={product.image} className="card-img-top p-3" alt={product.title} style={{ height: "200px", objectFit: "contain" }} />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
                    <button className="btn btn-primary w-100" onClick={() => addToCart(product)}>Add to Cart</button>                </div>
                </div>
              </div>

            ))
          ) : (
            <p className="text-center">Loading products...</p>
          )}
        </div>
      </div>


      {/*card*/}
      <div className="col-md-4">
        <div className="card p-3">
          <h4>Cart Summary</h4>
          {cart.length > 0 ? (
            <ul className="list-group">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {item.title}
                    <div className="d-flex justify-content-between align-items-center">
                      <button className="btn btn-sm btn-warning" onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button className="btn btn-sm btn-success" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in cart</p>
          )}
           {/* price*/}
           <div className="mt-3">
            <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>
            <p>Shipping: ${calculateShipping()}</p>
            <hr />
            <h5>Total: ${calculateTotal().toFixed(2)}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
export default Cart;
