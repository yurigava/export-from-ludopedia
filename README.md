# Baixa partidas jogadas da Ludopedia
## Requerimentos
* Você irá precisar do aplicativo de android BGstats, que é pago.
    * Não se esqueça de logar no BGG dentro do BGstats, e ativar a sincronia.
* Seu Id numérico da Ludopedia:
    * Vá para a página de partidas e pegue o número no final do link.
    * Exemplo: https://www.ludopedia.com.br/partidas?id_usuario=59657
    * Seu Id é: 59657
## Rodando no computador
1. Instale o [node.js](https://nodejs.org/en/download/)
2. Baixe o Código (git ou download do Zip)
3. Entre na pasta do projeto
4. Rode na linha de comando (cmd/shell):
	1. `npm install`
	2. `node src --userId=SeuIdDaLudopedia`
5. Envie o arquivo gerado `ludopedia-export-yyyy-MM-dd HH:mm:ss.bgsplay` para o seu celular, e abra com o aplicativo BGStats

## Rodando no Android
1. Baixe Termux na Play Store
2. Rode os seguintes comandos no termux:
    1. `pkg update`
    2. `pkg install nodejs`
    3. `npm install -g npm`
    4. `pkg install git`
    5. `git clone https://github.com/yurigava/export-from-ludopedia.git`
    6. `cd export-from-ludopedia`
    7. `npm install`
    8. `node src --user-id=SeuIdDaLudopedia`
3. Quando terminar de rodar, mande o arquivo para o BGstats. Digite no termux:
    1. `termux-setup-storage` e dê as permissões.
    2. `termux-open --send ludo`
4. E aperte o botão de tab (e enter)
5. Selecione o BGStats na lista de aplicativos.
