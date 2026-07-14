import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/app/public/Home';
import Rooms from '@/app/rooms/Rooms';
import RoomDetails from '@/app/rooms/RoomDetails';
import Login from '@/app/auth/Login';
import Register from '@/app/auth/Register';
import Cart from '@/app/booking/Cart';
import Checkout from '@/app/booking/Checkout';
import MyBookings from '@/app/booking/MyBookings';
import Profile from '@/app/profile/Profile';
import About from '@/app/public/About';
import Contact from '@/app/public/Contact';
import Terms from '@/app/legal/Terms';
import Privacy from '@/app/legal/Privacy';
import NotFound from '@/app/public/NotFound';
import LocationsMap from '@/app/rooms/LocationsMap';
import { StorageService } from '@/services';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

function RouteTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.start();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
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
      <RouteTracker />
      <Routes>
        {/* Root Redirect to language prefix */}
        <Route path="/" element={<LanguageRedirect />} />

        {/* App routes nested inside Main Layout */}
        <Route path="/:lang" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="map" element={<LocationsMap />} />

          {/* Nested 404 inside layout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Global Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
