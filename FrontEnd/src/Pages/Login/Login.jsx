// Página de login

import './Login.css'
import Botao from '../../Components/Botao/Botao'
import BackArrow from '../../Assets/Images/Icons/back_arrow_icon.svg'
import Logo from '../../Assets/Images/Logo/Logo.svg'
import Input from '../../Components/Input/Input'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from "react";
import { AuthContext } from '../../Services/AuthContext';
import EmailIcon from '../../Assets/Images/Icons/email_icon.svg'
import Cadeado from '../../Assets/Images/Icons/cadeado_icon.svg'
import LoadingModal from '../../Components/LoadingModal/LoadingModal'


export default function Login() {
    const navigate = useNavigate();

    // pega login do contexto
    const { login } = useContext(AuthContext);

    // estados dos inputs
    const [form, setForm] = useState({
        email: "",
        senha: ""
    });

    // mensagem de erro
    const [error, setError] = useState("");

    // estado para o modal de loading
    const [isLoading, setIsLoading] = useState(false);

    // visibilidade da senha
    const [showPassword, setShowPassword] = useState(false);

    // atualiza inputs
    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    // validações do form
    function validate() {

        // email
        if (!form.email.includes("@") || !form.email.includes(".")) {
            setError("Usuário e/ou senha inválidos.");
            return false;
        }

        // senha
        if (form.senha.length < 1) {
            setError("Usuário e/ou senha inválidos.");
            return false;
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
            const ok = await login(form.email, form.senha);
            if (ok) {
                navigate("/home");
                setIsLoading(false);
            }

        } catch (error) {
            setError("Usuário e/ou senha inválidos.");
            setIsLoading(false);
        }
    }

    return (
        <main className='loginPage'>
            <div className='contentContainer'>
                {/* Imagem */}
                <div className='formImage'>
                    <Botao 
                        style = 'primary'
                        text = 'Voltar'
                        icon={BackArrow}
                        to='/'
                    />
                    <img src={Logo} alt='Logo' className='formLogo'/>
                </div>

                {/* Form */}
                <form className='entryForm' onSubmit={handleSubmit}>
                    <div>
                        <h1>Login</h1>
                        <p>Por favor, preencha as informações da sua conta abaixo</p>

                        {/* Erro */}
                        {error && (
                            <div className="errorMessage">
                                <TriangleAlert/>
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Inputs */}
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
                                placeholder = 'Digite a sua senha'
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
                        
                        <Botao 
                            style = 'primary'
                            text = 'Entrar'
                            type = 'submit'
                        />

                        <div className='divider'></div>

                        {/* Link para cadastro */}
                        <div className='formLinks'>
                            <p>Ainda não tem uma conta?</p>
                            <Link to='/cadastro'>Crie uma!</Link>
                        </div>
                    </div>
                </form>
            </div>

            <LoadingModal isOpen={isLoading}/>
        </main>
    )
}