let fs = require('fs');

let data = fs.readFileSync('data.pgn', 'utf-8');
data = data.split('\n');

const user = 'LukeNK' // LukeNK
let luke = undefined, // white 0, black 1
    elo = [];

data.forEach((line) => {

    if (line == `[White "${user}"]`) luke = 0; 
    else if (line == `[Black "${user}"]`) luke = 1;

    if (
        (luke == 0 && line.slice(0, 11) == '[WhiteElo "') ||
        (luke == 1 && line.slice(0, 11) == '[BlackElo "')
    ) {
        debugger
        for (let l1 = 0; l1 < line.length; l1++) {
            if (isNaN(parseInt(line[l1]))) {
                line = line.substring(0, l1) + " " + line.substring(l1 + 1, line.length);
            }
        }
        line = line.replace(' ', '');
        elo.push(parseInt(line));
    }
});
fs.writeFileSync('out.js', 'data = ' + JSON.stringify(elo, null, '\t'), 'utf-8')