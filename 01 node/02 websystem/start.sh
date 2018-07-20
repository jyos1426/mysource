#!/bin/sh

#CPU TARGETING..
#ex1) 8
#ex2) 8,9
#ex3) 0-23

CPU_TARGET_NUMS="9"

IS_ALREADY_EXECUTED=`forever list | grep 'server.js' | awk '{print $6}'`

if [ ! "$IS_ALREADY_EXECUTED" == "" ] ; then
	echo "Daemon is already running. Restart Daemon~~"
	./node_modules/forever/bin/forever stopall > /dev/null
fi

NODE_ENV=production ./node_modules/forever/bin/forever start ./server.js 

FOREVER_PID=""
NODE_PID=""

while [[ "$FOREVER_PID" == "" || "$NODE_PID" == "" ]] ;
do
	FOREVER_PID=`forever list | grep 'server.js' | awk '{print $6}'`
	NODE_PID=`forever list | grep 'server.js' | awk '{print $7}'`
done

echo "## CPU Targeting (${FOREVER_PID}) [1/2]"
taskset -cp $CPU_TARGET_NUMS $FOREVER_PID > /dev/null

#CPU TARGETING CHECK
FOREVER_PID_CHECK=`taskset -cp $FOREVER_PID`
if [ ! $CPU_TARGET_NUMS == ${FOREVER_PID_CHECK#pid*:} ] ; then
	echo "[ERROR] cpu targeting fail(${FOREVER_PID})"
	exit 1
fi

echo "## CPU Targeting (${NODE_PID}) [2/2]"
taskset -cp $CPU_TARGET_NUMS $NODE_PID > /dev/null

NODE_PID_CHECK=`taskset -cp $NODE_PID`
if [ ! $CPU_TARGET_NUMS == ${NODE_PID_CHECK#pid*:} ] ; then
	echo "[ERROR] cpu targeting fail(${NODE_PID})"
	exit 1
fi

echo "done."


