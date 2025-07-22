import { useEffect, useState } from 'react';
import '../CSS/Menu.css';

export default function Menu() {
    const [menuData, setMenuData] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/menu')
            .then(res => res.json())
            .then(data => setMenuData(data))
            .catch(err => console.error('Failed to fetch menu:', err));
    }, []);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    return (
        <div className="menu-page">
            <h1 className="menu-title">Our Menu</h1>

            {menuData.map((section) => (
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
                {cart.length === 0 ? (
                    <p>No items yet</p>
                ) : (
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
