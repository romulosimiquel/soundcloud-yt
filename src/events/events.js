const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const server = http.Server;
const io = socketIo(server);

module.exports = (io) => {
  io.on('connection', (socket, client) => {
    console.log('New client connected');
    clientGlob = client
    console.log(client)
    console.log(clientGlob)
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
  });
}
