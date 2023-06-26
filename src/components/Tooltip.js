import React, { useState } from 'react';
import '../styles/Tooltip.scoped.css'; // Import CSS for styling

const Tooltip = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        // Perform any desired action when an option is clicked
    };

    return (
        <div className="tooltip-container">
            <div
                className="target-element"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Hover over me
            </div>
            {showTooltip && (
                <div className="tooltip-options">
                    <ul>
                        <li>
                            <button
                                className={`option-button ${
                                    selectedOption === 'Option 1' ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionClick('Option 1')}
                            >
                                Option 1
                            </button>
                        </li>
                        <li>
                            <button
                                className={`option-button ${
                                    selectedOption === 'Option 2' ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionClick('Option 2')}
                            >
                                Option 2
                            </button>
                        </li>
                        <li>
                            <button
                                className={`option-button ${
                                    selectedOption === 'Option 3' ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionClick('Option 3')}
                            >
                                Option 3
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
