import sqlite3
import pandas as pd

# 1. Connect to your SQLite database file
conn = sqlite3.connect('telemetry.db')

# 2. Load the raw telemetry table into a DataFrame
df = pd.read_sql_query("SELECT * FROM telemetry", conn)
print("⏳ Original data:")
print(df)

# 3. Drop any rows where engine_rpm or fuel_level is null or out of expected range
df_clean = df.dropna(subset=['engine_rpm', 'fuel_level'])
df_clean = df_clean[(df_clean['fuel_level'] >= 0) & (df_clean['fuel_level'] <= 100)]

# 4. Save the cleaned data back to a new table and CSV
df_clean.to_sql('telemetry_clean', conn, if_exists='replace', index=False)
df_clean.to_csv('cleaned_telemetry.csv', index=False)

print("\n✅ Cleaned data:")
print(df_clean)

conn.close()