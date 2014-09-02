var net = require('net');
var prompt = require('prompt');

module.exports = {
    client: null,
    config: {
        host: '127.0.0.1',
        port: 9999
    },

    join: function() {
        var _this = this;

        this.client = new net.Socket();
        this.client.connect(
            this.config.port,
            this.config.host,
            function() {
                _this.onConnect();
            }
        );
        this.client.on('close', function() {
            _this.onClose();
        });
        this.client.on('data', function(data) {
            _this.onData(data);
        });
    },

    onConnect: function() {
        console.log('CONNECTED TO: ' + this.config.host + ':' + this.config.port);
        this.messagePrompt();
    },

    onClose: function() {
        console.log('Connection closed');
    },

    onData: function(data) {
        console.log('DATA: ' + data);
    },

    messagePrompt: function() {
        var _this = this;

        prompt.start();
        prompt.get(['message'], function(err, result) {
            try {
                if (err) {
                    throw err;
                }

                if (result.message == 'exit') {
                    _this.client.destroy();
                    return 1;
                }
                
                _this.client.write(result.message);
            } catch (e) {
                console.log(e);
            }

            _this.messagePrompt();
        });
    }
};
