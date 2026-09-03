// --- CONFIGURAÇÃO ---
const seuNumero = "5519971085994"; 
const SENHA_ADMIN = "Caio25"; 

// Banco de dados local inicializado de forma limpa
let dadosEnquete = JSON.parse(localStorage.getItem('oficina_enquete')) || {
    total: 0,
    totalPontos: 0,
    cargos: {
        "Mecânico / Técnico": 0, 
        "Auxiliar de Mecânico / Ajudante": 0, 
        "Chefe de Oficina / Gerente": 0, 
        "Atendente / Balconista de Peças": 0, 
        "Dono / Proprietário": 0, 
        "Outros / Cargos": 0
    },
    p1: { "Procurar peças": 0, "Mão suja no papel": 0, "Furo no estoque": 0, "Erro de aplicação": 0 },
    p2: { "Digitar sozinho": 0, "Entender gírias": 0, "Prefiro tradicional": 0 },
    p3: { "Melhorar organização": 0, "Aumentar eficiência": 0, "Reduzir tempo de espera": 0 },
    p4: { "Muito boa": 0, "Boa": 0, "Regular": 0, "Ruim": 0 },
    p5: { "Perder serviço por falta de peça": 0, "Comprar peças repetidas": 0, "Mecânico parado esperando peça": 0, "Peça antiga estragando": 0 },
    p6: { "Ler código de barras pelo celular": 0, "Alerta automático de peça acabando": 0, "Ver quem usou e em qual carro": 0, "Cadastrar peça por foto da nota": 0 },
    p7: { "Pegar peça e esquecer de dar baixa": 0, "Cadastrar peça com nomes diferentes": 0, "Ter que ir ao computador toda hora": 0, "Correria do dia a dia impede": 0 },
    p8: { "Garantir que todos lancem tudo sempre": 0, "Falta de conhecimento das funções": 0, "Costume dos funcionários antigos": 0, "Aplicativo travar pela rede": 0 }
};

// MAPA DE PONTOS (Princípio do Código Limpo)
const tabelaPontos = {
    "Furo no estoque": 4, "Procurar peças": 3, "Erro de aplicação": 2, "Mão suja no papel": 1,
    "Entender gírias": 4, "Digitar sozinho": 3, "Prefiro tradicional": 1,
    "Reduzir tempo de espera": 4, "Aumentar eficiência": 3, "Melhorar organização": 2,
    "Ruim": 4, "Regular": 3, "Boa": 2, "Muito boa": 1,
    "Perder serviço por falta de peça": 4, "Comprar peças repetidas": 3, "Mecânico parado esperando peça": 2, "Peça antiga estragando": 1,
    "Ler código de barras pelo celular": 4, "Alerta automático de peça acabando": 3, "Ver quem usou e em qual carro": 2, "Cadastrar peça por foto da nota": 1,
    "Pegar peça e esquecer de dar baixa": 4, "Cadastrar peça com nomes diferentes": 3, "Ter que ir ao computador toda hora": 2, "Correria do dia a dia impede": 1,
    "Garantir que todos lancem tudo sempre": 4, "Falta de conhecimento das funções": 3, "Costume dos funcionários antigos": 2, "Aplicativo travar pela rede": 1
};

// Inicialização da página
atualizarGraficos();
verificarAdmin();

function verificarAdmin() {
    const urlParams = new URLSearchParams(window.location.search);
    const botaoZerar = document.getElementById('btnZerar');
    if (botaoZerar) {
        botaoZerar.style.display = urlParams.get('admin') === SENHA_ADMIN ? "block" : "none";
    }
}

