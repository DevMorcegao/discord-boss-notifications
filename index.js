const cron = require('node-cron');
const axios = require('axios');
const config = require('./config');

// Extrair configurações do arquivo de configuração
const { WEBHOOK_URL, TIMEZONE, bosses, eventos } = config;

// Função para enviar webhook para o Discord
async function enviarNotificacao(mensagem, dadosNotificacao) {
  try {
    // Divide a mensagem em linhas
    const linhas = mensagem.split('\n').filter(linha => linha.trim() !== '');
    
    // Extrai o título (ALERTA DE BOSS/EVENTO)
    const tituloMatch = mensagem.match(/\*\*📢 ALERTA DE (BOSS|EVENTO) 📢\*\*/);
    const titulo = tituloMatch ? tituloMatch[0].replace(/\*/g, '') : 'Alerta';
    
    // Extrai a primeira linha após o título (descrição)
    const descricaoIndex = linhas.findIndex(linha => linha.includes('nascerá em') || linha.includes('abrirá em'));
    const descricao = descricaoIndex >= 0 ? linhas[descricaoIndex] : '';
    
    // Prepara o conteúdo do embed
    const embedFields = [];
    let currentField = null;
    
    // Processa as linhas para criar os campos do embed
    for (let i = descricaoIndex + 1; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      
      // Ignora linhas vazias, a última linha (copyright) e o link da imagem
      if (linha === '' || linha.includes('Mu © Since') || linha.startsWith('http')) continue;
      
      // Se a linha contém um emoji, é um novo campo
      if (linha.match(/^[🎯🗺️⏰]/)) {
        // Salva o campo anterior se existir
        if (currentField) {
          embedFields.push(currentField);
        }
        
        // Inicia um novo campo
        currentField = {
          name: linha,
          value: '',
          inline: false // Alterado de true para false para ficar na vertical
        };
      } 
      // Se não é um novo campo, adiciona ao valor do campo atual
      else if (currentField) {
        currentField.value += (currentField.value ? '\n' : '') + linha;
      }
    }
    
    // Adiciona o último campo
    if (currentField) {
      embedFields.push(currentField);
    }
    
    // Encontra a linha do copyright
    const copyrightLine = linhas.find(linha => linha.includes('Mu © Since'));
    
    // Verifica se é uma notificação de 30 minutos para definir a cor
    let embedColor = 0xDD2E44; // Cor vermelha padrão para 5 minutos
    if (descricao.includes('30 minutos')) {
      embedColor = 0xFDCB58; // Cor amarela para 30 minutos
    }
    
    // Constrói o embed
    const embed = {
      title: titulo,
      description: descricao,
      color: embedColor,
      fields: embedFields,
      footer: {
        text: copyrightLine || 'Mu © Since 2025'
      }
    };
    
    // Adiciona a imagem se os dados de notificação tiverem uma
    if (dadosNotificacao && dadosNotificacao.imagem) {
      embed.image = {
        url: dadosNotificacao.imagem
      };
    }
    
    // Envia a mensagem como embed
    await axios.post(WEBHOOK_URL, {
      content: linhas[0], // Mantém o @everyone fora do embed
      embeds: [embed]
    });
    
    console.log('Notificação enviada com sucesso!');
  } catch (erro) {
    console.error('Erro ao enviar notificação:', erro);
  }
}

// Função para formatar notificação de boss
function formatarNotificacaoBoss(boss, horario, minutosRestantes) {
  const dataAtual = new Date();
  const horaAtual = dataAtual.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Define o emoji de acordo com o tempo restante
  const emojiCor = minutosRestantes === 30 ? '🟡' : '🔴';

  return `@everyone
**📢 ALERTA DE BOSS 📢**

O boss **${boss.nome}** nascerá em ${minutosRestantes} minutos em todos os servidores!

🎯 **Boss**
${boss.nome}

🗺️ **Mapa**
${boss.local}

⏰ **Horário de Spawn (GMT-3 BRASIL)**
${horario} ${emojiCor}

Mu © Since 2025 • Hoje às ${horaAtual}`;
}

// Função para formatar notificação de evento
function formatarNotificacaoEvento(evento, horario, minutosRestantes) {
  const dataAtual = new Date();
  const horaAtual = dataAtual.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `@everyone
**📢 ALERTA DE EVENTO 📢**

O evento **${evento.nome}** abrirá em ${minutosRestantes} minutos em todos os servidores!

🎯 **Evento**
${evento.nome}

🗺️ **Mapa**
${evento.local}

⏰ **Horário de Abertura (GMT-3 BRASIL)**
${horario} 🔴

Mu © Since 2025 • Hoje às ${horaAtual}`;
}

