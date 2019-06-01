---
layout: page
title: Executive Summary
---

| Deliverable | Business Value| Delivery Method|
|-------|-------|-------|
|Predictive Model for Downtime | Reducing manual data entry & data accuracy | Python code|
|Executive Level Dashboard|Quick access to well performance for executive level|Tableau link: Executive Dashboard| 
|Operator Level Dashboard | Quick access to the data for field operators to help drive data accuracy as well as increase well performance insight |Tableau links: Lost Production and Downtime |
| Mobile App | Combination of the two dashboards for access on the go | Tableau mobile view |
|Web app | Web app to allow data entry of well characteristics and estimate most likely downtime code | Web page |
| Analysis of Data | Overall analysis of both data and model | This report|
| Executive Slide Deck | Quick summary for executive level of this entire analysis | PowerPoint presentation|

- [Problem Statement](#problem-statement)
- [Data Description](#data_desc)
- [Data Manipulation](#data_manip)
- [Analysis and Modeling](#analysis)
- [Dashboards](#dashboards)
- [Conclusions](#conclusions)
- [Recommendations](#recommendations)

# Problem Statement <a name="problem-statement">
Six weeks ago, ABC Oil & Gas approached the project team to work on a solution for a time-consuming and inefficient task: entering oil and gas well downtime in the system of record (SoR). This task is currently performed manually each day by each field operator. Not only is this data entry inefficient and expensive, but it also introduces a source for errors and inconsistencies. The project team worked on this problem to build a solution to reduce the need for manual data entry. This will enable the field operators to spend more time optimizing production as well as reduce overall data entry errors in the downtime SoR, leading to higher quality examination and analysis of well downtime.

The solution that the project team will deliver will include the following:
- A model to automatically code well downtime based on alarm data
- A dashboard for examination of past outages
- A Python application for performing data preparation and modeling

# Data Description <a name="data_desc">
The data provided by ABC Oil and Gas is a snapshot from both the SCADA alarm system and the downtime SoR. The data spans Q4 2017 through Q1 2019. The Alarm Data describes events which triggered a SCADA alert. Each record is an alarm instance, and there may be multiple alarms on the same day. Records have timestamps indicating the time the alarm fired, location, and the condition which caused the alarm to be produced. By contrast, the Downtime Data table contains information filled out by operators to characterize interruptions in well production. Each day may have only a single downtime record. Records contain some identifying information regarding the well, the type of well, the impact to production, and categorization of the downtime causes.

# Data Manipulation <a name="data_manip">
The project team decided to parallelize the efforts on data wrangling as it was unclear on how to best treat the data. This led to two initial different data sets and models. An illustration of this is seen to the right in Figure 1.

One team member chose an approach that allowed the consolidation of codes through a fifteen-minute sliding window. They hoped to group alarms together that were caused by the same event. This was achieved by grouping all of the alarm data into fifteen-minute segments and then keeping the first alarm for each segment. This substantially reduced duplication within the data set and allowed the model a better chance at learning a pattern for applying a label to a given alarm condition. This is illustrated in Figure 2. The purple outlines show the time windows, and the yellow highlighted record indicate which record is kept for each window.

The other workflow consolidated all the alarms by well pad into encoded columns with frequency counts of each type of alarm. This allowed all alarm data to be used while the alarm records for each pad remained the same input size. This also helped capture relationships where the frequency of a particular alarm might impact the actual downtime code. A small snapshot of what this looks like is pasted below in Figure 3.

![Project goals](../../assets/workflows.png)

The data manipulation that worked best when it came to modeling was the windowing method. This allowed the model to accurately predict the downtime code around 60 percent of the time.

![Project goals](../../assets/minute_intervals.png)
![Project goals](../../assets/collapsed_alarms.png)

# Analysis of Data and Modeling <a name="analysis">
After the initial split of different engineering techniques, the project team continued to work in parallel to develop different modeling approaches, Workstream 1 and Workstream 2. Workstream 1 took a more traditional approach, iteratively creating different individual models and refining parameters as they went. The initial models included a deep neural network, random forest, and a light GBM model. However, the results of these first models performed poorly and the project team identified that this was due to the large class imbalance in the downtime coding outputs. As a result, Workstream 1 tried to remove any downtime code that constituted less than 20 percent of the data to help with the class imbalance. While this increased the model accuracies to almost 45 percent, the project team wanted to push the data as far as possible and attempt to create a better model.

![Project goals](../../assets/encoding.png)

Workstream 2 used the lessons learned from the other group and decided to take a different approach towards the massive class imbalance that existed within the downtime coding.  They consolidated the data set into four general groups which greatly increased the precision and recall of the models. The code reduction was done in conjunction with feedback from the SME and business to ensure an accurate and representative result could be digested by the business for quarterly and yearly performance reporting.  Workstream 2 obtained a trial license to the software DataRobot which allows users to quickly iterate through hundreds of different machine learning algorithms and find ones that produce the best results for their problem. This significantly reduced the amount of time associated with mixing and matching models to find the best result. With the use of DataRobot, the team was able to arrive and refine a model over the course of two business days. The best model from the two workstreams was a result from DataRobot. Specifically, **the team chose an XGBoost model that resulted in 60 percent balanced accuracy,** the best out of any other modeling efforts.

# Dashboards <a name="dashboards">
Another deliverable of this project pertained to the development a dashboard that both executives and field operators could more efficiently analyze outages and improve production. When developing dashboards the team determined that a ‘one-size-fits-all’ approach would be an unfortunate compromise, so the team developed three dashboards and a mobile application. The team identified two key audiences.  First, that of the CEO and executive leadership team. These people would be focused on high level production and year-over-year performance. By contrast, operators would find a more detailed overview of the pads and wells helpful for solving immediate and problems and identifying troubling short-term trends. 

The Executive Summary dashboard highlights geography, population of wells, gas production, oil production, downtime, lost gas, and lost operator production hours. The last metric, lost operator production, is what will ultimately decrease due to the model’s ability to expedite the process of imputing downtime codes. Through the trending and drill-down abilities of this dashboard, the CEO and executive leadership can focus on high-achieving and poor performing wells with a high level of detail. The team also understood that the CEO and executive leadership team is busy and often traveling so we developed a mobile view which optimizes our dashboards for a mobile screen so that production and performance can be monitored on-the-go. 

The second set of dashboards are tailored for operator use. These are Lost Production and Downtime. Due to the large number of pads and wells, the team determined it best to bifurcate the dashboards. This allows the operators to drill into the data and makes the visualizations comprehensible due to the large amounts of colors needed for the stacked bars—once again because of the large number of pads, wells and downtime codes.

Lastly, the team created a proof-of-concept web application that takes in test inputs and shows the value predicted by the model. This application allows both operators and officers to see how the automatically generated or static inputs might be programmatically converted to actionable outage data. This data then might be automatically ported into the SoR, saving operators the labor of manually inputting numerous (often redundant) encodings. Images of each of the dashboards and web app are shown in Figure 8.

![Project goals](../../assets/dashboard_survey.png)
![Project goals](../../assets/mobile_dash.png)
![Project goals](../../assets/operational_dash.png)
![Project goals](../../assets/data_recording_app.png)

# Conclusions <a name="conclusions">
The project team was able to deliver a model that is accurate roughly 60 percent of the time. This allows ABC Oil & Gas to implement a model which can predict the downtime for each well on a given day, and then have the field operator validate the data. 
1. Class imbalance led to the need to coalesce the original 15 outage codes into 4 simplified codes. This modification to the data model still preserved the majority of nuance conveyed through the original 15 codes.
2. The model was able to capture 60 percent accuracy when compared to what operators manually input. 
3. Analyzing feature importance, each pad seemed to show its own behavior in relating alarms to downtime. Intuitively, this makes sense as each pad has equipment differing by age, model, geography, and is thus subject to different types of problems.
4. Reducing the full-time equivalent time required to enter downtime by 75 percent as the algorithm will be able to get the downtime code correct but will still need validation by the operator to further train the model. Previous efforts of entering downtime took each of the 35 field operators 20 minutes per day to enter, or 700 minutes per day. This project will decrease this value to just 175 minutes, or 5 minutes per operator per day. This translates to **$4MM savings per year in operator time alone. This time can be spent optimizing production, which will show even more value to ABC Oil & Gas.**

# Recommendations <a name="recommendations">
The project team has delivered a viable algorithm to predict well downtime. This model should be implemented to allow ABC Oil & Gas to begin reaping the value of this project. As with any model, though, there are pieces of data that would greatly enhance the model’s capabilities. Below are the project team’s recommendations for next steps for both implementation and future steps to build a more robust model.
1. Implement the final model in production environment for use in automatically encoding downtime.
2. Require validation of automated entries. This will help future iterations of the model and ensure consistency with the existing SoR.
3. Continue to collect downtime and alarm data. This will improve future versions of the model and assist in reducing the class imbalance.
4. Distribute and train the field operators on how to use the operator level dashboard and mobile app for consumption.
5. Begin collecting real-time production data. Coupling the real-time alarm and production data would enable the algorithms to better identify the important alarms by informing the model when production was down and knowing that the alarms preceding this event are what should inform the model to identify the downtime code. (See illustration below.)

![Project goals](../../assets/alarm_data.png)