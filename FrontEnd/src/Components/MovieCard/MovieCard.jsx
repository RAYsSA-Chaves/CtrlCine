// Card genérico para os filmes

import './MovieCard.css'
import { Star } from 'lucide-react'
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import SaveIcon from '../../Assets/Images/Icons/flag_icon.svg'
import TrashIcon from '../../Assets/Images/Icons/trash_icon.svg'


export default function MovieCard({ 
    titulo, 
    imagem, 
    stars = null, 
    btnSalvar, 
    btnDeletar, 
    lancamento = null }) {

    // Pega infos do usuário logado
    const  { user } = useContext(AuthContext); 

    // Função para renderizar estrelas completas ou vazias
    const renderStars = (nota) => {
        if (!nota) return null;

        const maxStars = 5;
        const fullStars = nota; 
        const emptyStars = maxStars - nota;

        const starsArray = [];

        for (let i = 0; i < fullStars; i++) {
            starsArray.push(<Star key={`full-${i}`} className="star filled" fill="currentColor"/>);
        }

        for (let i = 0; i < emptyStars; i++) {
            starsArray.push(<Star key={`empty-${i}`} className="star empty" fill="currentColor"/>);
        }

        return starsArray;
    };

    return (
        <article className='movieCard'>
            <div className='cardImg'>
                <img src={imagem} alt="Capa do filme" />

                {/* Botão salvar para user comum */}
                {user.role === 'comum' && (
                    <button onClick={btnSalvar} className='saveBtn'>
                        <img src={SaveIcon} alt="" />
                    </button>
                ) }

                {/* Botão deletar par adm */}
                {user.role === 'admin' && (
                    <button onClick={btnDeletar} className='deleteBtn'>
                        <img src={TrashIcon} alt="" />
                    </button>
                ) }
            </div>
            <section className='movieInfos'>
                <h3>{titulo}</h3>
                
                {stars && (
                    <div className="movieStars">{renderStars(stars)}</div>
                )}

                {lancamento && (
                    <div className="movieStars" id='lancamento'>
                        <p>Estreia em</p>
                        <span>{lancamento}</span>
                    </div>
                )}
            </section>
        </article>
    )
}