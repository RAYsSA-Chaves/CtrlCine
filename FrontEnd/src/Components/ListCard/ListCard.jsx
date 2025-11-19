// Componente genérico de lista de filmes

import './ListCard.css'
import { Pencil } from 'lucide-react'


export default function ListCard({ nome, onEditar, onClick }) {
    return (
        <article className='listCard' onClick={onClick}>
            <h3>🎬 {nome}</h3>
            {/* Botão de edição */}
            <button
                className='btnEditar'
                onClick={(e) => {
                    e.stopPropagation(); 
                    onEditar();      
                }}
                title='Editar lista'
            >
                <Pencil />
            </button>
        </article>
    )
}
