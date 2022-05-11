# Frontend-Web
Repositorio del equipo Frontend Web

## Como crear una partida
Si es solo en una maquina abre una pestaña de incognito (para simular otro navegador)
 1. Inicia sesion en dos cuentas diferentes
 2. Una de las cuentas presiona "Crear partida". Configura la partida (Recomendado nº de jugadores exacto, sino no podras empezar la partida), le da a crear y espera (no hay mucho feedback)
 3. El otro usuario presiona unirse a partida privada y mete el codigo de la partida (esta en la url del jugador que la ha creado). Se une. No asustarse si esta reventado todo, todavia faltan cosas
 4. El primer jugador presiona "Empezar partida"

Si presionais F12 abrireis la consola. Podeis ver que se envia y recibe cuando llegue una linea tipo:
 * **>>> SEND** Frontend envia a backend
 * **<<< MESSAGE** Backend envia a frontend
 * **>>> SUBSCRIBE** Me suscribo a algun sitio

Todavia no estan implementado el nº de cartas ni los turnos, pero podeis hacer click en las cartas para jugarlas (si las reglas del uno lo dejan)
