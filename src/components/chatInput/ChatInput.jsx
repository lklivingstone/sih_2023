import React, { useState, useRef } from 'react';

const ChatInput = () => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    adjustTextAreaHeight();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Handle submission logic here, e.g., send the text to a chat system
    console.log('Submitted:', inputText);

    setInputText('');
    resetTextAreaHeight();
  };

  const adjustTextAreaHeight = () => {
    if (inputRef.current) {
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${scrollHeight}px`;
    }
  };

  const resetTextAreaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="chat-input">
      <textarea
        ref={inputRef}
        style={{
          width: '300px',
          minHeight: '50px',
          maxHeight: '200px',
          position: 'absolute',
          bottom: '0',
        }}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatInput;
