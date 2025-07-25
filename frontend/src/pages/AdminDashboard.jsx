import React, { useState } from "react";
import "../CSS/Home.css";
import "../CSS/AdminDashboard.css";

export default function AdminDashboard() {
    const [tone, setTone] = useState("casual");
    const [generatedText, setGeneratedText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

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
            if (data.suggestion) {
                setGeneratedText(data.suggestion);
            } else {
                setGeneratedText("No promotion suggestion received.");
            }
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
                    <button className="admin-dashboard-btn" onClick={() => alert("Menu management coming soon")}>
                        Manage Menu
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => alert("Reservations management coming soon")} style={{ marginLeft: "1rem" }}>
                        Manage Reservations
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => alert("Orders management coming soon")} style={{ marginLeft: "1rem" }}>
                        View Orders
                    </button>
                </div>

                <hr />

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
