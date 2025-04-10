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
      horarios: ['08:00', '16:00', '22:00'], // 3 vezes por dia
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Kundun.png'
    },
    {
      nome: 'Core Magriffy',
      local: 'Nars',
      horarios: ['10:00', '18:00', '01:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Core.png'
    },
    {
      nome: 'Lord of Ferea',
      local: 'Ferea',
      horarios: ['12:00', '20:00', '03:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Ferea.png'
    },
    {
      nome: 'Lord Silvester',
      local: 'Uruk',
      horarios: ['09:00', '17:00', '23:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Silvester.png'
    },
    {
      nome: 'Selupan',
      local: 'Raklion',
      horarios: ['11:00', '19:00', '04:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Selupan.png'
    },
    {
      nome: 'Medusa',
      local: 'Swamp of Calmness',
      horarios: ['13:00', '21:00', '05:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Medusa.png'
    }
  ],
  
  // Configuração dos eventos
  eventos: [
    {
      nome: 'Chaos Castle',
      local: 'Event Square',
      expressao: '50 * * * *', // Todo minuto 50
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/ChaosCastle.png'
    },
    {
      nome: 'Blood Castle',
      local: 'Event Square',
      expressao: '0,30 * * * *', // 0:00, 0:30, 1:00, 1:30...
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/BloodCastle.png'
    },
    {
      nome: 'Devil Square',
      local: 'Event Square',
      expressao: '5 * * * *', // Todo minuto 05
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/DevilSquare.png'
    },
    {
      nome: 'Doppelganger',
      local: 'Event Square',
      expressao: '30 * * * *', // Todo minuto 30
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/Doppelganger.png'
    },
    {
      nome: 'Illusion Temple',
      local: 'Event Square',
      horarios: ['08:00', '18:00', '22:00'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/IllusionTemple.png'
    },
    {
      nome: 'Boss Battle Together',
      local: 'Event Square',
      horarios: ['05:40', '13:40', '21:40'],
      imagem: 'https://raw.githubusercontent.com/DiscordBossNotification/boss-and-events-images/refs/heads/main/BattleTogether.png'
    }
  ]
}; 