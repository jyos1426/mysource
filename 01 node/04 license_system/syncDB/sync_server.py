import sys, datetime, time
import server.local as local
import server.sync as sync


path = '/home1/seriallicense/-/log/'
logFile = datetime.datetime.now().strftime('%Y%m%d') + '.log'
failLogFile = 'fail_' + datetime.datetime.now().strftime('%Y%m%d') + '.log'


syncList = local.findDB()
if syncList == 0 or len(syncList) ==  0:
    print('done')
    sys.exit()

maindb = 0
sniper2 = 0
sniper2B = 0
itmac2 = 0
flag = 0

for data in syncList:
    if len(data) != 5:
        continue
    if data[1] == None:
        continue
    
    maindb = sync.syncDB(data, 'mainDB')

    if data[0][1:3] == 'KR':
        sniper2 = sync.syncDB(data, 'sniper2')
        sniper2B = sync.syncDB(data, 'sniper2B')
        flag = 1 if sniper2 == 1 and sniper2B == 1 and maindb == 1 else 0
    elif data[0][1:3] == 'JP':
        itmac1 = sync.syncDB(data, 'itmac1')
        itmac2 = sync.syncDB(data, 'itmac2')
        flag = 1 if itmac1 == 1 and itmac2 == 1 and maindb == 1 else 0
    else:
        flag = 1 if maindb == 1 else 0


    if flag == 1:
        local.updateDB(data)
        nowTime = datetime.datetime.now().strftime('%Y%m%d %H:%M:%S')

        with open(path + logFile, 'a') as fp:
            fp.write( str(data) + " : " + nowTime + "\n" )
    else:
        nowTime = datetime.datetime.now().strftime('%Y%m%d %H:%M:%S')

        with open(path + failLogFile, 'a') as fp:
            fp.write( str(data) + " : " + nowTime + "\n" )


sys.exit()