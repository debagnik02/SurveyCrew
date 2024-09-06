import React from 'react';
import './styles/home.css'; // Make sure to create this CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Home = () => {
    const navigate = useNavigate();

    const goTo = () => {
        navigate('/surveys');
    };

    const handleLogout = async () => {
        const response = await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
        console.log(response.data)
        localStorage.removeItem('user'); // Clear user data
        navigate('/login');
    };

    return (
        <div className="home-container">
            <button className="logout-button" onClick={handleLogout}>Log Out</button>
            <h1 className="logo">SurveyCrew</h1>
            <p className="description">
                SurveyCrew is a website where you can create and upload your surveys on a public platform. You can get anonymous responses to your survey quickly, and uploading surveys comes at a minor cost.
            </p>
            <button className="get-started-button" onClick={goTo}>Get Started</button>
        </div>
    );
};

export default Home;
