// Rodapé

import './Footer.css'
import Logo from '../../Assets/Images/Logo/Logo.svg'

export default function Footer() {
    return (
        <footer>
            {/* Logo */}
            <img src={Logo} alt="Logo" />

            {/* Links */}
            <ul className='footerLinks'>
                <li>Home</li>
                <li>Catálogo</li>
                <li>Minhas Listas</li>
                <li>Solicitar Filme</li>
            </ul>

            {/* Linha divisória */}
            <div className='divider'></div>

            {/* Direitos */}
            <p>@2025 CtrlCine. Todos os Direitos Reservados.</p>
        </footer>
    )
}