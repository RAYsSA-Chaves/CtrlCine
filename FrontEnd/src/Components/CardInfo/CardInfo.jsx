// Card informativo genérico

import './CardInfo.css'


export default function CardInfo({ style, title, paragraphs, image, alt }) {
    return (
        <div className='infoCard'>
            <div className='shadow'>
                <article className={`${style}InfoCard`}>
                    <h3>{title}</h3>
                    {paragraphs.map((text, index) => <p key={index}>{text}</p>)}
                </article>
            </div>
            <img className={`${style === 'left' ? 'leftImg' : 'rightImg'}`} src={image} alt={alt} />
        </div>
    )
}