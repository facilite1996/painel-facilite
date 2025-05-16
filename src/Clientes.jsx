import React, { useState, useEffect } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function Clientes({ onVoltar }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '' });

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

    await addDoc(collection(db, 'clientes'), form);
    setForm({ nome: '', cpf: '', telefone: '' });
    carregarClientes();
    alert('Cliente cadastrado com sucesso!');
  };

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Cadastro de Clientes</h1>

      <div className="painel-box">
        <input name="nome" type="text" placeholder="Nome" value={form.nome} onChange={handleChange} />
        <input name="cpf" type="text" placeholder="CPF" value={form.cpf} onChange={handleChange} />
        <input name="telefone" type="text" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
        <button type="button" onClick={cadastrarCliente}>Cadastrar Cliente</button>

        <hr style={{ margin: '20px 0' }} />

        <h3>Clientes Cadastrados</h3>
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id}>
              <strong>{cliente.nome}</strong> – {cliente.cpf} – {cliente.telefone}
            </li>
          ))}
        </ul>
      </div>

      <button className="logout" onClick={onVoltar}>Voltar</button>
    </div>
  );
}

export default Clientes;
