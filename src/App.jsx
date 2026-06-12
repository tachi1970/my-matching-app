import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ModeSelectorPage from "./pages/ModeSelectorPage";
import LandingPage from "./pages/LandingPage";
import AreaSearchPage from "./pages/AreaSearchPage";
import FeedPage from "./pages/FeedPage";
import ClinicFeedPage from "./pages/ClinicFeedPage";
import ChatScreen from "./pages/ChatScreen";
import PricingPage from "./pages/PricingPage";
import ClinicRegisterPage from "./pages/ClinicRegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import TalkListPage from "./pages/TalkListPage";
import MyPage from "./pages/MyPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<ModeSelectorPage />} />
          <Route path="/lp" element={<LandingPage />} />
          <Route path="/search" element={<AreaSearchPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/clinic" element={<ClinicFeedPage />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/clinic-register" element={<ClinicRegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/talk" element={<TalkListPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/student-register" element={<StudentRegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
