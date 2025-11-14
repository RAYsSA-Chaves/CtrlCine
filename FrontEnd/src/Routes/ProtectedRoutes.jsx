import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Services/AuthContext';


export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Carregando...</p>;
    }

    // se não tem usuário, token inválido/expirou
    if (!user) {
        return <Navigate to='/landingPage' replace />;
    }

    return children;
}
