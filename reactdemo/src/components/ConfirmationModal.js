// ConfirmationModal.js

import React from 'react';
import '../css/ConfirmationModal.css'; // Import CSS file for styling

function ConfirmationModal({ message, handleConfirm, handleCancel }) {
    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>{message}</h2>
                <div className="buttons">
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
