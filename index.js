let fs = require('fs');
let https = require('https');

https.get('https://lichess.org/api/games/user/LukeNK?tags=true&clocks=false&evals=false&opening=false&perfType=rapid', (res) => {
    let data = ''
    res.on('data', (d) => { data += d });
    res.on('end', () => {
        // data = fs.readFileSync('com_data.pgn', 'utf-8');

        const user = 'LukeNK' // LukeNK
        let luke = undefined, // white 0, black 1
            elo = [];

        data = data.split('\n');
        data.forEach((line) => {
            if (line == `[White "${user}"]`) luke = 0; 
            else if (line == `[Black "${user}"]`) luke = 1;
            else if (
                (luke == 0 && line.includes('[WhiteRatingDiff "')) ||
                (luke == 1 && line.includes('[BlackRatingDiff "'))
            ) elo.push(parseInt(line.split('"')[1]));
        });
        fs.writeFileSync('out.js', 'data = ' + JSON.stringify(elo, null, '\t'), 'utf-8')
    })

}).on('error', (e) => {
    console.error(e);
});