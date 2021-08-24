# Loki

Loki is a microservice for handling user management

Steps to run this project:

- Run `yarn install` command
- Run `docker-compose up -d` command
- Create `loki` and `loki_test` databases
- Create a .env file with variables from .env-copy
- Setup database settings inside `ormconfig.json` file
- Run `yarn dev` command

Run tests with `yarn test`
