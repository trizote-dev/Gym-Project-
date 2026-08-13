const btnEntrar = document.getElementById('btn-entrar');
const btnCadastrar = document.getElementById('btn-cadastrar');

btnEntrar.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'entrar.html';
});

btnCadastrar.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'cadastro.html';
});