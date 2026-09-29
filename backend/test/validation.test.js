import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCandidate } from '../src/validation.js';
import { identifyFields } from '../src/extract.js';
test('cadastro manual exige nome e e-mail válido', () => {
  assert.equal(validateCandidate({}).valid, false);
  assert.equal(validateCandidate({ nomeCompleto: 'Ana Lima', email: 'invalido' }).errors.email, 'Informe um e-mail válido.');
  assert.equal(validateCandidate({ nomeCompleto: ' Ana Lima ', email: 'ana@exemplo.com' }).data.nomeCompleto, 'Ana Lima');
});
test('campos opcionais e limites são verificados', () => {
  assert.equal(validateCandidate({ nomeCompleto: 'Ana Lima', email: 'ana@exemplo.com' }).valid, true);
  assert.equal(validateCandidate({ nomeCompleto: 'Ana Lima', email: 'ana@exemplo.com', telefone: '1'.repeat(31) }).valid, false);
});
test('extrai dados conhecidos e deixa ausentes em branco', () => {
  assert.deepEqual(identifyFields('Ana Lima\nana@exemplo.com\n(41) 99999-1234'), { nomeCompleto: 'Ana Lima', email: 'ana@exemplo.com', telefone: '(41) 99999-1234' });
  assert.deepEqual(identifyFields('Currículo\nFormação'), { nomeCompleto: '', email: '', telefone: '' });
});
