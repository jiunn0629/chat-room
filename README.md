# chat-room

## Overview
The **chat-room** project is a real-time communication platform designed for seamless interaction among users. It leverages modern web technologies to provide an engaging and responsive user experience.

## Features
- **Real-Time Messaging**: Instant message delivery using WebSockets.
- **User Authentication**: Secure login with token.

## Technologies Used
- **Frontend**: JavaScript, Angular, Angular Material UI
- **Backend**: Golang, Iris
- **Database**: PostgreSQL

## Installation
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/jiunn0629/chat-room.git

2. Navigate to the server directory and build the Docker Image and run docker compose:
   ```bash
   cd server
   docker build -t chat-room-server .
   docker compose -f docker-compose.yml up -d

3. Switch to ui directory to install dependencies:
   ```bash
   npm install

4. Start the UI, you can use the following command. It also supports running multiple instances on different ports for testing purposes:
   ```bash
   Start a single instance and open it in the browser (default port: 4200)
   npx ng serve -o
   
   Start additional instances by specifying a different port number
   npx ng serve -o --port=<portnumber>
   Example: Start an instance on port 4201
   
