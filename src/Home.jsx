import React, { useState, useEffect } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function gerarToken() {
  return 'tok_' + Math.random().toString(36).substring(2, 12);
}

function Home({ onLogout, onHistorico, onCobrancaFutura, onClientes, usuario }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    valor: '',
    numeroLocacao: '',
  });

  const isAdmin = usuario?.email === 'admin@facilitelocadora.com';

  useEffect(() => {
    const carregarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(lista);
    };

    carregarClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'valor') {
      const raw = value.replace(/\D/g, '');
      const valorFormatado = (Number(raw) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      setForm({ ...form, valor: valorFormatado });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelecionarCliente = (e) => {
    const idSelecionado = e.target.value;
    const cliente = clientes.find(c => c.id === idSelecionado);
    if (cliente) {
      setForm({
        ...form,
        nome: cliente.nome,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
      });
    }
  };

  const solicitarPagamento = async () => {
    if (!form.nome || !form.cpf || !form.valor) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const token = gerarToken();

    await addDoc(collection(db, 'cobrancas'), {
      ...form,
      status: 'aprovado',
      token,
      data: new Date(),
    });

    alert('Pagamento aprovado com sucesso!');
    setForm({ nome: '', cpf: '', telefone: '', valor: '', numeroLocacao: '' });
  };

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Painel de Cobranças</h1>
      <div className="painel-box">
        <h3>Iniciar Locação</h3>
        <form>
          <select onChange={handleSelecionarCliente} style={{ marginBottom: '10px', padding: '10px', width: '100%' }}>
            <option value="">Selecionar Cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome} - {c.cpf}</option>
            ))}
          </select>

          <input name="nome" type="text" placeholder="Nome do Cliente" value={form.nome} disabled />
          <input name="cpf" type="text" placeholder="CPF" value={form.cpf} disabled />
          <input name="telefone" type="text" placeholder="Telefone" value={form.telefone} disabled />
          <input name="valor" type="text" placeholder="Valor da Locação" value={form.valor} onChange={handleChange} />
          <input name="numeroLocacao" type="text" placeholder="Número da Locação (opcional)" value={form.numeroLocacao} onChange={handleChange} />

          <button type="button" onClick={solicitarPagamento}>Solicitar Pagamento</button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={onHistorico}
                style={{ marginTop: '10px', backgroundColor: '#333', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Ver Histórico de Locações
              </button>

              <button
                type="button"
                onClick={onCobrancaFutura}
                style={{ marginTop: '10px', backgroundColor: '#444', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Cobranças Recorrentes
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClientes}
            style={{ marginTop: '10px', backgroundColor: '#666', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          >
            Gerenciar Clientes
          </button>
        </form>
      </div>

      <button className="logout" onClick={onLogout}>Sair</button>
    </div>
  );
}

export default Home;
