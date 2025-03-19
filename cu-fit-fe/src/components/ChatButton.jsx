import { useState } from "react";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 text-white font-semibold p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300"
      >
        💬 Chat
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white border border-gray-300 shadow-lg rounded-lg">
          <div className="flex justify-between items-center p-3 bg-green-600 text-white rounded-t-lg">
            <span className="font-semibold">Chat</span>
            <button onClick={toggleChat} className="text-white text-xl">
              ✖
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto text-gray-800">
            <p className="text-sm text-gray-500">Welcome! How can I help? 😊</p>
            {/* Chat messages will go here */}
          </div>
          <div className="p-3 border-t flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
            />
            <button className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;