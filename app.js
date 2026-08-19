const painel = document.getElementById('painel');

if (painel) {
    if (localStorage.getItem('logado') !== 'sim') {
        window.location.href = 'entrar.html';
    } else {
    
        const email = localStorage.getItem('emailLogado');
        const saudacao = document.getElementById('saudacao');
        if (saudacao && email) {
            saudacao.textContent = 'Olá, ' + email;
        }
    }
}

const btnEntrar = document.getElementById('btn-entrar');
const btnCadastrar = document.getElementById('btn-cadastrar');

if (btnEntrar) {
    btnEntrar.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'entrar.html';
    });
}

if (btnCadastrar) {
    btnCadastrar.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'cadastro.html';
    });
}

const formEntrar = document.getElementById('formEntrar');

if (formEntrar) {
    formEntrar.addEventListener('submit', function(event) {

        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        if (email === 'aluno@goldsgym.com' && senha === '123456') {

            localStorage.setItem('logado', 'sim');
            localStorage.setItem('emailLogado', email);


            window.location.href = 'area-membro.html';
        } else {
            alert('E-mail ou senha incorretos. Tente novamente.');
        }
    });
}

const btnSair = document.getElementById('btn-sair');

if (btnSair) {
    btnSair.addEventListener('click', function(event) {

        event.preventDefault();

        const confirmou = confirm('Tem certeza que deseja sair?');

        if (confirmou) {

            localStorage.removeItem('logado');
            localStorage.removeItem('emailLogado');


            window.location.href = event.target.getAttribute('href');
        }
    });
}