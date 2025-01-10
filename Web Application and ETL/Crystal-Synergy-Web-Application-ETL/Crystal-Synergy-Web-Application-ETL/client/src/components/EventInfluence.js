import React, { useState } from 'react';
import axios from 'axios';
import './EventInfluence.css';
import chart1 from '../assets/proportionofsales.png';
import chart2 from '../assets/annualpurchaseratebyterritory.png';
import chart3 from '../assets/quarterlyperformancebyregion.png';
import chart4 from '../assets/quarterlypurchaserateandeventfrequency.png';
import chart5 from '../assets/purchaserateandeventfrequency.png';

const EventInfluence = () => {
  const [eventFrequency, setEventFrequency] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  //State for Purchase Rate prediction
  const [eventFrequencyPurchase, setEventFrequencyPurchase] = useState('');
  const [yearPurchase, setYearPurchase] = useState('');
  const [quarterPurchase, setQuarterPurchase] = useState('');
  const [purchaseRateResult, setPurchaseRateResult] = useState(null);
  const [loadingPurchase, setLoadingPurchase] = useState(false);

  // Proportion of Sales prediction
  const handleSubmit = async () => {
    if (!eventFrequency || !year || !month) {
      alert('Please fill in all the fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/calculate-proportion', {
        event_input: parseInt(eventFrequency, 10),
        target_year: parseInt(year, 10),
        target_month: parseInt(month, 10),
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating proportion of sales:', error);
      alert('There was an error calculating the proportion of sales. Please try again.');
    }
    setLoading(false);
  };

  // Purchase Rate prediction
  const handlePurchaseRateSubmit = async () => {
    if (!eventFrequencyPurchase || !yearPurchase || !quarterPurchase) {
      alert('Please fill in all the fields.');
      return;
    }

    setLoadingPurchase(true);
    try {
      const response = await axios.post('http://localhost:5000/predict-purchase-rate', {
        eventFrequency: parseInt(eventFrequencyPurchase, 10),
        year: parseInt(yearPurchase, 10),
        quarter: parseInt(quarterPurchase, 10),
      });
      setPurchaseRateResult(response.data);
    } catch (error) {
      console.error('Error calculating purchase rate:', error);
      alert('There was an error calculating the purchase rate. Please try again.');
    }
    setLoadingPurchase(false);
  };

  return (
    <div className="event-influence-container">
      <h1>Event Influence</h1>
      <h2>Proportion of Sales Prediction</h2>
      <div className="input-section">
        <label htmlFor="eventFrequency">Event Frequency:</label>
        <input
          type="number"
          id="eventFrequency"
          value={eventFrequency}
          onChange={(e) => setEventFrequency(e.target.value)}
        />
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <label htmlFor="month">Month (1-12):</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>
      {result && (
        <div className="result-section">
          <h3>Prediction Summary</h3>
          <p><strong>Months Ahead:</strong> {result.months_ahead}</p>
          <p><strong>Predicted Proportion of Sales:</strong> {result.predicted_sales.toFixed(5)}</p>
        </div>
      )}


    {/*Proportion of Sales Content*/}
    <div className="detailed-content">
        <h2>What is the Proportion of Sales?</h2>
        <p>The proportion of sales represents the number of accounts that made purchases out of the total accounts within a specific period, typically measured by month.</p>

        <h2>Why We Performed the Analysis</h2>
        <p>Leveraging available data, we conducted an analysis to investigate potential correlations between the number of purchasers out of all purchasers and the number of events attended by Crystal D from 2018 to 2021.</p>

        <h2>How We Performed the Analysis</h2>
        <p>We conducted correlation analysis, linear regression analysis, and significance testing on two key variables: the proportion of sales and event frequency. To increase the accuracy of the analysis, we examined data over 48 months, covering the 4-year period. The dependent variable, the proportion of sales, was manually calculated by dividing the number of purchasing accounts in each month by the total number of accounts. The independent variable, event frequency, represents the number of events attended by Crystal D each month.</p>
        <p>First, we calculated the Correlation Coefficient of the relationship between event frequency and proportion of sales, which indicates the strength of the relationship between the two variables. A value greater than 0.7 would be considered a strong relationship.</p>
        <p>Second, we conducted a linear regression analysis to see how changes in event frequency could predict changes in the proportion of sales.</p>
        <p>Last, we performed a significance test to determine whether the observed relationship between the two variables was statistically significant enough to draw conclusions that the event frequency is positively related to the proportion of sales.</p>

        <h2>Results</h2>
        <p>The sales proportion has been fluctuating across 2018-2021, with a significant drop in April 2020. Generally, the sales proportion rate was decreasing. The event frequency distribution indicates that Crystal D's event attendance mostly happened during summer and fall.</p>
        <div className="chart-container">
            <img src={chart1} alt="Chart 1: Sales Proportion 2018-2021" className="chart-image" />
        </div>
        <p>From the correlation analysis, we found the correlation coefficient between sales proportion and event number is 0.20246001902272598. Correlation coefficient measures the strength and direction of the linear relationship between the number of events and the proportion of sales. A correlation coefficient of 0.2-0.3 shows a weak linear relationship between two variables.</p>
        <p>From the linear regression analysis, we found the regression coefficient is 8.76 × 10^-5 and the intercept is 0.0043. It indicates that for each additional event Crystal D attended, the proportion of sales increases by 8.76 × 10^-5. The intercept means that when there are no events, the proportion of sales is expected to be approximately 0.00434. Although this increase in proportion of sales appears small, it is reasonable given that the proportion of sales across each month is below 0.007, usually between 0.006 and 0.005.</p>
        <p>From the significance test, the result showed a p-value of 0.168, which is greater than the commonly used significance threshold of 0.05. This means that the test failed to reject the null hypothesis, suggesting there is no significant linear relationship between sales proportion and event numbers.</p>

        <h2>Insights</h2>
        <p>Sales proportion decreased during 2018-2022, as shown in the graph. This could represent a decrease in account engagement from 2018 to 2022. However, the graph only captures the data from 2018-2022. Since the total revenue grew significantly in the year 2022, the proportion of sales for 2022 and 2023 are expected to show a growing trend.</p>
        <p>Although there is no significant relationship between the event frequency and the proportion of sales, we still designed a prediction feature that allows users to have a general estimation of the expected proportion of sales in the future. We believe that one key reason for the insignificant relationship is due to the data volume, which 48 months of data would not provide a representative relationship for predicting proportion of sales.</p>
        <p>The event frequency dataset only contains the trade shows that Crystal D participated in from 2018-2022. This dataset does not contain event data on phone calls, sales meetings, or other types of client engagements that Crystal D conducted in those years. Due to insufficient data on phone calls and sales meetings, we could not include these variables in the event frequency analysis. We believe, however, that a more comprehensive and diverse event dataset could yield different results, potentially supporting the proportion of sales prediction.</p>
      </div>

       {/* Purchase Rate Prediction Section */}
       <h2>Purchase Rate Prediction</h2>
      <div className="input-section">
        <label htmlFor="eventFrequencyPurchase">Event Frequency:</label>
        <input
          type="number"
          id="eventFrequencyPurchase"
          value={eventFrequencyPurchase}
          onChange={(e) => setEventFrequencyPurchase(e.target.value)}
        />
        <label htmlFor="yearPurchase">Year:</label>
        <input
          type="number"
          id="yearPurchase"
          value={yearPurchase}
          onChange={(e) => setYearPurchase(e.target.value)}
        />
        <label htmlFor="quarterPurchase">Quarter (1-4):</label>
        <input
          type="number"
          id="quarterPurchase"
          value={quarterPurchase}
          onChange={(e) => setQuarterPurchase(e.target.value)}
          min="1"
          max="4"
        />
        <button onClick={handlePurchaseRateSubmit} disabled={loadingPurchase}>
          {loadingPurchase ? 'Calculating...' : 'Calculate Purchase Rate'}
        </button>
      </div>
      {purchaseRateResult && (
        <div className="result-section">
          <h3>Prediction Summary</h3>
          <p><strong>Quarters Ahead:</strong> {purchaseRateResult.quarters_ahead}</p>
          <p><strong>Predicted Purchase Rate:</strong> {purchaseRateResult.predicted_purchase_rate.toFixed(5)}</p>
        </div>
      )}

    {/* Purchase Rate Content */}
<div className="detailed-content">
    <h2>What is the Purchase Rate?</h2>
    <p>The purchase rate represents the number of active accounts with sales out of all the active accounts within a specific period, typically measured by quarter.</p>

    <h2>Why We Performed the Analysis</h2>
    <p>Leveraging available data, we conducted an analysis to investigate potential correlations between the number of purchasers out of all the active purchasers and the number of events attended by Crystal D from 2018 to 2021.</p>

    <h2>How We Performed the Analysis</h2>
    <p>We first processed our sales dataset by removing accounts with no purchases from 2018 to 2021. These removed accounts are what we considered inactive as they do not show any sales activities in those years. We then removed accounts with cumulative sales below 500 as they are outliers that do not contribute much to Crystal D’s revenue. These accounts are considered to have minimal value to Crystal D in revenue generation. Last, we removed duplicate records and rows with missing critical information.</p>
    <p>We further performed Regional Purchase Rate Analysis and Predictive analysis. For the predictive analysis, we generated two key variables: the purchase rate per quarter, and the event frequency per quarter. To increase the accuracy of the analysis, we examined data over 16 quarters, covering the 4-year period. The dependent variable, the purchase rate, was manually calculated by summing the number of accounts with sales in a particular quarter, divided by the total number of active accounts in the same quarter. The independent variable, event frequency, represents the number of events attended by Crystal D each quarter.</p>
    <p>In order to examine the relationship between these two variables, we delayed the purchase rate by one quarter to see how the event frequency of the previous quarter affects the account engagement of the next quarter. For example, the event frequency of Q1 2018 should be used to predict the purchase rate of Q2 2018. This method provides a more reliable predictive model that we can use for purchase rate prediction.</p>

    <h2>Results</h2>
    <h3>Annual Purchase Rate by Territory</h3>
    <div className="chart-container">
        <img src={chart2} alt="Chart 2: Annual Purchase Rate by Territory" className="chart-image" />
    </div>

    <h3>Quarterly Performance by Region</h3>
    <div className="chart-container">
        <img src={chart3} alt="Chart 3: Quarterly Performance by Region" className="chart-image" />
    </div>

    <h3>Event and Purchase Rate Analysis</h3>
    <p>From the linear regression analysis, we found the regression coefficient is 0.4192111483594866 and the intercept is 45.56742223109843. It indicates that for each additional event Crystal D attended, the purchase rate increases by 0.42. The intercept means that when there are no events participated, the purchase rate is expected to be approximately 45.57%. Although this increase in purchase rate appears small, it is reasonable given the proportion of sales across each quarter does not fluctuate significantly.</p>

    <h3>Purchase Rate and Event Frequency – Central Region (2018-2022)</h3>
    <div className="chart-container">
        <img src={chart4} alt="Chart 4: Purchase Rate and Event Frequency - Central (2018-2022)" className="chart-image" />
    </div>

    <h3>Quarterly Purchase Rate and Event Frequency</h3>
    <div className="chart-container">
        <img src={chart5} alt="Chart 5: Quarterly Purchase Rate and Event Frequency" className="chart-image" />
    </div>

    <h2>Insights</h2>
<h3>Seasonal Trends Across Territories</h3>
<p><strong>Overall Peaks:</strong> Most territories experience peak sales in Q1, likely due to post-holiday demand or new fiscal budgets.</p>
<p><strong>Declines in Q3 and Q4:</strong> Sales generally dip in Q3 and Q4, suggesting a slow-down toward year-end, potentially due to budget limits or year-end planning.</p>

<h3>Territory-Specific Patterns</h3>
<p><strong>Central, Midwest, South, and West:</strong> Strong Q1 sales followed by steady declines through Q4, indicating seasonally driven demand.</p>
<p><strong>International and Unknown:</strong> Show a more even sales distribution, with Q1 leading but less prominently, indicating stable year-round demand.</p>
<p><strong>Special Territory:</strong> Unusual trend with higher sales in Q3, suggesting unique demand conditions.</p>

<h3>Strategic Insights</h3>
<p><strong>Boost Marketing in Q1/Q2:</strong> Prioritize promotions in Q1/Q2 where most territories see peak demand.</p>
<p><strong>Allocate Resources:</strong> Focus inventory and resources on territories with high Q1 demand.</p>
<p><strong>Enhance Off-Peak Strategies:</strong> Develop sales tactics for Q3/Q4 to balance seasonal dips in performance.</p>
</div>
    </div>
  );
};

export default EventInfluence;