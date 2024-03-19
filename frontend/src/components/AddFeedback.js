import React, { useState } from "react";
import axios from "axios";

function AddFeedback() {

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleRatingChange = e => setRating(e.target.value);
  const handleCommentChange = e => setComment(e.target.value);

  function sendData(e) {
    e.preventDefault();
    
    const feedback = {
      rating: rating,
      comment: comment,
    };

    axios.post("http://localhost:8070/feedback/add", feedback)
      .then(res => {
      console.log(res.data);
      alert("Feedback added successfully");
    }).catch(err => alert(err));
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
      <h1>Add Feedback</h1>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={sendData}>
                <div className="form-group">
                  <label htmlFor="ratingSelect">Rating</label>
                  <select className="form-control" id="ratingSelect" onChange={handleRatingChange}>
                    <option value="">Select Rating</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="commentTextarea">Comment</label>
                  <textarea
                    className="form-control"
                    id="commentTextarea"
                    rows="3"
                    placeholder="Enter your comment here..."
                    onChange={handleCommentChange}
                  ></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFeedback;
