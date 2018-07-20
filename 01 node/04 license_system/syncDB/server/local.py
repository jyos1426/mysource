import pymysql
import time

host=''
user=''
password=''
db=''

selectSql = "SELECT ser, lic, date, limit_date, ver FROM master WHERE ser = %s "
findSql = "SELECT ser, lic, ver, date, limit_date FROM master WHERE sync=0 and lic IS NOT NULL"
updateSql = "UPDATE master SET sync=1 WHERE ser=%s"

def connect():
    conn = pymysql.connect(host=host, user=user, password=password, db=db)
    return conn

def findDB():
    try:
        conn = connect()
        curs = conn.cursor()
        curs.execute(findSql)
        rows = curs.fetchall()
        conn.close()
    except Exception as e:
        print('========local find Error========')
        print(e)
        return 0
    return rows

def updateDB(data):
    try:
        conn = connect()
        curs = conn.cursor()
        curs.execute(updateSql, (data[0]))
        conn.close()
    except Exception as e:
        print('========local updateDB Error========')
        print(e)
        return 0
    return 1
