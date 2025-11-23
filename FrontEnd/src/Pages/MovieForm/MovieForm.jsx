// MovieForm.jsx
import "./MovieForm.css";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../Services/Api";
import Input from "../../Components/Input/Input";
import { AuthContext } from "../../Services/AuthContext";
import BackArrow from '../../Assets/Images/Icons/back_arrow_icon.svg'
import Botao from "../../Components/Botao/Botao";
import SuccessModal from "../../Components/SuccessModal/SuccessModal";
import Logo from '../../Assets/Images/Logo/Logo.svg'
import XIcon from '../../Assets/Images/Icons/x_icon.svg'
import Modal from 'react-modal';
import LoadingModal from '../../Components/LoadingModal/LoadingModal'


export default function MovieForm() {
    const { user } = useContext(AuthContext);

    // estados para o modal de sucesso
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // estados dos modais de criar ator, diretor, produtora
    const [modalOutro, setModalOutro] = useState(null); 
    const [novoNome, setNovoNome] = useState("");
    const [novaFoto, setNovaFoto] = useState(""); // só para atores

    // estados internos dos modais
    const [loadingOutro, setLoadingOutro] = useState(false);
    const [successOutro, setSuccessOutro] = useState(false);
    const [successOutroMsg, setSuccessOutroMsg] = useState("");

    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const modeFromQuery = searchParams.get("mode");
    const idFromQuery = searchParams.get("id");
    const idSolicitacaoFromQuery = searchParams.get("idSolicitacao");

    const state = location.state || {};
    const mode = modeFromQuery || state.mode || "create";
    const movieId = idFromQuery || state.id || null;
    const idSolicitacao = idSolicitacaoFromQuery || state.idSolicitacao || null;

    const [titulo, setTitulo] = useState("");
    const [capaHorizontal, setCapaHorizontal] = useState("");
    const [capaVertical, setCapaVertical] = useState("");
    const [trailer, setTrailer] = useState("");
    const [lancamento, setLancamento] = useState("");
    const [duracao, setDuracao] = useState("");
    const [sinopse, setSinopse] = useState("");

    const [atoresLista, setAtoresLista] = useState([]);
    const [diretoresLista, setDiretoresLista] = useState([]);
    const [produtorasLista, setProdutorasLista] = useState([]);
    const [generosLista, setGenerosLista] = useState([]);

    const [atoresSelecionados, setAtoresSelecionados] = useState([]);
    const [diretorSelecionado, setDiretorSelecionado] = useState(null);
    const [produtorasSelecionadas, setProdutorasSelecionadas] = useState([]);
    const [generosSelecionados, setGenerosSelecionados] = useState([]);

    const [openDrop, setOpenDrop] = useState(null);

    // controla se o input está focado (para flutuar label e mostrar placeholder)
    const [focused, setFocused] = useState(false);

    // estados para buscas para os dropdowns
    const [buscaAtores, setBuscaAtores] = useState("");
    const [buscaProdutoras, setBuscaProdutoras] = useState("");
    const [buscaDiretores, setBuscaDiretores] = useState("");

    const atoresFiltrados = atoresLista.filter(a =>
    a.nome.toLowerCase().includes(buscaAtores.toLowerCase())
    );

    const produtorasFiltradas = produtorasLista.filter(p =>
        p.nome.toLowerCase().includes(buscaProdutoras.toLowerCase())
    );

    const diretoresFiltrados = diretoresLista.filter(d =>
        d.nome.toLowerCase().includes(buscaDiretores.toLowerCase())
    );


    // quando o input ganha foco → label sobe e placeholder aparece
    function handleFocus () {
        setFocused(true);
    }

    // quando perde foco → label só volta se não tiver valor digitado
    function handleBlur () {
        if (!sinopse) setFocused(false);
    };

    async function carregarListas() {
        try {
            const [rAtores, rDiretores, rProdutoras, rGeneros] = await Promise.all([
                api.get("/atores"),
                api.get("/diretores"),
                api.get("/produtoras"),
                api.get("/generos"),
            ]);

            setAtoresLista((rAtores.data || []).map(a => ({ id: Number(a.id), nome: a.nome, foto: a.foto })));
            setDiretoresLista((rDiretores.data || []).map(d => ({ id: Number(d.id), nome: d.nome })));
            setProdutorasLista((rProdutoras.data || []).map(p => ({ id: Number(p.id), nome: p.nome })));
            setGenerosLista((rGeneros.data || []).map(g => ({ id: Number(g.id), nome: g.nome })));
        } catch (err) {
            console.error("Erro ao carregar listas:", err);
        }
    }

    async function carregarDadosIniciais() {
        try {
            if (mode === "edit" && movieId) {
                const res = await api.get(`/filmes/${movieId}`);
                preencherCampos(res.data);
            } else if ((mode === "solicitacao" || mode === "editarSolicitacao") && idSolicitacao) {
                const res = await api.get(`/solicitacoes/${idSolicitacao}`);
                const filmeObj = res.data?.filme || res.data;
                preencherCampos(filmeObj);
            }
        } catch (err) {
            console.error("Erro ao carregar dados iniciais:", err);
        }
    }

    function preencherCampos(data) {
        if (!data) return;

        setTitulo(data.titulo || "");
        setCapaHorizontal(data.capa_horizontal || data.capaHorizontal || "");
        setCapaVertical(data.capa_vertical || data.capaVertical || "");
        setTrailer(data.trailer || "");
        setLancamento(data.lancamento ? data.lancamento.substring(0, 10) : "");
        setDuracao(data.duracao || "");
        setSinopse(data.sinopse || "");

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

    useEffect(() => {
        carregarListas();
        carregarDadosIniciais();
    }, []);

    function toggleDrop(nome) {
        setOpenDrop(prev => (prev === nome ? null : nome));
    }

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

        // fecha e volta depois de 1.8s (ou o tempo que quiser)
        setTimeout(() => {
            setSuccessOpen(false);
            navigate(-1);
        }, 1800)
    }


    // validações do form
    function validarFormulario() {
        // 1. campos simples
        if (!titulo.trim()) return "O título é obrigatório.";
        if (!capaHorizontal.trim()) return "A capa horizontal é obrigatória.";
        if (!capaVertical.trim()) return "A capa vertical é obrigatória.";
        if (!trailer.trim()) return "O trailer é obrigatório.";
        if (!lancamento.trim()) return "A data de lançamento é obrigatória.";
        if (!duracao.trim()) return "A duração é obrigatória.";
        if (!sinopse.trim()) return "A sinopse é obrigatória.";

        // 2. duração → 1h | 1min | 1h 30min
        const regexDuracao = /^(\d+h|\d+min|\d+h \d+min)$/;
        if (!regexDuracao.test(duracao.trim())) {
            return "A duração deve ser preenchida assim: 1h, 30min ou 1h 30min.";
        }

        // 3. campos de seleção
        if (generosSelecionados.length === 0) return "Selecione pelo menos um gênero.";
        if (!diretorSelecionado) return "Selecione um diretor.";
        if (produtorasSelecionadas.length === 0) return "Selecione pelo menos uma produtora.";
        if (atoresSelecionados.length === 0) return "Selecione pelo menos um ator.";

        return null; // tudo certo
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const erro = validarFormulario();
        if (erro) {
            alert(erro);
            return;
        }

        const filmePayload = {
            titulo,
            capa_horizontal: capaHorizontal,
            capa_vertical: capaVertical,
            trailer,
            lancamento,
            duracao,
            sinopse,
            atores: atoresSelecionados.map(a => ({ id: a.id, nome: a.nome, foto: a.foto })),
            diretor: diretorSelecionado ? { id: diretorSelecionado.id, nome: diretorSelecionado.nome } : null,
            produtoras: produtorasSelecionadas.map(p => ({ id: p.id, nome: p.nome })),
            generos: generosSelecionados.map(g => ({ id: g.id, nome: g.nome })),
        };

        try {

            console.log("role:", user?.role);
            console.log("mode:", mode);
            console.log("movieId:", movieId);
            // ---------- ADMIN ----------
            if (user?.role === "admin") {
                if (mode === "create") {
                    const res = await api.post("/filmes", filmePayload);
                    mostrarSucesso("Filme criado com sucesso!");
                    return navigate(-1);
                }

                if (mode === "edit" && movieId) {
                    const res = await api.put(`/filmes/${movieId}`, filmePayload);
                    mostrarSucesso("Filme atualizado!");
                    return navigate(-1);
                }

                if (mode === "solicitacao" && idSolicitacao) {
                    const res = await api.post("/filmes", { ...filmePayload, id_solicitacao: idSolicitacao });
                    mostrarSucesso("Solicitação aceita e filme criado!");
                    return navigate(-1);
                }
            }

            // ---------- USUÁRIO COMUM: criar solicitação de novo filme ----------
            if (user?.role === "comum" && (mode === "create" || mode === "solicitar")) {
                const body = {
                    usuario_id: user.id,
                    filme: filmePayload,
                    tipo: "novo filme",
                    filme_id: null
                };
                const res = await api.post("/solicitacoes", body);
                mostrarSucesso("Solicitação enviada!");
                return navigate(-1);
            }

            // ---------- USUÁRIO COMUM: solicitação de edição ----------
            if (user?.role === "comum" && (mode === "edit" || mode === "editarSolicitacao") && movieId) {
                const body = {
                    usuario_id: user.id,
                    filme: filmePayload,
                    tipo: "edição",  // ✔ CORREÇÃO AQUI
                    filme_id: Number(movieId)
                };
                const res = await api.post("/solicitacoes", body);
                mostrarSucesso("Solicitação de edição enviada!");
                return navigate(-1);
            }

            alert("Operação não permitida.");

        } catch (err) {
            console.error("Erro ao enviar form:", err.response?.data || err);
            alert("Erro ao enviar.");
        }
    }

    // abrir modal de criar ator/diretor/produtora
    function abrirModalOutro(tipo) {
        setModalOutro(tipo);
        setNovoNome("");
        setNovaFoto("");
    }

    // fechar modal de criar ator/diretor/produtora
    function fecharModalOutro() {
        setModalOutro(null);
    }

    // envio de novo item
    async function salvarOutro(e) {
        e.preventDefault();

        if (!novoNome.trim()) {
            alert("Digite um nome válido.");
            return;
        }

        try {
            setLoadingOutro(true);

            let res;
            if (modalOutro === "ator") {
                res = await api.post("/atores", {
                    nome: novoNome,
                    foto: novaFoto || null
                });
            }
            if (modalOutro === "diretor") {
                res = await api.post("/diretores", { nome: novoNome });
            }
            if (modalOutro === "produtora") {
                res = await api.post("/produtoras", { nome: novoNome });
            }

            const novo = res.data;

            // adiciona na lista correspondente
            if (modalOutro === "ator") {
                setAtoresLista(prev => [...prev, novo]);
                setAtoresSelecionados(prev => [...prev, novo]);
            }
            if (modalOutro === "diretor") {
                setDiretoresLista(prev => [...prev, novo]);
                setDiretorSelecionado(novo);
            }
            if (modalOutro === "produtora") {
                setProdutorasLista(prev => [...prev, novo]);
                setProdutorasSelecionadas(prev => [...prev, novo]);
            }

            setSuccessOutroMsg("Novo item criado com sucesso!");
            setSuccessOutro(true);

            setTimeout(() => {
                setSuccessOutro(false);
                fecharModalOutro();
            }, 1500);

        } catch (err) {
            console.error(err);
            alert("Erro ao criar novo item.");
        } finally {
            setLoadingOutro(false);
        }
    }

    return (
        <div className="formularioFilmeContainer">
            <Botao 
                style = 'primary'
                text = 'Voltar'
                icon={BackArrow}
                to={-1}
            />

            <h1 className="tituloForm">
                {(mode === "create") && "Cadastre um novo filme!"}
                {(mode === "edit") && "Edite o filme!"}
                {mode === "solicitacao" && "Revise a solicitação do usuário!"}
            </h1>

            <p className="subtituloForm">
                {(mode === "create" && user?.role === "comum") && "Preencha as informações do filme que deseja ver no CtrlCine e envie sua solicitação ao administrador."}
                {(mode === "edit" && user?.role === "comum") && "Edite as informações do filme como deseja ver no CtrlCine e envie sua solicitação ao administrador."}
            </p>

            <form className="form-filme" onSubmit={handleSubmit}>
                <Input label="Título" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                <div className="formInputsDisplay">
                    <div className="inputBox1">
                        <div className="previewImg">
                            {capaHorizontal ? <img src={capaHorizontal} alt="Capa horizontal" className="capaHorizontal" /> : <div className="placeholder">Prévia da capa horizontal</div>}
                        </div>
                        <Input label="Capa Horizontal (URL)" name="capa_horizontal" value={capaHorizontal} onChange={(e) => setCapaHorizontal(e.target.value)} />
                    </div>

                    <div className="inputBox2">
                        <div className="previewImg">
                            {capaVertical ? <img src={capaVertical} alt="Capa vertical" /> : <div className="placeholder">Prévia da capa vertical</div>}
                        </div>
                        <Input label="Capa Vertical (URL)" name="capa_vertical" value={capaVertical} onChange={(e) => setCapaVertical(e.target.value)} />
                    </div>
                </div>

                <div className="formInputsDisplay">
                    <div className="inputBox1">
                        <div className="inputContainer">
                            <label className="floatingLabel active">Lançamento</label>
                            <input type="date" className="inputField active" value={lancamento} onChange={(e) => setLancamento(e.target.value)} name="lancamento" required/>
                        </div>
                    </div>

                    <div className="inputBox2">
                        <Input label="Duração" placeholder="Ex: 00h, 00min, 00h 00min" name="duracao" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
                    </div>
                </div>

                <div className="select-box">
                    <label>Gêneros</label>
                    <div className="chips-container">
                        {generosLista.map(g => (
                            <span key={g.id} className={generosSelecionados.some(s => s.id === g.id) ? "chip ativo" : "chip"} onClick={() => toggleGenero(g)}>
                                {g.nome}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="inputContainer">
                    <label className={`floatingLabel ${sinopse || focused ? "active" : ""}`} htmlFor="sinopse">Sinopse</label>
                    <textarea id="sinopse" className={`inputField ${sinopse || focused ? "active" : ""}`} value={sinopse} onChange={(e) => setSinopse(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
            
                <Input label="Trailer" placeholder="ID do trailer no youtube" name="trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} />

                <div className="formInputsDisplay">
                    <div className="inputBox1">
                        <div className="select-box">
                            <label>Diretor</label>
                            <div className="select-trigger" onClick={() => toggleDrop("diretor")}>
                                {diretorSelecionado ? diretorSelecionado.nome : "Selecione o diretor"}
                            </div>
                            {openDrop === "diretor" && (
                                <div className="dropdown">
                                    
                                    <input 
                                        type="text"
                                        className="searchDrop"
                                        placeholder="Buscar..."
                                        value={buscaDiretores}
                                        onChange={(e) => setBuscaDiretores(e.target.value)}
                                    />

                                    {diretoresFiltrados.map(d => (
                                        <div 
                                            key={d.id} 
                                            className={`drop-item ${diretorSelecionado?.id === d.id ? "selected" : ""}`}
                                            onClick={() => {
                                                escolherDiretor(d);
                                                setBuscaDiretores("");
                                            }}
                                        >
                                            {d.nome}
                                        </div>
                                    ))}

                                    <div className="drop-item outro" onClick={() => abrirModalOutro("diretor")}>Outro +</div>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="inputBox2">
                        <div className="select-box">
                            <label>Produtoras</label>
                            <div className="select-trigger" onClick={() => toggleDrop("produtoras")}>
                                Selecione produtoras
                            </div>
                            {openDrop === "produtoras" && (
                                <div className="dropdown">

                                    <input 
                                        type="text"
                                        className="searchDrop"
                                        placeholder="Buscar..."
                                        value={buscaProdutoras}
                                        onChange={(e) => setBuscaProdutoras(e.target.value)}
                                    />

                                    {produtorasFiltradas.map(p => (
                                        <label key={p.id} className="drop-item checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={produtorasSelecionadas.some(s => s.id === p.id)}
                                                onChange={() => toggleProdutora(p)}
                                            />
                                            <span>{p.nome}</span>
                                        </label>
                                    ))}

                                    <div className="drop-item outro" onClick={() => abrirModalOutro("produtora")}>Outro +</div>
                                </div>
                            )}
                        </div>
                        <div className="chips-container">
                            {produtorasSelecionadas.map(p => (
                                <span key={p.id} className="chip ativo" onClick={() => toggleProdutora(p)}>
                                    {p.nome} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="select-box">
                    <label>Atores</label>
                    <div className="select-trigger" onClick={() => toggleDrop("atores")}>
                        Selecione atores
                    </div>
                    {openDrop === "atores" && (
                        <div className="dropdown">

                            <input 
                                type="text"
                                className="searchDrop"
                                placeholder="Buscar..."
                                value={buscaAtores}
                                onChange={(e) => setBuscaAtores(e.target.value)}
                            />

                            {atoresFiltrados.map(a => (
                                <label key={a.id} className="drop-item checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={atoresSelecionados.some(s => s.id === a.id)}
                                        onChange={() => toggleAtor(a)}
                                    />
                                    <span>{a.nome}</span>
                                </label>
                            ))}

                            <div className="drop-item outro" onClick={() => abrirModalOutro("ator")}>Outro +</div>
                        </div>
                    )}
                </div>
                <div className="chips-container">
                    {atoresSelecionados.map(a => (
                        <span key={a.id} className="chip ativo" onClick={() => toggleAtor(a)}>
                            {a.nome} ✕
                        </span>
                    ))}
                </div>

                <div className="botoes">
                    <button type="button" onClick={() => navigate(-1)} className="cancelar">Cancelar</button>
                    <button type="submit" className="confirmar">Confirmar</button>
                </div>
            </form>

            <Modal
                isOpen={!!modalOutro}
                onRequestClose={fecharModalOutro}
                className="modalSalvar"
                overlayClassName="modalOverlay"
            >

                <button className="fecharModal" onClick={fecharModalOutro}>
                    <img src={XIcon} alt="Fechar" />
                </button>

                <div className="modalSalvarHeader">
                    <img src={Logo} alt="Logo" className="logoModal" />
                    <h2 className="tituloModal">
                        Adicionar {modalOutro === "ator" && "Ator"}
                        {modalOutro === "diretor" && "Diretor"}
                        {modalOutro === "produtora" && "Produtora"}
                    </h2>
                </div>

                <form onSubmit={salvarOutro} className="modalSalvarConteudo">
                    
                    <label>Nome</label>
                    <input
                        type="text"
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        className="inputModalSalvar"
                        required
                    />

                    {modalOutro === "ator" && (
                        <>
                            <label>Foto (URL)</label>
                            <input
                                type="text"
                                value={novaFoto}
                                onChange={(e) => setNovaFoto(e.target.value)}
                                className="inputModalSalvar"
                            />
                        </>
                    )}

                    <div className="botoesModalSalvar">
                        <button type="button" className="botaoCancelarModal" onClick={fecharModalOutro}>
                            Cancelar
                        </button>

                        <button type="submit" className="botaoConfirmarModal">
                            Adicionar
                        </button>
                    </div>
                </form>

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
