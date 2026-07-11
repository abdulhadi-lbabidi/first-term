import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Rooms from '../pages/Rooms';
import RoomDetails from '../pages/RoomDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import { StorageService } from '../services';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
}

function LanguageRedirect() {
  const savedLang = StorageService.getLanguage();
  return <Navigate to={`/${savedLang}`} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Root Redirect to language prefix */}
        <Route path="/" element={<LanguageRedirect />} />
        
        {/* App routes nested inside Main Layout */}
        <Route path="/:lang" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Nested 404 inside layout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Global Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
