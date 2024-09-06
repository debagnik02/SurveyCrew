import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/surveyfill.css';

const SurveyFill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});

  const query = new URLSearchParams(location.search);
  const surveyId = query.get('survey');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/survey/${surveyId}`);
        if (response.data.found) {
          setSurvey(response.data.survey);
        } else {
          alert('Survey not found');
          navigate('/surveys');
        }
      } catch (error) {
        console.error('Error fetching survey:', error);
      }
    };

    fetchSurvey();
  }, [surveyId, navigate]);

  const handleChange = (questionIndex, optionIndex, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionIndex]: {
        ...(prevResponses[questionIndex] || {}),
        [optionIndex]: value
      }
    }));
  };

  const handleTextChange = (questionIndex, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionIndex]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(responses)
      const res = await axios.post('http://localhost:3000/api/submitResponse', {
        surveyId,
        responses
      });
      if(res.data.submit){
      alert('Survey submitted successfully!');
      navigate('/surveys');}
      else{
        alert('There was an error submitting the survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting the survey. Please try again.');
    }
  };

  if (!survey) {
    return <p>Loading...</p>;
  }

  return (
    <div className="surveyfill-container">
      <header className="surveyfill-header">
        <h1>Fill Survey</h1>
      </header>
      <div className="surveyfill-content">
        <h2 className="surveyfill-title">{survey.title}</h2>
        <p className="surveyfill-description">{survey.description}</p>
        <form className="surveyfill-form" onSubmit={handleSubmit}>
          {survey.questions.map((question, index) => (
            <div key={index} className="surveyfill-question">
              <label className="surveyfill-question-text">
                {index + 1}. {question.questionText}
                {question.required && <span className="surveyfill-required"> *Required</span>}
              </label>
              {question.questionType === 'text' && (
                <textarea
                  value={responses[index] || ''}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="surveyfill-input"
                  required={question.required}
                />
              )}
              {(question.questionType === 'multiple-choice' || question.questionType === 'checkbox') && (
                <div className="surveyfill-options">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="surveyfill-option">
                      <input
                        type={question.questionType === 'checkbox' ? 'checkbox' : 'radio'}
                        name={`question-${index}`}
                        value={option}
                        checked={responses[index]?.[optionIndex] || false}
                        onChange={(e) => handleChange(index, optionIndex, e.target.checked)}
                        className="surveyfill-input-option"
                      />
                      <label className="surveyfill-option-text">{option}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" className="surveyfill-submit">Submit Survey</button>
        </form>
      </div>
    </div>
  );
};

export default SurveyFill;
