let fs = require('fs');
let https = require('https');

https.get('https://lichess.org/api/games/user/LukeNK?tags=true&clocks=false&evals=false&opening=false&perfType=rapid', (res) => {
    let data = ''
    res.on('data', (d) => { data += d });
    res.on('end', () => {
        // data = fs.readFileSync('com_data.pgn', 'utf-8');

        const user = 'LukeNK' // LukeNK
        let luke = undefined, // white 0, black 1
            time = false, 
            elo = [];

        data = data.split('\n');
        data.forEach((line) => {
            if (line == `[White "${user}"]`) luke = 0; 
            else if (line == `[Black "${user}"]`) luke = 1;

            // set time control, CAUTION: CHESS.COM IS DIFFERENT FROM LICHESS
            if (line == '[TimeControl "600+0"]' || line == '[TimeControl "600"]') time = true;

            if (
                (luke == 0 && line.slice(0, 11) == '[WhiteElo "') ||
                (luke == 1 && line.slice(0, 11) == '[BlackElo "')
            ) {
                for (let l1 = 0; l1 < line.length; l1++)
                    if (isNaN(parseInt(line[l1])))
                        line = line.substring(0, l1) + " " + line.substring(l1 + 1, line.length);
                line = line.replace(' ', '');
                elo.push(parseInt(line));
                // flag for next game
                time = false;
            }
        });
        fs.writeFileSync('out.js', 'data = ' + JSON.stringify(elo, null, '\t'), 'utf-8')
    })

}).on('error', (e) => {
    console.error(e);
});