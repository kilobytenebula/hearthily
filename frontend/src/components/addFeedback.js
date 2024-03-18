import React from "react";

function AddFeedback() {
    return (
        <div>
            <form>
                <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <select className="form-control" id="rating">
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <small id="feedbackHelp" className="form-text text-muted">
                        We'll never share your feedback with anyone else.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        className="form-control"
                        id="comment"
                        placeholder="What do you think about our service?"
                    />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                        Check me out
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}
