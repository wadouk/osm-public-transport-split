#!/usr/bin/env bash
#set -x
set -euo pipefail
export overpass_host="http://overpass.openstreetmap.fr/api"
IFS=$'\n'
rm all.sh
lines=$(cat $1 | tail -n +2 )
for line in ${lines}
do
    type=$(echo ${line} | cut -d'|' -f 3)
    id=$(echo ${line} | cut -d'|' -f 2)
    echo curl -s -o ${type}_$id.osm "${overpass_host}/interpreter?" --data-urlencode "data=[out:xml][timeout:20];relation(${id});(._;>>;);out;" >> all.sh
done