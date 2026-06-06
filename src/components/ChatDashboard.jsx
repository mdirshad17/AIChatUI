import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatDashboard() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  // Protect the route: Kick user out if no token exists
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    console.log("This is the token",token)
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsTyping(true);

    // Add user message to UI immediately
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    
    // Create a placeholder for the AI's streaming response
    setChatHistory((prev) => [...prev, { role: 'ai', content: '' }]);

    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch(`http://localhost:8080/chat-stream?message=${encodeURIComponent(userMessage)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Attach the JWT to bypass the Spring filter
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout(); // Token expired or invalid
        return;
      }

      // Read the incoming Flux stream chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Append the new chunk dynamically to the last message in the array
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content += chunk;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Stream error:", error);
      setChatHistory((prev) => [...prev, { role: 'system', content: 'Connection lost.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Secure AI Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
      </div>

      <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'auto', padding: '10px', marginBottom: '10px', backgroundColor: '#fafafa' }}>
        {chatHistory.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Start the conversation...</p>}
        
        {chatHistory.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '8px 12px', 
              borderRadius: '15px',
              backgroundColor: msg.role === 'user' ? '#007bff' : '#e0e0e0',
              color: msg.role === 'user' ? 'white' : 'black',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        {isTyping && <div style={{ color: '#888', fontStyle: 'italic', fontSize: '12px' }}>AI is typing...</div>}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Ask the AI something..."
          style={{ flexGrow: 1, padding: '10px', fontSize: '16px' }}
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping} style={{ padding: '10px 20px', marginLeft: '5px' }}>
          Send
        </button>
      </form>
    </div>
  );
}