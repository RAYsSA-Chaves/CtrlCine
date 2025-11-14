import './App.css'
import { AuthProvider } from './Services/AuthContext';
import Router from './Routes/Routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        // Disponibiliza a request para API para pegar infos do user
        <AuthProvider>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
