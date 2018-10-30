# Extract public transports from OSM

## First extract

Heavily use of overpass

 * execute csv-route-master-world.overpass.ql.txt on overpass-turbo
 * that output all.csv
 * `export_by_id.sh` to query overpass by id
 * that extract *.osm raw files
 * `node partitonate` from parent directory that contains all osm files
 * that will convert osm file to geojson
 * and extract geohashes for lines
    * line : geohashes*
    * line : geohashes*
    * line : geohashes*
 * `split-partitionate` will build geohash files that contains all line at this geohash
    * geohash : lines*
    * geohash : lines*
    * geohash : lines*
    
## TODO

From osm files, build the database that could run the diff files