import '../CSS/Home.css';
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Healthy Eating<br />is important part of lifestyle</h1>
                <p>Discover delicious, nutritious meals crafted for your well-being.</p>
                <button className="hero-btn">Book a Table</button>
            </section>

            {/* Menu Preview */}
            <section className="menu-preview">
                <h2>Our Menu</h2>
                <div className="menu-items">
                    <div className="menu-card">
                        <h3>Deep Sea Cod Fillet</h3>
                        <p>Pan-seared cod with lemon butter sauce.</p>
                        <span>$20</span>
                    </div>
                    <div className="menu-card">
                        <h3>Steak with Rosemary</h3>
                        <p>Grilled beef steak with aromatic herbs.</p>
                        <span>$22</span>
                    </div>
                    <div className="menu-card">
                        <h3>Cucumber Salad</h3>
                        <p>Refreshing and crunchy with a light vinaigrette.</p>
                        <span>$18</span>
                    </div>
                </div>

                <button className="hero-btn" onClick={() => navigate('/menu')}>
                    View Menu
                </button>

            </section>

            {/* Featured Chef */}
            <section className="chef-section">
                <img src="/assets/chef.png" alt="Chef Dish" />
                <div>
                    <h2>Excellent Cook</h2>
                    <p>Our chef brings passion and creativity to every plate, using only the freshest ingredients.</p>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div>
                    <img src="/assets/fish.png" alt="Preminum Quality"/>
                    <h3>Premium Quality</h3>
                    <p>Locally sourced ingredients ensure the best flavors and nutrients.</p>
                </div>
                <div>
                    <img src="/assets/carrot.png" alt="Vegetables"/>
                    <h3>Seasonal Vegetables</h3>
                    <p>We rotate our menu to reflect the best produce of each season.</p>
                </div>
                <div>
                    <img src="/assets/lemon.png" alt="Fresh Fruit"/>
                    <h3>Fresh Fruit</h3>
                    <p>Sweet, ripe fruits enhance every meal and dessert.</p>
                </div>
            </section>

            {/* Reservation Form (moved up) */}
            <section className="reservation">
                <h2>Make a Reservation</h2>
                <form>
                    <input type="date" />
                    <input type="time" />
                    <select>
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests</option>
                    </select>
                    <button type="submit">Book Now</button>
                </form>
            </section>

            {/* Blog Section (Calories Energy) */}
            <section className="blog-section">
                <h2>Calories Energy Balance</h2>
                <div className="blog-cards">
                    <div className="blog-card">
                        <img src="/assets/food.png" alt="Food"/>
                        <h4>Fruit and vegetables and protection against diseases</h4>
                    </div>
                    <div className="blog-card">
                        <img src="/assets/ingredient.png" alt="Food"/>
                        <h4>Asparagus Spring Salad with Rocket, Goat’s Cheese</h4>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className="feedback-section">
                <h2>We value your feedback</h2>
                <p>Let us know how we can improve your dining experience.</p>
                <form>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="4" required></textarea>
                    <button type="submit">Send Feedback</button>
                </form>
            </section>


            {/* Footer */}
            <footer>
                <div className="footer-left">
                    <h3>FoodZero</h3>
                    <p>Contact us at: contact@foodzero.com<br />123 Green Street, Foodville</p>
                </div>
                <div className="footer-right">
                    <label>Subscribe to our newsletter:</label><br />
                    <input type="email" placeholder="Enter your email" />
                    <button>Subscribe</button>
                </div>
            </footer>
        </div>
    );
}
