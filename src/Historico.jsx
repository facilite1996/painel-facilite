import React, { useEffect, useState } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function Historico({ onVoltar, onAbrirDetalhes }) {
  const [cobrancas, setCobrancas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const carregarCobrancas = async () => {
      const querySnapshot = await getDocs(collection(db, 'cobrancas'));
      const dados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCobrancas(dados);
    };

    carregarCobrancas();
  }, []);

  const cobrancasFiltradas = cobrancas.filter(item =>
    item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    item.cpf.toLowerCase().includes(filtro.toLowerCase())
  );

  // Relatórios
  const totalLocacoes = cobrancasFiltradas.length;
  const totalValor = cobrancasFiltradas.reduce((soma, item) => {
    const numero = parseFloat(
      (item.valor || '')
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
        .trim()
    );
    return soma + (isNaN(numero) ? 0 : numero);
  }, 0);
  const totalAprovadas = cobrancasFiltradas.filter(c => c.status === 'aprovado').length;
  const totalOutras = cobrancasFiltradas.filter(c => c.status !== 'aprovado').length;

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Histórico de Locações</h1>

      <div className="painel-box">
        <input
          type="text"
          placeholder="Filtrar por nome ou CPF"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            marginBottom: '15px',
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        {/* Bloco de resumo */}
        <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <p><strong>Total de Locações:</strong> {totalLocacoes}</p>
          <p><strong>Total Aprovadas:</strong> {totalAprovadas}</p>
          <p><strong>Outras (pendentes/canceladas):</strong> {totalOutras}</p>
          <p><strong>Valor Total Cobrado:</strong> R$ {totalValor.toFixed(2)}</p>
        </div>

        {cobrancasFiltradas.length === 0 ? (
          <p>Nenhuma locação encontrada.</p>
        ) : (
          <table className="tabela-cobrancas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Token</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {cobrancasFiltradas.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onAbrirDetalhes(item)}
                >
                  <td>{item.nome}</td>
                  <td>{item.cpf}</td>
                  <td>{item.valor}</td>
                  <td>{item.status}</td>
                  <td>{'*'.repeat(item.token.length)}</td>
                  <td>{new Date(item.data.seconds * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="logout" onClick={onVoltar}>Voltar</button>
    </div>
  );
}

export default Historico;
