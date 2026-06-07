
import React from "react";
export default function Login() {
  const handleGoogleLogin = () => {
    // Redirect directly to the Spring Boot backend trigger URL
    window.location.href = 'http://3.108.194.133:8080/oauth2/authorization/google';
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://3.108.194.133:8080/oauth2/authorization/github';
  };

  return (
  
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Welcome to the AI Chat</h2>
      <p>Please sign in to continue</p>
      
      <button onClick={handleGoogleLogin} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
        Sign in with Google
      </button>
      
      <button onClick={handleGithubLogin} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
        Sign in with GitHub
      </button>
    </div>
  );
}