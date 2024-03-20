import React, { Component } from "react";
import axios from "axios";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackList: [],
    };
  }

  componentDidMount() {
    this.fetchFeedback();
  }

  fetchFeedback = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "feedback/getAllFeedback"
      );
      this.setState({ feedbackList: response.data });
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  render() {
    const { feedbackList } = this.state;

    return (
      <div>
        <h1>Feedback List</h1>
        <ul>
          {feedbackList.map((feedback) => (
            <li key={feedback.id}>{feedback.feedback}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Feedback;
