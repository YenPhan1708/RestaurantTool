import React from "react";
import "../CSS/Home.css";  // optional, only if you want shared styles
import "../CSS/AdminDashboard.css";

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
            </header>

            <section className="admin-dashboard-content">
                <h2>Welcome, Admin</h2>
                <p>Here you can manage menus, reservations, feedback, and more.</p>

                <div className="admin-dashboard-buttons">
                    <button className="admin-dashboard-btn" onClick={() => alert("Menu management coming soon")}>
                        Manage Menu
                    </button>
                    <button className="admin-dashboard-btn" onClick={() => alert("Reservations management coming soon")} style={{ marginLeft: "1rem" }}>
                        Manage Reservations
                    </button>
                </div>
            </section>
        </div>
    );
}
