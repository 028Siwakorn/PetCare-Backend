import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import HistoryPage from "./pages/HistoryPage";
import AddPetPage from "./pages/AddPetPage";
import ServicesManagePage from "./pages/ServicesManagePage";
import AddServicePage from "./pages/AddServicePage";
import EditServicePage from "./pages/EditServicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-base-200">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/edit/:id" element={<EditBookingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/add-pet" element={<AddPetPage />} />
            <Route path="/services" element={<ServicesManagePage />} />
            <Route path="/services/new" element={<AddServicePage />} />
            <Route path="/services/:id/edit" element={<EditServicePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
