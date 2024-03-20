package com.tyrecentre.entity;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "feedback")
public class FeedbackEntity implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;


	@Id
    private String id;

	
	String feedback;


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getFeedback() {
		return feedback;
	}


	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

}
