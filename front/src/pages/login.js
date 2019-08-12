import React, { useState } from 'react';
import './login.css';
import api from '../services/api';

import logo from '../assets/logo.svg';

function Login({ history }){
    const [ username, setUsername ] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(username);

        const response = await api.post('devs',{
            username
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input 
                    placeholder="Digite seu usuário no github"
                    value={username}
                    onChange={ e => setUsername(e.target.value) }
                />
                <button type="submit">Entrar</button>
            </form>
            
        </div>
    );
}

export default Login;