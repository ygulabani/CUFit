import { useState } from "react";
import axios from "axios";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", content: "Welcome! How can I assist you? 💪" }]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chatbot/", { message: input });
      setMessages([...messages, { role: "user", content: input }, { role: "bot", content: response.data.reply }]);
    } catch (error) {
      setMessages([...messages, { role: "user", content: input }, { role: "bot", content: "Error fetching response." }]);
    }
    setInput("");
  };

  return (
    <>
      <button onClick={toggleChat} className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700">
        💬 Chat
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white border shadow-lg rounded-lg">
          <div className="flex justify-between items-center p-3 bg-green-600 text-white rounded-t-lg">
            <span className="font-semibold">CUFITBot</span>
            <button onClick={toggleChat} className="text-white text-xl">✖</button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <p key={index} className={`text-sm p-2 ${msg.role === "user" ? "text-right bg-gray-200 rounded-lg" : "text-left bg-green-100 rounded-lg"}`}>
                {msg.content}
              </p>
            ))}
          </div>
          <div className="p-3 border-t flex">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-l-lg" />
            <button onClick={sendMessage} className="bg-green-600 text-white px-4 rounded-r-lg">➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;