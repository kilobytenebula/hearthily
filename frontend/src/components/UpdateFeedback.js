import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom'; 

export default function UpdateFeedback() {
    return (
        <div className="update-feedback">
            <div className="update-feedback-container">
                <div className="update-feedback-form">
                    <form>
                        <label htmlFor="rating">Rating:</label>
                        <input type="number" id="rating" />

                        <label htmlFor="comment">Comment:</label>
                        <textarea id="comment" />

                        <button type="submit">Update Feedback</button>
                    </form>
                </div>
                <div className="update-feedback-buttons">
                    <Link to="/order-details/65f7d7052e0ba6d9c6dc6e23" className="button">Cancel</Link>
                </div>
            </div>
        </div>
    );
}