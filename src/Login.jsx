import React, { useState } from 'react';
import './index.css';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      onLogin(); // redireciona após login
    } catch (error) {
      setErro('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login Facilite</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="erro">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;