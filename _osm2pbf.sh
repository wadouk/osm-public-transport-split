for f in $(find . -name *.osm);
do
    t=$(basename $f)
    osmium cat -o $(dirname $f)/${t%.osm}.pbf $f
done