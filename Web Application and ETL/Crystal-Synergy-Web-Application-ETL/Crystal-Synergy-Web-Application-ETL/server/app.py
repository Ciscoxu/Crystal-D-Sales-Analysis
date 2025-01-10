from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2
import joblib
from datetime import datetime

app = Flask(__name__)
CORS(app)

#Load the saved time series model
time_series_model = joblib.load('time_series_model.pkl')
time_series_model_purchase = joblib.load('purchase_rate_model.pkl')

#Coefficients from the linear regression model
coefficient = 0.000087628771228481
intercept = 0.004336541002030218

#Coefficients from the linear regression model for purchase rate
purchase_coefficient = 0.4192
purchase_intercept = 45.5674

# Connect to PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        dbname='5900_test', user='postgres', password='123', host='localhost'
    )
    return conn

def build_select_columns(month, quarter):
    select_columns = ['Unq_Name', 'C1AccountNo', 'CXRecords', 'Year', 'Territory', 'annual_sales']

    # Add months or quarters based on user selection
    if month != 'All':
        select_columns.append(month)  # Add the specific month selected
    elif quarter != 'All':
        # Add all months within the selected quarter
        if quarter == 'Q1':
            select_columns.extend(['Jan', 'Feb', 'Mar'])
        elif quarter == 'Q2':
            select_columns.extend(['Apr', 'May', 'Jun'])
        elif quarter == 'Q3':
            select_columns.extend(['Jul', 'Aug', 'Sep'])
        elif quarter == 'Q4':
            select_columns.extend(['Oct', 'Nov', 'Dec'])
    else:
        # If 'All' is selected, include all months
        select_columns.extend(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])


    # Add the relevant quarter sales column based on user selection
    if quarter == 'Q1':
        select_columns.append('q1_sales')
    elif quarter == 'Q2':
        select_columns.append('q2_sales')
    elif quarter == 'Q3':
        select_columns.append('q3_sales')
    elif quarter == 'Q4':
        select_columns.append('q4_sales')
    else:
        # If 'All' is selected, include all quarters
        select_columns.extend(['q1_sales', 'q2_sales', 'q3_sales', 'q4_sales'])

    return select_columns

# Route to fetch data based on filters
@app.route('/get-data', methods=['POST'])
def get_data():
    filters = request.json
    year = filters.get('year')
    quarter = filters.get('quarter')
    month = filters.get('month')
    territory = filters.get('territory')


    # build the SELECT columns
    select_columns = build_select_columns(month, quarter)

    # build the SQL query
    query = f"SELECT {', '.join(select_columns)} FROM database_table WHERE 1=1"

    # filter by year
    if year != 'All':
        query += f" AND Year = {year}"

    # filter by territory
    if territory != 'All':
        query += f" AND Territory = '{territory}'"

    print("Executing query:", query)
    
    # Execute the query and return the result
    conn = get_db_connection()
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Convert the result to JSON and return it to the frontend
    return df.to_json(orient='records')

