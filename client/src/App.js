import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
//import Footer from "./components/Layout/Footer";   // import your footer

function App() {
  return (
    <div id="root" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* main content wrapper */}
      <div className="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {/* footer always at bottom */}
      {/* <Footer /> */}
    </div>
  );
}

export function ProtectedRoutes(props) {
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
