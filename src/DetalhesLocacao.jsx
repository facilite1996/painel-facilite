import React from 'react';
import './index.css';

function DetalhesLocacao({ dados, onVoltar }) {
  if (!dados) return null;

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Detalhes da Locação</h1>

      <div className="painel-box">
        <p><strong>Nome:</strong> {dados.nome}</p>
        <p><strong>CPF:</strong> {dados.cpf}</p>
        <p><strong>Telefone:</strong> {dados.telefone}</p>
        <p><strong>Valor:</strong> R$ {dados.valor}</p>
        <p><strong>Número da Locação:</strong> {dados.numeroLocacao}</p>
        <p><strong>Status:</strong> {dados.status}</p>
        <p><strong>Token:</strong> {dados.token}</p>
        <p><strong>Data:</strong> {new Date(dados.data.seconds * 1000).toLocaleString()}</p>
      </div>

      <button className="logout" onClick={onVoltar}>Voltar</button>
    </div>
  );
}

export default DetalhesLocacao;
