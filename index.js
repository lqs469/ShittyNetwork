const http = require('http');
const player = require('play-sound')();

const webSite = process.argv.length > 2 ? process.argv.splice(2) : '';

function alert() {
    player.play('ahh.wav', function(err) {
        if (err) throw err;
    });
}

function unexceptionHandler(e) {
    alert();
    console.log(e);
    this.socket && this.socket.destroy();
}

function ping(host) {
    const startTime = new Date();
    http.get(
        {
            host,
            timeout: 3000,
        },
        res => {
            const endTime = new Date();
            const spendTime = endTime - startTime;
            const [s] = res.statusCode.toString();
            if (s === '2' || s === '3') {
                console.log(`${host}: ${spendTime}ms`);
            } else {
                unexceptionHandler(res);
            }
        }
    )
        .on('error', unexceptionHandler)
        .setTimeout(3000, unexceptionHandler);
}

let counter = 1;
setInterval(() => {
    process.stdout.write('\x1Bc');
    console.log(` ${counter++ * 3}s...`);
    webSite.forEach(site => {
        ping(site);
    });
}, 3000);
