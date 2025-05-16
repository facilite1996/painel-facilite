import React, { useEffect, useState } from 'react';
import Login from './Login';
import Home from './Home';
import Historico from './Historico';
import CobrancaFutura from './CobrancaFutura';
import DetalhesLocacao from './DetalhesLocacao';
import Clientes from './Clientes';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tela, setTela] = useState('home');
  const [locacaoSelecionada, setLocacaoSelecionada] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUsuarioLogado(usuario);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setTela('home');
  };

  if (!usuarioLogado) return <Login onLogin={() => setTela('home')} />;

  if (tela === 'historico') {
    return (
      <Historico
        onVoltar={() => setTela('home')}
        onAbrirDetalhes={(dados) => {
          setLocacaoSelecionada(dados);
          setTela('detalhes');
        }}
      />
    );
  }

  if (tela === 'detalhes') {
    return (
      <DetalhesLocacao
        dados={locacaoSelecionada}
        onVoltar={() => {
          setTela('historico');
          setLocacaoSelecionada(null);
        }}
      />
    );
  }

  if (tela === 'cobrancaFutura') return <CobrancaFutura onVoltar={() => setTela('home')} />;
  if (tela === 'clientes') return <Clientes onVoltar={() => setTela('home')} />;

  return (
    <Home
      onLogout={handleLogout}
      onHistorico={() => setTela('historico')}
      onCobrancaFutura={() => setTela('cobrancaFutura')}
      onClientes={() => setTela('clientes')}
    />
  );
}

export default App;

