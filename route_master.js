
var osmium = require('../osm-public-transport/osmium/lib/osmium')
var fs = require('fs')

var input_filename = process.argv[2]

var route_masters_json = fs.createWriteStream('route_master.json')
var route_master_sh = fs.createWriteStream('route_master.sh')

route_masters_json.write('[')
var handler = new osmium.Handler()
handler.on('relation', function (relation) {
  if (relation.tags('type') == 'route_master') {
    route_masters_json.write(JSON.stringify({...relation, tags : relation.tags(), members : relation.members()}, null, 2))
    route_masters_json.write(',\n')

    route_master_sh.write(`mkdir -p ${relation.tags('route_master')}\n`)
    route_master_sh.write(`osmium getid ${input_filename} r${relation.id} --progress -r -O -o ${relation.tags('route_master')}/${relation.id}.osm.pbf || echo ${relation.id}\n`)
  }
})


var reader = new osmium.BasicReader(input_filename)
osmium.apply(reader, handler)
console.log('routes from route_master extracted')
route_masters_json.write(']')
route_masters_json.end()
route_master_sh.end()