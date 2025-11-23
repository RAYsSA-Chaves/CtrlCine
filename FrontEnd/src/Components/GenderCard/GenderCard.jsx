// Card genérico para os gêneros

import './GenderCard.css'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


export default function GenderCard({ nome, imagem }) {
    const navigate = useNavigate();

    // navega para o catálogo aplicando filtro de gênero
    function handleClick() {
        navigate(`/filmes?genero=${encodeURIComponent(nome)}`);
    }

    return (
        <article className='genderCard' onClick={handleClick}>
           <img src={imagem} alt='Capa' />
            <section>
                <h3>{nome}</h3>
                <ArrowRight />
            </section>
        </article>
    )
}