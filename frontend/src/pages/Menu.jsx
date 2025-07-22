import { useState } from 'react';
import '../CSS/Menu.css'; // Create and style accordingly

const sampleMenu = [
    {
        category: 'Starters',
        image: '/assets/starter.png',
        items: [
            { name: 'Grilled Okra and Tomatoes', price: 20 },
            { name: 'Cucumber Salad', price: 12 },
            { name: 'Basil Pancakes', price: 18 },
        ],
    },
    {
        category: 'Mains',
        image: '/assets/main.png',
        items: [
            { name: 'Deep Sea Cod Fillet', price: 20 },
            { name: 'Steak With Rosemary', price: 22 },
            { name: 'Grilled Kimchi Steaks', price: 20 },
        ],
    },
    {
        category: 'Pastries & Drinks',
        image: '/assets/dessert.png',
        items: [
            { name: 'Wine Pairing', price: 158 },
            { name: 'Natural Wine Pairing', price: 168 },
            { name: 'Whisky Flyer', price: 90 },
        ],
    },
];

export default function Menu() {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    return (
        <div className="menu-page">
            <h1 className="menu-title">Our Menu</h1>

            {sampleMenu.map((section, index) => (
                <div key={section.category} className="menu-section">
                    <h2>{section.category}</h2>
                    <p className="menu-sub">This is a section of your menu. Give your section a brief description</p>

                    <div className="menu-section-content">
                        <div className="menu-items-list">
                            {section.items.map((item, idx) => (
                                <div key={idx} className="menu-item">
                                    <p>{item.name}</p>
                                    <span>${item.price}</span>
                                    <button onClick={() => addToCart(item)}>Add</button>
                                </div>
                            ))}
                        </div>

                        <img src={section.image} alt={section.category} className="menu-section-img" />
                    </div>
                </div>
            ))}


            <div className="cart-section">
                <h3>Your Order</h3>
                {cart.length === 0 ? <p>No items yet</p> : (
                    <ul>
                        {cart.map((item, i) => (
                            <li key={i}>{item.name} - ${item.price}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>


    );
}
