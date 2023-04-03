# Syla Hromady Bot

##

## PM2

To use this bot well I am using pm2 with a few adjustemtns
Initial command
`pm2 start dist/main.js`

Cron to restart it every day 5AM
`pm2 cron "0 5 \* \* \* dist/main.js"`

Initial command but restart in case if memory is higher than 300M
`pm2 start dist/main.js --max-memory-restart 300M --cron-restart "0 5 * * * "`
