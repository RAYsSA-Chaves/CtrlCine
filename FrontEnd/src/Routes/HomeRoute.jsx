/* Decidir a rota do '/'
- se usuário deslogado -> LandingPage
- se logado -> Home */

import { AuthContext } from '../Services/AuthContext';
import LandingPage from '../Pages/LandingPage/LandingPage';
import { useContext } from 'react';
import HomePage from '../Pages/HomePage/HomePage';


export default function HomeRoute() {
    const { user } = useContext(AuthContext);

    if (user) {
        return <HomePage />; // usuário logado
    } else {
        return <LandingPage />; // usuário deslogado
    }
}
