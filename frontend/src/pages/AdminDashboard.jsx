import React, { useState, useEffect } from "react";
import "../CSS/Home.css";
import "../CSS/AdminDashboard.css";

export default function AdminDashboard() {
    const [tone, setTone] = useState("casual");
    const [generatedText, setGeneratedText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [menuData, setMenuData] = useState([]); // ✅ ADD THIS LINE

    // Menu state
    const [menuItems, setMenuItems] = useState([]);
    const [menuFile, setMenuFile] = useState(null);

    useEffect(() => {
        if (activeSection === "menu") {
            fetchMenuItems();
        }
    }, [activeSection]);

    const fetchMenuItems = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/menu");
            const data = await res.json();
            setMenuData(data);
        } catch (err) {
            console.error("Failed to load menu:", err);
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        await fetch(`http://localhost:5000/api/menu/${id}`, { method: "DELETE" });
        fetchMenuItems(); // Refresh list
    };

    const handleFileUpload = async () => {
        if (!menuFile) return alert("Please choose a file");

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const parsed = JSON.parse(e.target.result); // ← parse uploaded JSON file

                // Wrap parsed data in expected format: { menu: [...] }
                const res = await fetch("http://localhost:5000/api/menu/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parsed.menu ? parsed : { menu: parsed })
                });

                const result = await res.json();
                alert("Menu imported: " + result.message);
                fetchMenuItems(); // Refresh menu list
            } catch (err) {
                alert("Invalid file format or error uploading");
                console.error(err);
            }
        };

        reader.readAsText(menuFile);
    };


    const handleGeneratePromotion = async () => {
        setIsGenerating(true);
        setGeneratedText("");
        try {
            const response = await fetch("http://localhost:5000/api/gpt/admin-generate-promo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tone }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed with ${response.status}: ${text}`);
            }

            const data = await response.json();
            setGeneratedText(data.suggestion || "No promotion suggestion received.");
        } catch (error) {
            console.error("Error generating promotion:", error);
            setGeneratedText("Failed to generate promotion.");
        }

        setIsGenerating(false);
    };

    return (
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
            </header>

            <section className="admin-dashboard-content">
                <h2>Welcome, Admin</h2>
                <p>Manage your restaurant’s content and promotions here.</p>

                <div className="admin-dashboard-buttons">
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("menu")}>
                        Manage Menu
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("reservations")} style={{ marginLeft: "1rem" }}>
                        Manage Reservations
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("orders")} style={{ marginLeft: "1rem" }}>
                        View Orders
                    </button>
                </div>

                <hr />

                {activeSection === "menu" && (
                    <div className="menu-management">
                        <h3>📋 Menu Management</h3>
                        <div className="upload-section">
                            <input type="file" accept=".json" onChange={(e) => setMenuFile(e.target.files[0])}/>
                            <button onClick={handleFileUpload} className="admin-dashboard-btn">
                                Upload Menu File
                            </button>
                        </div>

                        <table style={{marginTop: "1rem", width: "100%", borderCollapse: "collapse"}}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {menuData.flatMap((categoryObj) =>
                                categoryObj.items.map((item, index) => (
                                    <tr key={`${categoryObj.id}-${index}`}>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>{categoryObj.category}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteItem(categoryObj.id, index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>

                        </table>
                    </div>
                )}

                {activeSection === "reservations" && (
                    <div className="reservations-management">
                        <h3>📅 Reservation Management</h3>
                        <p>Coming soon (You’ll fetch from /api/reservations here)</p>
                    </div>
                )}

                {activeSection === "orders" && (
                    <div className="orders-management">
                    <h3>🧾 Order Management</h3>
                        <p>Coming soon (You’ll fetch from /api/orders here)</p>
                    </div>
                )}

                <hr style={{ marginTop: "2rem" }} />

                <div className="promotion-generator">
                    <h3>🧠 Smart Promotion Generator</h3>

                    <label htmlFor="tone-select">Select Tone:</label>
                    <select id="tone-select" value={tone} onChange={(e) => setTone(e.target.value)}>
                        <option value="casual">Casual</option>
                        <option value="elegant">Elegant</option>
                        <option value="enthusiastic">Enthusiastic</option>
                    </select>

                    <button
                        className="admin-dashboard-btn"
                        onClick={handleGeneratePromotion}
                        style={{ marginTop: "1rem" }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Generating..." : "Generate Promotion"}
                    </button>

                    {generatedText && (
                        <div className="promotion-result" style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
                            <h4>Generated Promotion:</h4>
                            <p>{generatedText}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
