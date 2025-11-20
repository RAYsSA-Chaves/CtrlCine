// Centralizando a função que renderiza estrelas completas e vazias

import { Star } from 'lucide-react'


export function renderStars(nota) {
    if (!nota) return null;

    const maxStars = 5;
    const fullStars = nota; 
    const emptyStars = maxStars - nota;

    const starsArray = [];

    for (let i = 0; i < fullStars; i++) {
        starsArray.push(<Star key={`full-${i}`} className='star filled' fill='currentColor'/>);
    }

    for (let i = 0; i < emptyStars; i++) {
        starsArray.push(<Star key={`empty-${i}`} className='star empty' fill='currentColor'/>);
    }

    return starsArray;
};