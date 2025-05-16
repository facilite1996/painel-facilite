import React, { useEffect, useState } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function mascararCPF(cpf) {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})\d{3}\d{3}(\d{2})/, '$1.***.***-$2');
}

function Historico({ onVoltar, onAbrirDetalhes }) {
  const [cobrancas, setCobrancas] = useState([]);
  const [filtro, setFiltro] = useState('');

  const carregarCobrancas = async () => {
    const querySnapshot = await getDocs(collection(db, 'cobrancas'));
    const dados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const ordenado = dados.sort((a, b) => b.data.seconds - a.data.seconds);
    setCobrancas(ordenado);
  };

  useEffect(() => {
    carregarCobrancas();
  }, []);

  const excluirCobranca = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cobrança?')) {
      await deleteDoc(doc(db, 'cobrancas', id));
      carregarCobrancas();
    }
  };

  const cobrancasFiltradas = cobrancas.filter(item =>
    item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    item.cpf.toLowerCase().includes(filtro.toLowerCase())
  );

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
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {cobrancasFiltradas.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{mascararCPF(item.cpf)}</td>
                  <td>{item.valor}</td>
                  <td>{item.status}</td>
                  <td>{'*'.repeat(item.token.length)}</td>
                  <td>{new Date(item.data.seconds * 1000).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => excluirCobranca(item.id)}
                      style={{
                        backgroundColor: '#d9534f',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
                    </button>
                  </td>
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
