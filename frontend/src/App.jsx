import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminLogin from './pages/AdminLogin';  // adjust path if necessary
import AdminDashboard from './pages/AdminDashboard';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Customer routes */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
