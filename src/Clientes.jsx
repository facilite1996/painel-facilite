import React, { useState, useEffect } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Clientes({ onVoltar }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '' });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const querySnapshot = await getDocs(collection(db, 'clientes'));
    const dados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClientes(dados);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrarCliente = async () => {
    if (!form.nome || !form.cpf || !form.telefone) {
      alert('Preencha todos os campos.');
      return;
    }

    if (editandoId) {
      await updateDoc(doc(db, 'clientes', editandoId), form);
      setEditandoId(null);
      alert('Cliente atualizado com sucesso!');
    } else {
      await addDoc(collection(db, 'clientes'), form);
      alert('Cliente cadastrado com sucesso!');
    }

    setForm({ nome: '', cpf: '', telefone: '' });
    carregarClientes();
  };

  const editarCliente = (cliente) => {
    setForm({ nome: cliente.nome, cpf: cliente.cpf, telefone: cliente.telefone });
    setEditandoId(cliente.id);
  };

  const excluirCliente = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteDoc(doc(db, 'clientes', id));
      carregarClientes();
    }
  };

  const mascararCPF = (cpf) => {
    return cpf.replace(/(\\d{3})\\d{3}(\\d{3})/, '$1.***.$2');
  };

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Cadastro de Clientes</h1>

      <div className="painel-box">
        <input name="nome" type="text" placeholder="Nome" value={form.nome} onChange={handleChange} />
        <input name="cpf" type="text" placeholder="CPF" value={form.cpf} onChange={handleChange} />
        <input name="telefone" type="text" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
        <button type="button" onClick={cadastrarCliente}>
          {editandoId ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>

        <hr style={{ margin: '20px 0' }} />

        <h3>Clientes Cadastrados</h3>
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id}>
              <strong>{cliente.nome}</strong> – {mascararCPF(cliente.cpf)} – {cliente.telefone}
              <div style={{ marginTop: 5 }}>
                <button style={{ marginRight: 10 }} onClick={() => editarCliente(cliente)}>
                  Editar
                </button>
                <button
                  style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px' }}
                  onClick={() => excluirCliente(cliente.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button className="logout" onClick={onVoltar}>Voltar</button>
    </div>
  );
}

export default Clientes;
