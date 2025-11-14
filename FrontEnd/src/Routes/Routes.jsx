import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import NavBar from "../Components/NavBar/Nav";
import HomeRoute from "./HomeRoute";
import Footer from "../Components/Footer/Footer";


export default function Router() {
    const location = useLocation();

    // rotas SEM navbar
    const noNavbarRoutes = ["/login", "/register", '/movieRegistration'];
    const hideNavbar = noNavbarRoutes.includes(location.pathname);

    return (
        <>
            {!hideNavbar && <NavBar />}

            <Routes>

                {/* Públicas */}
                <Route path="/" element={<HomeRoute />} />

                {/* Privadas */}
                {/* <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                /> */}

                {/* <Route
                    path="/administration"
                    element={
                        <ProtectedRoute>
                            <AdministrationPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/registerMovie"
                    element={
                        <ProtectedRoute>
                            <RegisterMovie />
                        </ProtectedRoute>
                    }
                /> */}
            </Routes>

            <Footer />
        </>
    );
}
