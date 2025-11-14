/* Decidir a rota do '/'
- se usuário deslogado -> LandingPage
- se logado -> Administracao */

import { AuthContext } from "../Services/AuthContext";
import LandingPage from "../Pages/LandingPage/LandingPage";
import { useContext } from 'react';

export default function HomeRoute() {
    const { user } = useContext(AuthContext);

    if (user) {
        return // <Administracao />; // usuário logado
    } else {
        return <LandingPage />; // usuário deslogado
    }
}
