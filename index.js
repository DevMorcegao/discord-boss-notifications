const cron = require('node-cron');
const axios = require('axios');
const config = require('./config');

// Extrair configurações do arquivo de configuração
const { WEBHOOK_URL, TIMEZONE, bosses, eventos } = config;

// Função para enviar webhook para o Discord
async function enviarNotificacao(mensagem) {
  try {
    await axios.post(WEBHOOK_URL, {
      content: mensagem
    });
    console.log('Notificação enviada com sucesso!');
  } catch (erro) {
    console.error('Erro ao enviar notificação:', erro);
  }
}

// Função para formatar notificação de boss
function formatarNotificacaoBoss(boss, horario, minutosRestantes) {
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const horaAtual = dataAtual.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `@everyone
📢 ALERTA DE BOSS 📢

O boss ${boss.nome} nascerá em ${minutosRestantes} minutos em todos os servidores!
📋 Informações do Boss
🎯 Boss
${boss.nome}
🗺️ Local
${boss.local}
⏰ Horário de Spawn (GMT-3 BRASIL)
${horario} 🔴
Mu © Since 2025•Hoje às ${horaAtual}`;
}

// Função para formatar notificação de evento
function formatarNotificacaoEvento(evento, horario, minutosRestantes) {
  const dataAtual = new Date();
  const horaAtual = dataAtual.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `@everyone
📢 ALERTA DE EVENTO 📢

O evento ${evento.nome} abrirá em ${minutosRestantes} minutos em todos os servidores!
📋 Informações do Evento
🎯 Evento
${evento.nome}
🗺️ Local
${evento.local}
⏰ Horário de Abertura (GMT-3 BRASIL)
${horario} 🔴
Mu © Since 2025•Hoje às ${horaAtual}`;
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
        enviarNotificacao(mensagem);
      }, {
        timezone: TIMEZONE
      });
      
      // Notificação 5 minutos antes
      const minuto5Antes = (minuto + 55) % 60;
      const hora5Antes = (hora + Math.floor((minuto + 55) / 60) - 1 + 24) % 24;
      
      cron.schedule(`${minuto5Antes} ${hora5Antes} * * *`, () => {
        const mensagem = formatarNotificacaoBoss(boss, horario, 5);
        enviarNotificacao(mensagem);
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
        enviarNotificacao(mensagem);
      }, {
        timezone: TIMEZONE
      });
    });
  });
}

// Configurar notificações para eventos com expressões cron
function configurarNotificacoesEventosCron() {
  eventos.filter(evento => evento.expressao).forEach(evento => {
    // Calculamos o tempo 5 minutos antes da expressão cron
    const expressaoOriginal = evento.expressao;
    const partes = expressaoOriginal.split(' ');
    
    // Para eventos baseados em minutos específicos
    if (partes[0] !== '*') {
      const minutos = partes[0].split(',').map(Number);
      
      minutos.forEach(minuto => {
        // Calculamos 5 minutos antes
        const minuto5Antes = (minuto - 5 + 60) % 60;
        
        // Criamos uma nova expressão cron para 5 minutos antes
        const novaExpressao = `${minuto5Antes} ${partes[1]} ${partes[2]} ${partes[3]} ${partes[4]}`;
        
        cron.schedule(novaExpressao, () => {
          // Formatamos a hora do evento
          const agora = new Date();
          const horaAtual = agora.getHours();
          const horarioEvento = `${horaAtual.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
          
          const mensagem = formatarNotificacaoEvento(evento, horarioEvento, 5);
          enviarNotificacao(mensagem);
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