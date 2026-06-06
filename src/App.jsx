import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import ChatDashboard from "./components/ChatDashboard";
// import Login from './Login';
// import OAuth2RedirectHandler from './OAuth2RedirectHandler';
// import ChatDashboard from './ChatDashboard';

export default function App() {
  return (
    // <div>Hello world</div>
    // <Login/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/oauth2/redirect"
          element={<OAuth2RedirectHandler />}
        ></Route>
        <Route path="/dashboard" element={<ChatDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
