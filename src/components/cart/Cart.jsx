

import React, { useState } from 'react';
import './Cart.css'; // Styles set up for your cart and form

const getNextOrderNumber = () => {
  const lastOrderNumber = localStorage.getItem('lastOrderNumber') || 1000; // Start from 1000
  const nextOrderNumber = parseInt(lastOrderNumber) + 1;
  localStorage.setItem('lastOrderNumber', nextOrderNumber);
  return nextOrderNumber;
};


function Cart({ cartItems, onRemoveFromCart, onEmptyCart }) {  
  const [customer, setCustomer] = useState({ 
    name: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from target
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    })); // Update customer state with new value
  };

  // Add state to track order completion
const [orderStatus, setOrderStatus] = useState({
  isProcessing: false,
  progress: 0,
  // showProgressBar: false, // Hide progress bar by default
});

const processOrder = () => {
  
  // For simulation, we'll just use a timeout
  setOrderStatus({ isProcessing: true, progress: 0 }); // Show progress bar when order starts
  
  const interval = setInterval(() => {
    setOrderStatus((prevState) => {
      if (prevState.progress >= 100) {
        clearInterval(interval);
        return { ...prevState, isProcessing: false };
        }
        return { ...prevState, progress: prevState.progress + 20 };
      });
    }, 1000);
  };
       
        


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderNumber = getNextOrderNumber(); // Get next order number
    const subTotal = cartItems.reduce((acc, item) => acc + item.price, 0); // Calculate subtotal
    const tax = subTotal * 0.15; // Calculate tax
    const total = subTotal + tax; // Calculate total

    const order = {
      orderNumber,
      customer,
      items: cartItems,
      subTotal: subTotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };

   

    
    processOrder(); // Start order processing

    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || []; // Get existing orders from localStorage
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order])); // Add new order to existing orders

      alert(`Order #${orderNumber} complete!`); // Show order number

      if (window.confirm('Would you like to print a receipt?')) {
        window.print(); // Print receipt
      }

      setCustomer({ name: '', email: '', address: '' }); // Reset customer state
      onEmptyCart(); // Empty cart
      setOrderStatus({ isProcessing: false, progress: 0 }); // Set order status to complete
    }, 8000); // Wait 8 seconds before completing order

      



 
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0); // Calculate subtotal
  const tax = subtotal * 0.15; // Calculate tax
  const total = subtotal + tax; // Calculate total

  

  return (
    <div className="cart-container"> 
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? ( // If cartItems is not empty
        <div>
          <ul>
            {cartItems.map((item, index) => ( // Loop through cartItems
              <li key={index}>
                {item.modelName} - {item.size} / {item.color} - ${item.price} 
                <button onClick={() => onRemoveFromCart(index)}>Remove</button> 
              </li>
            ))}
          </ul>
<div id='emptycart'>
          <button onClick={onEmptyCart}>Empty Cart</button> 
          </div>

          <div className="totals">
            <h2 id='order-summary'>Order Summary</h2>
            <p>Subtotal: <span className='totals-span'>     ${subtotal.toFixed(2)}</span></p>
            <p>Shipping: <span className='totals-span'>     Included</span></p>
            <p>Tax (15%): <span className='totals-span'>      ${tax.toFixed(2)}</span></p>
            
            <p>Total: <span id='finaltotal-span'>${total.toFixed(2)}</span></p> 
            
          </div>
         
         <h2 id='customer-h2'>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <textarea
              name="address"
              value={customer.address}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              required
            />
            <button type="submit">Checkout</button>
          </form>
          <div className="progress-bar-container ">
            {orderStatus.isComplete ? ( // If order is complete
              <p>Order Complete!</p>
            ) : (
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${orderStatus.progress}%` }} // Set width of progress bar
                ></div>
              </div>
            )}
        </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;

