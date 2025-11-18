// Componente genérico de lista de filmes

import './ListCard.css'
import { Pencil } from 'lucide-react'


export default function ListCard({ nome, onEditar }) {
    return (
        <article className='listCard'>
            <h3>{nome}</h3>
            {/* Botão de edição */}
            <button
                className="btnEditar"
                onClick={onEditar}
                title="Editar lista"
            >
                <Pencil />
            </button>
        </article>
    )
}
