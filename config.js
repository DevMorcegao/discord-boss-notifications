// Configurações do sistema de notificações
require('dotenv').config();

module.exports = {
  // URL do webhook do Discord
  WEBHOOK_URL: process.env.WEBHOOK_URL || 'SUA_URL_DO_WEBHOOK_AQUI',
  
  // Configuração de timezone
  TIMEZONE: process.env.TIMEZONE || 'America/Sao_Paulo', // GMT-3 Brasil
  
  // Configuração dos bosses
  bosses: [
    {
      nome: 'Illusion of Kundun',
      local: 'Kalima 7',
      horarios: ['08:00', '16:00', '00:00'] // 3 vezes por dia
    },
    {
      nome: 'Core Magriffy',
      local: 'Nars',
      horarios: ['10:00', '18:00', '02:00']
    },
    {
      nome: 'Lord of Ferea',
      local: 'Ferea',
      horarios: ['12:00', '20:00', '04:00']
    },
    {
      nome: 'Lord Silvester',
      local: 'Uruk',
      horarios: ['09:00', '17:00', '01:00']
    },
    {
      nome: 'Selupan',
      local: 'Raklion',
      horarios: ['11:00', '17:35', '03:00']
    },
    {
      nome: 'Medusa',
      local: 'Swamp of Calmness',
      horarios: ['13:00', '17:10', '05:00']
    }
  ],
  
  // Configuração dos eventos
  eventos: [
    {
      nome: 'Chaos Castle',
      local: 'Event Square',
      expressao: '50 * * * *' // Todo minuto 50
    },
    {
      nome: 'Blood Castle',
      local: 'Event Square',
      expressao: '0,30 * * * *' // 0:00, 0:30, 1:00, 1:30...
    },
    {
      nome: 'Devil Square',
      local: 'Event Square',
      expressao: '5 * * * *' // Todo minuto 05
    },
    {
      nome: 'Doppelganger',
      local: 'Event Square',
      expressao: '30 * * * *' // Todo minuto 30
    },
    {
      nome: 'Illusion Temple',
      local: 'Event Square',
      horarios: ['08:00', '18:00', '22:00']
    },
    {
      nome: 'Boss Battle Together',
      local: 'Event Square',
      horarios: ['05:40', '13:40', '21:40']
    }
  ]
}; 