# Cadastro de currículos — desafio CIEE/PR

Aplicação para cadastrar candidatos manualmente ou importar um currículo em PDF. A importação sugere nome, e-mail e telefone; a pessoa pode revisar e completar o mesmo formulário antes de salvar. O PDF nunca é necessário para o cadastro.

## Tecnologias

- React 18.3.1 e Vite 5.4.15 (frontend)
- Node.js 20.16+ e Express 4.21.2 (backend)
- SQL Server 2019+ (banco de dados), pacote `mssql` 11.0.1
- `multer` 2.0.2 e `pdf-parse` 2.4.5 (envio e extração)
- Testes com `node:test` (integrado ao Node.js)

## Pré-requisitos

Node.js 20.16 ou superior, npm e SQL Server em execução. É possível usar SQL Server local, em container ou remoto, com usuário que tenha acesso à base. Porta padrão: 1433. O script SQL usa o comando `GO`, aceito pelo SSMS e `sqlcmd`.

## Configuração do banco

1. Conecte-se ao SQL Server via SQL Server Management Studio ou `sqlcmd` com um usuário autorizado a criar banco.
2. Execute `database/001_create.sql`. Exemplo com `sqlcmd`:

```bash
sqlcmd -S localhost,1433 -U sa -P 'SENHA_LOCAL' -i database/001_create.sql -C
```

O script cria `CieeCurriculos` e a tabela `dbo.Candidatos` caso não existam. Para uma instância que já tenha a base, ajuste o nome no script e em `DB_NAME` de forma consistente. Não registre senhas reais no repositório.

## Executar o backend

```bash
cd backend
cp .env.example .env
# Edite DB_SERVER, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD conforme sua instância.
npm install
npm run dev
```

No Windows PowerShell, use `Copy-Item .env.example .env` no lugar de `cp`. API em `http://localhost:3001`.

## Executar o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

No Windows PowerShell, use `Copy-Item .env.example .env`. Abra `http://localhost:5173`. Caso a porta ou endereço mude, ajuste `FRONTEND_ORIGIN` no backend e `VITE_API_URL` no frontend; reinicie ambos. Para gerar a versão de produção: `npm run build` na pasta `frontend`.

## Testes

```bash
cd backend
npm install
npm test
```

Os testes verificam regras de cadastro e a identificação de campos no texto extraído. Teste manual de ponta a ponta: cadastrar sem PDF, conferir listagem e detalhes; importar `exemplos/curriculo-ficticio.pdf`, revisar os campos, salvar e consultar; enviar um arquivo não PDF ou um PDF acima de 5 MB e confirmar que o formulário continua utilizável. Para validar persistência, reinicie a API e confirme que os registros permanecem na lista.

## API

| Método | Rota | Resultado |
| --- | --- | --- |
| `POST` | `/api/curriculos/extrair` | `multipart/form-data`, campo `arquivo`; devolve `dados` sugeridos, sem salvar |
| `POST` | `/api/candidatos` | JSON com `nomeCompleto`, `email`, `telefone`, `areaInteresse`, `resumoProfissional`; cria registro |
| `GET` | `/api/candidatos` | Lista registros |
| `GET` | `/api/candidatos/:id` | Exibe detalhes |

Nome e e-mail são obrigatórios; e-mail precisa ter formato válido. Limites: nome 200, e-mail 254, telefone 30, área 150 e resumo 3000 caracteres. A API valida novamente os dados mesmo quando o frontend já validou. A importação aceita apenas um PDF de até 5 MB, com extensão, MIME e assinatura `%PDF-` verificados. Erros da leitura retornam mensagem e permitem preencher manualmente.

## Limitações

A extração usa expressões regulares e heurística para linhas iniciais; pode confundir nomes, não detectar telefones em formatos pouco comuns e não encontra texto em PDFs que são apenas imagens (sem OCR). Nenhum PDF é armazenado. A listagem não tem paginação ou autenticação, recursos que seriam necessários em produção com muitos usuários e dados pessoais. O exemplo é fictício.
