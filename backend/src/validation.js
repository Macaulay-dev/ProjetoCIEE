const limits = { nomeCompleto: 200, email: 254, telefone: 30, areaInteresse: 150, resumoProfissional: 3000 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateCandidate(input) {
  const errors = {};
  const data = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = input?.[key];
    if (value != null && typeof value !== 'string') {
      errors[key] = 'Deve ser um texto.';
      continue;
    }
    data[key] = (value ?? '').trim();
    if (data[key].length > max) errors[key] = `Use até ${max} caracteres.`;
  }
  if (!data.nomeCompleto) errors.nomeCompleto = 'Informe o nome completo.';
  if (!data.email) errors.email = 'Informe o e-mail.';
  else if (!emailPattern.test(data.email)) errors.email = 'Informe um e-mail válido.';
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
