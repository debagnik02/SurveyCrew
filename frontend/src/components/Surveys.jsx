import React, { useState, useEffect } from 'react';
import './styles/surveys.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Surveys = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);

  // Fetch surveys from the API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []);

  const handleSurveyClick = (surveyId) => {
    navigate(`/fill?survey=${surveyId}`);
  };

  return (
    <div className="surveys-page">
      <button className="surveys-page__logout-button" onClick={() => navigate('/login')}>Log Out</button>
      <h1 className="surveys-page__heading">Surveys for You</h1>
      <div className="surveys-page__list">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <div
              key={survey._id}
              className="surveys-page__survey-item"
              onClick={() => handleSurveyClick(survey._id)}
            >
              <h2 className="surveys-page__survey-title">{survey.title}</h2>
              <p className="surveys-page__survey-description">{survey.description}</p>
            </div>
          ))
        ) : (
          <p className="surveys-page__no-surveys">No surveys available.</p>
        )}
      </div>
      <button className="surveys-page__create-button" onClick={() => navigate('/create')}>Create Survey</button>
    </div>
  );
};

export default Surveys;
