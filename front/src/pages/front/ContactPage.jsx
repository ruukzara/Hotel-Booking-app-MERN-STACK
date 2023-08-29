import React from 'react';
import './index.css'; // Import your CSS file for styling

export const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>If you have any questions or inquiries, feel free to reach out to us.<br />
      We will reach you and reply your queries within 24 hours. </p>

      <div className="contact-section">
        <div className="contact-details">
          <h2>Contact Information</h2>
          <br />
          <p>
            <strong>Address:</strong> 123 Main Street, Cityville
            <br /><br />
            <strong>Email:</strong> info@example.com
            <br /><br />
            <strong>Phone:</strong> +123 456 7890
            <br /><br />
            <strong>Fax:</strong> +123 456 7800
            <br /><br />
            <strong>Hotline: </strong> +123 456 7811 (opens for 24 hours)
          </p>
        </div>
        
        <div className="contact-form">
          <h2>Contact Form</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="4"></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Q: How do I make a reservation?</h3>
          <p>A: You can make a reservation by visiting our website or calling our reservation hotline.</p>
        </div>
        <div className="faq-item">
          <h3>Q: What are the check-in and check-out times?</h3>
          <p>A: Check-in time is at 3:00 PM and check-out time is at 12:00 PM.</p>
        </div>
        <div className="faq-item">
          <h3>Q: Is parking available at the hotel?</h3>
          <p>A: Yes, we offer complimentary parking for hotel guests.</p>
        </div>
        <div className="faq-item">
          <h3>Q: Do you have a fitness center?</h3>
          <p>A: Yes, our hotel features a state-of-the-art fitness center that is open to all guests.</p>
        </div>
        {/* Add more FAQ items */}
      </div>
    </div>
  );
};


