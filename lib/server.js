
net = require('net');

module.exports = {
    server: null,
    clients: [],
    config: {
        port: 9999
    },

    start: function() {
        var _this = this;
        this.server = net.createServer();
         
        this.server.on('connection', function(socket) {
            _this.onConnection(socket);
        });

        this.server.listen(this.config.port);

        console.log('Chat server running at port '+this.config.port+'.\n');
    },

    onConnection: function(socket) {
        var _this = this;

        socket.name = socket.remoteAddress + ":" + socket.remotePort 
     
        this.clients.push(socket);
     
        socket.write('Welcome ' + socket.name + "\n");
        this.broadcast(socket.name + " joined the chat\n", socket);
     
        socket.on('data', function(data) {
            _this.broadcast(socket.name + "> " + data + "\n", socket);
        });
     
        socket.on('end', function() {
            _this.clients.splice(_this.clients.indexOf(socket), 1);
            _this.broadcast(socket.name + " left the chat.\n");
        });

    },

    broadcast: function(message, sender) {
        this.clients.forEach(function(client) {
            if (client === sender) return;
            client.write(message);
        });
        process.stdout.write(message)
    }
};
