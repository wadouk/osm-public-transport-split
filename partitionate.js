function extractPoints(features) {
    switch (features.type) {
        case 'FeatureCollection':
            return features.features.map(extractPoints)
        case 'Feature':
            return extractPoints(features.geometry)
        case 'LineString':
        case 'Point':
            return features.coordinates
        case 'MultiLineString':
        case 'Polygon':
            return features.coordinates.reduce((a, b) => a.concat(b))
    }
}

const {readdirSync, readFileSync, mkdirSync, writeFileSync} = require('fs')
const osmtogeojson = require('osmtogeojson')
const {encode} = require('latlon-geohash')
const {join, resolve} = require('path')
const {DOMParser} = new require('xmldom')
const {clearLine, cursorTo} = require('readline')
const t0 = Date.now()
function timeToFinish(index, length) {
    const tN = Date.now()
    const msToFinish = ((tN - t0)/(length - index)) * length
    let partialHoursToFinish = (msToFinish / 1000 /*MS*/ / 60 /*S*/ / 60 /*M*/ / 24 /*H*/);
    const hoursToFinish = partialHoursToFinish.toFixed(0)
    return `${hoursToFinish} : ${((partialHoursToFinish - hoursToFinish) * 60)}`
}
const points = readdirSync(process.argv[2])
    .filter((a) => /\.osm/.exec(a))
    .map((filename, index, array) => {
        cursorTo(process.stdout, 0)
        clearLine(process.stdout, 0)
        let rest = timeToFinish(index, array.length);
        process.stdout.write(`${index}/${array.length} ${filename} ${rest}`)
        const content = readFileSync(join(process.argv[2], filename)).toString()
        try {
            const geojson = osmtogeojson(new DOMParser({
                errorHandler: function (level, msg) {
                    console.log(level, filename, msg)
                }
            }).parseFromString(content))
            writeFileSync(join(process.argv[2], '..', filename.replace(/(.+)\.osm/, (match, p1) => `${p1}.geojson`)), JSON.stringify(geojson))
            let hashes = extractPoints(geojson)
                .reduce((a, b) => a.concat(b[0].length === 2 ? b : [b]), [])
                .map(([lon, lat]) => encode(lat, lon, 5))
                .reduce((a, b) => ({...a, [b]: ''}), {});
            return {filename, hashes}
        } catch (e) {
            process.stdout.write(e.toString())
            return {filename}
        }
    })
writeFileSync(join(process.argv[2], 'partitionate.json'), JSON.stringify(points))