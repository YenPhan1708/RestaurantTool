import React, { useState, useEffect } from "react";
import "../CSS/Home.css";
import "../CSS/AdminDashboard.css";
import * as XLSX from 'xlsx';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function AdminDashboard() {
    const [tone, setTone] = useState("casual");
    const [generatedText, setGeneratedText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeSection, setActiveSection] = useState('menu');
    const [menuData, setMenuData] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "", categoryId: "" });
    const [editingItem, setEditingItem] = useState(null); // { docId, itemIndex, name, price, categoryId }
    const [menuFile, setMenuFile] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [reservationInsight, setReservationInsight] = useState("");
    const [analyzingReservations, setAnalyzingReservations] = useState(false);
    const [orderInsight, setOrderInsight] = useState("");
    const [analyzingOrders, setAnalyzingOrders] = useState(false);
    const [feedbackInsight, setFeedbackInsight] = useState("");
    const [analyzingFeedback, setAnalyzingFeedback] = useState(false);

    useEffect(() => {
        if (activeSection === "menu") fetchMenuItems();
        else if (activeSection === "reservations") fetchReservations();
        else if (activeSection === "orders") fetchOrders();
        else if (activeSection === "feedback") fetchFeedbacks();
        else  if (localStorage.getItem("adminLoggedIn") !== "true") {
            window.location.href = "/admin";
        }
    }, [activeSection]);

    const fetchMenuItems = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/menu");
            const data = await res.json();
            setMenuData(data);
        } catch (error) {
            console.error("Failed to fetch menu items:", error);
        }
    };


    const fetchReservations = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/reservations");
            const data = await res.json();
            setReservations(data);
        } catch (err) {
            console.error("Failed to load reservations:", err);
        }
    };

    // Fetch orders from the backend API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/selections');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/feedback");
            const data = await res.json();
            setFeedbacks(data);
        } catch (err) {
            console.error("Failed to load feedbacks:", err);
        }
    };


    const exportToExcel = () => {
        const exportData = orders.map(order => {
            const total = order.items?.reduce((sum, item) => {
                return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
            }, 0);

            return {
                OrderID: order.id,
                Items: order.items?.map(item => `${item.name} x ${item.quantity || 1}`).join(', '),
                Total: total.toFixed(2),
                CreatedAt: formatFirestoreTimestamp(order.createdAt),
                IP: order.ip || "Unknown"
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "Orders.xlsx");
    };

    const deleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            await fetch(`http://localhost:5000/api/selections/${id}`, { method: "DELETE" });
            setOrders(prev => prev.filter(order => order.id !== id));
        } catch (err) {
            console.error("Failed to delete order", err);
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

    const formatFirestoreTimestamp = (ts) => {
        try {
            if (!ts) return "N/A";

            if (typeof ts === "string" || ts instanceof Date) {
                return new Date(ts).toLocaleString();
            }

            if (ts._seconds) {
                return new Date(ts._seconds * 1000).toLocaleString();
            }

            if (ts.seconds) {
                return new Date(ts.seconds * 1000).toLocaleString();
            }

            return "N/A";
        } catch (err) {
            console.error("Invalid timestamp:", ts, err);
            return "Invalid Date";
        }
    };

    const handleAnalyzeReservations = async () => {
        setAnalyzingReservations(true);
        setReservationInsight("");

        try {
            const res = await fetch("http://localhost:5000/api/reservations/analyze", {
                method: "POST"
            });
            const data = await res.json();
            setReservationInsight(data.analysis || "No analysis returned.");
        } catch (err) {
            console.error("AI analysis failed", err);
            setReservationInsight("Failed to analyze reservations.");
        }

        setAnalyzingReservations(false);
    };

    const handleAnalyzeOrders = async () => {
        setAnalyzingOrders(true);
        setOrderInsight("");

        try {
            const res = await fetch("http://localhost:5000/api/selections/analyze", {
                method: "POST"
            });
            const data = await res.json();
            setOrderInsight(data.analysis || "No analysis returned.");
        } catch (err) {
            console.error("Order analysis failed", err);
            setOrderInsight("Failed to analyze orders.");
        }

        setAnalyzingOrders(false);
    };

    const handleAnalyzeFeedback = async () => {
        setAnalyzingFeedback(true);
        setFeedbackInsight("");

        try {
            const res = await fetch("http://localhost:5000/api/feedback/analyze", {
                method: "POST"
            });
            const data = await res.json();
            setFeedbackInsight(data.analysis || "No analysis returned.");
        } catch (err) {
            console.error("Feedback analysis failed", err);
            setFeedbackInsight("Failed to analyze feedback.");
        }

        setAnalyzingFeedback(false);
    };



    return (
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
            </header>

            <section className="admin-dashboard-content">
                <h2>Welcome, Admin</h2>
                <p>Manage your restaurant’s content and promotions here.</p>
                <button
                    className="admin-dashboard-btn"
                    style={{float: "right"}}
                    onClick={() => {
                        localStorage.removeItem("adminLoggedIn");
                        window.location.href = "/admin/login";
                    }}
                >
                    🚪 Logout
                </button>

                <div className="admin-dashboard-buttons">
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("menu")}>
                        Manage Menu
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("reservations")}
                            style={{marginLeft: "1rem"}}>
                        Manage Reservations
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => setActiveSection("orders")}
                            style={{marginLeft: "1rem"}}>
                        View Orders
                    </button>
                    <button
                        className="admin-dashboard-btn"
                        onClick={() => setActiveSection("feedback")}
                        style={{marginLeft: "1rem"}}
                    >
                        View Feedback
                    </button>

                </div>

                <hr/>

                {activeSection === "menu" && (
                    <div className="menu-management">
                        <h3>📋 Menu Management</h3>
                        <div className="upload-section">
                            <input type="file" accept=".json" onChange={(e) => setMenuFile(e.target.files[0])}/>
                            <button onClick={handleFileUpload} className="admin-dashboard-btn">
                                Upload Menu File
                            </button>
                        </div>

                        <table style={{marginTop: "1rem", width: "100%"}}>
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
                                                            setEditingItem({...editingItem, name: e.target.value})
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
                                                            setEditingItem({...editingItem, price: e.target.value})
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
                                                            setEditingItem({...editingItem, categoryId: e.target.value})
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
                                                        <button className={"save-btn"} onClick={handleSaveEdit}>Save
                                                        </button>
                                                        <button className="cancel-btn"
                                                                onClick={() => setEditingItem(null)}
                                                                style={{marginLeft: "0.5rem"}}>
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
                                onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
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
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newItem.price}
                                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                            />
                            <button
                                onClick={async () => {
                                    const res = await fetch(`http://localhost:5000/api/menu/${newItem.categoryId}/item`, {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"},
                                        body: JSON.stringify({
                                            name: newItem.name,
                                            price: Number(newItem.price)
                                        })
                                    });
                                    const result = await res.json();
                                    alert(result.message);
                                    setNewItem({name: "", price: "", categoryId: ""});
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
                        {activeSection === "reservations" && (
                            <div className="reservations-management">
                                <h3>📅 Reservation Management</h3>
                                <table style={{width: "100%", borderCollapse: "collapse", marginTop: "1rem"}}>
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Guests</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{textAlign: "center", padding: "1rem"}}>
                                                No reservations found.
                                            </td>
                                        </tr>
                                    ) : (
                                        reservations.map((res, index) => (
                                            <tr key={index}>
                                                <td>{res.date}</td>
                                                <td>{res.time}</td>
                                                <td>{res.guests}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>

                                </table>

                                <hr style={{margin: "2rem 0"}}/>
                                <h4>🔍 AI Reservation Analysis</h4>
                                <button
                                    className="admin-dashboard-btn"
                                    onClick={handleAnalyzeReservations}
                                    disabled={analyzingReservations}
                                >
                                    {analyzingReservations ? "Analyzing..." : "Analyze with AI"}
                                </button>

                                {reservationInsight && (
                                    <div style={{
                                        marginTop: "1rem",
                                        background: "#f9f9f9",
                                        padding: "1rem",
                                        borderRadius: "8px"
                                    }}>
                                        <h5>📊 Insights:</h5>
                                        <div
                                            style={{whiteSpace: "pre-wrap"}}
                                            dangerouslySetInnerHTML={{__html: reservationInsight.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}}
                                        ></div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                )}

                {activeSection === "orders" && (
                    <div className="orders-management">
                        <h3>🧾 Order Management</h3>

                        <button onClick={exportToExcel} style={{marginBottom: '1rem'}}>📥 Export to Excel</button>

                        {loading && <p>Loading orders...</p>}
                        {error && <p style={{color: "red"}}>Error: {error}</p>}
                        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

                        {!loading && !error && orders.length > 0 && (
                            <table className="orders-table">
                                <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Total Price</th>
                                    <th>Created At</th>
                                    <th>IP Address</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => {
                                    const total = order.items?.reduce((sum, item) => {
                                        const price = parseFloat(item.price || 0);
                                        const qty = parseInt(item.quantity || 1);
                                        return sum + price * qty;
                                    }, 0) || 0;


                                    return (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx}>
                                                        {item.name} x {item.quantity || 1}
                                                    </div>
                                                )) || "No items"}
                                            </td>
                                            <td>${total.toFixed(2)}</td>
                                            <td>
                                                {order.createdAt && order.createdAt._seconds
                                                    ? new Date(order.createdAt._seconds * 1000).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                            <td>{order.ip || "Unknown"}</td>
                                            <td>
                                                <button onClick={() => deleteOrder(order.id)}>🗑 Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                        <hr style={{margin: "2rem 0"}}/>
                        <h4>🍽 Order Insights</h4>
                        <button
                            className="admin-dashboard-btn"
                            onClick={handleAnalyzeOrders}
                            disabled={analyzingOrders}
                        >
                            {analyzingOrders ? "Analyzing..." : "Analyze with AI"}
                        </button>

                        {orderInsight && (
                            <div
                                style={{marginTop: "1rem", background: "#f0f0f0", padding: "1rem", borderRadius: "8px"}}
                                dangerouslySetInnerHTML={{
                                    __html: orderInsight
                                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                        .replace(/\n/g, "<br />")
                                }}

                            />
                        )}

                    </div>
                )}

                {activeSection === "feedback" && (
                    <div className="feedback-management">
                        <h3>🗣️ User Feedback</h3>

                        {feedbacks.length === 0 ? (
                            <p>No feedback received.</p>
                        ) : (
                            <>
                                <table className="feedback-table">
                                    <thead>
                                    <tr>
                                        <th style={{textAlign: "left"}}>Name</th>
                                        <th style={{textAlign: "left"}}>Email</th>
                                        <th style={{textAlign: "left"}}>Message</th>
                                        <th style={{textAlign: "left"}}>Created At</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {feedbacks.map((fb, index) => (
                                        <tr key={index}>
                                            <td>{fb.name || "Anonymous"}</td>
                                            <td>{fb.email || "N/A"}</td>
                                            <td>{fb.message}</td>
                                            <td>{formatFirestoreTimestamp(fb.createdAt)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <hr style={{margin: "2rem 0"}}/>
                                <h4>📊 AI Feedback Analysis</h4>
                                <button
                                    className="admin-dashboard-btn"
                                    onClick={handleAnalyzeFeedback}
                                    disabled={analyzingFeedback}
                                >
                                    {analyzingFeedback ? "Analyzing..." : "Analyze with AI"}
                                </button>

                                {feedbackInsight && (
                                    <div
                                        style={{
                                            marginTop: "1rem",
                                            background: "#f0f0f0",
                                            padding: "2rem",
                                            borderRadius: "8px",
                                            whiteSpace: "pre-wrap"
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(marked.parse(feedbackInsight))
                                        }}
                                    />
                                )}
                            </>
                        )}

                    </div>
                )}

                <hr style={{marginTop: "2rem"}}/>

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
                        style={{marginTop: "1rem"}}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Generating..." : "Generate Promotion"}
                    </button>
                    {generatedText && (
                        <div className="promotion-result" style={{marginTop: "1rem", whiteSpace: "pre-wrap"}}>
                            <h4>Generated Promotion:</h4>
                            <p>{generatedText}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
