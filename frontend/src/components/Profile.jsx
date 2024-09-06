import React, { useState, useEffect } from 'react';
import './styles/profile.css'; // Ensure you create and style this file accordingly
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [fetchState, setFetchState] = useState(null);
    const [userSurveys, setUserSurveys] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const getUserDetails = () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                const { name, email } = userData;
                setUserName(name);
                setUserEmail(email);
            }
        };

        const fetchUserSurveys = async () => {
            try {
              console.log('Sending email:', userEmail); // Log email
              const response = await axios.post('http://localhost:3000/api/user-surveys', { email: userEmail });
              setUserSurveys(response.data);
              setFetchState(true);
            } catch (error) {
              console.error('Error fetching user surveys:', error);
              setFetchState(false);
            } finally {
              setLoading(false);
            }
          }
        if(userEmail=='')
        getUserDetails();
        else
        fetchUserSurveys();
    }, [userEmail]);

    const handleSurveyClick = (surveyId) => {
        navigate(`/stats?survey=${surveyId}`);
    };

    if (loading) {
        return <div className="profile-page__loading">Loading...</div>; // Add your loading styling here
    }

    return (
        <div className="profile-page">
            <button className="profile-page__logout-button" onClick={() => navigate('/login')}>Log Out</button>
            <div className="profile-page__info">
                <h1 className="profile-page__name">{userName}</h1>
                <p className="profile-page__email">{userEmail}</p>
            </div>
            <h2 className="profile-page__heading">Your Surveys</h2>
            <div className="profile-page__list">
                {userSurveys.length > 0 ? (
                    userSurveys.map((survey) => (
                        <div
                            key={survey._id}
                            className="profile-page__survey-item"
                            onClick={() => handleSurveyClick(survey._id)}
                        >
                            <h3 className="profile-page__survey-title">{survey.title}</h3>
                            <p className="profile-page__survey-description">{survey.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="profile-page__no-surveys">No surveys available.</p>
                )}
            </div>
            <button className="profile-page__create-button" onClick={() => navigate('/create')}>Create Survey</button>
        </div>
    );
};

export default Profile;
