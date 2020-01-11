#!/bin/bash
SRCDIR=../../vscode-restclient/src

#fgrep -rw import . | grep "\.ts\:" | grep -v ": *//" 
#echo ----------------------------------------------------------------
#fgrep -rw import . | grep \.ts\: | grep -v ": *//" | sed -e "s/\(.*\):.*[\"']\([^\"']*\)[\"'].*/\1\t\2/"
#echo ----------------------------------------------------------------
function findd() {
	EFULL=0
        fgrep -rw $1 . | grep \.ts\: | grep -v ": *//" | sed -e "s/\(.*\):.*[\"']\([^\"']*\)[\"'].*/\1\t\2/" | while read f d; do
                if [[ $d == \.* ]]; then
                        D=`dirname $f`
                        #DD=$D/$d
                        #echo $DD
                        P=`realpath -m --relative-to=. $D/$d`
            		if [ -f $P.ts ]; then
            		    :
            		else
            		    EFULL=1
                    	    echo $P.ts "(from $f)"
                    	    mkdir -p `dirname $P` 2> /dev/null
                    	    cp $SRCDIR/$P.ts $P.ts
                    	fi
                #else
                #        echo "    $d"
                fi
        done
        return $EFULL
}


cd src
mkdir -p controllers 2> /dev/null
cp $SRCDIR/controllers/RestClient.ts controllers/

while : ; do
    findd "import"
    EF1=$?
    findd "require"
    EF2=$?
    [[ $EF1 -gt 0 || $EF2 -gt 0 ]] || break
done
