// Todas as rotas

import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import ProtectedAdminRoute from './ProtectedAdminRoute.jsx';
import NavBar from '../Components/NavBar/Nav';
import HomeRoute from './HomeRoute';
import Footer from '../Components/Footer/Footer';
import Login from '../Pages/Login/Login';
import HomePage from '../Pages/HomePage/HomePage';
import Cadastro from '../Pages/Cadastro/Cadastro';
import ListasPage from '../Pages/ListasPage/ListasPage.jsx'
import ListaEspecificaPage from '../Pages/ListaEspecifica/ListaEspecifica.jsx';
import MoviePage from '../Pages/MoviePage/MoviePage.jsx';
import Catalogo from '../Pages/Catalogo/Catalogo.jsx';
import MovieForm from '../Pages/MovieForm/MovieForm.jsx';
import AdminPage from '../Pages/AdminPage/AdminPage.jsx';


export default function Router() {
    const location = useLocation();

    // rotas SEM navbar
    const noNavbarRoutes = ['/login', '/cadastro', '/movie_form'];
    const hideNavbar = noNavbarRoutes.includes(location.pathname);
    
    // rotas SEM footer
    const noFooterRoutes = ['/login', '/cadastro', '/movie_form'];
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

                {<Route
                    path='/listas/:id'
                    element={
                        <ProtectedRoute>
                            <ListaEspecificaPage />
                        </ProtectedRoute>
                    }
                />}

                {<Route
                    path='/filmes/:id'
                    element={
                        <ProtectedRoute>
                            <MoviePage />
                        </ProtectedRoute>
                    }
                />}

                {<Route
                    path='/filmes'
                    element={
                        <ProtectedRoute>
                            <Catalogo />
                        </ProtectedRoute>
                    }
                />}

                {<Route
                    path='/movie_form'
                    element={
                        <ProtectedRoute>
                            <MovieForm />
                        </ProtectedRoute>
                    }
                />}

                {/* Página do adm */}
                {<Route
                    path='/administracao'
                    element={
                        <ProtectedAdminRoute>
                            <AdminPage />
                        </ProtectedAdminRoute>
                    }
                />}

            </Routes>

            {!hideFooter && <Footer />}
        </>
    );
}
