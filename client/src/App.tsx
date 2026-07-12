import Navbar from "./components/common/Navbar";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./components/pages/home/HomePage";
import SignUpPage from "./components/pages/signup/SignUpPage";
import LoginPage from "./components/pages/login/LoginPage";
import SettingsPage from "./components/pages/settings/SettingsPage";
import ProfilePage from "./components/pages/profile/ProfilePage";
import { useAuth } from "./store/useAuth.store";
import { useEffect } from "react";
import FullHideLoader from "./components/common/Loaders/FullHideLoader";
import { Toaster } from "react-hot-toast";

const App = () => {
    const { checkAuth, isCheckingAuth, authUser } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return <FullHideLoader />;
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? (
                            <HomePage />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        !authUser ? <SignUpPage /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/login"
                    element={
                        !authUser ? <LoginPage /> : <Navigate to="/" replace />
                    }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                    path="/profile"
                    element={
                        authUser ? (
                            <ProfilePage />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
