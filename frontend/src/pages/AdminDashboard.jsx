import React, { useState, useEffect } from "react";
import "../CSS/Home.css";
import "../CSS/AdminDashboard.css";

export default function AdminDashboard() {
    const [tone, setTone] = useState("casual");
    const [generatedText, setGeneratedText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [menuData, setMenuData] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "", categoryId: "" });
    const [editingItem, setEditingItem] = useState(null); // { docId, itemIndex, name, price, categoryId }

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

    const handleDeleteMenuItemFromCategory = async (docId, itemIndex) => {
        if (!window.confirm("Delete this menu item?")) return;
        try {
            await fetch(`http://localhost:5000/api/menu/${docId}/item/${itemIndex}`, {
                method: "DELETE"
            });
            fetchMenuItems();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete item.");
        }
    };

    const handleFileUpload = async () => {
        if (!menuFile) return alert("Please choose a file");
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                const res = await fetch("http://localhost:5000/api/menu/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parsed.menu ? parsed : { menu: parsed })
                });
                const result = await res.json();
                alert("Menu imported: " + result.message);
                fetchMenuItems();
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

    const handleSaveEdit = async () => {
        const res = await fetch(`http://localhost:5000/api/menu/${editingItem.docId}/item/${editingItem.itemIndex}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: editingItem.name,
                price: Number(editingItem.price),
                newCategoryId: editingItem.categoryId
            })
        });
        const result = await res.json();
        alert(result.message);
        setEditingItem(null);
        fetchMenuItems();
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
                            <input type="file" accept=".json" onChange={(e) => setMenuFile(e.target.files[0])} />
                            <button onClick={handleFileUpload} className="admin-dashboard-btn">
                                Upload Menu File
                            </button>
                        </div>

                        <table style={{ marginTop: "1rem", width: "100%" }}>
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
                                categoryObj.items.map((item, index) => {
                                    const isEditing = editingItem && editingItem.docId === categoryObj.id && editingItem.itemIndex === index;
                                    return (
                                        <tr key={`${categoryObj.id}-${index}`}>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingItem.name}
                                                        onChange={(e) =>
                                                            setEditingItem({ ...editingItem, name: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    item.name
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editingItem.price}
                                                        onChange={(e) =>
                                                            setEditingItem({ ...editingItem, price: e.target.value })
                                                        }
                                                    />
                                                ) : (
                                                    `$${item.price}`
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <select
                                                        value={editingItem.categoryId}
                                                        onChange={(e) =>
                                                            setEditingItem({ ...editingItem, categoryId: e.target.value })
                                                        }
                                                    >
                                                        {menuData.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    categoryObj.category
                                                )}
                                            </td>
                                            <td className={"action_btn"}>
                                                {isEditing ? (
                                                    <>
                                                        <button className={"save-btn"} onClick={handleSaveEdit}>Save</button>
                                                        <button className="cancel-btn" onClick={() => setEditingItem(null)} style={{ marginLeft: "0.5rem" }}>
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                setEditingItem({
                                                                    docId: categoryObj.id,
                                                                    itemIndex: index,
                                                                    name: item.name,
                                                                    price: item.price,
                                                                    categoryId: categoryObj.id
                                                                })
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button class={"delete-btn"}
                                                            onClick={() => handleDeleteMenuItemFromCategory(categoryObj.id, index)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>

                        <div className="add-item-section">
                            <h4>Add New Dish</h4>
                            <select
                                value={newItem.categoryId}
                                onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                            >
                                <option value="">-- Select Category --</option>
                                {menuData.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Dish Name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            />
                            <button
                                onClick={async () => {
                                    const res = await fetch(`http://localhost:5000/api/menu/${newItem.categoryId}/item`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            name: newItem.name,
                                            price: Number(newItem.price)
                                        })
                                    });
                                    const result = await res.json();
                                    alert(result.message);
                                    setNewItem({ name: "", price: "", categoryId: "" });
                                    fetchMenuItems();
                                }}
                            >
                                Add Dish
                            </button>
                        </div>
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
