import React, { useEffect, useRef, useState } from 'react';
import agent from '../agent.js'; 
import '../styles/chatbot.css';

const initialMessages = [
  { from: 'bot', text: 'Hello! I am your MedRemind AI Assistant. I can help with reminders, medication questions, and health guidance.' },
];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

 const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: 'user', text: trimmed };
    setMessages((items) => [...items, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await agent.AI.chat(trimmed);
      
      let aiResponse = data.reply || "I received your message, but I'm not sure how to respond.";
      
      aiResponse = aiResponse.replace(/[*#]/g, '');
      
      setMessages((items) => [...items, { from: 'bot', text: aiResponse }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((items) => [...items, { 
        from: 'bot', 
        text: "I'm having trouble connecting to the server right now. Please check your connection." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
      <button className="chatbot__toggle" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle chat assistant">
        {isOpen ? '×' : '💬'}
      </button>
      {isOpen && (
        <div className="chatbot__panel" role="dialog" aria-label="Health assistant chat">
          <div className="chatbot__header">
            <div>
              <h3>MedRemind AI</h3>
              <p>Powered by Gemini</p>
            </div>
            <div className="chatbot__header-actions">
             <button className="chatbot__icon-button" onClick={() => setIsOpen(false)}>—</button>
             <button className="chatbot__icon-button" onClick={() => setIsOpen(false)}>✕</button>
           </div>
          </div>
          <div className="chatbot__messages">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`chatbot__message chatbot__message--${message.from}`}>
                {message.text}
              </div>
            ))}
            {isTyping && <div className="chatbot__message chatbot__message--bot chatbot__message--typing">Thinking...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="chatbot__input-group">
            <input 
              className="chatbot__input" 
              value={input} 
              onChange={(event) => setInput(event.target.value)} 
              placeholder="Ask a medical question..." 
              onKeyDown={(event) => event.key === 'Enter' && sendMessage()} 
            />
            <button className="button button--primary button--small" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;