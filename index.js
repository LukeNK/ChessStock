let fs = require('fs');
let https = require('https');

https.get('https://lichess.org/api/games/user/LukeNK?tags=true&clocks=false&evals=false&opening=false&perfType=rapid', (res) => {
    let data = '',
        chunk = 0;
    res.on('data', (d) => { 
        data += d;
        console.log('Got chunk ' + chunk);
        chunk++;
    });
    res.on('end', () => {
        console.log('Download completed');

        const user = 'LukeNK';
        let luke = undefined, // white 0, black 1
            eloFluc = []
            elo = []; // full elo

        data = data.split('\n');
        data.forEach((line) => {
            if (line == `[White "${user}"]`) luke = 0; 
            else if (line == `[Black "${user}"]`) luke = 1;
            else if (
                (luke == 0 && line.includes('[WhiteRatingDiff "')) ||
                (luke == 1 && line.includes('[BlackRatingDiff "'))
            ) eloFluc.push(parseInt(line.split('"')[1]));
            else if (
                (luke == 0 && line.includes('[WhiteElo "')) ||
                (luke == 1 && line.includes('[BlackElo "'))
            ) elo.push(parseInt(line.split('"')[1]));
        });
        fs.writeFileSync(
            'out.js', 
            'let data = ' + JSON.stringify(eloFluc, null, '\t') + '\n' +
            'let eloData = ' + JSON.stringify(elo, null, '\t'), 
            'utf-8')
    })

}).on('error', (e) => {
    console.error(e);
});