function processarResposta(event) {
    // 🛑 EVITA QUE O NAVEGADOR RECARREGUE A PÁGINA ANTES DA HORA
    if (event) event.preventDefault();

    const form = document.getElementById('quizForm');
    const cargo = document.querySelector('input[name="cargo"]:checked')?.value || "";
    
    if (cargo === "" || !form.checkValidity()) {
        alert("Por favor, selecione seu cargo e responda todas as perguntas!");
        return;
    }

    if (dadosEnquete.cargos[cargo] !== undefined) {
        dadosEnquete.cargos[cargo] += 1;
    }

    let pontosRodada = 0;
    let respostas = {};

    // Captura as respostas dinamicamente de p1 a p8
    for (let i = 1; i <= 8; i++) {
        const marcada = document.querySelector(`input[name="p${i}"]:checked`).value;
        respostas[`r${i}`] = marcada;
        pontosRodada += tabelaPontos[marcada] || 0;
        dadosEnquete[`p${i}`][marcada] += 1;
    }

    dadosEnquete.total += 1;
    dadosEnquete.totalPontos += pontosRodada;

    localStorage.setItem('oficina_enquete', JSON.stringify(dadosEnquete));
    atualizarGraficos();
    form.reset();

    // 1. PRIMEIRO: Ativa e mostra a tela de despedida imediatamente
    const desv = document.getElementById('despedidaScreen');
    if (desv) {
        desv.classList.add('mostrar');
    }

    // Monta o texto organizando as quebras de linha com \n
    const textoMensagem = `*Nova Resposta da Pesquisa* 🛠️\n\n` +
                          `*👤 Cargo:* ${cargo}\n\n` +
                          `*Pontuação Total:* ${pontosRodada} pts\n\n` +
                          `*1. Obstáculo:* ${respostas.r1}\n*2. IA:* ${respostas.r2}\n*3. Melhoria:* ${respostas.r3}\n*4. Tecnologia:* ${respostas.r4}\n` +
                          `*5. Prejuízo:* ${respostas.r5}\n*6. App Ideal:* ${respostas.r6}\n*7. Dificuldade:* ${respostas.r7}\n*8. Desafio:* ${respostas.r8}`;
        
    const linkWhatsApp = "https://wa.me/" + seuNumero + "?text=" + encodeURIComponent(textoMensagem);

    // 2. SEGUNDO: Abre o WhatsApp após 1 segundo (tempo para ver o foguete subir)
    setTimeout(() => {
        window.open(linkWhatsApp, '_blank');
    }, 1000); 

    // 3. TERCEIRO: Fecha a animação e reinicia a página após 3 segundos no total
    // Isso dá mais 2 segundos após a abertura do WhatsApp para o site resetar sozinho de fundo
    setTimeout(() => {
        if (desv) {
            desv.classList.remove('mostrar');
        }
        location.reload(); 
    }, 6000); 
}

function atualizarGraficos() {
    const total = dadosEnquete.total;
    let mediaGeral = total > 0 ? (dadosEnquete.totalPontos / total).toFixed(1) : 0;

    // Controla o botão de zerar
    const botaoZerar = document.getElementById('btnZerar');
    if (botaoZerar && total > 0) {
        verificarAdmin(); // Mantém o filtro de senha admin ativo
    }

    // Configura a seção consolidada de totais e listagem de respostas por função
    let textoPainel = `Total de respostas computadas: ${total}<br>` +
        `<strong style="color: #25d366; font-size: 1.1em;">Índice Geral de Urgência Tecnológica: ${mediaGeral} / 31.0 pts</strong>`;
    
    textoPainel += `<p style="color: #17b978; margin-bottom: 5px; font-weight: bold;">👥 Respostas por Função:</p>`;
    textoPainel += `<div class="cargo-card-container">`;

    // Mapeia ícones mecânicos para cada cargo de forma estilosa
    const iconesCargos = {
        "Mecânico / Técnico": "🛠️", 
        "Auxiliar de Mecânico / Ajudante": "🧰", 
        "Chefe de Oficina / Gerente": "📋", 
        "Atendente / Balconista de Peças": "📦", 
        "Dono / Proprietário": "👑", 
        "Outros / Cargos": "👥"
    };
    
    for (let nomeCargo in dadosEnquete.cargos) {
        let qtdVotos = dadosEnquete.cargos[nomeCargo] || 0;
        let icone = iconesCargos[nomeCargo] || "👤";

        textoPainel += `
            <div class="cargo-card">
                <span style="font-size: 1.2em; margin-right: 5px;">${icone}</span>
                <span style="font-size: 0.85em; display: block; color: #a0aec0; margin-top: 2px;">${nomeCargo}</span>
                <strong style="font-size: 1.2em;">${qtdVotos} <span style="font-size: 0.7em; font-weight: normal; color: #17b978;">votos</span></strong>
            </div>`;
    }
    textoPainel += `</div>`;
    
    document.getElementById('totalVotos').innerHTML = textoPainel;
    
    let html = "";
    const perguntas = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
    const titulos = [
        "Obstáculo mais votado:", "Preferência sobre IA/Voz:", "Melhorias mais Desejadas:", "Avaliação sobre a Tecnologia:",
        "Principais Prejuízos de Estoque:", "Funções Mais Desejadas no App:", "Dificuldades do Sistema Atual:", "Desafios de Implementação:"
    ];

    for(let i = 0; i < perguntas.length; i++) {
        html += `<p style="color: #17b978; margin-top: 25px; text-align: left; font-weight: bold;">${titulos[i]}</p>`;
        for (let chave in dadosEnquete[perguntas[i]]) {
            let votos = dadosEnquete[perguntas[i]][chave];
            let porc = total > 0 ? Math.round((votos / total) * 100) : 0;
            
            html += `
                <div class="chart-item">
                    <div class="bar-text">
                        <span>${chave} (${votos} votos)</span>
                        <strong>${porc}%</strong>
                    </div>
                    <div class="bar-container">
                        <div class="bar" id="barra-${perguntas[i]}-${chave.replace(/\s+/g, '')}" style="width: 0%"></div>
                    </div>
                </div>`;
        }
    }
    
    document.getElementById('estatisticas').innerHTML = html;

    // Dispara a animação fluida para o crescimento das barras de progresso
    setTimeout(() => {
        for(let i = 0; i < perguntas.length; i++) {
            for (let chave in dadosEnquete[perguntas[i]]) {
                let votos = dadosEnquete[perguntas[i]][chave];
                let porc = total > 0 ? Math.round((votos / total) * 100) : 0;
                const elementoBarra = document.getElementById(`barra-${perguntas[i]}-${chave.replace(/\s+/g, '')}`);
                if (elementoBarra) {
                    elementoBarra.style.width = porc + "%"; 
                }
            }
        }
    }, 100);
}
// Inicializa o tema salvo pelo usuário ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('oficina_tema') || 'claro';
    document.body.classList.add('tema-' + temaSalvo);
    const btn = document.getElementById('btnTema');
    if (btn) {
        btn.innerHTML = temaSalvo === 'escuro' ? "☀️ Claro" : "🌙 Escuro";
    }
});

