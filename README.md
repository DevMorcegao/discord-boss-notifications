# Sistema de Notificações de Bosses e Eventos para Discord

Este sistema envia notificações automáticas para um canal no Discord sobre bosses e eventos que ocorrem em horários específicos.

## Funcionalidades

- Envio de notificações para bosses 30 e 5 minutos antes do nascimento
- Envio de notificações para eventos 5 minutos antes da abertura
- Suporte para eventos com horários fixos e recorrentes (usando expressões cron)
- Mensagens formatadas no estilo pedido
- Configuração de timezone para Brasil (GMT-3)
- Menção @everyone para chamar atenção de todos os membros

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (Node Package Manager)
- URL de webhook do Discord para o canal de destino

## Instalação

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example` e configure sua URL de webhook do Discord
4. Execute o sistema:
   ```
   npm start
   ```

## Configuração

### Variáveis de Ambiente

Você pode configurar o sistema usando variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
WEBHOOK_URL=seu_webhook_url_aqui
TIMEZONE=America/Sao_Paulo
```

Alternativamente, você pode configurar diretamente no arquivo `config.js`.

### URL do Webhook

Edite a variável `WEBHOOK_URL` no arquivo `config.js` com a URL do seu webhook do Discord.

Para criar um webhook no Discord:
1. Vá para as configurações do canal
2. Selecione "Integrações"
3. Clique em "Webhooks"
4. Clique em "Novo Webhook"
5. Dê um nome e defina um avatar (opcional)
6. Copie a URL do webhook
7. Cole no arquivo `config.js`

### Configuração de Horários

Os horários dos bosses e eventos podem ser configurados no arquivo `config.js`.

#### Bosses
Cada boss tem as seguintes propriedades:
- `nome`: Nome do boss
- `local`: Local onde o boss aparece
- `horarios`: Array com os horários de aparecimento no formato "HH:MM"

#### Eventos
Os eventos podem ser configurados de duas formas:
1. Com horários específicos:
   - `nome`: Nome do evento
   - `local`: Local do evento
   - `horarios`: Array com os horários de abertura no formato "HH:MM"

2. Com expressões cron (para eventos recorrentes):
   - `nome`: Nome do evento
   - `local`: Local do evento
   - `expressao`: Expressão cron que define a recorrência do evento

## Como Executar

Após configurar o webhook, execute o sistema:

```
npm start
```

O sistema começará a enviar notificações nos horários programados.

## Como Manter o Sistema Executando

Para manter o sistema em execução 24/7, você pode usar:

- PM2 (Process Manager) - recomendado para servidores Linux/macOS/Windows
  ```
  # Instalação global do PM2
  npm install -g pm2
  
  # Iniciar com arquivo de configuração
  pm2 start pm2-setup.js
  
  # OU iniciar diretamente
  pm2 start index.js --name "discord-boss-notifications"
  
  # Salvar configuração para reinicialização
  pm2 save
  
  # Configurar para iniciar automaticamente após reinicialização do sistema
  pm2 startup
  ```

- Serviço do Windows (para sistemas Windows)
- Hospedagem em nuvem (como Heroku, AWS, etc.)

## Estrutura do Projeto

- `index.js` - Arquivo principal contendo a lógica do sistema
- `config.js` - Arquivo de configuração com webhook e horários
- `package.json` - Arquivo de configuração do Node.js
- `pm2-setup.js` - Arquivo de configuração do PM2
- `.env.example` - Exemplo de arquivo de variáveis de ambiente
- `README.md` - Este arquivo de documentação
