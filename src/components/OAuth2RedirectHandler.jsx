import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the URL (e.g., ?token=eyJhbG...)
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      // Save the JWT for future API requests
      localStorage.setItem('jwt_token', token);
      navigate('/dashboard', { replace: true });
    } else {
      // If something went wrong, send them back to login
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return <div>Authenticating... Please wait.</div>;
}