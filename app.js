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
                            infoEndereco.textContent = `Você está em ${cidade}\n${estado}`;
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

    const treinosPorModalidade = {
        'Natação': 'Nado livre 40min + técnica de respiração',
        'Boxe': 'Combinação de socos + trabalho de esquiva',
        'Jiu-Jitsu Brasileiro (BJJ)': 'Passagem de guarda + quedas',
        'Capoeira': 'Ginga + floreios + música',
        'Musculação': 'Treino de Peito e Ombro'
    };

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
            const campoPesquisa = document.getElementById('campo-pesquisa');
            const selectOrdenacao = document.getElementById('select-ordenacao');
            const contadorResultados = document.getElementById('contador-resultados');

            function renderModalidades() {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuarioAtual = usuarios.find(function(u) {
                    return u.email === email;
                });
                const modalidades = (usuarioAtual && usuarioAtual.modalidades) || [];

                if (modalidades.length === 0) {
                    listaModalidades.innerHTML = '<p>Você ainda não adicionou nenhuma modalidade. <a href="index.html" style="color:#ffd700;">Ver modalidades disponíveis</a>.</p>';
                    valorTotalEl.textContent = '';
                    if (contadorResultados) contadorResultados.textContent = '';
                    return;
                }

                const termoBusca = campoPesquisa ? campoPesquisa.value.toLowerCase().trim() : '';
                const ordem = selectOrdenacao ? selectOrdenacao.value : 'asc';

                let modalidadesFiltradas = modalidades.filter(function(m) {
                    const treino = (treinosPorModalidade[m.nome] || '').toLowerCase();
                    return m.nome.toLowerCase().includes(termoBusca) || treino.includes(termoBusca);
                });

                modalidadesFiltradas.sort(function(a, b) {
                    if (ordem === 'asc') {
                        return a.nome.localeCompare(b.nome);
                    } else {
                        return b.nome.localeCompare(a.nome);
                    }
                });

                if (contadorResultados) {
                    contadorResultados.textContent = 'Registros encontrados: ' + modalidadesFiltradas.length;
                }

                if (modalidadesFiltradas.length === 0) {
                    listaModalidades.innerHTML = '<p style="color: #ff4d4d; font-weight: bold;">Nenhum registro encontrado</p>';
                    valorTotalEl.textContent = '';
                    return;
                }

                let valorTotal = 0;
                let htmlCards = '';

                modalidades.forEach(function(m) {
                    valorTotal += m.valor;
                });

                modalidadesFiltradas.forEach(function(modalidade) {
                    const treino = treinosPorModalidade[modalidade.nome] || 'Treino combinado com o instrutor';
                    htmlCards += '<article class="card-info card-modalidade">' +
                        '<div>' +
                        '<h3>' + modalidade.nome + '</h3>' +
                        '<p class="card-destaque">R$ ' + modalidade.valor + '/mês</p>' +
                        '<p class="treino-modalidade">Treino de hoje: ' + treino + '</p>' +
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

            if (campoPesquisa) {
                campoPesquisa.addEventListener('input', renderModalidades);
            }

            if (selectOrdenacao) {
                selectOrdenacao.addEventListener('change', renderModalidades);
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

    const btnSalvarTxt = document.getElementById('btn-salvar-txt');
    if (btnSalvarTxt) {
        btnSalvarTxt.addEventListener('click', function() {
            const form = document.getElementById('formCadastro');

            if (!form.reportValidity()) {
                return;
            }

            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;
            const cep = document.getElementById('cep').value;
            const telefone = document.getElementById('telefone').value;

            const conteudo =
                'CADASTRO - GOLD\'S GYM\n' +
                '----------------------\n' +
                'Nome: ' + nome + '\n' +
                'CPF: ' + cpf + '\n' +
                'E-mail: ' + email + '\n' +
                'CEP: ' + cep + '\n' +
                'Telefone: ' + telefone + '\n';

            const arquivo = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(arquivo);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'cadastro.txt';
            link.click();

            URL.revokeObjectURL(url);
        });
    }

    const btnSalvarCsv = document.getElementById('btn-salvar-csv');
    if (btnSalvarCsv) {
        btnSalvarCsv.addEventListener('click', function() {
            const form = document.getElementById('formCadastro');

            if (!form.reportValidity()) {
                return;
            }

            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;
            const cep = document.getElementById('cep').value;
            const telefone = document.getElementById('telefone').value;

            const cabecalho = 'Nome;CPF;E-mail;CEP;Telefone\n';
            const dados = `"${nome}";"${cpf}";"${email}";"${cep}";"${telefone}"\n`;
            const conteudoCsv = cabecalho + dados;

            const arquivo = new Blob(['\uFEFF' + conteudoCsv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(arquivo);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'cadastro.csv';
            link.click();

            URL.revokeObjectURL(url);
        });
    }

    const inputCsvImportar = document.getElementById('input-csv-importar');
    if (inputCsvImportar) {
        inputCsvImportar.addEventListener('change', function(e) {
            const arquivo = e.target.files[0];
            if (!arquivo) return;

            const leitor = new FileReader();
            leitor.onload = function(evento) {
                const conteudo = evento.target.result;
                const linhas = conteudo.split(/\r\n|\n/);

                if (linhas.length > 1 && linhas[1].trim() !== '') {
                    const valores = linhas[1].split(';').map(v => v.replace(/^"|"$/g, '').trim());

                    if (valores.length >= 5) {
                        document.getElementById('nome').value = valores[0] || '';
                        document.getElementById('cpf').value = valores[1] || '';
                        document.getElementById('email').value = valores[2] || '';
                        document.getElementById('cep').value = valores[3] || '';
                        document.getElementById('telefone').value = valores[4] || '';
                        
                        alert('Dados do arquivo CSV importados com sucesso!');
                    } else {
                        alert('O formato do CSV não é compatível.');
                    }
                } else {
                    alert('Arquivo CSV vazio ou sem dados válidos.');
                }
            };

            leitor.readAsText(arquivo, 'UTF-8');
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