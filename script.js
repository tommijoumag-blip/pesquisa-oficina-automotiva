// --- CONFIGURAÇÃO ---
// CADASTRE SEU NÚMERO DO WHATSAPP AQUI EMBAIXO
const seuNumero = "5519971085994"; 
const SENHA_ADMIN = "Caio25"; 

// Banco de dados local inicializado de forma limpa
let dadosEnquete = JSON.parse(localStorage.getItem('oficina_enquete')) || {
    total: 0,
    totalPontos: 0,
    p1: { "Procurar peças": 0, "Mão suja no papel": 0, "Furo no estoque": 0, "Erro de aplicação": 0 },
    p2: { "Digitar sozinho": 0, "Entender gírias": 0, "Prefiro tradicional": 0 },
    p3: { "Melhorar organização": 0, "Aumentar eficiência": 0, "Reduzir tempo de espera": 0 },
    p4: { "Muito boa": 0, "Boa": 0, "Regular": 0, "Ruim": 0 },
    p5: { "Perder serviço por falta de peça": 0, "Comprar peças repetidas": 0, "Mecânico parado esperando peça": 0, "Peça antiga estragando": 0 },
    p6: { "Ler código de barras pelo celular": 0, "Alerta automático de peça acabando": 0, "Ver quem usou e em qual carro": 0, "Cadastrar peça por foto da nota": 0 },
    p7: { "Pegar peça e esquecer de dar baixa": 0, "Cadastrar peça com nomes diferentes": 0, "Ter que ir ao computador toda hora": 0, "Correria do dia a dia impede": 0 },
    p8: { "Garantir que todos lancem tudo sempre": 0, "Falta de conhecimento das funções": 0, "Costume dos funcionários antigos": 0, "Aplicativo travar pela rede": 0 }
};

// MAPA DE PONTOS (Princípio do Código Limpo: remove os IFs repetitivos)
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

function processarResposta() {
    const form = document.getElementById('quizForm');
    const cargoSelect = document.getElementById('cargo');
    
    if (cargoSelect.value === "" || !form.checkValidity()) {
        alert("Por favor, selecione seu cargo e responda todas as perguntas!");
        return;
    }

    const cargo = cargoSelect.value;
    let pontosRodada = 0;
    let respostas = {};

    // Captura as respostas dinamicamente de p1 a p8
    for (let i = 1; i <= 8; i++) {
        const marcada = document.querySelector(`input[name="p${i}"]:checked`).value;
        respostas[`r${i}`] = marcada;
        
        // Acumula os pontos buscando direto na tabela
        pontosRodada += tabelaPontos[marcada] || 0;
        
        // Registra o voto no objeto
        dadosEnquete[`p${i}`][marcada] += 1;
    }

    // Atualiza os totais globais
    dadosEnquete.total += 1;
    dadosEnquete.totalPontos += pontosRodada;

    localStorage.setItem('oficina_enquete', JSON.stringify(dadosEnquete));
    atualizarGraficos();

    // Monta o texto organizando as quebras de linha com \n
    const textoMensagem = `*Nova Resposta da Pesquisa* 🛠️\n\n` +
                          `*👤 Cargo:* ${cargo}\n\n` +
                          `*Pontuação Total:* ${pontosRodada} pts\n\n` +
                          `*1. Obstáculo:* ${respostas.r1}\n*2. IA:* ${respostas.r2}\n*3. Melhoria:* ${respostas.r3}\n*4. Tecnologia:* ${respostas.r4}\n` +
                          `*5. Prejuízo:* ${respostas.r5}\n*6. App Ideal:* ${respostas.r6}\n*7. Dificuldade:* ${respostas.r7}\n*8. Desafio:* ${respostas.r8}`;
        
    // Transforma o texto em um link universal correto para o navegador
    const linkWhatsApp = "https://wa.me/" + seuNumero + "?text=" + encodeURIComponent(textoMensagem);
        
    // Abre o WhatsApp em uma nova aba
    window.open(linkWhatsApp, '_blank');
    
    // Limpa o formulário para a próxima pessoa responder
    form.reset();
}

function atualizarGraficos() {
    const total = dadosEnquete.total;
    let mediaGeral = total > 0 ? (dadosEnquete.totalPontos / total).toFixed(1) : 0;
    
    document.getElementById('totalVotos').innerHTML = 
        `Total de respostas computadas: ${total}<br>` +
        `<strong style="color: #25d366; font-size: 1.1em;">Índice Geral de Urgência Tecnológica: ${mediaGeral} / 31.0 pts</strong>`;
    
    let html = "";
    const perguntas = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
    const titulos = [
        "Obstáculo mais votado:", "Preferência sobre IA/Voz:", "Melhorias mais Desejadas:", "Avaliação sobre a Tecnologia:",
        "Principais Prejuízos de Estoque:", "Funções Mais Desejadas no App:", "Dificuldades do Sistema Atual:", "Desafios de Implementação:"
    ];

    // Geração do HTML limpo de todas as perguntas
    for(let i = 0; i < perguntas.length; i++) {
        html += `<p style="color: #17b978; margin-top: 25px;">${titulos[i]}</p>`;
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
    
    // 1. PRIMEIRO: Colocamos os elementos visuais na tela
    document.getElementById('estatisticas').innerHTML = html;

    // 2. SEGUNDO: Disparamos a animação para as barras crescerem suavemente (Fora dos loops!)
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

function limparDados() {
    if (confirm("Tem certeza que deseja zerar todas as porcentagens da enquete?")) {
        localStorage.removeItem('oficina_enquete');
        location.reload(); 
    }
}