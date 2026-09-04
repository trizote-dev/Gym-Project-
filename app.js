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

    const navVisitante = document.getElementById('nav-visitante');
    const navLogado = document.getElementById('nav-logado');

    if (navVisitante && navLogado) {
        if (localStorage.getItem('logado') === 'sim') {
            navVisitante.style.display = 'none';
            navLogado.style.display = 'flex';
        } else {
            navVisitante.style.display = 'flex';
            navLogado.style.display = 'none';
        }
    }

    const btnSairHome = document.getElementById('btn-sair-home');
    if (btnSairHome) {
        btnSairHome.addEventListener('click', function(event) {
            event.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('logado');
                localStorage.removeItem('emailLogado');
                localStorage.removeItem('nomeLogado');
                window.location.reload();
            }
        });
    }

    const botoesEsporte = document.querySelectorAll('.btn-esporte');
    botoesEsporte.forEach(function(botao) {
        botao.addEventListener('click', function(event) {
            event.preventDefault();

            if (localStorage.getItem('logado') !== 'sim') {
                alert('Você precisa entrar (ou se cadastrar) antes de adicionar uma modalidade.');
                window.location.href = 'entrar.html';
                return;
            }

            const card = botao.closest('.card-esporte');
            const nomeModalidade = card.dataset.modalidade;
            const valorModalidade = Number(card.dataset.valor);

            const emailAtual = localStorage.getItem('emailLogado');
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuario = usuarios.find(function(u) {
                return u.email === emailAtual;
            });

            if (!usuario) {
                return;
            }

            if (!usuario.modalidades) {
                usuario.modalidades = [];
            }

            const jaTem = usuario.modalidades.some(function(m) {
                return m.nome === nomeModalidade;
            });

            if (jaTem) {
                alert('Você já tem "' + nomeModalidade + '" no seu perfil.');
                return;
            }

            usuario.modalidades.push({ nome: nomeModalidade, valor: valorModalidade });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('"' + nomeModalidade + '" adicionada ao seu perfil!');
            window.location.href = 'area-membro.html';
        });
    });

    const painel = document.getElementById('painel');
    if (painel) {
        if (localStorage.getItem('logado') !== 'sim') {
            window.location.href = 'entrar.html';
        } else {
            const nome = localStorage.getItem('nomeLogado');
            const email = localStorage.getItem('emailLogado');
            const saudacao = document.getElementById('saudacao');
            if (saudacao) {
                saudacao.textContent = 'Olá, ' + (nome || email);
            }

            const listaModalidades = document.getElementById('lista-modalidades');
            const valorTotalEl = document.getElementById('valor-total');

            function renderModalidades() {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuarioAtual = usuarios.find(function(u) {
                    return u.email === email;
                });
                const modalidades = (usuarioAtual && usuarioAtual.modalidades) || [];

                if (modalidades.length === 0) {
                    listaModalidades.innerHTML = '<p>Você ainda não adicionou nenhuma modalidade. <a href="index.html" style="color:#ffd700;">Ver modalidades disponíveis</a>.</p>';
                    valorTotalEl.textContent = '';
                    return;
                }

                let valorTotal = 0;
                let htmlCards = '';

                modalidades.forEach(function(modalidade) {
                    valorTotal += modalidade.valor;
                    htmlCards += '<article class="card-info card-modalidade">' +
                        '<div>' +
                        '<h3>' + modalidade.nome + '</h3>' +
                        '<p class="card-destaque">R$ ' + modalidade.valor + '/mês</p>' +
                        '</div>' +
                        '<button class="btn-remover-esporte" data-nome="' + modalidade.nome + '">Remover</button>' +
                        '</article>';
                });

                listaModalidades.innerHTML = htmlCards;
                valorTotalEl.textContent = 'Total mensal das modalidades: R$ ' + valorTotal;

                const botoesRemover = listaModalidades.querySelectorAll('.btn-remover-esporte');
                botoesRemover.forEach(function(botao) {
                    botao.addEventListener('click', function() {
                        const nomeParaRemover = botao.dataset.nome;

                        if (!confirm('Remover "' + nomeParaRemover + '" do seu perfil?')) {
                            return;
                        }

                        const usuariosAtuais = JSON.parse(localStorage.getItem('usuarios')) || [];
                        const usuarioAtualizado = usuariosAtuais.find(function(u) {
                            return u.email === email;
                        });

                        usuarioAtualizado.modalidades = usuarioAtualizado.modalidades.filter(function(m) {
                            return m.nome !== nomeParaRemover;
                        });

                        localStorage.setItem('usuarios', JSON.stringify(usuariosAtuais));
                        renderModalidades();
                    });
                });
            }

            renderModalidades();
        }
    }

    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const jaExiste = usuarios.some(function(usuario) {
                return usuario.email === email;
            });

            if (jaExiste) {
                alert('Já existe uma conta com esse e-mail. Tente entrar em vez de cadastrar.');
                return;
            }

            usuarios.push({ nome: nome, email: email, senha: senha, modalidades: [] });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            localStorage.setItem('logado', 'sim');
            localStorage.setItem('emailLogado', email);
            localStorage.setItem('nomeLogado', nome);

            window.location.href = 'area-membro.html';
        });
    }

    const formEntrar = document.getElementById('formEntrar');
    if (formEntrar) {
        formEntrar.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioEncontrado = usuarios.find(function(usuario) {
                return usuario.email === email && usuario.senha === senha;
            });

            if (usuarioEncontrado) {
                localStorage.setItem('logado', 'sim');
                localStorage.setItem('emailLogado', usuarioEncontrado.email);
                localStorage.setItem('nomeLogado', usuarioEncontrado.nome);
                window.location.href = 'area-membro.html';
            } else {
                alert('E-mail ou senha incorretos, ou você ainda não se cadastrou.');
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
                localStorage.removeItem('nomeLogado');
                window.location.href = 'index.html';
            }
        });
    }
});