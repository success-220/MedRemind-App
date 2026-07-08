import React, { useEffect, useRef, useState } from 'react';
import '../styles/chatbot.css';

const initialMessages = [
  { from: 'bot', text: 'Hello! I can help with reminders, medication questions, and simple health guidance.' },
];

function getBotReply(message) {

  const value = message.toLowerCase().trim();

  /* Greetings */

  if (
    value.includes("hi") ||
    value.includes("hello") ||
    value.includes("hey")
  ) {
    return "Hello 👋 I'm MedRemind Assistant. I can help you with medications, reminders, your calendar, healthy living and using this app.";
  }

  /* Medication */

  if (
    value.includes("add medication") ||
    value.includes("add medicine")
  ) {
    return "To add a medication, open the Add Medication page, enter the medicine name, dosage, time and frequency, then tap Save.";
  }

  if (
    value.includes("edit medication") ||
    value.includes("change medication")
  ) {
    return "Open the Medication page and tap the Edit button beside the medicine you want to update.";
  }

  if (
    value.includes("delete medication") ||
    value.includes("remove medication")
  ) {
    return "Open the Medication page and tap Delete beside the medicine.";
  }

  /* Reminder */

  if (
    value.includes("reminder") ||
    value.includes("alarm")
  ) {
    return "Medication reminders notify you when it is time to take your medicine. You can mark it as Taken or Snooze it.";
  }

  if (
    value.includes("missed dose") ||
    value.includes("miss medicine") ||
    value.includes("forgot medicine")
  ) {
    return "If you miss a dose, take it when you remember unless it is almost time for your next dose. Never double the dose unless your healthcare provider advises you.";
  }

  /* Calendar */

  if (
    value.includes("calendar")
  ) {
    return "The calendar helps you see your medication history. Green means Taken, while Red means Missed medication.";
  }

  /* Notification */

  if (
    value.includes("notification") ||
    value.includes("alert")
  ) {
    return "Notifications remind you to take your medicine on time. Check the Notification page to see Upcoming, Missed and Completed reminders.";
  }

  /* Blood Pressure */

  if (
    value.includes("blood pressure") ||
    value.includes("hypertension")
  ) {
    return "High blood pressure is often called the silent killer because it may not show symptoms. Take your medications regularly and check your blood pressure often.";
  }

  /* Diabetes */

  if (
    value.includes("diabetes") ||
    value.includes("blood sugar")
  ) {
    return "Diabetes causes high blood sugar levels. Healthy eating, regular exercise and taking medication as prescribed help manage it.";
  }

  /* Fever */

  if (
    value.includes("fever")
  ) {
    return "Drink plenty of water, rest and monitor your temperature. If your fever is high or lasts several days, contact a healthcare professional.";
  }

  /* Headache */

  if (
    value.includes("headache")
  ) {
    return "Headaches may result from stress, dehydration or illness. Drink water, rest and consult a healthcare provider if headaches are severe or frequent.";
  }

  /* Water */

  if (
    value.includes("water")
  ) {
    return "Drinking enough water every day helps your body function properly and supports good health.";
  }

  /* Healthy Tips */

  if (
    value.includes("healthy") ||
    value.includes("health tip") ||
    value.includes("tips")
  ) {
    const tips = [
      "Take your medications at the same time every day.",
      "Drink enough water.",
      "Eat healthy meals.",
      "Exercise regularly.",
      "Sleep 7-8 hours every night.",
      "Attend your medical appointments."
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  }

  /* Emergency */

  if (
    value.includes("emergency") ||
    value.includes("help")
  ) {
    return "If someone has chest pain, difficulty breathing or loses consciousness, seek emergency medical care immediately.";
  }

  /* Navigation */

  if (
    value.includes("home")
  ) {
    return "Home shows today's medications, reminders and quick actions.";
  }

  if (
    value.includes("profile")
  ) {
    return "Profile lets you manage your account settings and personal information.";
  }

  if (
    value.includes("notification page")
  ) {
    return "The Notification page shows Upcoming, Missed and Completed medication reminders.";
  }

  /* Thanks */

  if (
    value.includes("thank")
  ) {
    return "You're welcome 😊. I'm always here to help.";
  }

  return "I'm here to help with medications, reminders, healthy living, blood pressure, diabetes, calendar information, notifications and using the MedRemind app.";
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMessage = { from: 'user', text: trimmed };
    setMessages((items) => [...items, userMessage]);
    setInput('');
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((items) => [...items, { from: 'bot', text: getBotReply(trimmed) }]);
      setIsTyping(false);
    }, 750);
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
              <h3>MedRemind Assistant</h3>
              <p>Always here to help</p>
            </div>
            <div className="chatbot__header-actions">
             <button
              className="chatbot__icon-button"
              onClick={() => setIsOpen(false)}
              >
               —
              </button>

             <button
          className="chatbot__icon-button"
          onClick={() => setIsOpen(false)}
          >
           ✕
           </button>
           </div>
          </div>
          <div className="chatbot__messages">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`chatbot__message chatbot__message--${message.from}`}>
                {message.text}
              </div>
            ))}
            {isTyping && <div className="chatbot__message chatbot__message--bot chatbot__message--typing">Typing…</div>}
            <div ref={bottomRef} />
          </div>
          <div className="chatbot__input-group">
            <input className="chatbot__input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about medications or reminders" onKeyDown={(event) => event.key === 'Enter' && sendMessage()} />
            <button className="button button--primary button--small" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;
