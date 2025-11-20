// Centralizando configuração para slider de gêneros e filmes

export const cardsSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,  // quantos cards aparecem na tela
    slidesToScroll: 5,
    arrows: true,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            }
            }
    ]
};