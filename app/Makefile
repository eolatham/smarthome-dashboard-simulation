init:
	pdm install
	npm install

start:  # Runs Flask server on localhost:5000 and React app on localhost:3000
	screen -S react-dev-server -X stuff ^C; \
	screen -dmS react-dev-server npm run start; \
	pdm run start; \
	screen -S react-dev-server -X stuff ^C;
