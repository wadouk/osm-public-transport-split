#!/usr/bin/env bash
rm $1/$1.csv
for i in $(ls $1/*.osm.pbf)
do
    rm $1/$(basename $i)-bbox.osm
    osmconvert ${i} --add-bbox-tags > $1/$(basename $i)-bbox.osm
    sleep 1
    osmium tags-filter $1/$(basename $i)-bbox.osm r/type=route_master -R -f pbf | osmconvert - --out-csv --csv='@id type ref bBox route_master colour' --csv-separator='|' >> $1/$1.csv
done