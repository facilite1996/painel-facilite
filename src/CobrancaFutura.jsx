import React, { useEffect, useState } from 'react';
import './index.css';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function CobrancaFutura({ onVoltar }) {
  const [cobrancas, setCobrancas] = useState([]);
  const [valorNovo, setValorNovo] = useState({});
  const [confirmandoId, setConfirmandoId] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const querySnapshot = await getDocs(collection(db, 'cobrancas'));
      const lista = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(c => c.token); // só mostrar as que têm token
      setCobrancas(lista);
    };
    carregar();
  }, []);

  const iniciarCobranca = (id) => {
    setConfirmandoId(id);
  };

  const confirmarCobranca = async (cliente) => {
    if (!valorNovo[cliente.id]) {
      alert('Informe um valor válido.');
      return;
    }

    const novaCobranca = {
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      valor: valorNovo[cliente.id],
      numeroLocacao: cliente.numeroLocacao + ' (Recobrança)',
      token: cliente.token,
      status: 'aprovado',
      data: new Date(),
    };

    await addDoc(collection(db, 'cobrancas'), novaCobranca);
    alert(`Cobrança realizada com sucesso!`);
    setConfirmandoId(null);
    setValorNovo({ ...valorNovo, [cliente.id]: '' });
  };

  return (
    <div className="home-container">
      <h1 className="titulo-facilite">Cobranças Recorrentes</h1>

      <div className="painel-box">
        {cobrancas.length === 0 ? (
          <p>Nenhuma cobrança com token encontrada.</p>
        ) : (
          <table className="tabela-cobrancas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Último Valor</th>
                <th>Token</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {cobrancas.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>R$ {item.valor}</td>
                  <td>{item.token}</td>
                  <td>
                    {confirmandoId === item.id ? (
                      <>
                        <input
                          type="text"
                          placeholder="Novo valor"
                          value={valorNovo[item.id] || ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            const formatado = (Number(raw) / 100).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            });
                            setValorNovo({ ...valorNovo, [item.id]: formatado });
                          }}
                          style={{ width: '120px', marginBottom: '5px' }}
                        />
                        <br />
                        <button onClick={() => confirmarCobranca(item)}>
                          Confirmar cobrança
                        </button>
                      </>
                    ) : (
                      <button onClick={() => iniciarCobranca(item.id)}>
                        Cobrar novamente
                      </button>
                    )}
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

export default CobrancaFutura;
