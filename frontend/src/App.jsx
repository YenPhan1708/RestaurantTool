import React from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MainContent from './components/MainContent.jsx';
import './CSS/App.css';

function App() {
    return (
        <div className="app-layout">
            <Header />
            <div className="main-layout">
                <Sidebar />
                <MainContent />
            </div>
        </div>
    );
}

export default App;
