// ==========================================
// PÍ INTERATIVA • PROFESSOR PÍ MATH 2026
// JavaScript Completo com Mascote 3D de Corpo Inteiro,
// Laboratório, Lousa, Tabela-Verdade, Chat, Quiz & Scroll Companion
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------
    // GERENCIAMENTO DE ÁUDIO & VOZ (SINTETIZADOR)
    // ------------------------------------------
    let soundEnabled = true;
    let voiceEnabled = true;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSound(type) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'toggle') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'poke') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(550, now);
                osc.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(700, now);
                osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'success') {
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, now + i * 0.08);
                    g.gain.setValueAtTime(0.15, now + i * 0.08);
                    g.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
                    o.start(now + i * 0.08);
                    o.stop(now + i * 0.08 + 0.35);
                });
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(250, now);
                osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'easter') {
                [440, 554, 659, 880, 1108].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + i * 0.1);
                    g.gain.setValueAtTime(0.2, now + i * 0.1);
                    g.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.25);
                    o.start(now + i * 0.1);
                    o.stop(now + i * 0.1 + 0.25);
                });
            }
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    function speakText(text) {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[\*\_\#\&]/g, '').replace(/→/g, 'implica').replace(/↔/g, 'se e somente se').replace(/¬/g, 'não');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.1;
            utterance.pitch = 1.2;

            const voices = window.speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang.includes('pt') || v.lang.includes('BR'));
            if (ptVoice) utterance.voice = ptVoice;

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.log('Speech error:', e);
        }
    }

    const btnToggleSound = document.getElementById('btnToggleSound');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');

    if (btnToggleSound) {
        btnToggleSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
            soundLabel.textContent = `Som: ${soundEnabled ? 'ON' : 'OFF'}`;
            if (soundEnabled) playSound('click');
        });
    }

    const btnToggleVoice = document.getElementById('btnToggleVoice');
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceLabel = document.getElementById('voiceLabel');

    if (btnToggleVoice) {
        btnToggleVoice.addEventListener('click', () => {
            voiceEnabled = !voiceEnabled;
            voiceIcon.textContent = voiceEnabled ? '🗣️' : '🤫';
            voiceLabel.textContent = `Voz: ${voiceEnabled ? 'ON' : 'OFF'}`;
            if (voiceEnabled) {
                playSound('click');
                speakText('Voz do Professor Pí ativada!');
            } else {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }
        });
    }


    // ------------------------------------------
    // VARIÁVEIS DO LABORATÓRIO
    // ------------------------------------------
    let valorA = 1;
    let valorB = 0;
    let operacaoAtual = "AND";


    // ------------------------------------------
    // FRASES DO PROFESSOR PÍ
    // ------------------------------------------
    const frasesPi = [
        "Bora codar lógica?",
        "Me clica de novo! ✨",
        "2026 é nosso semestre em DSM!",
        "Tá com dúvida na tabela? Dá uma olhada na lousa!",
        "Capivara 1010 ativada! 💚",
        "Cafézinho de π quentinho? Clica na caneca!",
        "E é o exigente (só dá 1 se ambos forem 1), OU é o gente boa!",
        "No SE ENTÃO, 1 → 0 é o único caso falso! Cuidado!",
        "No SE E SOMENTE SE, valores iguais dão 1 e diferentes dão 0!"
    ];

    let fraseAtual = 0;
    let cliquesCaneca = 0;


    // ------------------------------------------
    // ELEMENTOS DO HTML
    // ------------------------------------------
    const resultado = document.getElementById("resultado");
    const textoValorA = document.getElementById("valorA");
    const textoValorB = document.getElementById("valorB");
    const btnA = document.getElementById("btnA");
    const btnB = document.getElementById("btnB");
    const avisoB = document.getElementById("avisoB");
    const expressao = document.getElementById("expressao");
    const lousaFormulaFormal = document.getElementById("lousaFormulaFormal");
    const explicacao = document.getElementById("explicacao");
    const explicacaoStatus = document.getElementById("explicacaoStatus");
    const imgLousaPi = document.getElementById("imgLousaPi");
    const tabelaVerdade = document.getElementById("tabelaVerdade");
    const nomeOperacao = document.getElementById("nomeOperacao");
    const regraOperacao = document.getElementById("regraOperacao");


    // ------------------------------------------
    // CALCULAR OPERAÇÃO LÓGICA
    // ------------------------------------------
    function calcularLogica(operacao, a, b) {
        if (operacao === "AND") {
            return (a === 1 && b === 1) ? 1 : 0;
        }
        if (operacao === "OR") {
            return (a === 1 || b === 1) ? 1 : 0;
        }
        if (operacao === "SE_ENTAO") {
            if (a === 1 && b === 0) return 0;
            return 1;
        }
        if (operacao === "SE_SOMENTE_SE") {
            return (a === b) ? 1 : 0;
        }
        if (operacao === "NOT") {
            return (a === 1) ? 0 : 1;
        }
        return 0;
    }

    function nomeDaOperacao(operacao) {
        if (operacao === "AND") return "E (Conjunção)";
        if (operacao === "OR") return "OU (Disjunção)";
        if (operacao === "SE_ENTAO") return "SE ENTÃO (Condicional)";
        if (operacao === "SE_SOMENTE_SE") return "SE SOMENTE SE (Bicondicional)";
        if (operacao === "NOT") return "NÃO (Negação)";
        return operacao;
    }

    function simboloDaOperacao(operacao) {
        if (operacao === "AND") return "E";
        if (operacao === "OR") return "OU";
        if (operacao === "SE_ENTAO") return "→";
        if (operacao === "SE_SOMENTE_SE") return "↔";
        if (operacao === "NOT") return "NÃO";
        return operacao;
    }

    function simboloMatematico(operacao) {
        if (operacao === "AND") return "∧";
        if (operacao === "OR") return "∨";
        if (operacao === "SE_ENTAO") return "→";
        if (operacao === "SE_SOMENTE_SE") return "↔";
        if (operacao === "NOT") return "¬";
        return "";
    }

    function criarExplicacao(operacao, a, b, resposta) {
        if (operacao === "AND") {
            if (resposta === 1) {
                return a + " E " + b + " = 1. O E só resulta em 1 quando A e B são 1 ao mesmo tempo!";
            }
            return a + " E " + b + " = 0. Para o E funcionar, ambos os valores precisam ser 1.";
        }

        if (operacao === "OR") {
            if (resposta === 1) {
                return a + " OU " + b + " = 1. No OU basta pelo menos um dos valores ser 1 para dar verdadeiro.";
            }
            return "0 OU 0 = 0. O OU só resulta em 0 quando os dois valores são 0.";
        }

        if (operacao === "SE_ENTAO") {
            if (resposta === 0) {
                return "1 → 0 = 0. Atenção: este é o único caso falso do SE ENTÃO (prometeu e não cumpriu)!";
            }
            return a + " → " + b + " = 1. A condição lógica foi atendida com sucesso.";
        }

        if (operacao === "SE_SOMENTE_SE") {
            if (resposta === 1) {
                return a + " ↔ " + b + " = 1. O SE SOMENTE SE resulta em 1 quando os valores são iguais (" + a + " e " + b + ").";
            }
            return a + " ↔ " + b + " = 0. Valores diferentes geram 0 no bicondicional.";
        }

        if (operacao === "NOT") {
            return "NOT " + a + " = " + resposta + ". O NÃO simplesmente inverte o valor de entrada.";
        }
    }

    function mostrarRegra() {
        if (operacaoAtual === "AND") {
            regraOperacao.textContent = "E = 1 somente quando A=1 e B=1.";
        }
        if (operacaoAtual === "OR") {
            regraOperacao.textContent = "OU = 0 somente quando A=0 e B=0.";
        }
        if (operacaoAtual === "SE_ENTAO") {
            regraOperacao.textContent = "SE ENTÃO é falso somente no caso 1 → 0.";
        }
        if (operacaoAtual === "SE_SOMENTE_SE") {
            regraOperacao.textContent = "SE SOMENTE SE = 1 quando A e B são iguais.";
        }
        if (operacaoAtual === "NOT") {
            regraOperacao.textContent = "NOT inverte o valor de A (0 vira 1, 1 vira 0).";
        }
    }


    // ------------------------------------------
    // ATUALIZAR LABORATÓRIO
    // ------------------------------------------
    function atualizarLaboratorio() {
        const resposta = calcularLogica(operacaoAtual, valorA, valorB);

        textoValorA.textContent = valorA;
        textoValorB.textContent = valorB;
        resultado.textContent = resposta;

        nomeOperacao.textContent = nomeDaOperacao(operacaoAtual);

        if (operacaoAtual === "NOT") {
            expressao.textContent = "NÃO " + valorA + " = " + resposta;
            if (lousaFormulaFormal) lousaFormulaFormal.textContent = "¬" + valorA + " = " + resposta;
            btnB.disabled = true;
            avisoB.textContent = "NÃO utiliza somente o valor A.";
        } else {
            expressao.textContent = valorA + " " + simboloDaOperacao(operacaoAtual) + " " + valorB + " = " + resposta;
            if (lousaFormulaFormal) lousaFormulaFormal.textContent = valorA + " " + simboloMatematico(operacaoAtual) + " " + valorB + " = " + resposta;
            btnB.disabled = false;
            avisoB.textContent = "";
        }

        explicacao.textContent = criarExplicacao(operacaoAtual, valorA, valorB, resposta);

        if (explicacaoStatus) {
            explicacaoStatus.textContent = resposta === 1 ? "Verdadeiro (1) ✨" : "Falso (0)";
            explicacaoStatus.style.color = resposta === 1 ? "#2e7d32" : "#c62828";
        }

        // Atualizar pose do mascote na lousa
        if (imgLousaPi) {
            if (resposta === 1) {
                imgLousaPi.src = "assets/pi_hero.png";
            } else {
                imgLousaPi.src = "assets/pi_pensativo.png";
            }
        }

        atualizarBotoesOperacao();
        criarTabelaVerdade();
        mostrarRegra();
    }


    // ------------------------------------------
    // ALTERAR A E B
    // ------------------------------------------
    btnA.addEventListener("click", function () {
        playSound('toggle');
        valorA = valorA === 1 ? 0 : 1;
        atualizarLaboratorio();
    });

    btnB.addEventListener("click", function () {
        playSound('toggle');
        valorB = valorB === 1 ? 0 : 1;
        atualizarLaboratorio();
    });


    // ------------------------------------------
    // BOTÕES DE OPERAÇÃO
    // ------------------------------------------
    const botoesOperacao = document.querySelectorAll("[data-operacao]");

    botoesOperacao.forEach(function (botao) {
        botao.addEventListener("click", function () {
            playSound('click');
            operacaoAtual = botao.getAttribute("data-operacao");
            atualizarLaboratorio();
        });
    });

    function atualizarBotoesOperacao() {
        botoesOperacao.forEach(function (botao) {
            const operacao = botao.getAttribute("data-operacao");
            if (operacao === operacaoAtual) {
                botao.classList.add("ativo");
            } else {
                botao.classList.remove("ativo");
            }
        });
    }


    // ------------------------------------------
    // TABELA VERDADE
    // ------------------------------------------
    function criarTabelaVerdade() {
        let html = "";
        html += "<table class='tabela'>";
        html += "<tr>";
        html += "<th>A</th>";

        if (operacaoAtual !== "NOT") {
            html += "<th>B</th>";
        }

        html += "<th>Resultado</th>";
        html += "</tr>";

        if (operacaoAtual === "NOT") {
            criarLinhaNot(0);
            criarLinhaNot(1);
        } else {
            criarLinhaTabela(0, 0);
            criarLinhaTabela(0, 1);
            criarLinhaTabela(1, 0);
            criarLinhaTabela(1, 1);
        }

        html += "</table>";
        tabelaVerdade.innerHTML = html;

        function criarLinhaTabela(a, b) {
            const r = calcularLogica(operacaoAtual, a, b);
            let classe = "";
            if (a === valorA && b === valorB) {
                classe = "linha-ativa";
            }
            html += "<tr class='" + classe + "'>";
            html += "<td>" + a + "</td>";
            html += "<td>" + b + "</td>";
            html += "<td>" + r + "</td>";
            html += "</tr>";
        }

        function criarLinhaNot(a) {
            const r = calcularLogica("NOT", a, 0);
            let classe = "";
            if (a === valorA) {
                classe = "linha-ativa";
            }
            html += "<tr class='" + classe + "'>";
            html += "<td>" + a + "</td>";
            html += "<td>" + r + "</td>";
            html += "</tr>";
        }
    }


    // ------------------------------------------
    // PROFESSOR PÍ MATH (HERO / APRESENTAÇÃO)
    // ------------------------------------------
    const falaPi = document.getElementById("falaPi");
    const btnPi = document.getElementById("btnPi");
    const personagemPi = document.getElementById("personagemPi");
    const imgPersonagemPi = document.getElementById("imgPersonagemPi");
    const btnOuvirHero = document.getElementById("btnOuvirHero");
    const btnProximaDicaHero = document.getElementById("btnProximaDicaHero");

    const posesAnimadas = ["pi_hero", "pi_ideia", "pi_pensativo", "pi_explicando", "pi_comemorando"];

    function mudarFalaPi() {
        playSound('poke');
        fraseAtual++;
        if (fraseAtual >= frasesPi.length) {
            fraseAtual = 0;
        }
        falaPi.textContent = frasesPi[fraseAtual];

        if (imgPersonagemPi) {
            const randomPose = posesAnimadas[Math.floor(Math.random() * posesAnimadas.length)];
            imgPersonagemPi.src = `assets/${randomPose}.png`;
        }

        if (voiceEnabled) {
            speakText(falaPi.textContent);
        }
    }

    if (btnPi) btnPi.addEventListener("click", mudarFalaPi);
    if (personagemPi) {
        personagemPi.addEventListener("click", mudarFalaPi);

        // Inclinação 3D natural ao mover o mouse
        window.addEventListener('mousemove', (e) => {
            const rect = personagemPi.getBoundingClientRect();
            const mascotCenterX = rect.left + rect.width / 2;
            const mascotCenterY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - mascotCenterX) / window.innerWidth;
            const deltaY = (e.clientY - mascotCenterY) / window.innerHeight;

            const rotateY = deltaX * 24;
            const rotateX = -deltaY * 20;

            personagemPi.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        personagemPi.addEventListener('mouseleave', () => {
            personagemPi.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    if (btnOuvirHero) {
        btnOuvirHero.addEventListener("click", () => {
            playSound('click');
            speakText(falaPi.textContent);
        });
    }

    if (btnProximaDicaHero) {
        btnProximaDicaHero.addEventListener("click", mudarFalaPi);
    }


    // ------------------------------------------
    // BOTÃO IR PARA LABORATÓRIO
    // ------------------------------------------
    const btnLaboratorio = document.getElementById("btnLaboratorio");
    if (btnLaboratorio) {
        btnLaboratorio.addEventListener("click", function () {
            playSound('click');
            document.getElementById("laboratorio").scrollIntoView({ behavior: 'smooth' });
        });
    }


    // ------------------------------------------
    // CANECA E EASTER EGG
    // ------------------------------------------
    const canecaPi = document.getElementById("canecaPi");
    const textoCliquesCaneca = document.getElementById("textoCliquesCaneca");
    const contadorCaneca = document.getElementById("contadorCaneca");
    const modal = document.getElementById("modal");
    const fecharModal = document.getElementById("fecharModal");

    canecaPi.addEventListener("click", function () {
        cliquesCaneca++;
        playSound('click');

        if (cliquesCaneca < 5) {
            const msg = "Caneca: " + cliquesCaneca + "/5 para o Easter Egg ☕";
            contadorCaneca.textContent = msg;
            if (textoCliquesCaneca) textoCliquesCaneca.textContent = `Caneca π (${cliquesCaneca}/5)`;
        }

        if (cliquesCaneca >= 5) {
            playSound('easter');
            lancarConfetes();
            modal.classList.remove("hidden");
            contadorCaneca.textContent = "";
            if (textoCliquesCaneca) textoCliquesCaneca.textContent = "Caneca π (0/5)";
            cliquesCaneca = 0;
        }
    });

    fecharModal.addEventListener("click", function () {
        playSound('click');
        modal.classList.add("hidden");
    });


    // ------------------------------------------
    // CHAT
    // ------------------------------------------
    const entradaChat = document.getElementById("entradaChat");
    const operacaoChat = document.getElementById("operacaoChat");
    const respostaChat = document.getElementById("respostaChat");
    const btnPerguntar = document.getElementById("btnPerguntar");
    const imgChatPi = document.getElementById("imgChatPi");

    const exemplos = document.querySelectorAll("[data-exemplo]");
    exemplos.forEach(function (botao) {
        botao.addEventListener("click", function () {
            playSound('click');
            entradaChat.value = botao.getAttribute("data-exemplo");
            perguntarParaPi();
        });
    });

    function lerValores(texto) {
        texto = texto.toUpperCase().replaceAll(" ", "");
        const valorEncontradoA = texto.match(/A=([01])/);
        const valorEncontradoB = texto.match(/B=([01])/);

        if (!valorEncontradoA) {
            const digitos = texto.match(/([01])[^01]*([01])?/);
            if (digitos) {
                return {
                    a: Number(digitos[1]),
                    b: digitos[2] !== undefined ? Number(digitos[2]) : 0
                };
            }
            return null;
        }

        const a = Number(valorEncontradoA[1]);
        let b = 0;
        if (valorEncontradoB) {
            b = Number(valorEncontradoB[1]);
        }

        return { a: a, b: b };
    }

    if (btnPerguntar) {
        btnPerguntar.addEventListener("click", perguntarParaPi);
    }

    if (entradaChat) {
        entradaChat.addEventListener("keypress", function (e) {
            if (e.key === 'Enter') {
                perguntarParaPi();
            }
        });
    }

    function perguntarParaPi() {
        playSound('click');
        const txt = entradaChat.value;
        const valores = lerValores(txt);

        if (valores === null) {
            respostaChat.textContent = "Não consegui entender. Digite no formato A=1 B=0 ou clique nos botões de exemplo acima!";
            if (imgChatPi) imgChatPi.src = "assets/pi_pensativo.png";
            return;
        }

        let operacao = operacaoChat.value;
        const tUpper = txt.toUpperCase();

        if (tUpper.includes('OU') || tUpper.includes('OR')) operacao = 'OR';
        else if (tUpper.includes('SE ENTAO') || tUpper.includes('IMPLICA') || tUpper.includes('->')) operacao = 'SE_ENTAO';
        else if (tUpper.includes('BICONDICIONAL') || tUpper.includes('<->') || tUpper.includes('SOMENTE SE')) operacao = 'SE_SOMENTE_SE';
        else if (tUpper.includes('NOT') || tUpper.includes('NAO') || tUpper.includes('NÃO')) operacao = 'NOT';

        const resposta = calcularLogica(operacao, valores.a, valores.b);
        const textoExplicacao = criarExplicacao(operacao, valores.a, valores.b, resposta);

        respostaChat.textContent = textoExplicacao;

        if (imgChatPi) {
            imgChatPi.src = resposta === 1 ? "assets/pi_hero.png" : "assets/pi_pensativo.png";
        }

        if (voiceEnabled) {
            speakText(textoExplicacao);
        }
    }


    // ------------------------------------------
    // QUIZ
    // ------------------------------------------
    const perguntas = [
        {
            titulo: "Login da Cantina",
            descricao: "Para entrar no app da cantina: A = matrícula válida e B = senha correta. Regra: A E B.",
            pergunta: "A=1 e B=1. Consegue entrar?",
            opcoes: ["0 - bloqueado", "1 - liberado"],
            correta: 1,
            dica: "AND só libera quando os dois são 1!"
        },
        {
            titulo: "Desconto do DCE",
            descricao: "Ganho desconto se A = sou calouro OU B = trouxe caneca. Regra: A OU B.",
            pergunta: "A=0 e B=0. Ganho desconto?",
            opcoes: ["0 - sem desconto", "1 - com desconto"],
            correta: 0,
            dica: "OR só dá 0 quando A=0 e B=0."
        },
        {
            titulo: "Frete Grátis",
            descricao: "A loja promete: SE pagou com cartão da faculdade ENTÃO ganha frete grátis.",
            pergunta: "Pagou com cartão (1), mas não ganhou frete (0). A promessa foi quebrada?",
            opcoes: ["0 - falsa, quebrou a promessa", "1 - verdadeira, tudo bem"],
            correta: 0,
            dica: "SE ENTÃO só é falso em 1 → 0."
        },
        {
            titulo: "Sincronia do Grupo",
            descricao: "O trabalho vale SE SOMENTE SE A = você fez e B = seu colega fez igual.",
            pergunta: "A=1 e B=0. A nota vale?",
            opcoes: ["0 - não vale", "1 - vale"],
            correta: 0,
            dica: "SE SOMENTE SE é 1 quando A e B são iguais."
        },
        {
            titulo: "Permissão de Editar",
            descricao: "Pode editar o mural se A = é monitor E B = está online.",
            pergunta: "A=1 e B=0. Pode editar?",
            opcoes: ["0 - não pode", "1 - pode"],
            correta: 0,
            dica: "AND precisa dos dois valores em 1."
        },
        {
            titulo: "Porta com NÃO",
            descricao: "A porta tranca quando NOT A, onde A significa crachá aproximado.",
            pergunta: "A=0, ou seja, sem crachá. A porta fica trancada?",
            opcoes: ["0 - destrancada", "1 - trancada"],
            correta: 1,
            dica: "NÃO inverte o valor. Se A=0, NÃO A=1."
        }
    ];

    let questaoAtual = 0;
    let pontos = 0;
    let respondeu = false;

    const numeroQuestao = document.getElementById("numeroQuestao");
    const tituloQuestao = document.getElementById("tituloQuestao");
    const descricaoQuestao = document.getElementById("descricaoQuestao");
    const perguntaQuestao = document.getElementById("perguntaQuestao");
    const opcoesQuiz = document.getElementById("opcoesQuiz");
    const feedbackQuiz = document.getElementById("feedbackQuiz");
    const btnProxima = document.getElementById("btnProxima");
    const pontuacao = document.getElementById("pontuacao");
    const areaQuiz = document.getElementById("areaQuiz");
    const certificado = document.getElementById("certificado");
    const notaFinal = document.getElementById("notaFinal");
    const btnRefazer = document.getElementById("btnRefazer");
    const btnVoltarLab = document.getElementById("btnVoltarLab");
    const btnImprimirCert = document.getElementById("btnImprimirCert");

    function mostrarQuestao() {
        respondeu = false;
        const questao = perguntas[questaoAtual];

        numeroQuestao.textContent = (questaoAtual + 1) + " / " + perguntas.length + " • " + questao.titulo;
        tituloQuestao.textContent = questao.titulo;
        descricaoQuestao.textContent = questao.descricao;
        perguntaQuestao.textContent = questao.pergunta;

        feedbackQuiz.classList.add("hidden");
        btnProxima.classList.add("hidden");
        opcoesQuiz.innerHTML = "";

        questao.opcoes.forEach(function (texto, indice) {
            const botao = document.createElement("button");
            botao.className = "opcao";
            botao.textContent = texto;

            botao.addEventListener("click", function () {
                responderQuestao(indice, botao);
            });

            opcoesQuiz.appendChild(botao);
        });
    }

    function responderQuestao(indiceEscolhido, botaoEscolhido) {
        if (respondeu) return;
        respondeu = true;

        const questao = perguntas[questaoAtual];
        const botoes = opcoesQuiz.querySelectorAll(".opcao");

        botoes.forEach(function (botao, indice) {
            botao.disabled = true;
            if (indice === questao.correta) {
                botao.classList.add("correta");
            }
        });

        if (indiceEscolhido === questao.correta) {
            pontos++;
            playSound('success');
            lancarConfetes();
            botaoEscolhido.classList.add("correta");
            feedbackQuiz.textContent = "✅ Acertou! " + questao.dica;
            falaPi.textContent = "Boa! Você acertou essa! ✨";
        } else {
            playSound('error');
            botaoEscolhido.classList.add("errada");
            feedbackQuiz.textContent = "❌ Não foi dessa vez. " + questao.dica;
            falaPi.textContent = "Quase! Olha a regra e tenta entender o motivo.";
        }

        pontuacao.textContent = pontos + "/" + perguntas.length;
        feedbackQuiz.classList.remove("hidden");
        btnProxima.classList.remove("hidden");

        if (questaoAtual === perguntas.length - 1) {
            btnProxima.textContent = "Ver certificado 🎓";
        } else {
            btnProxima.textContent = "Próxima →";
        }

        if (voiceEnabled) {
            speakText(feedbackQuiz.textContent);
        }
    }

    btnProxima.addEventListener("click", function () {
        playSound('click');
        questaoAtual++;
        if (questaoAtual < perguntas.length) {
            mostrarQuestao();
        } else {
            mostrarCertificado();
        }
    });

    function mostrarCertificado() {
        areaQuiz.classList.add("hidden");
        certificado.classList.remove("hidden");
        notaFinal.textContent = pontos + "/" + perguntas.length;
        falaPi.textContent = "Mandou muito no quiz do Professor Pí! 🎓";
        playSound('easter');
        lancarConfetes();

        if (voiceEnabled) {
            speakText(`Parabéns! Você completou o quiz com ${pontos} de ${perguntas.length} acertos!`);
        }
    }

    btnRefazer.addEventListener("click", function () {
        playSound('click');
        questaoAtual = 0;
        pontos = 0;
        respondeu = false;
        pontuacao.textContent = "0/" + perguntas.length;
        certificado.classList.add("hidden");
        areaQuiz.classList.remove("hidden");
        mostrarQuestao();
    });

    btnVoltarLab.addEventListener("click", function () {
        playSound('click');
        document.getElementById("laboratorio").scrollIntoView({ behavior: 'smooth' });
    });

    if (btnImprimirCert) {
        btnImprimirCert.addEventListener("click", function () {
            window.print();
        });
    }


    // ------------------------------------------
    // NOVO SCROLL COMPANION LIVRE (MASCOTE 3D DE CORPO INTEIRO)
    // ------------------------------------------
    const btnFloatingPi = document.getElementById('btnFloatingPi');
    const imgFloatingPi = document.getElementById('imgFloatingPi');
    const floatingBubble = document.getElementById('floatingBubble');
    const floatingBubbleText = document.getElementById('floatingBubbleText');
    const floatingSectionTag = document.getElementById('floatingSectionTag');
    const btnCloseBubble = document.getElementById('btnCloseBubble');

    let secaoAtivaAtual = 'apresentacao';
    let bubbleTimeout = null;

    const companionContexts = {
        'apresentacao': {
            tag: '🧭 Boas-vindas',
            fala: 'Olá! Sou o Professor Pí Math! Role a página para aprender lógica comigo!',
            img: 'assets/pi_hero.png',
            dica: 'Você pode cutucar o mascote no topo da página para ver frases engraçadas!'
        },
        'laboratorio': {
            tag: '🧪 Laboratório da Pí',
            fala: 'Hora dos experimentos! Alterne A e B para ver a lógica ao vivo na lousa!',
            img: 'assets/pi_ideia.png',
            dica: 'Cuidado com a condicional: 1 → 0 é o único caso que dá 0!'
        },
        'chat': {
            tag: '💬 Chat com a Pí',
            fala: 'Ficou com alguma dúvida? Mande uma mensagem que eu te explico tudinho!',
            img: 'assets/pi_pensativo.png',
            dica: 'Você pode clicar nos exemplos prontos como A=1 B=0 para testar rápido!'
        },
        'quiz': {
            tag: '📋 Quiz do Professor Pí',
            fala: 'Prancheta de avaliação pronta! Responda às 6 questões e emita seu certificado!',
            img: 'assets/pi_expert.png',
            dica: 'Leia com atenção cada caso da cantina, DCE e frete grátis!'
        },
        'certificado': {
            tag: '🎓 Certificado Oficial',
            fala: 'Parabéns! Você completou com louvor o laboratório do Professor Pí!',
            img: 'assets/pi_comemorando.png',
            dica: 'Digite seu nome e clique em Imprimir/Salvar PDF para guardar sua conquista!'
        }
    };

    function atualizarCompanion(secaoKey) {
        if (!companionContexts[secaoKey]) return;
        secaoAtivaAtual = secaoKey;
        const ctx = companionContexts[secaoKey];

        if (btnFloatingPi) {
            btnFloatingPi.classList.remove('poking');
            void btnFloatingPi.offsetWidth;
            btnFloatingPi.classList.add('poking');
        }

        if (imgFloatingPi) imgFloatingPi.src = ctx.img;
        if (floatingSectionTag) floatingSectionTag.textContent = ctx.tag;
        if (floatingBubbleText) floatingBubbleText.textContent = ctx.fala;

        if (floatingBubble) {
            floatingBubble.classList.add('show');
            playSound('pop');

            if (bubbleTimeout) clearTimeout(bubbleTimeout);
            bubbleTimeout = setTimeout(() => {
                floatingBubble.classList.remove('show');
            }, 6000);
        }
    }

    const sectionsToTrack = [
        { id: 'apresentacao-secao', key: 'apresentacao' },
        { id: 'laboratorio', key: 'laboratorio' },
        { id: 'chat', key: 'chat' },
        { id: 'quiz', key: 'quiz' },
        { id: 'certificado', key: 'certificado' }
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const match = sectionsToTrack.find(s => s.id === entry.target.id);
                if (match && match.key !== secaoAtivaAtual) {
                    atualizarCompanion(match.key);
                }
            }
        });
    }, { threshold: 0.2 });

    sectionsToTrack.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
    });

    if (btnFloatingPi) {
        btnFloatingPi.addEventListener('click', () => {
            playSound('poke');

            btnFloatingPi.classList.remove('poking');
            void btnFloatingPi.offsetWidth;
            btnFloatingPi.classList.add('poking');

            const ctx = companionContexts[secaoAtivaAtual] || companionContexts['apresentacao'];
            floatingBubbleText.innerHTML = `<strong>Dica do Professor Pí:</strong> ${ctx.dica}`;
            floatingBubble.classList.add('show');
            speakText(ctx.dica);

            if (bubbleTimeout) clearTimeout(bubbleTimeout);
            bubbleTimeout = setTimeout(() => {
                floatingBubble.classList.remove('show');
            }, 6000);
        });
    }

    if (btnCloseBubble) {
        btnCloseBubble.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingBubble.classList.remove('show');
        });
    }


    // ------------------------------------------
    // MOTOR DE CONFETES EM CANVAS
    // ------------------------------------------
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let confettiParticles = [];
    let animationFrame = null;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function lancarConfetes() {
        if (!canvas || !ctx) return;
        confettiParticles = [];
        const cores = ['#2e7d32', '#00b4d8', '#4caf50', '#f59e0b', '#ffffff', '#e91e63'];

        for (let i = 0; i < 80; i++) {
            confettiParticles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.5) * 16 - 3,
                size: Math.random() * 8 + 4,
                color: cores[Math.floor(Math.random() * cores.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        if (animationFrame) cancelAnimationFrame(animationFrame);
        animarConfetes();
    }

    function animarConfetes() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let active = false;
        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.rotSpeed;
            p.opacity -= 0.015;

            if (p.opacity > 0) {
                active = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (active) {
            animationFrame = requestAnimationFrame(animarConfetes);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }


    // ------------------------------------------
    // INICIAR PÁGINA
    // ------------------------------------------
    atualizarLaboratorio();
    mostrarQuestao();

});
