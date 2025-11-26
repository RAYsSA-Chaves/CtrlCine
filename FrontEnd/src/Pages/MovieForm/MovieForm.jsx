// Formulário de cadastro/edição/solicitações de filmes

import './MovieForm.css';
import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../Services/Api';
import Input from '../../Components/Input/Input';
import { AuthContext } from '../../Services/AuthContext';
import BackArrow from '../../Assets/Images/Icons/back_arrow_icon.svg'
import Botao from '../../Components/Botao/Botao';
import SuccessModal from '../../Components/SuccessModal/SuccessModal';
import Logo from '../../Assets/Images/Logo/Logo.svg'
import Modal from 'react-modal';
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import { buscarNotaFilme } from '../../Utils/getRating';
import { Search, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import XIcon from '../../Assets/Images/Icons/x_icon.svg';


/*
    Maneiras de acessar essa página:
    - via URL -> /movie_form?mode=edit&id=123&idSolicitacao=456
    - usando navigate -> navigate('/movie-form', { state: { mode: 'edit', id: 123 } })
*/

export default function MovieForm() {
    const { user } = useContext(AuthContext);

    // estados para o modal de sucesso
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // estados dos modais de criar ator, diretor, produtora
    const [modalOutro, setModalOutro] = useState(null); 
    const [novoNome, setNovoNome] = useState('');
    const [novaFoto, setNovaFoto] = useState(''); // só para atores
    const [loadingOutro, setLoadingOutro] = useState(false);
    const [successOutro, setSuccessOutro] = useState(false);
    const [successOutroMsg, setSuccessOutroMsg] = useState('');

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // pega o modo do formulário passado na URL
    const mode = searchParams.get('mode');

    // pega ID do filme (em caso de edição)
    const movieId = searchParams.get('id');

    // pega ID da solicitação (em caso de revisão para aceite)
    const idSolicitacao = searchParams.get('idSolicitacao');

    // estados para os campos de infos do filme
    const [titulo, setTitulo] = useState('');
    const [capaHorizontal, setCapaHorizontal] = useState('');
    const [capaVertical, setCapaVertical] = useState('');
    const [trailer, setTrailer] = useState('');
    const [lancamento, setLancamento] = useState('');
    const [duracao, setDuracao] = useState('');
    const [sinopse, setSinopse] = useState('');

    // guardar todas as opções puxadas do banco
    const [atoresLista, setAtoresLista] = useState([]);
    const [diretoresLista, setDiretoresLista] = useState([]);
    const [produtorasLista, setProdutorasLista] = useState([]);
    const [generosLista, setGenerosLista] = useState([]);

    // guardar as opções selecionadas
    const [atoresSelecionados, setAtoresSelecionados] = useState([]);
    const [diretorSelecionado, setDiretorSelecionado] = useState(null);
    const [produtorasSelecionadas, setProdutorasSelecionadas] = useState([]);
    const [generosSelecionados, setGenerosSelecionados] = useState([]);

    // estado para o dropdown aberto
    const [openDrop, setOpenDrop] = useState(null);

    // controla se a sinopse está focada (para flutuar label)
    const [focused, setFocused] = useState(false);

    // estados para buscas dos dropdowns
    const [buscaAtores, setBuscaAtores] = useState('');
    const [buscaProdutoras, setBuscaProdutoras] = useState('');
    const [buscaDiretores, setBuscaDiretores] = useState('');

    const atoresFiltrados = atoresLista.filter(a =>
    a.nome.toLowerCase().includes(buscaAtores.toLowerCase())
    );

    const produtorasFiltradas = produtorasLista.filter(p =>
        p.nome.toLowerCase().includes(buscaProdutoras.toLowerCase())
    );

    const diretoresFiltrados = diretoresLista.filter(d =>
        d.nome.toLowerCase().includes(buscaDiretores.toLowerCase())
    );

    // estado do modal para recusar solicitação
    const [modalCancelarOpen, setModalCancelarOpen] = useState(false);

    // função do foco da sinopse
    function handleFocus () {
        setFocused(true);
    }

    // quando perde foco → label só volta se não tiver valor digitado
    function handleBlur () {
        if (!sinopse) setFocused(false);
    };

    // puxar opções de atores, produtoras diretores e gêneros do banco
    async function carregarListas() {
        try {
            const [rAtores, rDiretores, rProdutoras, rGeneros] = await Promise.all([
                api.get('/atores'),
                api.get('/diretores'),
                api.get('/produtoras'),
                api.get('/generos'),
            ]);

            setAtoresLista((rAtores.data || []).map(a => ({ id: Number(a.id), nome: a.nome, foto: a.foto })));
            setDiretoresLista((rDiretores.data || []).map(d => ({ id: Number(d.id), nome: d.nome })));
            setProdutorasLista((rProdutoras.data || []).map(p => ({ id: Number(p.id), nome: p.nome })));
            setGenerosLista((rGeneros.data || []).map(g => ({ id: Number(g.id), nome: g.nome })));
        } catch (err) {
            console.error('Erro ao carregar listas:', err);
        }
    }

    // puxar infos do filme em caso de edição ou solicitação
    async function carregarDadosIniciais() {
        try {
            if (mode === 'edit' && movieId) {
                const res = await api.get(`/filmes/${movieId}`);
                preencherCampos(res.data);
                
            } else if (mode === 'solicitacao' && idSolicitacao) {
                const res = await api.get(`/solicitacoes/${idSolicitacao}`);
                let filmeObj = res.data?.filme;
                // se vier string JSON → parseia
                if (typeof filmeObj === "string") {
                    try {
                        filmeObj = JSON.parse(filmeObj);
                    } catch (err) {
                        console.error("Erro ao parsear filme da solicitação:", err);
                    }
                }
                preencherCampos(filmeObj);
            }
        } catch (err) {
            console.error('Erro ao carregar dados iniciais:', err);
        }
    }

    // preencher os campos com as infos atuais
    function preencherCampos(data) {
        if (!data) return;

        setTitulo(data.titulo || '');
        setCapaHorizontal(data.capa_horizontal || data.capaHorizontal || '');
        setCapaVertical(data.capa_vertical || data.capaVertical || '');
        setTrailer(data.trailer || '');
        setLancamento(data.lancamento ? data.lancamento.substring(0, 10) : '');
        setDuracao(data.duracao || '');
        setSinopse(data.sinopse || '');

        setAtoresSelecionados(
            Array.isArray(data.atores)
                ? data.atores.map(a => ({ id: Number(a.id), nome: a.nome, foto: a.foto }))
                : []
        );

        setProdutorasSelecionadas(
            Array.isArray(data.produtoras)
                ? data.produtoras.map(p => ({ id: Number(p.id), nome: p.nome }))
                : []
        );

        setGenerosSelecionados(
            Array.isArray(data.generos)
                ? data.generos.map(g => ({ id: Number(g.id), nome: g.nome }))
                : []
        );

        setDiretorSelecionado(
            data.diretor
                ? (Array.isArray(data.diretor) ? { id: Number(data.diretor[0].id), nome: data.diretor[0].nome } : { id: Number(data.diretor.id), nome: data.diretor.nome })
                : null
        );
    }

    // chama as funções ao carregar a página
    useEffect(() => {
        carregarListas();
        carregarDadosIniciais();
    }, []);

    // função para abrir um dropdown de cada vez
    function toggleDrop(nome) {
        setOpenDrop(prev => (prev === nome ? null : nome));
    }

    // funções para selecionar ou desselecionar opções
    function toggleAtor(ator) {
        setAtoresSelecionados(prev => {
            const existe = prev.some(a => a.id === ator.id);
            return existe ? prev.filter(a => a.id !== ator.id) : [...prev, { id: ator.id, nome: ator.nome, foto: ator.foto }];
        });
    }

    function toggleProdutora(prod) {
        setProdutorasSelecionadas(prev => {
            const existe = prev.some(p => p.id === prod.id);
            return existe ? prev.filter(p => p.id !== prod.id) : [...prev, { id: prod.id, nome: prod.nome }];
        });
    }

    function toggleGenero(genero) {
        setGenerosSelecionados(prev => {
            const existe = prev.some(g => g.id === genero.id);
            return existe ? prev.filter(g => g.id !== genero.id) : [...prev, { id: genero.id, nome: genero.nome }];
        });
    }

    function escolherDiretor(d) {
        setDiretorSelecionado({ id: d.id, nome: d.nome });
        setOpenDrop(null);
    }

    // abrir modal de sucesso
    function mostrarSucesso(msg) {
        setSuccessMessage(msg);
        setSuccessOpen(true);
        setTimeout(() => {
            setSuccessOpen(false);
            navigate(-1);
        }, 1800)
    }

    // validações do form
    function validarFormulario() {
        // campos simples
        if (!titulo.trim()) return 'O título é obrigatório.';
        if (!capaHorizontal.trim()) return 'A capa horizontal é obrigatória.';
        if (!capaVertical.trim()) return 'A capa vertical é obrigatória.';
        if (!trailer.trim()) return 'O trailer é obrigatório.';
        if (!lancamento.trim()) return 'A data de lançamento é obrigatória.';
        if (!duracao.trim()) return 'A duração é obrigatória.';
        if (!sinopse.trim()) return 'A sinopse é obrigatória.';

        // duração → 0h | 0min | 0h 00min
        const regexDuracao = /^(\d+h|\d+min|\d+h \d+min)$/;
        if (!regexDuracao.test(duracao.trim())) {
            return 'A duração deve ser preenchida assim: 00h, 00min ou 00h 00min.';
        }

        // campos de seleção
        if (generosSelecionados.length === 0) return 'Selecione pelo menos um gênero.';
        if (!diretorSelecionado) return 'Selecione um diretor.';
        if (produtorasSelecionadas.length === 0) return 'Selecione pelo menos uma produtora.';
        if (atoresSelecionados.length === 0) return 'Selecione pelo menos um ator.';

        return null; // tudo certo
    }

    // função do botão confirmar
    async function handleSubmit(e) {
        e.preventDefault();

        const erro = validarFormulario();
        if (erro) {
            alert(erro);
            return;
        }

        // busca média de notas externa
        const notaTMDB = await buscarNotaFilme(titulo);

        const filmePayload = {
            titulo,
            capa_horizontal: capaHorizontal,
            capa_vertical: capaVertical,
            trailer,
            lancamento,
            duracao,
            sinopse,
            atores: atoresSelecionados.map(a => a.id),
            diretor: diretorSelecionado ? [diretorSelecionado.id] : [],
            produtoras: produtorasSelecionadas.map(p => p.id),
            generos: generosSelecionados.map(g => g.id),
            nota_imdb: notaTMDB,
        };


        try {
            // ---------- ADMIN ----------
            if (user?.role === 'admin') {
                // cria o filme
                if (mode === 'create') {
                    const res = await api.post('/filmes', {
                        filme: filmePayload,
                        solicitacao_id: null
                    });
                    mostrarSucesso('Filme criado com sucesso!');
                }

                // edita o filme
                else if (mode === 'edit' && movieId) {
                    const res = await api.put(`/filmes/${movieId}`, {
                        filme: filmePayload
                    });
                    mostrarSucesso('Filme atualizado!');
                }

                // aceita a solicitação e cria ou edita
                else if (mode === 'solicitacao' && idSolicitacao) {
                    const solicitacao = await api.get(`/solicitacoes/${idSolicitacao}`);

                    // identifica se é novo filme ou edição
                    const tipo = solicitacao.data.tipo;
                    const filmeIdOriginal = solicitacao.data.filme_id;

                    if (tipo === "novo filme") {
                        await api.post('/filmes', {
                            filme: filmePayload,
                            solicitacao_id: idSolicitacao
                        });
                        mostrarSucesso("Novo filme criado com sucesso!");
                    }

                    else if (tipo === "edição") {
                        await api.put(`/filmes/${filmeIdOriginal}`, {
                            filme: filmePayload,
                            solicitacao_id: idSolicitacao
                        });
                        mostrarSucesso("Filme atualizado com sucesso!");
                    }
                }
            }

            // ---------- USUÁRIO COMUM ----------
            // cria solicitação de novo filme
            else if (user?.role === 'comum' && (mode === 'create')) {
                const body = {
                    usuario_id: user.id,
                    filme: filmePayload,
                    tipo: 'novo filme',
                    filme_id: null
                };
                const res = await api.post('/solicitacoes', body);
                mostrarSucesso('Solicitação enviada!');
            }

            // cria solicitação de edição
            else if (user?.role === 'comum' && (mode === 'edit' || mode === 'editarSolicitacao') && movieId) {
                const body = {
                    usuario_id: user.id,
                    filme: filmePayload,
                    tipo: 'edição',
                    filme_id: Number(movieId)
                };
                const res = await api.post('/solicitacoes', body);
                mostrarSucesso('Solicitação de edição enviada!');
            }
            else {
                alert('Operação não permitida.');
            }

        } catch (err) {
            console.error('Erro ao enviar form:', err.response?.data || err);
            alert('Erro ao enviar.');
        }
    }

    // abrir modal de criar ator/diretor/produtora
    function abrirModalOutro(tipo) {
        setModalOutro(tipo);
        setNovoNome('');
        setNovaFoto('');
    }

    // fechar modal de criar ator/diretor/produtora
    function fecharModalOutro() {
        setModalOutro(null);
    }

    // envio de novo item
    async function salvarOutro(e) {
        e.preventDefault();

        if (!novoNome.trim()) {
            alert('Digite um nome válido.');
            return;
        }
        if (modalOutro === 'ator' && !novaFoto.trim()) {
            alert('A foto do ator é obrigatória!');
            return;
        }

        try {
            setLoadingOutro(true);

            let res;
            if (modalOutro === 'ator') {
                res = await api.post('/atores', {
                    nome: novoNome,
                    foto: novaFoto
                });
            }
            if (modalOutro === 'diretor') {
                res = await api.post('/diretores', { nome: novoNome });
            }
            if (modalOutro === 'produtora') {
                res = await api.post('/produtoras', { nome: novoNome });
            }

            const novo = res.data;

            // adiciona na lista correspondente
            if (modalOutro === 'ator') {
                setAtoresLista(prev => [...prev, novo]);
                setAtoresSelecionados(prev => [...prev, novo]);
            }
            if (modalOutro === 'diretor') {
                setDiretoresLista(prev => [...prev, novo]);
                setDiretorSelecionado(novo);
            }
            if (modalOutro === 'produtora') {
                setProdutorasLista(prev => [...prev, novo]);
                setProdutorasSelecionadas(prev => [...prev, novo]);
            }

            setSuccessOutroMsg('Novo item criado com sucesso!');
            setSuccessOutro(true);

            setTimeout(() => {
                setSuccessOutro(false);
                fecharModalOutro();
            }, 1500);

        } catch (err) {
            console.error(err);
            alert('Erro ao criar novo item.');
        } finally {
            setLoadingOutro(false);
        }
    }

    /*
        função do botão cancelar
        - para o adm -> recusa solicitação
        - para outros casos -> volta para página anterior 
    */
    async function handleCancelar() {
        if (user?.role === 'admin' && mode === 'solicitacao' && idSolicitacao) {
            setModalCancelarOpen(true);
        } else {
            navigate(-1);
        }
    }

    // função do modal de recusar solicitação
    async function confirmarCancelar() {
        const idSolic = Number(idSolicitacao);
        try {
            const res = await api.delete(`/solicitacoes/${idSolic}`);
            setSuccessMessage(res.data?.Mensagem || 'Solicitação recusada!');
            setSuccessOpen(true);
            setTimeout(() => {
                setSuccessOpen(false);
                navigate(-1);
            }, 1500);
        } catch (err) {
            console.error('Erro ao excluir:', err);
            alert(err.response?.data?.Erro || 'Erro ao recusar solicitação.');
        } finally {
            setModalCancelarOpen(false);
        }
    }


    return (
        <div className='formularioFilmeContainer'>
            {/* Botão voltar */}
            <Botao 
                style = 'primary'
                text = 'Voltar'
                icon={BackArrow}
                to={-1}
            />

            {/* Título */}
            <h1 className='tituloForm'>
                {(mode === 'create') && 'Cadastre um novo filme!'}
                {(mode === 'edit') && 'Edite o filme!'}
                {mode === 'solicitacao' && 'Revise a solicitação do usuário!'}
            </h1>

            {/* Subtítulo */}
            <p className='subtituloForm'>
                {(mode === 'create' && user?.role === 'comum') && 'Preencha as informações do filme que deseja ver no CtrlCine e envie sua solicitação ao administrador.'}
                {(mode === 'edit' && user?.role === 'comum') && 'Edite as informações do filme como deseja ver no CtrlCine e envie sua solicitação ao administrador.'}
            </p>

            <form className='formFilme' onSubmit={handleSubmit}>
                {/* Título do filme */}
                <Input label='Título' name='titulo' value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                <div className='formInputsDisplay'>
                    <div className='inputBox1'>
                        {/* Preview da capa */}
                        <div className='previewImg'>
                            {capaHorizontal ? <img src={capaHorizontal} alt='Capa horizontal' className='capaHorizontal' /> : <div className='placeholder'>Prévia da capa horizontal</div>}
                        </div>
                        {/* URL da capa */}
                        <Input label='Capa Horizontal (URL)' name='capa_horizontal' value={capaHorizontal} onChange={(e) => setCapaHorizontal(e.target.value)} />
                    </div>

                    <div className='inputBox2'>
                        {/* Preview da capa */}
                        <div className='previewImg'>
                            {capaVertical ? <img src={capaVertical} alt='Capa vertical' /> : <div className='placeholder'>Prévia da capa vertical</div>}
                        </div>
                        {/* URL da capa */}
                        <Input label='Capa Vertical (URL)' name='capa_vertical' value={capaVertical} onChange={(e) => setCapaVertical(e.target.value)} />
                    </div>
                </div>

                <div className='formInputsDisplay'>
                    <div className='inputBox1'>
                        {/* Data de lançamento */}
                        <div className='inputContainer'>
                            <label className='floatingLabel active'>Lançamento</label>
                            <input type='date' className='inputField active' value={lancamento} onChange={(e) => setLancamento(e.target.value)} name='lancamento' required/>
                        </div>
                    </div>

                    <div className='inputBox2'>
                        {/* Duração */}
                        <Input label='Duração' placeholder='Ex: 00h, 00min, 00h 00min' name='duracao' value={duracao} onChange={(e) => setDuracao(e.target.value)} />
                    </div>
                </div>

                {/* Gêneros */}
                <div className='selectBox'>
                    <label>Gêneros</label>
                    <div className='chipsContainer'>
                        {generosLista.map(g => {
                        const ativo = generosSelecionados.some(s => s.id === g.id); // verifica se está ativo
                        return (
                            <span 
                                key={g.id} 
                                className={ativo ? 'chip ativo' : 'chip'} 
                                onClick={() => toggleGenero(g)}
                            >
                            {g.nome}
                            {ativo && ' ✕'} 
                            </span>
                        )
                        })}
                    </div>
                    </div>

                {/* Sinopse */}
                <div className='inputContainer'>
                    <label className={`floatingLabel ${sinopse || focused ? 'active' : ''}`} htmlFor='sinopse'>Sinopse</label>
                    <textarea id='sinopse' className={`inputField ${sinopse || focused ? 'active' : ''}`} value={sinopse} onChange={(e) => setSinopse(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
            
                {/* Prévia do trailer */}
                <div className='previewTrailerContainer'>
                    {trailer ? (
                        <iframe
                            className='previewTrailer'
                            src={`https://www.youtube.com/embed/${trailer}?modestbranding=1&cc_load_policy=1&cc_lang_pref=pt&rel=0`}
                            title='Prévia do trailer'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className='placeholder'>Prévia do trailer</div>
                    )}
                </div>

                {/* ID do trailer */}
                <Input label='Trailer' placeholder='ID do trailer no youtube' name='trailer' value={trailer} onChange={(e) => setTrailer(e.target.value)} />

                {/* Diretor */}
                <div className='formInputsDisplay'>
                    <div className='inputBox1'>
                        <div className='selectBox'>
                            {/* Cabeçalho */}
                            <div className='selectTrigger' onClick={() => toggleDrop('diretor')}>
                                <span>{diretorSelecionado ? diretorSelecionado.nome : 'Diretor'}</span>
                                {openDrop === 'diretor' ? (
                                    <ChevronUp size={20} className='chevronIcon' />
                                ) : (
                                    <ChevronDown size={20} className='chevronIcon' />
                                )}
                            </div>
                            {openDrop === 'diretor' && (
                                <div className='dropdown'>
                                    
                                    {/* Pesquisa */}
                                    <div className='searchContainer'>
                                        <Search className='searchIcon' size={18} />
                                        <input 
                                            type='text'
                                            className='searchDrop'
                                            placeholder='Buscar'
                                            value={buscaDiretores}
                                            onChange={(e) => setBuscaDiretores(e.target.value)}
                                        />
                                    </div>

                                    {/* Opções */}
                                    {diretoresFiltrados.map(d => (
                                        <div 
                                            key={d.id} 
                                            className={`dropItem ${diretorSelecionado?.id === d.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                escolherDiretor(d);
                                                setBuscaDiretores('');
                                            }}
                                        >
                                            {d.nome}
                                        </div>
                                    ))}

                                    {/* Adicionar */}
                                    <div className='dropItem outro' onClick={() => abrirModalOutro('diretor')}>
                                        Outro
                                        <Plus size={16} className='plusIcon' />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Produtoras */}
                    <div className='inputBox2'>
                        <div className='selectBox'>
                            {/* Cabeçalho */}
                            <div className='selectTrigger' onClick={() => toggleDrop('produtoras')}>
                                <span>Selecione produtoras</span>
                                {openDrop === 'produtoras' ? (
                                    <ChevronUp size={20} className='chevronIcon' />
                                ) : (
                                    <ChevronDown size={20} className='chevronIcon' />
                                )}
                            </div>
                            {openDrop === 'produtoras' && (
                                <div className='dropdown'>

                                    {/* Pesquisa */}
                                    <div className='searchContainer'>
                                        <Search className='searchIcon' size={18} />
                                        <input 
                                            type='text'
                                            className='searchDrop'
                                            placeholder='Buscar'
                                            value={buscaProdutoras}
                                            onChange={(e) => setBuscaProdutoras(e.target.value)}
                                        />
                                    </div>

                                    {/* Opções */}
                                    {produtorasFiltradas.map(p => (
                                        <label key={p.id} className='dropItem checkboxItem'>
                                            <input
                                                type='checkbox'
                                                checked={produtorasSelecionadas.some(s => s.id === p.id)}
                                                onChange={() => toggleProdutora(p)}
                                            />
                                            <span>{p.nome}</span>
                                        </label>
                                    ))}

                                    {/* Adicionar */}
                                    <div className='dropItem outro' onClick={() => abrirModalOutro('produtora')}>
                                        Outro
                                        <Plus size={16} className='plusIcon' />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chip labels das opções selecionadas */}
                        <div className='chipsContainer'>
                            {produtorasSelecionadas.map(p => (
                                <span key={p.id} className='chip ativo' onClick={() => toggleProdutora(p)}>
                                    {p.nome} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Atores */}
                <div>
                    <div className='selectBox'>
                        {/* Cabeçalho */}
                        <div className='selectTrigger' onClick={() => toggleDrop('atores')}>
                            <span>Selecione atores</span>
                            {openDrop === 'atores' ? (
                                <ChevronUp size={20} className='chevronIcon' />
                                ) : (
                                    <ChevronDown size={20} className='chevronIcon' />
                                )}
                        </div>
                        {openDrop === 'atores' && (
                            <div className='dropdown'>

                                {/* Pesquisa */}
                                <div className='searchContainer'>
                                    <Search className='searchIcon' size={18} />
                                    <input 
                                        type='text'
                                        className='searchDrop'
                                        placeholder='Buscar'
                                        value={buscaAtores}
                                        onChange={(e) => setBuscaAtores(e.target.value)}
                                    />
                                </div>

                                {/* Opções */}
                                {atoresFiltrados.map(a => (
                                    <label key={a.id} className='dropItem checkboxItem'>
                                        <input
                                            type='checkbox'
                                            checked={atoresSelecionados.some(s => s.id === a.id)}
                                            onChange={() => toggleAtor(a)}
                                        />
                                        <span>{a.nome}</span>
                                    </label>
                                ))}

                                {/* Adicionar */}
                                <div className='dropItem outro' onClick={() => abrirModalOutro('ator')}>
                                    Outro
                                    <Plus size={16} className='plusIcon' />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chip labels das opções selecionadas */}
                    <div className='chipsContainer'>
                        {atoresSelecionados.map(a => (
                            <span key={a.id} className='chip ativo' onClick={() => toggleAtor(a)}>
                                {a.nome} ✕
                            </span>
                        ))}
                    </div>
                </div>

                {/* Botões confirmar e cancelar */}
                <div className='botoes'>
                    <Botao 
                        style = 'terciary'
                        text = {user.role === 'admin' && mode === 'solicitacao' ? 'Recusar' : 'Cancelar'}
                        onClick={handleCancelar}
                    />
                    <Botao 
                        style = 'primary'
                        text = {user.role === 'admin' && mode === 'solicitacao' ? 'Aceitar' : 'Confirmar'}
                        type='submit'
                    />
                </div>
            </form>

            {/* Modal para adicionar item */}
            <Modal
                isOpen={!!modalOutro}
                onRequestClose={fecharModalOutro}
                className='modalSalvar'
                overlayClassName='modalOverlay'
            >

                <header className='headerModal'>
                    <img src={Logo} alt='Logo' className='logo' />
                    <Botao
                        style='secondary'
                        icon={XIcon}
                        onClick={fecharModalOutro}
                    />
                </header>

                {/* Conteúdo do modal */}
                <section className='modalContent'>
                    <h1>
                        Adicionar {modalOutro === 'ator' && 'ator'}
                        {modalOutro === 'diretor' && 'diretor'}
                        {modalOutro === 'produtora' && 'produtora'}
                    </h1>

                    <form onSubmit={salvarOutro} className='modalSalvarConteudo'>
                        <div className='displayAtorInfo'>
                            {/* Prévia da foto do ator */}
                            {novaFoto && (
                                <div className='previewFotoAtorContainer'>
                                    <img
                                        src={novaFoto}
                                        alt='Prévia da foto'
                                        className='previewFotoAtor'
                                        onError={(e) => { e.target.src = ''; }}
                                    />
                                </div>
                            )}
                            <div>
                                <Input label='Nome' name='nome' value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />

                                {modalOutro === 'ator' && (
                                    <Input label='URL da foto' name='foto' value={novaFoto} onChange={(e) => setNovaFoto(e.target.value)} />
                                )}
                            </div>
                        </div>

                        <footer className='footerBtns'>
                            <Botao style='secondary' text='Cancelar' onClick={fecharModalOutro} />
                            <Botao
                                style='primary'
                                text='Confirmar'
                                type='submit'
                                disabled={
                                    !novoNome || (modalOutro === 'ator' && !novaFoto)
                                }
                            />
                        </footer>
                    </form>
                </section>
            </Modal>

            {/* Modal de confirmação da exclusão de solicitação */}
            <Modal
                isOpen={modalCancelarOpen}
                onRequestClose={() => setModalCancelarOpen(false)}
                className='modalSalvar'
                overlayClassName='modalOverlay'
            >
                {/* Cabeçalho */}
                <header className='headerModal'>
                    <img src={Logo} alt='Logo' className='logo' />
                    <Botao
                        style='secondary'
                        icon={XIcon}
                        onClick={() => setModalCancelarOpen(false)}
                    />
                </header>

                {/* Conteúdo */}
                <section className='modalContent'>
                    <h1>Tem certeza que deseja cancelar?</h1>
                    <p className='textoInfo'>
                        {(mode === 'solicitacao' && user?.role === 'admin') ? 
                            'Você está prestes a recusar a solicitação do usuário.' : 
                            'Todas as alterações feitas serão descartadas.'
                        }
                    </p>
                    <p className='textoInfo'>Esta ação não pode ser desfeita!</p>
                </section>

                {/* Footer */}
                <footer className='footerBtns'>
                    <Botao
                        style='secondary'
                        text='Cancelar'
                        onClick={() => setModalCancelarOpen(false)}
                    />
                    <Botao
                        style='primary'
                        text='Confirmar'
                        onClick={confirmarCancelar}
                    />
                </footer>
            </Modal>


            {/* modais de loading e sucesso para modal de criar novo item */}
            <LoadingModal isOpen={loadingOutro} />
            <SuccessModal isOpen={successOutro} message={successOutroMsg} />

            {/* modal de sucesso */}
            <SuccessModal 
                isOpen={successOpen}
                message={successMessage}
            />
        </div>
    );
}
