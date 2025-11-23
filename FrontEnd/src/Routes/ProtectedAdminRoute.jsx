// protegendo rota do administrador

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Services/AuthContext";

export default function ProtectedAdminRoute({ children }) {
    const { user } = useContext(AuthContext);

    // Se não está logado, ou não é admin → manda pra home
    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
