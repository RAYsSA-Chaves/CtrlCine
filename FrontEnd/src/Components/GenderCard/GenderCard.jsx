// Card genérico para os gêneros

import './GenderCard.css'
import { ArrowRight } from 'lucide-react'


export default function GenderCard({ nome, imagem }) {
    return (
        <article className='genderCard'>
'            <img src={imagem} alt='Capa' />
'            <section>
                <h3>{nome}</h3>
                <ArrowRight />
            </section>
        </article>
    )
}