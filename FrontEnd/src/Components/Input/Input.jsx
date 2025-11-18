// Input genérico para todos os forms

import './Input.css';
import { useState } from 'react';


export default function Input({ 
    label, 
    icon, 
    placeholder, 
    type = 'text', 
    value, onChange, 
    name }) {
        
    // controla se o input está focado (para flutuar label e mostrar placeholder)
    const [focused, setFocused] = useState(false);

    // quando o input ganha foco → label sobe e placeholder aparece
    function handleFocus () {
        setFocused(true);
    }

    // quando perde foco → label só volta se não tiver valor digitado
    function handleBlur () {
        if (!value) setFocused(false);
    };

    return (
        // Container do input
        <div className='inputContainer'>

            {/* Ícone */}
            {icon && <img src={icon} alt='Ícone' className='inputIcon' />}

            {/* Label que flutua */}
            <label className={`floatingLabel ${focused || value ? 'active' : ''}`} htmlFor={name}>
                {label}
            </label>

            {/* Input */}
            <input
                type={type}
                className={`inputField ${focused || value ? 'active' : ''}`}
                value={value}
                onChange={(e) => onChange(e)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={focused ? placeholder : ''}
                name={name}
                // limites de caracteres
                maxLength={
                    name === 'senha' ? 32 : 255}
                autocomplete='off'
                required
            />
        </div>
    );
}