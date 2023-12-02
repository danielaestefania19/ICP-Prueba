.PHONY: help startTestnet deployBackend deploy

help:
	@echo "make startTestnet: lanza una blockchain local de icp"
	@echo "make deployBackend: lanza de manera local el canister de backend"
	@echo "make deploy: lanza de manera local todos los canisters"
	@echo "make generate: compila los canisters"

startTestnet:
	@echo "Launching local testnet of icp"
	@echo "Remember do not close this terminal"
	dfx start --clean

deployBackend:
	@echo "Deploying backend canister"
	dfx deploy help_backend

deploy:
	@echo "Deploying all canisters"
	dfx deploy

deployAndRun:
	@echo "Deploying all canisters"
	dfx deploy
	@echo "Running frontend"
	npm run start

generate:
	@echo "Compiling canisters"
	dfx generate
