import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./layouts/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./layouts/MainLayouts";
import MyCats from "./pages/MyCats";
import MyFriends from "./pages/MyFriends";
import RecoverPass from "./pages/RecoverPass/RecoverPass";
import UpdatePass from "./pages/UpdatePass/UpdatePass";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Error from "./pages/Error/Error";
import QrCode from "./pages/QrCode/QrCode";
import VeriryOTP from "./pages/VeriryOTP/VeriryOTP";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-cats"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyCats />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-friends"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyFriends />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/recover-pass" element={<RecoverPass />} />
        <Route path="/update-password" element={<UpdatePass />} />
        <Route path="/qr-code" element={<QrCode />} />
        <Route path="/verify-otp" element={<VeriryOTP />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />

      </Routes>
    </Router>
  )
}

export default AppRoutes