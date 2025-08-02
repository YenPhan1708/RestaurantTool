import React, { useState } from "react";
import "../CSS/Home.css";  // If you want to keep shared styles
import "../CSS/AdminLogin.css";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("adminLoggedIn", "true");
                window.location.href = "/admin/dashboard";
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Error logging in");
        }
    };


    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h1 className="admin-login-title">Admin Login</h1>
                <form onSubmit={handleLogin} className="admin-login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="admin-login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="admin-login-input"
                    />
                    <button type="submit" className="admin-login-button">Login</button>
                </form>
            </div>
        </div>
    );
}
