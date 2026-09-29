# Registro do desenvolvimento

## Organização e execução

Dividi o desafio em API e banco, interface, documentação e verificação. Implementei primeiro um cadastro independente do PDF. Depois adicionei a leitura como preenchimento opcional do mesmo formulário e mantive uma única rota para salvar. Separei commits para mostrar as etapas. Antes da entrega, é necessário executar o roteiro de ponta a ponta em uma instância SQL Server e registrar o resultado real abaixo.

## Decisões técnicas

Escolhi React e Node.js por serem tecnologias permitidas e por reduzirem o número de linguagens necessárias neste projeto. Usei uma tabela simples no SQL Server, consultas parametrizadas para inserir e buscar por ID, e um script SQL repetível para criar a estrutura. O arquivo é lido em memória apenas durante a requisição, limitado a 5 MB, e não é armazenado. O backend extrai texto e tenta identificar os três campos; o usuário tem a decisão final ao revisar o formulário. Dados ausentes não bloqueiam o cadastro manual. Validações no frontend dão retorno rápido, e a API aplica as regras novamente.

## Uso de IA

Usei o ChatGPT (Codex, modelo GPT-6) para ajudar a estruturar o projeto, gerar um primeiro rascunho da API, da interface, dos testes e desta documentação. Exemplos de pedidos feitos nesta conversa: “transformar o enunciado do desafio em um projeto executável com React, Node.js e SQL Server”; “incluir os dois fluxos de cadastro usando o mesmo formulário”; “documentar o uso de IA de forma fiel”. Revisei o enunciado e organizei a solução em torno dos critérios da vaga. **O candidato deve revisar este relato e ajustar qualquer afirmação que não corresponda à sua própria participação antes de enviar.**

## Correções e adaptações

A extração é tratada como sugestão, não como cadastro automático. A validação ocorre novamente na API. A falha de leitura não impede digitar e salvar. As consultas usam parâmetros. O PDF de exemplo traz dados fictícios. Não usei OCR porque aumentaria a instalação e a complexidade para um desafio curto.

## Verificação

Os testes automatizados cobrem obrigatoriedade, formato do e-mail, limites e extração de dados de texto. A validação completa com SQL Server depende de executar o banco no ambiente do candidato. Preencher após executar:

- [ ] `npm test` no backend: resultado e data: ______
- [ ] `npm run build` no frontend: resultado e data: ______
- [ ] Cadastro manual, listagem e detalhes com SQL Server: ______
- [ ] Importação do PDF fictício, revisão e salvamento: ______
- [ ] PDF inválido/grande e continuação manual: ______

## Tempo, dificuldades e melhorias

Tempo aproximado dedicado pelo candidato: **preencher com o tempo real antes da entrega**. Dificuldades observadas: PDFs têm formatos diferentes e podem conter somente imagens; reconhecer nome por uma linha de texto é incerto. Com mais tempo, eu acrescentaria testes de integração com SQL Server, paginação, autenticação e autorização, política de retenção de dados e OCR para documentos digitalizados.
