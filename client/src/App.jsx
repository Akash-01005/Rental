import { Routes, Route, Navigate } from "react-router-dom";
import { NavBar, FootBar } from "./components";
import  { HomePage, PropertiesPage, PropertyDetailsPage, BookingPage, ProfilePage, LoginPage, SignUp, Dashboard, PropertyRegistration } from "./page";
import { useAuthStore, useThemeStore } from "./store";
import { useEffect } from "react";
import { Loader } from "lucide-react"
import { About, Contact } from "./page";

function App() {
  const { theme } = useThemeStore();
  const { user, checkAuth, loading } = useAuthStore();
   
  useEffect(()=>{
     checkAuth();
  },[checkAuth])

  if(!user && loading){
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="">
          <Loader className="ml-4"/>
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <NavBar />
      <Routes>
        <Route path="/" element={user?<HomePage />:<Navigate to="/login" />} />
        <Route path="/about" element={user?<About />:<Navigate to="/login" />} />
        <Route path="/contact" element={user?<Contact />:<Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user?<Dashboard />:<Navigate to="/login" />} />
        <Route path="/properties" element={user?<PropertiesPage />:<Navigate to="/login" />} />
        <Route path="/properties/:id" element={user?<PropertyDetailsPage />:<Navigate to="/login" />} />
        <Route path="/booking/:id" element={user?<BookingPage />:<Navigate to="/login" />} />
        <Route path="/login" element={!user?<LoginPage />:<Navigate to="/" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/owner/property-registration" element={<PropertyRegistration />} />
      </Routes>
      <FootBar />
    </div>
  );
}

export default App;