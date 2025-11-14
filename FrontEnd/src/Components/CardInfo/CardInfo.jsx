import './CardInfo.css'


export default function CardInfo({ style, title, paragraphs, image, alt }) {
    return (
        <article className={`${style}InfoCard`}>
            <h3>{title}</h3>
            {paragraphs.map((text, index) => <p key={index}>{text}</p>)}
            <img src={image} alt={alt} />
        </article>
    )
}