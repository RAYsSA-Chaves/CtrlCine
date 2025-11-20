// Card genérico para os filmes

import './MovieCard.css'
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import SaveIcon from '../../Assets/Images/Icons/flag_icon.svg'
import TrashIcon from '../../Assets/Images/Icons/trash_icon.svg'
import { useNavigate } from 'react-router-dom';
import { renderStars } from '../../Utils/renderStarsFunction'


export default function MovieCard({ 
    titulo, 
    id,
    imagem, 
    stars = null, 
    btnSalvar, 
    btnDeletar, 
    lancamento = null,
    minhaNota = null
}) {

    const navigate = useNavigate();

    // Pega infos do usuário logado
    const  { user } = useContext(AuthContext); 

    return (
        <article className='movieCard' onClick={() => navigate(`/filmes/${id}`)}>
            <div className='cardImg'>
                <img src={imagem} alt='Capa do filme' />

                {/* Botão salvar para user comum */}
                {user.role === 'comum' && btnSalvar && (
                    <button 
                        className='saveBtn' 
                        onClick={(e) => {
                            e.stopPropagation();
                            btnSalvar();
                        }}
                    >
                        <img src={SaveIcon} alt='Ícone de flag' />
                    </button>
                ) }

                {/* Botão deletar */}
                {btnDeletar && (
                    <button
                        className="deleteBtn"
                        onClick={(e) => {
                            e.stopPropagation();
                            btnDeletar();
                        }}
                    >
                        <img src={TrashIcon} alt="Ícone de lixeira" />
                    </button>
                )}
            </div>
            <section className='movieInfos'>
                <h3>{titulo}</h3>
                
                {stars && (
                    <div className='movieStars'>{renderStars(stars)}</div>
                )}

                {lancamento && (
                    <div className='movieStars' id='lancamento'>
                        <p>Estreia em</p>
                        <span>{lancamento}</span>
                    </div>
                )}

                {minhaNota !== null && (
                    <div className="userRating">
                        <p>Minha nota:</p>
                        <div className="starsRow">
                            {renderStars(minhaNota)}
                        </div>
                    </div>
                )}
                
            </section>
        </article>
    )
}