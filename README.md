# GOLD'S GYM 🏋️

Site institucional para um CT (Centro de Treinamento) de esportes, com sistema de cadastro, login e uma área do aluno onde cada usuário monta seu próprio perfil de modalidades. Projeto acadêmico em desenvolvimento, feito com HTML, CSS e JavaScript puro (sem frameworks).

## ✨ Funcionalidades

- **Landing page** com apresentação do CT e as modalidades disponíveis (Natação, Boxe, Jiu-Jitsu, Capoeira, Musculação), cada uma com seu valor mensal.
- **Cadastro e login** de usuários, com validação de e-mail/senha.
- **Área do aluno**, exclusiva para quem está logado, mostrando:
  - Saudação personalizada com o nome do usuário
  - As modalidades que o usuário adicionou ao próprio perfil
  - O valor total mensal das modalidades escolhidas
  - Opção de remover uma modalidade do perfil
- **Menu dinâmico**: a página inicial muda de "Entrar/Cadastrar" para "Minha Área/Sair" conforme o usuário está logado ou não.
- **Geolocalização**: botão que usa a localização do navegador para informar em qual cidade/estado o usuário está (via API do OpenStreetMap/Nominatim).
- Proteção de rota simples: quem não está logado não consegue acessar a área do aluno diretamente pela URL.

## 🛠️ Tecnologias

- HTML5
- CSS3 (Grid e Flexbox para o layout responsivo)
- JavaScript (vanilla, sem bibliotecas)
- `localStorage` do navegador, usado como um banco de dados simples enquanto o projeto não tem backend

## 📁 Estrutura do projeto

```
├── index.html          # Página inicial (landing page)
├── cadastro.html        # Formulário de cadastro
├── entrar.html           # Formulário de login
├── area-membro.html     # Área exclusiva do aluno logado
├── style.css              # Estilos gerais do site
├── cadastro.css          # Estilos compartilhados de cadastro e login
├── area-membro.css      # Estilos da área do aluno
└── app.js                 # Toda a lógica do site (login, cadastro, modalidades, geolocalização)
```

## 🚀 Como rodar localmente

Não precisa de instalação nem de servidor — é só abrir o `index.html` direto no navegador.

```bash
git clone https://github.com/trizote-dev/Gym-Project-.git
cd Gym-Project-
```

Depois é só abrir o arquivo `index.html` no navegador de sua preferência.

## 🧭 Como testar o fluxo completo

1. Abra `index.html` e clique em **Cadastrar**.
2. Preencha o formulário e envie — você será redirecionado(a) já logado(a) para a Área do Aluno.
3. Volte para a página inicial e adicione uma ou mais modalidades clicando em **Adicionar Esporte**.
4. Acesse **Minha Área** para ver as modalidades escolhidas e o valor total mensal.
5. Use **Sair** para deslogar, ou **Início** para voltar à página inicial sem sair da conta.

## 🗺️ Roadmap

- [ ] Migrar o armazenamento de usuários e modalidades do `localStorage` para um banco de dados MySQL
- [ ] Criar um backend (PHP ou Node.js) para autenticação e persistência real dos dados
- [ ] Adicionar máscara/validação nos campos de CPF, telefone e CEP
- [ ] Melhorar a acessibilidade dos cards de modalidade

## 👤 Autor

Projeto acadêmico desenvolvido para a disciplina de desenvolvimento web.
