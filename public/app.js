import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [error, setError] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
    setError(''); // Clear error on input change
  };

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJson(jsonInput)) {
      setError('Invalid JSON format. Please correct and try again.');
      return;
    }

    const payload = JSON.parse(jsonInput);

    try {
      const response = await axios.post('http://localhost:5000/api/process', payload);
      setResponseData(response.data);
      setDropdownVisible(true); // Show dropdown on valid submission
    } catch (err) {
      setError('Error submitting data. Please check the API and try again.');
    }
  };

  const handleDropdownChange = (e) => {
    setDropdownOptions([...e.target.selectedOptions].map((option) => option.value));
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const filteredResponse = {};
    if (dropdownOptions.includes('Alphabets')) {
      filteredResponse['Alphabets'] = responseData.alphabets;
    }
    if (dropdownOptions.includes('Numbers')) {
      filteredResponse['Numbers'] = responseData.numbers;
    }
    if (dropdownOptions.includes('Highest lowercase alphabet')) {
      filteredResponse['Highest lowercase alphabet'] = responseData.highest_lowercase;
    }

    return (
      <pre>
        {JSON.stringify(filteredResponse, null, 2)}
      </pre>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>12345</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label htmlFor="jsonInput">Enter JSON Input:</label>
        <textarea
          id="jsonInput"
          value={jsonInput}
          onChange={handleJsonInputChange}
          rows="5"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dropdownVisible && (
        <>
          <label htmlFor="dropdown">Select Response Data:</label>
          <select
            id="dropdown"
            multiple
            onChange={handleDropdownChange}
            style={{ display: 'block', margin: '10px 0', padding: '10px', width: '100%' }}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </>
      )}

      <div>
        <h3>Response:</h3>
        {renderResponse()}
      </div>
    </div>
  );
};

export default App;
