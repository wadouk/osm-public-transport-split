const {readdirSync, readFileSync, mkdirSync, writeFileSync} = require('fs')
const {join, resolve, dirname} = require('path')
let root = process.argv[2]

const partition = JSON.parse(readFileSync(root).toString())
const hashes = partition.map(p => {
    return p.hashes ? Object.keys(p.hashes).map(key => {
        return {
            filename: p.filename,
            hash: key
        }
    }) : undefined
})
    .filter(Boolean)
    .reduce((a, b) => {
        return a.concat(b)
    }, [])
    .reduce((a, b) => {
        a[b.hash] = [].concat(a[b.hash]).concat(b.filename).filter(Boolean)
        return a
    }, {})

Object.entries(hashes)
    .forEach(([key, value]) => {
        writeFileSync(join(dirname(root), 'geohashes', `${key}.json`), JSON.stringify(value))
    })

writeFileSync(join(dirname(root), 'geohashes.csv'), Object.entries(hashes)
    .map(([key, value]) => {
        return `${key}:${value.length}`
    }).join('\n'))