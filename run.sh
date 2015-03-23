#!/bin/bash
#node=/home/pi/node-v0.10.2-linux-arm-pi/bin/node
node=/usr/local/bin/node
log=/home/pi/vera-houm/server.log
server=/home/pi/vera-houm/drivers.js

#su pi -c "$node $server 2>&1 >> $log"

while true
do
	su pi -c "XBMC_HOST=raspbmc HOUMIO_BRIDGE=houm:3001 VERA_IP=192.168.0.30 $node $server 2>&1 >> $log"
	sleep 1
done