// Configurar notificações para bosses com horários específicos
function configurarNotificacoesBosses() {
  bosses.forEach(boss => {
    boss.horarios.forEach(horario => {
      const [hora, minuto] = horario.split(':').map(Number);
      
      // Notificação 30 minutos antes
      const minuto30Antes = (minuto + 30) % 60;
      const hora30Antes = (hora + Math.floor((minuto + 30) / 60) - 1 + 24) % 24;
      
      cron.schedule(`${minuto30Antes} ${hora30Antes} * * *`, () => {
        const mensagem = formatarNotificacaoBoss(boss, horario, 30);
        enviarNotificacao(mensagem, boss);
      }, {
        timezone: TIMEZONE
      });
      
      // Notificação 5 minutos antes
      const minuto5Antes = (minuto + 55) % 60;
      const hora5Antes = (hora + Math.floor((minuto + 55) / 60) - 1 + 24) % 24;
      
      cron.schedule(`${minuto5Antes} ${hora5Antes} * * *`, () => {
        const mensagem = formatarNotificacaoBoss(boss, horario, 5);
        enviarNotificacao(mensagem, boss);
      }, {
        timezone: TIMEZONE
      });
    });
  });
}

// Configurar notificações para eventos com horários específicos
function configurarNotificacoesEventosHorarios() {
  eventos.filter(evento => evento.horarios).forEach(evento => {
    evento.horarios.forEach(horario => {
      const [hora, minuto] = horario.split(':').map(Number);
      
      // Notificação 5 minutos antes
      const minuto5Antes = (minuto + 55) % 60;
      const hora5Antes = (hora + Math.floor((minuto + 55) / 60) - 1 + 24) % 24;
      
      cron.schedule(`${minuto5Antes} ${hora5Antes} * * *`, () => {
        const mensagem = formatarNotificacaoEvento(evento, horario, 5);
        enviarNotificacao(mensagem, evento);
      }, {
        timezone: TIMEZONE
      });
    });
  });
}

// Configurar notificações para eventos com expressões cron
function configurarNotificacoesEventosCron() {
  eventos.filter(evento => evento.expressao).forEach(evento => {
    // Calcula o tempo 5 minutos antes da expressão cron
    const expressaoOriginal = evento.expressao;
    const partes = expressaoOriginal.split(' ');
    
    // Para eventos baseados em minutos específicos
    if (partes[0] !== '*') {
      const minutos = partes[0].split(',').map(Number);
      
      minutos.forEach(minuto => {
        // Calcula 5 minutos antes
        const minuto5Antes = (minuto - 5 + 60) % 60;
        
        // Cria uma nova expressão cron para 5 minutos antes
        const novaExpressao = `${minuto5Antes} ${partes[1]} ${partes[2]} ${partes[3]} ${partes[4]}`;
        
        cron.schedule(novaExpressao, () => {
          // Formata a hora do evento
          const agora = new Date();
          const horaAtual = agora.getHours();
          
          // Calcula a hora correta do evento (5 minutos depois da notificação)
          let eventoHora = horaAtual;
          // Se estamos nos últimos 5 minutos da hora atual e o evento é no minuto 0 ou
          // nos primeiros minutos da próxima hora, precisamos avançar uma hora
          if (agora.getMinutes() >= 55 && minuto < 5) {
            eventoHora = (horaAtual + 1) % 24;
          }
          
          const horarioEvento = `${eventoHora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
          
          const mensagem = formatarNotificacaoEvento(evento, horarioEvento, 5);
          enviarNotificacao(mensagem, evento);
        }, {
          timezone: TIMEZONE
        });
      });
    }
  });
}

// Inicializar o sistema
function iniciarSistema() {
  console.log('Sistema de notificações de bosses e eventos iniciado!');
  console.log(`Webhook configurado para: ${WEBHOOK_URL}`);
  console.log(`Timezone configurado para: ${TIMEZONE}`);
  console.log('Aguardando horários programados...');
  
  // Verificar se a URL do webhook foi configurada
  if (WEBHOOK_URL === 'SUA_URL_DO_WEBHOOK_AQUI') {
    console.warn('⚠️ ATENÇÃO: Você precisa configurar a URL do webhook no arquivo config.js');
  }
  
  configurarNotificacoesBosses();
  configurarNotificacoesEventosHorarios();
  configurarNotificacoesEventosCron();
}

// Iniciar o sistema
iniciarSistema(); 