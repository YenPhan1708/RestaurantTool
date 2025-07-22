import React, { useState } from "react";
import "../CSS/Home.css";  // If you want to keep shared styles
import "../CSS/AdminLogin.css";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "password") {
            window.location.href = "/admin/dashboard";
        } else {
            alert("Invalid credentials");
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
