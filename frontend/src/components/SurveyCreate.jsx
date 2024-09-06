import React, { useState } from 'react';
import Question from './Question'; // Import the Question component
import './styles/surveycreate.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SurveyCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate=useNavigate();
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', questionType: 'text', options: [], isRequired: false }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      alert('No questions provided');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (
        (question.questionType === 'multiple-choice' || question.questionType === 'checkbox') &&
        question.options.length < 1
      ) {
        alert(`Question ${i + 1} must have at least one option.`);
        return;
      }
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    const { email } = userData ? userData : '';

    if (email === '') {
      alert('Login invalid, please login again');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/createSurvey', {
        title,
        description,
        questions,
        email,
      });
      if (response.data.success) {
        alert('Survey successfully created');
        navigate('/profile')
      } else {
        alert('Survey upload failed.');
      }
    } catch (error) {
      alert('There was an error creating the survey. Please try again.');
    }
  };

  return (
    <div className="survey-form-container">
      <div className="survey-form">
        <h1>Create Survey</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Survey Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Survey Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="questions-section">
            <h2>Questions</h2>
            {questions.map((question, index) => (
              <Question
                key={index}
                index={index}
                question={question}
                updateQuestion={updateQuestion}
                removeQuestion={removeQuestion}
              />
            ))}
            <button type="button" onClick={addQuestion} className="add-question-button">
              Add Question
            </button>
          </div>
          <button type="submit" className="submit-button">Create Survey</button>
        </form>
      </div>
    </div>
  );
};

export default SurveyCreate;
