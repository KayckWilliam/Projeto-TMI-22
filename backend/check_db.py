import sqlite3

conn = sqlite3.connect('ConselhoTutelar.db')
cursor = conn.cursor()

# Lista todas as tabelas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [row[0] for row in cursor.fetchall()]
print("Tabelas no banco:", tables)

# Verifica estrutura da tabela filiacao
if 'filiacao' in tables:
    cursor.execute("PRAGMA table_info(filiacao)")
    columns = cursor.fetchall()
    print("\nColunas da tabela filiacao:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")

conn.close()
