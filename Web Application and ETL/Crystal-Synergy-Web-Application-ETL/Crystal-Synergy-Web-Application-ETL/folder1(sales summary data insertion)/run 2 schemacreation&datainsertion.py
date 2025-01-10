import pandas as pd
import psycopg2
from psycopg2 import sql

# Database connection parameters
db_params = {
    'dbname': '5900_test',    
    'user': 'postgres',    
    'password': '123',  
    'host': 'localhost',         
    'port': '5432'               
}

# Path to the CSV file
csv_file_path = csv_file_path = 'data_insert.csv' #This dataset should be in the same folder as the code after you run the first code file


# Load CSV data into a pandas DataFrame
data = pd.read_csv(csv_file_path)

# Connect to PostgreSQL database
conn = psycopg2.connect(**db_params)
cursor = conn.cursor()


# Define the table creation query with precision for floats
table_name = 'database_table'  
create_table_query = f"""
CREATE TABLE IF NOT EXISTS {table_name} (
    Unq_Name VARCHAR(255) PRIMARY KEY,  -- Unique name, with max length of 255 characters
    C1AccountNo VARCHAR(100),  -- Account number, max 100 characters
    CXRecords VARCHAR(100),    -- CXRecords, max 100 characters
    Year INT,  -- Year as an integer
    Territory VARCHAR(50),  -- Territory, with max length 50 characters
    Jan NUMERIC(12, 2),   -- Monthly sales with two decimal precision
    Feb NUMERIC(12, 2),
    Mar NUMERIC(12, 2),
    Apr NUMERIC(12, 2),
    May NUMERIC(12, 2),
    Jun NUMERIC(12, 2),
    Jul NUMERIC(12, 2),
    Aug NUMERIC(12, 2),
    Sep NUMERIC(12, 2),
    Oct NUMERIC(12, 2),
    Nov NUMERIC(12, 2),
    Dec NUMERIC(12, 2),
    q1_sales NUMERIC(12, 2),   -- Quarterly sales
    q2_sales NUMERIC(12, 2),
    q3_sales NUMERIC(12, 2),
    q4_sales NUMERIC(12, 2),
    annual_sales NUMERIC(12, 2)  -- Annual sales
);
"""
cursor.execute(create_table_query)
conn.commit()

# Insert data into the table
insert_query = f"""
INSERT INTO {table_name} (
    Unq_Name, C1AccountNo, CXRecords, Year, Territory, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, q1_sales, q2_sales, q3_sales, q4_sales, annual_sales
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Loop through each row in the dataframe and insert it into the PostgreSQL table
for _, row in data.iterrows():
    cursor.execute(insert_query, tuple(row))

conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print(f"Data from {csv_file_path} has been successfully inserted into {table_name}!")
