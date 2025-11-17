import './App.css'
import { AuthProvider } from './Services/AuthContext';
import Router from './Routes/Routes';
import { BrowserRouter } from 'react-router-dom';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

function App() {
    return (
        // Disponibilizando o contexto que guarda infos do user
        <AuthProvider>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
