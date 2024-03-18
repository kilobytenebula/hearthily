import React, { useState } from "react";

export default function NewFeedback() {
    return (
        <div className="container">
            <form>
                <div>
                    <label>Rating</label>
                    <select>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label>Comment</label>
                    <textarea placeholder="Enter your comments"></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
