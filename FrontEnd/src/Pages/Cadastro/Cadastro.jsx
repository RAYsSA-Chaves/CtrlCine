// Página de cadastro

import './Cadastro.css'
import '../Login/Login.css'
import Botao from '../../Components/Botao/Botao'
import BackArrow from '../../Assets/Images/Icons/back_arrow_icon.svg'
import Logo from '../../Assets/Images/Logo/Logo.svg'
import Input from '../../Components/Input/Input'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import EmailIcon from '../../Assets/Images/Icons/email_icon.svg'
import Cadeado from '../../Assets/Images/Icons/cadeado_icon.svg'
import UserIcom from '../../Assets/Images/Icons/user_icon.svg'
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import api from '../../Services/Api'
import SuccessModal from '../../Components/SuccessModal/SuccessModal'


export default function Cadastro() {
    const navigate = useNavigate();
        
        // estados dos inputs
        const [form, setForm] = useState({
            nome: "",
            sobrenome: "",
            email: "",
            senha: "",
            confirmarSenha: ""
        });
    
        // mensagem de erro
        const [error, setError] = useState("");

        // estado para o modal de sucesso
        const [success, setSuccess] = useState("")
    
        // estado para o modal de loading
        const [isLoading, setIsLoading] = useState(false);
    
        // visibilidade da senha
        const [showPassword, setShowPassword] = useState(false);
        const [showPassword2, setShowPassword2] = useState(false);
    
        // atualiza inputs
        function handleChange(e) {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }
    
        // validações do form
        function validate() {

            // nome
            if (form.nome.trim().length < 2) {
                setError("Digite um nome válido.")
                return false
            }
    
            // email
            if (!form.email.includes("@") || !form.email.includes(".")) {
                setError("Digite um email válido.")
                return false;
            }
    
            // senha
            if (form.senha.length < 6) {
                setError("A senha deve ter no mínimo 6 caracteres.")
                return false;
            }

            // confirmar senha
            if (form.senha !== form.confirmarSenha) {
                setError("As senhas não coincidem.")
                return false
            }
            
            return true;
        }
    
        // envio para API
        async function handleSubmit(e) {
            e.preventDefault();
            setError("");
    
            if (!validate()) return;
    
            setIsLoading(true);
    
            try {
                const response = await api.post("/usuarios/cadastro", {
                    nome: form.nome,
                    sobrenome: form.sobrenome,
                    email: form.email,
                    senha: form.senha
                })

                setIsLoading(false)

                 // sucesso do cadastro
                if (response.status === 201) {
                    setSuccess(true)

                    // esperar 3 segundos e mandar para login
                    setTimeout(() => {
                        navigate("/login")
                    }, 3000)
                }
    
            } catch (error) {
                setIsLoading(false);

                // mensagem vinda da API
                if (error.response?.data?.Erro) {
                    setError(error.response.data.Erro)
                } else {
                    setError("Erro ao cadastrar. Tente novamente.")
                }
            }
        }
    
        return (
            <main className='loginPage' id='registerPage'>
                <div className='contentContainer'>
                    {/* Imagem */}
                    <div className='loginImage'>
                        <Botao 
                            style = 'primary'
                            text = 'Voltar'
                            icon={BackArrow}
                            to='/login'
                        />
                        <img src={Logo} alt='Logo' className='formLogo'/>
                    </div>
    
                    {/* Form */}
                    <form className='entryForm' onSubmit={handleSubmit}>
                        <div className='cadastroForm'>
                            <h1>Cadastro</h1>
                            <p>Por favor, preencha suas informações abaixo</p>
    
                            {/* Erro */}
                            {error && (
                                <div className="errorMessage">
                                    <TriangleAlert/>
                                    <p>{error}</p>
                                </div>
                            )}
    
                            {/* Inputs */}
                            <div className='inputsDisplay'>
                                <Input
                                    label='Nome'
                                    icon = {UserIcom}
                                    placeholder = 'Seu primeiro nome'
                                    type = 'text'
                                    value={form.nome}
                                    onChange={handleChange}
                                    name = 'nome'
                                />
                                <Input
                                    label='Sobrenome'
                                    placeholder = 'Seu últmo nome'
                                    type = 'text'
                                    value={form.sobrenome}
                                    onChange={handleChange}
                                    name = 'sobrenome'
                                />
                            </div>

                            <Input
                                label='Email'
                                icon = {EmailIcon}
                                placeholder = 'usuario@gmail.com'
                                type = 'email'
                                value={form.email}
                                onChange={handleChange}
                                name = 'email'
                            />

                            <div className='passwordField'>
                                <Input
                                    label='Senha'
                                    icon={Cadeado}
                                    placeholder = 'Crie uma senha'
                                    type={showPassword ? 'text' : 'password'}
                                    value = {form.senha}
                                    onChange={handleChange}
                                    name = 'senha'
                                />
                                <div 
                                    className="eyeBtn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </div>
                            </div>

                            <div className='passwordField'>
                                <Input
                                    label='Confirme a senha'
                                    icon={Cadeado}
                                    placeholder = 'Digite a senha novamente'
                                    type={showPassword2 ? 'text' : 'password'}
                                    value = {form.confirmarSenha}
                                    onChange={handleChange}
                                    name = 'confirmarSenha'
                                />
                                <div 
                                    className="eyeBtn"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                >
                                    {showPassword2 ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </div>
                            </div>
                            
                            <Botao 
                                style = 'primary'
                                text = 'Cadastrar'
                                type = 'submit'
                            />
    
                            <div className='divider'></div>
    
                            {/* Link para cadastro */}
                            <div className='formLinks'>
                                <p>Já tem uma conta?</p>
                                <Link to='/login'>Entre!</Link>
                            </div>
                            
                        </div>
                    </form>
                </div>
    
                <LoadingModal isOpen={isLoading}/>
                <SuccessModal isOpen={success} message="Usuário cadastrado com sucesso!" />
            </main>
        )
}