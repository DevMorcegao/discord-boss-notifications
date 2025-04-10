// Configuração do PM2 para o sistema de notificações

module.exports = {
  apps: [
    {
      name: 'discord-boss-notifications',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}; 