import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { validateCandidate } from './validation.js';
import { extractPdf } from './extract.js';
import { getPool, sql } from './db.js';

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
const select = 'Id AS id, NomeCompleto AS nomeCompleto, Email AS email, Telefone AS telefone, AreaInteresse AS areaInteresse, ResumoProfissional AS resumoProfissional, CriadoEm AS criadoEm';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single('arquivo');

app.post('/api/curriculos/extrair', (req, res, next) => upload(req, res, async error => {
  if (error) return next(error);
  if (!req.file) return res.status(400).json({ mensagem: 'Selecione um arquivo PDF.' });
  const f = req.file;
  if (f.mimetype !== 'application/pdf' || !f.originalname.toLowerCase().endsWith('.pdf') || f.buffer.subarray(0, 5).toString() !== '%PDF-') {
    return res.status(400).json({ mensagem: 'Arquivo inválido. Envie um PDF de até 5 MB.' });
  }
  try {
    const dados = await extractPdf(f.buffer);
    res.json({ dados, mensagem: 'PDF lido. Confira os dados antes de salvar.' });
  } catch {
    res.status(422).json({ mensagem: 'Não foi possível ler o texto do PDF. Preencha o formulário manualmente.' });
  }
}));

app.post('/api/candidatos', async (req, res, next) => {
  const { valid, data, errors } = validateCandidate(req.body);
  if (!valid) return res.status(400).json({ mensagem: 'Confira os campos do formulário.', erros: errors });
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nome', sql.NVarChar(200), data.nomeCompleto)
      .input('email', sql.NVarChar(254), data.email)
      .input('telefone', sql.NVarChar(30), data.telefone || null)
      .input('area', sql.NVarChar(150), data.areaInteresse || null)
      .input('resumo', sql.NVarChar(3000), data.resumoProfissional || null)
      .query(`INSERT INTO dbo.Candidatos (NomeCompleto, Email, Telefone, AreaInteresse, ResumoProfissional)
        OUTPUT INSERTED.Id AS id VALUES (@nome, @email, @telefone, @area, @resumo)`);
    res.status(201).json({ id: result.recordset[0].id, mensagem: 'Cadastro salvo com sucesso.' });
  } catch (error) { next(error); }
});
app.get('/api/candidatos', async (_req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT ${select} FROM dbo.Candidatos ORDER BY CriadoEm DESC, Id DESC`);
    res.json(result.recordset);
  } catch (error) { next(error); }
});
app.get('/api/candidatos/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ mensagem: 'Identificador inválido.' });
  try {
    const pool = await getPool();
    const result = await pool.request().input('id', sql.Int, id).query(`SELECT ${select} FROM dbo.Candidatos WHERE Id = @id`);
    if (!result.recordset.length) return res.status(404).json({ mensagem: 'Candidato não encontrado.' });
    res.json(result.recordset[0]);
  } catch (error) { next(error); }
});
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ mensagem: 'O PDF deve ter no máximo 5 MB.' });
  if (error instanceof multer.MulterError) return res.status(400).json({ mensagem: 'Envie apenas um arquivo PDF.' });
  console.error(error);
  res.status(500).json({ mensagem: 'Não foi possível concluir a operação. Verifique o servidor e tente novamente.' });
});
