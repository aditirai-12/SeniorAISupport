import psycopg2

connection = psycopg2.connect(
    database="asrak",
    user="asrak",
    password="mkm!KHaleeL",
    host="localhost",
    port="5433"
)

cursor = connection.cursor()
query = "SELECT * FROM MAKE;"
cursor.execute(query)

result = cursor.fetchall()

for row in result:
    print(row)

cursor.close()
connection.close()


