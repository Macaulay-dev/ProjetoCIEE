# Registro do desenvolvimento

## Organização e execução

Organizei o trabalho em configuração do ambiente, execução da aplicação, verificação dos requisitos e documentação. Usei uma base de código gerada com auxílio de IA, organizada em frontend React, backend Node.js e script de criação do banco SQL Server. A base foi entregue com commits separados para API, interface, documentação e ajustes.

Minha participação incluiu instalar e configurar o SQL Server, executar o script do banco, ajustar as variáveis de ambiente, iniciar frontend e backend no VS Code, testar os fluxos e acompanhar a solução dos erros com orientação da IA. Não desenvolvi toda a base de código manualmente; usei a IA também para gerar código e esclarecer a execução.

## Decisões técnicas

Usei React no frontend para organizar a interface e controlar os dados do formulário. No backend, usei Node.js com Express para receber as requisições, validar os dados e acessar o SQL Server. O banco tem uma tabela de candidatos, criada por um script que pode ser executado novamente sem recriar a estrutura existente. As consultas de inserção e busca por ID usam parâmetros para tratar os valores recebidos com segurança.
Mantive o mesmo formulário para o cadastro manual e a importação de currículo, evitando duplicar a lógica de salvamento. O PDF é opcional e serve para ajudar no preenchimento: o backend lê o texto e tenta identificar nome, e-mail e telefone. Antes de salvar, o usuário pode corrigir as informações encontradas e completar os campos que ficaram vazios.

Limitei o PDF a 5 MB e mantive o processamento em memória, sem guardar o documento. Coloquei validações no frontend para mostrar os erros rapidamente e no backend para conferir os dados antes de salvar. A validação do e-mail verifica apenas o formato, sem confirmar se o endereço existe.

## Dificuldades

Durante a execução, encontrei dificuldades com o frontend abrindo em branco, a conexão com a API e o login no SQL Server. Analisei as mensagens do terminal para identificar o que precisava ajustar.
Corrigi a forma de iniciar a aplicação, executando os comandos nas pastas do frontend e do backend. Também configurei o TCP/IP do SQL Server e ajustei as credenciais e a conexão no arquivo .env.

Depois dos ajustes, executei os testes automatizados e conferi pela interface o cadastro manual, a importação do PDF, a listagem e os detalhes dos candidatos. 

Um detalhe importante foi sobre as linguagens pois na faculdade atualmente estou tendo matéria de angular mas decidi escolher o React por ser mais um desafio e aprender mais uma linguagem.

## Correções e adaptações

Durante a execução:

- A abertura direta do index.html, substituída pela execução do frontend com Vite.
- A porta 3001 ocupada por uma execução anterior da API.
- A configuração de TCP/IP e da porta 1433 do SQL Server.
- A falha de autenticação do usuário sa, verificando o modo de autenticação, redefinindo a senha e ajustando o backend/.env.
- A localização do sqlcmd pelo caminho completo, pois o terminal não o encontrava pelo PATH.


## Verificação

Em 02/010/2026, executei no meu ambiente Windows:

- npm test no backend: 3 testes passaram, sem falhas. Cobrem campos obrigatórios, formato do e-mail, campos opcionais, limites e identificação de dados no texto.
- npm run build no frontend: compilação de produção concluída com Vite 5.4.15.
- Consulta da API ao SQL Server: a listagem inicialmente retornou uma lista vazia, confirmando o acesso ao banco.

Realizei e confirmei os testes manuais de cadastro sem PDF, listagem, detalhes e permanência dos dados após atualizar a página. Um e-mail com formato inválido foi rejeitado.

Com um currículo em PDF, nome, e-mail e telefone foram preenchidos automaticamente. Com um PDF sem os dados esperados, consegui completar o formulário manualmente e salvar. Também confirmei os testes de rejeição de arquivo que não fosse PDF e de PDF acima do limite de 5 MB, com mensagens de erro.

Os testes automatizados são testes das funções de validação e identificação de dados. A integração completa com SQL Server foi verificada manualmente; não há uma suíte automatizada de integração ou de navegador.

## Tempo e dificuldades

Dediquei aproximadamente 6 horas para o pensamento e decisão do desafio até estruturar ele completo, incluindo instalação, configuração, execução e testes. A preparação final da documentação, revisão e publicação 3 dias.

As principais dificuldades foram configurar a conexão com SQL Server, distinguir comandos de terminal de configurações do arquivo .env.

## Limitações e melhorias

A extração depende de texto disponível no PDF. Documentos digitalizados como imagem não são reconhecidos sem OCR. O nome é identificado por heurísticas e pode ser confundido com um título; diferentes layouts podem gerar sugestões incompletas ou incorretas. Por isso, a revisão manual é necessária.

Com mais tempo, acrescentaria testes automatizados de integração com SQL Server e da interface, paginação, autenticação e autorização, um usuário de banco específico para a aplicação com permissões restritas, política de retenção de dados e OCR. Também aprofundaria minha compreensão do código para explicar e evoluir cada parte da solução.


## Uso de inteligência artificial

Utilizei o ChatGPT com Codex, durante a estruturação e revisão do projeto.

A IA ajudou nas seguintes etapas:

- criação da estrutura inicial do frontend, backend e banco;
- implementação da leitura e validação do PDF;
- elaboração inicial dos testes;
- investigação de erros de conexão com SQL Server;
- revisão da documentação.

Exemplos resumidos de pedidos:

- "Crie uma API Node.js com Express e SQL Server para cadastrar e listar candidatos."
- "Implemente o envio de um PDF opcional de até 5 MB e extraia nome, e-mail e telefone."
- "Revise o projeto conforme os requisitos do desafio e identifique divergências."
