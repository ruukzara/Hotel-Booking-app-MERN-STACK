import React from 'react';

export const Error404 = () => {
    return <div className="error-page">
    <h1 className="error-title">Oops! Page not found.</h1>
    <p className="error-message">The requested page could not be found.</p>
    <p className="error-message">Please check the URL or navigate back to the homepage.</p>
    <a href="/" className="error-link">Go back to Homepage</a>
  </div>
}