import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const initial = { nomeCompleto: '', email: '', telefone: '', areaInteresse: '', resumoProfissional: '' };
async function request(path, options) {
  let response;
  try { response = await fetch(`${API}${path}`, options); }
  catch { throw new Error('Não foi possível conectar ao servidor. Verifique se a API está ligada.'); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(payload.mensagem || 'Ocorreu um erro.'); error.fields = payload.erros || {}; throw error; }
  return payload;
}
function App() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('form');
  const [listError, setListError] = useState('');
  async function refresh() {
    try { setList(await request('/api/candidatos')); setListError(''); }
    catch (error) { setListError(error.message); }
  }
  useEffect(() => { refresh(); }, []);
  function change(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })); setErrors(current => ({ ...current, [event.target.name]: '' })); }
  async function importFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
      setNotice('Arquivo inválido. Selecione um PDF de até 5 MB. Você pode continuar o cadastro manualmente.'); return;
    }
    setBusy(true); setNotice('Lendo PDF...');
    try {
      const body = new FormData(); body.append('arquivo', file);
      const result = await request('/api/curriculos/extrair', { method: 'POST', body });
      setForm(current => ({ ...current, ...Object.fromEntries(Object.entries(result.dados).filter(([, value]) => value)) }));
      setNotice(result.mensagem);
    } catch (error) { setNotice(`${error.message} Você pode continuar o cadastro manualmente.`); }
    finally { setBusy(false); }
  }
  async function save(event) {
    event.preventDefault(); setErrors({}); setNotice('');
    const fieldErrors = {};
    if (!form.nomeCompleto.trim()) fieldErrors.nomeCompleto = 'Informe o nome completo.';
    if (!form.email.trim()) fieldErrors.email = 'Informe o e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) fieldErrors.email = 'Informe um e-mail válido.';
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); setNotice('Confira os campos do formulário.'); return; }
    setBusy(true);
    try {
      const result = await request('/api/candidatos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setForm(initial); setNotice(result.mensagem); await refresh(); setView('list');
    } catch (error) { setErrors(error.fields || {}); setNotice(error.message); }
    finally { setBusy(false); }
  }
  async function show(id) {
    setBusy(true); setNotice('');
    try { setSelected(await request(`/api/candidatos/${id}`)); setView('detail'); }
    catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  return <div className="shell"><header><div><span className="eyebrow">Gestão de candidatos</span><h1>Cadastro de currículos</h1><p>Cadastre manualmente ou importe um PDF para preencher os dados.</p></div><span className="badge">Processo seletivo • CIEE/PR</span></header>
    <nav aria-label="Navegação"><button className={view === 'form' ? 'active' : ''} onClick={() => setView('form')}>Novo cadastro</button><button className={view === 'list' ? 'active' : ''} onClick={() => { setView('list'); refresh(); }}>Candidatos ({list.length})</button></nav>
    {notice && <div className="notice" role="status">{notice}</div>}
    {view === 'form' && <main className="panel"><h2>Dados do candidato</h2><p>O arquivo é opcional. Revise os campos preenchidos antes de salvar.</p><div className="upload"><label htmlFor="pdf">Importar currículo em PDF <span>até 5 MB</span></label><input id="pdf" type="file" accept="application/pdf,.pdf" onChange={importFile} disabled={busy}/></div><form onSubmit={save} noValidate>
      {[[ 'nomeCompleto', 'Nome completo', true ],[ 'email', 'E-mail', true ],[ 'telefone', 'Telefone', false ],[ 'areaInteresse', 'Área ou cargo de interesse', false ]].map(([name, label, required]) => <label className="field" key={name}>{label}{required && ' *'}<input name={name} type={name === 'email' ? 'email' : 'text'} value={form[name]} onChange={change} maxLength={{ nomeCompleto: 200, email: 254, telefone: 30, areaInteresse: 150 }[name]} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} required={required}/>{errors[name] && <small id={`${name}-error`} className="error">{errors[name]}</small>}</label>)}
      <label className="field">Resumo profissional<textarea name="resumoProfissional" rows="5" maxLength="3000" value={form.resumoProfissional} onChange={change}/>{errors.resumoProfissional && <small className="error">{errors.resumoProfissional}</small>}</label><button className="primary" disabled={busy}>{busy ? 'Aguarde...' : 'Salvar cadastro'}</button></form></main>}
    {view === 'list' && <main className="panel"><div className="heading"><h2>Candidatos cadastrados</h2><button onClick={refresh}>Atualizar</button></div>{listError && <p role="alert" className="error">{listError}</p>}{!listError && !list.length && <p>Nenhum candidato cadastrado ainda.</p>}<div className="cards">{list.map(person => <button className="candidate" key={person.id} onClick={() => show(person.id)}><strong>{person.nomeCompleto}</strong><span>{person.areaInteresse || 'Área não informada'}</span><span>{person.email}</span><em>Ver detalhes →</em></button>)}</div></main>}
    {view === 'detail' && selected && <main className="panel"><button className="back" onClick={() => setView('list')}>← Voltar à lista</button><h2>{selected.nomeCompleto}</h2><dl>{[['E-mail', selected.email], ['Telefone', selected.telefone], ['Área de interesse', selected.areaInteresse], ['Resumo profissional', selected.resumoProfissional], ['Cadastrado em', new Date(selected.criadoEm).toLocaleString('pt-BR')]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Não informado'}</dd></div>)}</dl></main>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
