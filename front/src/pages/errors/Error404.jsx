import React from 'react';
import './Error404.css'; // Import the CSS file for styling

export const Error404 = () => {
  const handleGoBack = () => {
    window.history.back(); // Go back to the previous page
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">Oops! Page not found.</h1>
        <p className="error-message">The requested page could not be found.</p>
        <p className="error-message">Please check the URL or navigate back to the previous page.</p>
        <button onClick={handleGoBack} className="error-link">Go back</button>
      </div>
    </div>
  );
};
