const axios = require('axios');
const { promisify } = require('util');
const parseString = promisify(require('xml2js').parseString);
const program = require('commander');

program
    .usage('[options] <urls ...>')
    .version('0.1.0')
    .parse(process.argv);

const sizePromises =  program.args.map(getSizeFromRssUrl);
Promise.all(sizePromises).then(sizes => {
    for (let i = 0; i < program.args.length; i++) {
        console.log(`${program.args[i]}: ${printFilesize(sizes[i])}`);
    }

    const totalSize = sizes.reduce((size, totalSize) => size + totalSize, 0);
    console.log(`Total size: ${printFilesize(totalSize)}`);
});

function printFilesize(filesize) {
    return `${filesize / 1000000000}GB`
}

async function getSizeFromRSS(rawRSS) {
    const rss = await parseString(rawRSS);
    const channel = rss.rss.channel[0];
    
    return totalSize = channel.item
        .map(getItemSize)
        .reduce((size, totalSize) => size + totalSize, 0);
}

async function getSizeFromRssUrl(url) {
    const result = await axios.get(url);
    return getSizeFromRSS(result.data);
}

function getItemSize(item) {
    return parseInt(item.enclosure[0].$.length, 10);
}
