import pymysql
import time

def connect(serverInfo):
    if serverInfo == 'mainDB':
        conDB = mainDB
    elif serverInfo == 'sniper2':
        conDB = sniper2DB
    elif serverInfo == 'sniper2B':
        conDB = sniper2BackupDB        
    elif serverInfo == 'itmac1':
        conDB = itmac1DB     
    elif serverInfo == 'itmac2':
        conDB = itmac2DB                     
    else:
        return 0

    conn = pymysql.connect(host=conDB['host'], user=conDB['user'] , password=conDB['pwd'], db=conDB['db'])
    return conn

def syncDB(data, serverInfo):
    count = findDB(data[0], serverInfo)
    if count == 0:
        return 0

    if count == None:
        return insertDB(data, serverInfo)
    else:
        return updateDB(data, serverInfo)

def findDB(ser, serverInfo):
    try:
        conn = connect(serverInfo)
        curs = conn.cursor()
        curs.execute(findSql, ser)
        rows = curs.fetchone()
        conn.close()
    except Exception as e:
        print('========sync findDB Error========')
        print(e)
        return 0
    return rows

def insertDB(data, serverInfo):
    try:
        conn = connect(serverInfo)
        curs = conn.cursor()
        curs.execute(insertSql, data)
        conn.close()
    except Exception as e:
        print('========sync insertDB Error========')
        print(e)
        return 0
    return 1

def updateDB(data, serverInfo):
    try:
        conn = connect(serverInfo)
        curs = conn.cursor()
        curs.execute(updateSql, (data[1], data[2], data[3], data[4], data[0]))
        conn.close()
    except Exception as e:
        print('========sync updateDB Error========')
        print(e)
        return 0
    return 1



if __name__ == "__main__":
    print("######  __main__  ######")
