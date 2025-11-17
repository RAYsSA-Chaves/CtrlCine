// Lista de perguntas frequentes

import { useState } from 'react'
import './FAQList.css'
import FAQItem from '../FAQItem/FAQItem';


export default function FAQList() {
    // Lista de perguntas e respostas
    const lista = [
        {'num': '01', 'pergunta': 'O que é o CtrlCine?', 'resp': 'O CtrlCine é uma plataforma para amantes de cinema descobrirem e organizarem seus filmes favoritos.<br/>Você pode criar listas, avaliar títulos, escrever resenhas e acompanhar suas estatísticas pessoais — tudo em um só lugar.'},
        {'num': '02', 'pergunta': 'Posso criar minhas próprias listas?', 'resp': 'Sim! Você pode criar listas personalizadas como “Favoritos”, “Quero Assistir”, “Clássicos” ou qualquer outra que quiser. Também é possível editar e excluir listas a qualquer momento.'},
        {'num': '03', 'pergunta': 'Preciso ter uma conta para usar o site?', 'resp': 'Sim, é necessário criar uma conta gratuita para salvar suas listas, avaliações e preferências.'},
        {'num': '04', 'pergunta': 'E se um filme não estiver no catálogo?', 'resp': 'Você pode solicitar a adição de novos filmes ou sugerir correções de informações.<br/>A equipe do CtrlCine revisa e atualiza o catálogo constantemente.'},
        {'num': '05', 'pergunta': 'O CtrlCine tem recursos sociais?', 'resp': 'Em breve!<br/>Planejamos permitir que os usuários sigam uns aos outros, compartilhem listas e vejam o que os amigos estão assistindo.<br/>Um toque social para deixar o cinema ainda mais divertido!'}
    ]

    // Index do drop aberto
    const [openIndex, setOpenIndex] = useState(null);

    // Funcação para abrir um por vez
    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        // Seção com perguntas e respostas
        <section className='faqList'>
            {lista.map((item, index) => (
                <div key={index}>
                    <FAQItem
                        number={item.num}
                        question={item.pergunta}
                        resp={item.resp}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                    {/* Linha divisória */}
                    {index < lista.length - 1 && (
                        <div className='divider'></div>
                    )}
                </div>
            ))}
        </section>
    );
}
