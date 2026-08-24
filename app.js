document.addEventListener('DOMContentLoaded', () => {

    const btnLocalizacao = document.getElementById('btn-localizacao');
    const statusLocalizacao = document.getElementById('status-localizacao');
    const infoEndereco = document.getElementById('info-endereco');

    if (btnLocalizacao) {
        btnLocalizacao.addEventListener('click', () => {
            if (!navigator.geolocation) {
                statusLocalizacao.textContent = 'A geolocalização não é suportada pelo seu navegador.';
                return;
            }

            statusLocalizacao.textContent = 'Obtendo sua localização...';

            navigator.geolocation.getCurrentPosition(
                async (posicao) => {
                    const latitude = posicao.coords.latitude;
                    const longitude = posicao.coords.longitude;

                    statusLocalizacao.textContent = `Coordenadas: Lat ${latitude.toFixed(4)}, Long ${longitude.toFixed(4)}`;

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();

                        if (data && data.address) {
                            const cidade = data.address.city || data.address.town || data.address.village || 'sua região';
                            const estado = data.address.state || '';
                            infoEndereco.textContent = `Você está em ${cidade} - ${estado}`;
                        }
                    } catch (erro) {
                        console.error('Erro ao buscar o endereço:', erro);
                    }
                },
                (erro) => {
                    switch(erro.code) {
                        case erro.PERMISSION_DENIED:
                            statusLocalizacao.textContent = 'Permissão para obter localização negada pelo usuário.';
                            break;
                        case erro.POSITION_UNAVAILABLE:
                            statusLocalizacao.textContent = 'Informações de localização indisponíveis.';
                            break;
                        case erro.TIMEOUT:
                            statusLocalizacao.textContent = 'A requisição para obter a localização expirou.';
                            break;
                        default:
                            statusLocalizacao.textContent = 'Ocorreu um erro desconhecido ao obter a localização.';
                            break;
                    }
                }
            );
        });
    }

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
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('logado');
                localStorage.removeItem('emailLogado');
                window.location.href = 'index.html';
            }
        });
    }
});