# Route to fetch the entire event dataset
@app.route('/get-events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    
    # Fetch all data from the event table
    query = "SELECT * FROM event_table"
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Convert the dataframe to a list of dictionaries
    event_data = df.to_dict(orient='records')

    # Send the data as json to the frontend
    return jsonify(event_data)


# Extract Account Engagement data
@app.route('/get-account-engagement-data', methods=['POST'])
def get_account_engagement_data():
    filters = request.json
    year = filters.get('year')
    month = filters.get('month')
    region = filters.get('region')
    scenario = filters.get('scenario')

    #query based on scenario
    if scenario == 1:
        #Query for purchase_rate_1
        query = "SELECT * FROM purchase_rate_1"
        if year != 'All':
            query += f" WHERE year_range = '{year}'"
    elif scenario == 2:
    # Query for purchase_rate_2
        query = "SELECT year_range, \"{}\" FROM purchase_rate_2".format(region.lower())
        if year == 'All':
            query += f" WHERE \"{region.lower()}\" IS NOT NULL"
        else:
            query += f" WHERE year_range = '{year}' AND \"{region.lower()}\" IS NOT NULL"
    elif scenario == 3:
        #QUery for purchase_rate_3
        query = "SELECT year_range, \"{}\" FROM purchase_rate_3".format(month)
        if year == 'All':
            query += f" WHERE \"{month}\" IS NOT NULL"
        else:
            query += f" WHERE year_range = '{year}' AND \"{month}\" IS NOT NULL"
    elif scenario == 4:
        # Query for purchase_rate_4
        query = "SELECT year_range, region, \"{}\" FROM purchase_rate_4".format(month)
    
        conditions = []
        if year != 'All':
            conditions.append(f"year_range = '{year}'")
        if region != 'All':
            conditions.append(f"region = '{region}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
    else:
        return jsonify({"error": "Invalid scenario"}), 400

    print("Executing query:", query)
    
    
    conn = get_db_connection()
    df = pd.read_sql_query(query, conn)
    conn.close()

   
    return df.to_json(orient='records')

#Get Full table in the Account Engagement Page
@app.route('/get-full-table', methods=['POST'])
def get_full_table():
    table = request.json.get('table')

    table_mapping = {
        'Table1': 'purchase_rate_1',
        'Table2': 'purchase_rate_2',
        'Table3': 'purchase_rate_3',
        'Table4': 'purchase_rate_4'
    }

    if table not in table_mapping:
        return jsonify({"error": "Invalid table selection"}), 400

    query = f"SELECT * FROM {table_mapping[table]}"
    print("Executing query:", query)

    conn = get_db_connection()
    df = pd.read_sql_query(query, conn)
    conn.close()

    return df.to_json(orient='records')

#The backend function for calculationg the proportion of sales
@app.route('/calculate-proportion', methods=['POST'])
def calculate_proportion():
    data = request.get_json()
    event_input = data['event_input']
    target_year = data['target_year']
    target_month = data['target_month']

    #Calculate months ahead from December 2021 - this is where the original end date for the dataset
    last_date_in_data = datetime(2021, 12, 1)
    months_ahead = (target_year - last_date_in_data.year) * 12 + (target_month - last_date_in_data.month)

    if months_ahead <= 0:
        return jsonify({'error': 'The target date must be in the future.'}), 400

    #Get the time series prediction
    forecast = time_series_model.forecast(steps=months_ahead)
    time_series_pred = forecast.iloc[-1]

    #Calculate the linear regression prediction value
    linear_pred = intercept + coefficient * event_input

    #Calculate the weighted proportion of sales
    weighted_prediction = 0.6 * linear_pred + 0.4 * time_series_pred

    return jsonify({
        'months_ahead': months_ahead,
        'predicted_sales': weighted_prediction
    })


#Route for calculating the purchase rate prediction
@app.route('/predict-purchase-rate', methods=['POST'])
def predict_purchase_rate():
    data = request.get_json()
    eventFrequency = data['eventFrequency']
    target_year = data['year']
    target_quarter = data['quarter']

    # Calculate quarters ahead from Q4 2021
    last_date_in_data = datetime(2021, 12, 31)
    target_date = datetime(target_year, (target_quarter - 1) * 3 + 1, 1)
    quarters_ahead = (target_date.year - last_date_in_data.year) * 4 + (target_date.month - last_date_in_data.month) // 3

    if quarters_ahead <= 0:
        return jsonify({'error': 'The target date must be in the future.'}), 400

    # Get the time series prediction for the purchase rate
    forecast = time_series_model_purchase.forecast(steps=quarters_ahead)
    time_series_pred = forecast.iloc[-1]

    # Calculate the linear regression prediction value for purchase rate
    linear_pred = purchase_intercept + purchase_coefficient * eventFrequency

    # Calculate the weighted prediction for purchase rate
    weighted_prediction = 0.6 * linear_pred + 0.4 * time_series_pred

    return jsonify({
        'quarters_ahead': quarters_ahead,
        'predicted_purchase_rate': weighted_prediction
    })


if __name__ == '__main__':
    app.run(debug=True)
