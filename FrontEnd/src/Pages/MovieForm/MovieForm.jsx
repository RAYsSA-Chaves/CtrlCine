// MovieForm.jsx
import "./MovieForm.css";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../Services/Api";
import Input from "../../Components/Input/Input";
import { AuthContext } from "../../Services/AuthContext";

export default function MovieForm() {
    const { user } = useContext(AuthContext);

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

    const [loading, setLoading] = useState(false);

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

    async function handleSubmit(e) {
        e.preventDefault();

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
            setLoading(true);

            // ---------- ADMIN ----------
            if (user?.role === "admin") {
                if (mode === "create") {
                    const res = await api.post("/filmes", filmePayload);
                    alert("Filme criado!");
                    return navigate(-1);
                }

                if (mode === "edit" && movieId) {
                    const res = await api.put(`/filmes/${movieId}`, filmePayload);
                    alert("Filme atualizado!");
                    return navigate(-1);
                }

                if (mode === "solicitacao" && idSolicitacao) {
                    const res = await api.post("/filmes", { ...filmePayload, id_solicitacao: idSolicitacao });
                    alert("Solicitação aceita e filme criado!");
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
                alert("Solicitação enviada!");
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
                alert("Solicitação de edição enviada!");
                return navigate(-1);
            }

            alert("Operação não permitida.");

        } catch (err) {
            console.error("Erro ao enviar form:", err.response?.data || err);
            alert("Erro ao enviar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cadastro-filme-container">
            <h1 className="titulo-form">
                {mode === "create" && "Cadastrar Filme"}
                {mode === "edit" && "Editar Filme"}
                {mode === "solicitar" && "Solicitar Novo Filme"}
                {mode === "editarSolicitacao" && "Editar Solicitação"}
                {mode === "solicitacao" && "Revisar Solicitação"}
            </h1>

            <form className="form-filme" onSubmit={handleSubmit}>
                <Input label="Título" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                <div className="inputContainer">
                    <label className="floatingLabel active">Lançamento</label>
                    <input type="date" className="inputField active" value={lancamento} onChange={(e) => setLancamento(e.target.value)} />
                </div>

                <Input label="Capa Horizontal (URL)" name="capa_horizontal" value={capaHorizontal} onChange={(e) => setCapaHorizontal(e.target.value)} />
                <div className="preview-img">
                    {capaHorizontal ? <img src={capaHorizontal} alt="Capa horizontal" /> : <div className="placeholder">Prévia da capa horizontal</div>}
                </div>

                <Input label="Capa Vertical (URL)" name="capa_vertical" value={capaVertical} onChange={(e) => setCapaVertical(e.target.value)} />
                <div className="preview-img">
                    {capaVertical ? <img src={capaVertical} alt="Capa vertical" /> : <div className="placeholder">Prévia da capa vertical</div>}
                </div>

                <Input label="Trailer (URL YouTube)" name="trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
                {trailer && trailer.includes("youtube") && (
                    <div className="trailer-preview">
                        <iframe title="Trailer preview" src={trailer.replace("watch?v=", "embed/")} frameBorder="0" allowFullScreen />
                    </div>
                )}

                <Input label="Duração" name="duracao" value={duracao} onChange={(e) => setDuracao(e.target.value)} />

                <div className="inputContainer">
                    <label className={`floatingLabel ${sinopse ? "active" : ""}`} htmlFor="sinopse">Sinopse</label>
                    <textarea id="sinopse" className={`inputField ${sinopse ? "active" : ""}`} value={sinopse} onChange={(e) => setSinopse(e.target.value)} placeholder="Digite a sinopse" rows={6} />
                </div>

                <div className="select-box">
                    <label>Atores</label>
                    <div className="select-trigger" onClick={() => toggleDrop("atores")}>
                        {atoresSelecionados.length > 0 ? atoresSelecionados.map(a => a.nome).join(", ") : "Selecione atores"}
                    </div>
                    {openDrop === "atores" && (
                        <div className="dropdown">
                            {atoresLista.map(a => (
                                <div key={a.id} className={`drop-item ${atoresSelecionados.some(s => s.id === a.id) ? "selected" : ""}`} onClick={() => toggleAtor(a)}>
                                    {a.nome}
                                </div>
                            ))}
                            <div className="drop-item outro">Outro +</div>
                        </div>
                    )}
                </div>

                <div className="select-box">
                    <label>Diretor</label>
                    <div className="select-trigger" onClick={() => toggleDrop("diretor")}>
                        {diretorSelecionado ? diretorSelecionado.nome : "Selecione o diretor"}
                    </div>
                    {openDrop === "diretor" && (
                        <div className="dropdown">
                            {diretoresLista.map(d => (
                                <div key={d.id} className={`drop-item ${diretorSelecionado?.id === d.id ? "selected" : ""}`} onClick={() => escolherDiretor(d)}>
                                    {d.nome}
                                </div>
                            ))}
                            <div className="drop-item outro">Outro +</div>
                        </div>
                    )}
                </div>

                <div className="select-box">
                    <label>Produtoras</label>
                    <div className="select-trigger" onClick={() => toggleDrop("produtoras")}>
                        {produtorasSelecionadas.length > 0 ? produtorasSelecionadas.map(p => p.nome).join(", ") : "Selecione produtoras"}
                    </div>
                    {openDrop === "produtoras" && (
                        <div className="dropdown">
                            {produtorasLista.map(p => (
                                <div key={p.id} className={`drop-item ${produtorasSelecionadas.some(s => s.id === p.id) ? "selected" : ""}`} onClick={() => toggleProdutora(p)}>
                                    {p.nome}
                                </div>
                            ))}
                            <div className="drop-item outro">Outro +</div>
                        </div>
                    )}
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

                <div className="botoes">
                    <button type="button" onClick={() => navigate(-1)} className="cancelar">Cancelar</button>
                    <button type="submit" className="confirmar">Confirmar</button>
                </div>
            </form>
        </div>
    );
}
