import './LandingPage.css'
import Botao from '../../Components/Botao/Botao'
import logoTransparent from '../../Assets/Images/Logo/logo_transparent.png'
import PlayIcon from '../../Assets/Images/Icons/play_icon.svg'
import CardInfo from '../../Components/CardInfo/CardInfo'
import Img1 from '../../Assets/Images/ilustration1.png'
import Img2 from '../../Assets/Images/ilustration2.png'
import Img3 from '../../Assets/Images/ilustration3.png'


export default function LandingPage() {
    return (
        <div className='landingPage'>
            {/* Cabeçalho */}
            <header className='headerHome' id='headerLandingPage'>
                <img src={logoTransparent} alt="Logo" className='transparentLogo'/>
                {/* Texto de introdução */}
                <section aria-label='Texto do cabeçalho' className='headerTxt'>
                    <h1>CtrlCine - Seu Cinema, do Seu Jeito.</h1>
                    <p>Descubra novas histórias, avalie seus favoritos e monte sua própria coleção cinematográfica. No CtrlCine, você tem o poder de explorar, opinar e até pedir aquele filme que ainda não está no catálogo.</p>
                    <p>Porque aqui, o catálogo  é seu — e o controle também.</p>
                    <Botao 
                        style = 'primary'
                        text = 'Entrar'
                        icon={PlayIcon}
                        onClick = {() => alert('Oi')}
                    />
                </section>
            </header>

            {/* Conteúdo principal */}
            <main>
                <section className='infoCardsSection'>
                    <CardInfo
                    style='left'
                    title='Viva o cinema do seu jeito!'
                    paragraphs={[
                        'Descubra novos títulos, explore catálogos por gênero, ano, diretor, nota e muito mais!', 
                        'Avalie, escreva resenhas e acompanhe seus assistidos ao longo do ano!'
                    ]}
                    image={Img2}
                    alt='Ilustração de câmera cinematográfica'
                />
                <CardInfo
                    style='right'
                    title='Seu universo cinematográfico pessoal'
                    paragraphs={[
                        'Monte suas listas personalizadas, adicione lembretes de estreias e muito mais — tudo em um só lugar.', 
                        'Seja para registrar o que já viu ou planejar o que vai assistir, o CtrlCine transforma sua paixão por filmes em uma experiência completa.'
                    ]}
                    image={Img1}
                    alt='Ilustração de claquete'
                />
                </section>
            </main>
        </div>
    )
}