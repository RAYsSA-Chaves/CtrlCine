// Todas as rotas

import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import NavBar from '../Components/NavBar/Nav';
import HomeRoute from './HomeRoute';
import Footer from '../Components/Footer/Footer';
import Login from '../Pages/Login/Login';
import HomePage from '../Pages/HomePage/HomePage';
import Cadastro from '../Pages/Cadastro/Cadastro';
import ListasPage from '../Pages/ListasPage/ListasPage.jsx'


export default function Router() {
    const location = useLocation();

    // rotas SEM navbar
    const noNavbarRoutes = ['/login', '/cadastro', '/movieRegistration'];
    const hideNavbar = noNavbarRoutes.includes(location.pathname);
    // rotas SEM footer
    const noFooterRoutes = ['/login', '/cadastro', '/movieRegistration'];
    const hideFooter = noFooterRoutes.includes(location.pathname);

    return (
        <>
            {!hideNavbar && <NavBar />}

            <Routes>

                {/* Públicas */}
                <Route path='/' element={<HomeRoute />} />
                <Route path='/login' element={<Login />}/>
                <Route path='/cadastro' element={<Cadastro />}/>

                {/* Privadas */}
                {<Route
                    path='/home'
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />}

                {<Route
                    path='/listas'
                    element={
                        <ProtectedRoute>
                            <ListasPage />
                        </ProtectedRoute>
                    }
                />}

                {/* <Route
                    path='/administration'
                    element={
                        <ProtectedRoute>
                            <AdministrationPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path='/registerMovie'
                    element={
                        <ProtectedRoute>
                            <RegisterMovie />
                        </ProtectedRoute>
                    }
                /> */}
            </Routes>

            {!hideFooter && <Footer />}
        </>
    );
}
