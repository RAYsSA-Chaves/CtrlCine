// Componente genérico de FAQ

import { ChevronUp, ChevronDown } from 'lucide-react'
import './FAQItem.css'


export default function FAQItem({ isOpen, number, resp, question, onClick }) {
    return (
        <article className='faqItem'>
            <header className={`${isOpen ? 'openedFaq' : 'faqHeader'}`} onClick={onClick}>
                <p className='faqNumber'>{number}</p>
                <div className='openedDrop'>
                    <h4 className='faqQuestion'>{question}</h4>
                    {isOpen && (
                        <p className='faqAnswer' dangerouslySetInnerHTML={{ __html: resp }}></p>
                    )}
                </div>
                {isOpen ? <ChevronUp/> : <ChevronDown/>}
            </header>
        </article>
    );
}