// Remove a tela de boas-vindas após o carregamento inicial
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) splash.classList.add('esconder');
    }, 2000); // 2000 milissegundos = 2 segundos de exibição
});

// Função Inteligente da Barra de Busca por Perguntas
function buscarPergunta() {
    const termo = document.getElementById('campoBusca').value.toLowerCase().trim();
    
    // Mapeia o que o usuário pode digitar para o endereço (ID) correto na tela
    const mapaIds = {
        "cargo": "pergunta-cargo",
        "cargos": "pergunta-cargo",
        "p1": "p1", "pergunta 1": "p1", "1": "p1",
        "p2": "p2", "pergunta 2": "p2", "2": "p2",
        "p3": "p3", "pergunta 3": "p3", "3": "p3",
        "p4": "p4", "pergunta 4": "p4", "4": "p4",
        "p5": "p5", "pergunta 5": "p5", "5": "p5",
        "p6": "p6", "pergunta 6": "p6", "6": "p6",
        "p7": "p7", "pergunta 7": "p7", "7": "p7",
        "p8": "p8", "pergunta 8": "p8", "8": "p8",
        "grafico": "painel-estatisticas", "graficos": "painel-estatisticas", 
        "painel": "painel-estatisticas", "estatisticas": "painel-estatisticas"
    };

    if (mapaIds[termo]) {
        const elementoDestino = document.getElementById(mapaIds[termo]);
        if (elementoDestino) {
            elementoDestino.scrollIntoView({ behavior: "smooth" });
        }
    }
}
// Função para Alternar entre Tema Claro e Escuro
function alternarTema() {
    const body = document.body;
    const btn = document.getElementById('btnTema');
    
    if (body.classList.contains('tema-escuro')) {
        body.classList.remove('tema-escuro');
        body.classList.add('tema-claro');
        btn.innerHTML = "🌙 Escuro";
        localStorage.setItem('oficina_tema', 'claro');
    } else {
        body.classList.remove('tema-claro');
        body.classList.add('tema-escuro');
        btn.innerHTML = "☀️ Claro";
        localStorage.setItem('oficina_tema', 'escuro');
    }
}
// Abre e fecha o menu hambúrguer no celular
function alternarMenuMobile() {
    const menu = document.getElementById('menuBotoes');
    menu.classList.toggle('aberto');
}

// Fecha o menu automaticamente quando o usuário clica em algum número para rolar a tela
function fecharMenuMobile() {
    const menu = document.getElementById('menuBotoes');
    if (menu) {
        menu.classList.remove('aberto');
    }
}
function limparDados() {
    if (confirm("Tem certeza que deseja zerar todas as porcentagens da enquete?")) {
        localStorage.removeItem('oficina_enquete');
        location.reload(); 
    }
}
1
