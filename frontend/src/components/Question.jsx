import React, { useState, useEffect } from 'react';

const Question = ({ index, question, updateQuestion, removeQuestion }) => {
  const [questionText, setQuestionText] = useState(question.questionText || '');
  const [questionType, setQuestionType] = useState(question.questionType || 'text');
  const [options, setOptions] = useState(question.options || []);
  const [isRequired, setIsRequired] = useState(question.isRequired || false);

  // Handle adding a new option for multiple-choice or checkbox questions
  const addOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    updateQuestion(index, { questionText, questionType, options: newOptions, isRequired });
  };

  // Handle updating an option
  const updateOption = (optionIndex, newOption) => {
    const newOptions = [...options];
    newOptions[optionIndex] = newOption;
    setOptions(newOptions);
    updateQuestion(index, { questionText, questionType, options: newOptions, isRequired });
  };

  // Handle removing an option
  const removeOption = (optionIndex) => {
    const newOptions = options.filter((_, i) => i !== optionIndex);
    setOptions(newOptions);
    updateQuestion(index, { questionText, questionType, options: newOptions, isRequired });
  };

  // Update question state when component receives new props
  useEffect(() => {
    setQuestionText(question.questionText || '');
    setQuestionType(question.questionType || 'text');
    setOptions(question.options || []);
    setIsRequired(question.isRequired || false);
  }, [question]);

  return (
    <div className="question">
      <div>
        <label>Question {index + 1}</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => {
            setQuestionText(e.target.value);
            updateQuestion(index, { questionText: e.target.value, questionType, options, isRequired });
          }}
          required
        />
      </div>
      <div>
        <label>Question Type</label>
        <select
          value={questionType}
          onChange={(e) => {
            const newType = e.target.value;
            setQuestionType(newType);
            // Clear options when type changes, if necessary
            const newOptions = newType === 'multiple-choice' || newType === 'checkbox' ? options : [];
            setOptions(newOptions);
            updateQuestion(index, { questionText, questionType: newType, options: newOptions, isRequired });
          }}
        >
          <option value="text">Text</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>
      {(questionType === 'multiple-choice' || questionType === 'checkbox') && (
        <div>
          <label>Options</label>
          {options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(optionIndex, e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeOption(optionIndex)}
              >
                Remove Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
          >
            Add Option
          </button>
        </div>
      )}
      <div>
        <label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => {
              setIsRequired(e.target.checked);
              updateQuestion(index, { questionText, questionType, options, isRequired: e.target.checked });
            }}
          />
          Required
        </label>
      </div>
      <button
        type="button"
        onClick={() => removeQuestion(index)}
      >
        Remove Question
      </button>
    </div>
  );
};

export default Question;
