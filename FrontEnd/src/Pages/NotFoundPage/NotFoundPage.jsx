// Página de Not Found para rotas não mapeadas

import './NotFoundPage.css';
import Botao from '../../Components/Botao/Botao';
import Astronaut from '../../Assets/Images/not_found_img.svg'


export default function NotFoundPage() {
    return (
        <div className="notfoundContainer">
            <div>
                <h1>Erro 404</h1>
                <h2>Página não encontrada.</h2>
                <Botao
                    style='primary'
                    to='/'
                    text='Voltar para Home'
                />
            </div>
            <img src={Astronaut} alt='Imagem de astronauta no espaço' />
        </div>
    );
}
