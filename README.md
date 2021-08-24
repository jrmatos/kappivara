# Kappivara
A microservices based app for tracking brazilian shipments via Correios.

![Kappivara logo](https://github.com/jrmatos/kappivara/blob/master/docs/kappivara-logo.jpg)

## About
This project is for studying purposes only. My intention is to use it as a playground for learning and practicing web development.

## Architecture

- Loki
  - Responsability: User management
  - Language: TypeScript/Node.js
  - Database: MariaDB

- Thor
  - User authentication
  - Language: TypeScript/Node.js

- Blackwidow
  - Message consumer
  - Language: Java/Spring Boot

![Kappivara architecture diagram](https://github.com/jrmatos/kappivara/blob/master/docs/kappivara-diagram.png)

MIT licensed.
