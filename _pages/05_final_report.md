---
layout: page
title: Final Report
---

- [Problem Statement and Project Scope](#problem_statement)
- [Data](#data)
    -[Overview](#data_overview)
    -[Description](#data_desc)
    -[Preparation](#data_prep)


# Problem Statement & Project Scope <a name="problem_statement">
Six weeks ago, ABC Oil & Gas approached the project team to work on a solution for a very time consuming and inefficient task: that of entering oil and gas well downtime in the system of record (SoR). This task is currently performed manually each day by each field operator. Not only is this data entry inefficient and expensive, but it also introduces a potential source for errors. The project team has been working for the last four weeks on the problem to build a solution to reduce the manual data entry. This will enable the field operators to spend more time optimizing production as well as reduce data errors in the downtime SoR, leading to higher quality examination and analysis of well downtime. 

![Project goals](../../assets/alarm_field_population.png)

The project team hoped to deliver a solution that included the following:
- A multi-class classification model that automatically codes ABC O&G’s well downtime based on alarm data
- A dashboard that can make examination of past outages easier, allowing users to identify opportunities of high downtime that need addressed
- A Python application capable of repeatedly performing data preparation and modeling

# Data <a name="data">
## Overview <a name="data_overview">
ABC oil and gas provided a snapshot of data from both the SCADA alarm system and the downtime system of record. The philosophy guiding system alerts changed in mid-2017, causing the company to make major changes to the alarm system and its constituent sensors. As a result, the data was only available starting in Q4 2017 through the end of Q1 2019. This data was housed in two separate tables: Alarm Data and Downtime Data. The Downtime Data table had approximately 215,000 records while the Alarm Data table had approximately 169,000 records. A data dictionary is included for reference in the appendix section.

## Description <a name="data_desc">
The Alarm Data table describes events which triggered a SCADA alerting event. Each record is an alarm instance, and there may be multiple alarms on the same day. Records have timestamps indicating the time the alarm fired, location, and the condition which caused the alarm to fire. By contrast, the Downtime Data table contains information filled out by operators to characterize interruptions in well production. Each day may have only a single downtime record. Records contain some identifying information regarding the well (though not as much detail as the alarm table), the type of well, the impact to production, and—most importantly for our purposes—categorization of the downtime by Tiers. There are four Tiers for each record and together they describe the unique downtime event: Tier 0 for surface; Tier 1, compressors and gas; Tier 2, industrial action or third party; and Tier 3, contractor or third party.

## Preparation <a name="data_prep">
The team began preparing the product by cleaning the data. Upon reviewing the data, the team requested an additional table containing well identification data. This allowed the team to merge downtime and alarm data to examine the descriptions associated with alarms. 

Preliminary analysis did not indicate an obvious path for presenting and modeling the data, so the team took two different approaches for cleaning the data. The project team thought this approach to be best as it parallelized analysis of the same original data with different wrangling methods. In both approaches, records were removed from the downtime table which contained null values for any tier codes, as these rows indicate days where wells did not have any problems and produced gas all day. Records with subsurface downtime were also removed as there were no alarms associated with this type of well production failure. The next two sections discuss the next steps in wrangling for each clean dataset. Figure 2 illustrates the data cleaning and analysis path taken by the project team as well as a preview of model accuracy.

![Project goals](../../assets/workflows.png)

### Data Engineering Method 1: “Clean Dataset 1” <a name="clean_dataset_1">
In the first data cleaning approach, which will be referred to as clean dataset 1, the team combined well fields to create a unique identifier for each well. This unique ID was made up of state, county code, and pad ID code. For preparing alarm data, the team manipulated existing fields to create pad ID, equipment ID, and point code ID. These fields were then incorporated into the model. The team modified the timestamps to collapse different alarm types onto the same days.

After manipulating the data into more useful objects, the team merged alarm data and downtime data together based on pad ID and date. This allowed the team to understand the combination of recorded events which ostensibly contributed to a well’s lack of productivity. The team used one-hot encoding to describe the events associated with downtime and associated each type of event with a different integer value. This data cleaning method produced a final input matrix of approximately 8,300 records. An illustration of the encoded and summed alarms can be seen in Figure 3.

![Project goals](../../assets/collapsed_alarms.png)

### Data Engineering Method 2: “Clean Dataset 2” <a name="clean_dataset_2">
The second data wrangling process as is referred to as “clean dataset 2.” The team first created a dictionary for replacement in Python which would take a unique identifier knows as “PUDNAME” and tie it to a “padname” as well as a “well name”.  The “PUDNAME” ID referenced the alarm data and the well name referenced the downtime data, so creating the dictionary allowed for a replacement and unique reference to join the datasets on. The team relied on regular expressions to clean and format the text into useful forms. The same cleaning steps were performed on the other two datasets, downtime data and well data, to ensure consistent formatting across data. 

One challenge presented in merging this data was that the records were recorded at different time intervals. When a join was performed, not all the data was merged correctly as the alarm data has timestamps. This is because alarms can happen throughout the day and the downtime data had only has a date reference. Another concern pertained to the possibility of duplicating alarm data. Because the data was already imbalanced, this was a very big problem. After engaging the subject matter expert from ABC, we learned that alarms can cascade from a single originating event. That is, one event may trigger several alerts. With this new knowledge, the team created a function that provided a window of buffer time and then indexed the first and last event in a given time.  The function took user input of the time window for which to group the alarms as a parameter. Four datasets were created with this function: 10-minute, 15-minute, 30-minute, and 60-minute intervals for grouping alarms. Once the data was indexed the 140,000-row alarm dataset collapsed into a more manageable size of 18,000 rows to join to the downtime data. The total number of records in the final input matrix using this method produced a similar number of records versus the method used to produce clean dataset around 8,000 records. An example of the windowing method used for this dataset can be seen in Figure 4.

![Project goals](../../assets/minute_intervals.png)

# Data Analysis and Modeling <a name="data_analysis">
After performing data cleaning and wrangling, the team engaged in exploratory data analysis (EDA). This allowed the team to gain more familiarity and insight with the data.  Several discussions emerged with the SME from ABC to address concerns the team had when attempting to create a model that would accurately provide a consistent labeling algorithm for us in daily business operations.  The team also discussed how the company might do away with the tiered approach for downtime labeling.

Much like the data engineering, the team team took a two-pronged approach toward modeling: the two analysts worked in parallel through different workstreams and methodologies, consulting with the SME at different intervals and ultimately presenting each case to the SME and business owners to decide the final implementation. 

Before discussing the modeling approaches, the metrics for model comparison ought to be discussed. Both accuracy and balanced accuracy were used as scoring metrics. Accuracy is the percentage of predicted data compared to test data that is correct. In classification predictions, however, this is not always a good reflection of how good the model is at predicting the correct values. This is where balanced accuracy comes into play. Balanced accuracy considers the predictions for each subclass. Figure 5 shows the difference. While accuracy was used as a metric, the overall metric for which models were scored was balanced accuracy.

![Project goals](../../assets/balanced_labels.jpeg)

## Modeling and Analysis: Workstream 1 <a name="workstream_1">
For the first workstream, Workstream 1, several variants of deep neural networks were tested. The variations consisted primarily of differing input features and differing combinations of the response variables. For instance, the team included at different times, all three downtime codes separated, all three downtime codes encoded, Tier Two and Tier Three codes separated, and Tier Two and Tier Three encoded. Describing codes as “separated” indicates use of the raw downtime code for a specific tier. All downtime codes were encoded regardless of combining or separating. Initial DNN models showed high overfitting of the training data, seen in Figure 6.

![Project goals](../../assets/training_validation.png)

After several variations, the model with the highest balanced accuracy of eight percent predicted the Tier Two and Tier Three using the input features of the encoded point descriptions, encoded “Value” columns, and encoded “pt_code” values from the “clean dataset 1.” This resulted in 597 input features. However, as stated earlier, the large class imbalance prevented the model from converging. To circumvent this problem, we removed the twenty percent of downtime codes with the fewest instances and kept only the top eighty percent. This resulted in the elimination of 1600 records, and only 14 of the original 177 combinations of Tier Two and Tier Three remained. This led to a model with an accuracy of approximately 45 percent. Different combinations of activation functions and nodes per layer were used through the model iterations. This technique was also performed on “clean dataset 2.”

After the DNN, the team attempted to implement a decision tree. The team started again with all of the data, but then adjusted based on the class imbalance. Unlike the DNN where the clean data was limited to the top 80 percent, with the decision tree was decided to try only the top 50 percent of the downtime data codes. This again produced models with low accuracy at only around 31 percent for “clean dataset 1.” As an effort to better deal with the class imbalance, the team employed the Synthetic Minority Oversampling Technique (SMOTE) algorithm. SMOTE uses the techniques of bootstrapping in combination with k-nearest neighbor to take the rare events or classes in a dataset and balance the overall class distribution. With this procedure, the team produced a model with a balanced accuracy of 24 percent.

Lastly, the team created a LightGBM model. LightGBM is a gradient boosting tool which uses tree-based learning algorithms. The team again combined instances of Tier Two and Tier Three downtime codes and used the most frequently appearing eighty percent. The team also employed the SMOTE algorithm to deal with class imbalances. This model was first tested with the “clean dataset 2” and showed promising results. By combining SMOTE with the LightGBM model, a balanced accuracy of 41 percent was achieved.

Each of the three model types was constructed for each dataset – clean dataset 1 & clean dataset 2 – and both the accuracy and balanced accuracy metrics were calculated. A summary table below shows each of the models and metrics.

![Project goals](../../assets/model_metrics.png)
From this table, it can be seen that the models do not typically score more than 50 percent accuracy or balanced accuracy. From these first pass models, though, it appears that the decision tree and LightGBM perform better than the DNN. The models in the table above did not outperform that of the models from the DataRobot tool.

## Modeling and Analysis: Workstream 2 <a name="workstream_2">
Aside from obvious trends in the amount of lost production per category and season, the main conclusion was how much class imbalance existed within the downtime codes across the consolidated dataset.  The team chose to model the Tier 2 downtime code after discussion with the SME and business; this was the most representative code within the three-tiered hierarchy of codes for labeling.  There were 15 total codes, which span events from weather and safety related to human interference.  The most common downtime code, “Industrial action / 3rd party,” accounted for over half of the total downtime codes whereas the second most abundant code appeared less than 20 percent of the time.  Figures 7 and 8 below provide a comparison of the data in both the pre-consolidation form and consolidated form:
![Project goals](../../assets/unconsolidated_codes.png)
![Project goals](../../assets/consolidated_codes.png)

With this data, the team again met with the SME. These discussions resulted in further consolidation of coding to four main groups to aid in the ability of the model to accurately label the downtime correctly. Along with the new suggested bucketing, the team also discussed removing any codes associated with ‘Subsurface’ related tags, as those are unrelated and normally caused by planned operator activity. The result can be seen in table below: the top four code groups contain the most important codes for driving performance in the business via measured KPIs (key performance indicators).  All codes that did not fall into the three most important surface related downtime events were grouped into a new group, Misc. – Other. 

|Tier Code | Count | Percentage|
|----|----|----|----|
|Industrial action/third party | 3,840 | 55% |
|Repair/failure | 1,542 | 22%|
|Weather/Seas/Natural events | 1,054|15%|
|Misc./other|537|8%|

Data Scientist, Tyler Peters, reached out to the company DataRobot to provide our project team with a trial license to test the new data science platform that DataRobot provides.  The platform allows any analyst or data scientist access to over a hundred different, modern machine learning algorithms which can be run through on a distributed compute (cloud) platform.  This allowed Tyler to rapidly iterate through many models to find the most suitable model based on score, speed, interpretability and deployment.  It should be noted that DataRobot provides only minimal data engineering capabilities, so the final dataset used for model training went through the cleansing and engineering discussed above.  The resulting data used to train our models was the 15-minute dataset with consolidated tier codes (4 buckets).

DataRobot chose a total of 47 models, each with varying training/-est splits, the variability in the training split is used by DataRobot to understand model performance.  If the model performs worse as it is exposed to more training data, it will drop it from the automated selection criteria. The training-test splits start at 15 percent training set and step up to the final size of 80 percent-20 percent train-test. In the figure below, you can see the results of the different models as they step through different test/train splits.  The scoring criteria decided by the modeler was balanced accuracy, since the problem is a multiclass classification, a normal accuracy measure will exaggerate the model’s ability to label downtime effectively.  Eventually, the top performing models are then exposed to the holdout set in which they can make predictions on, the holdout set was another 20 percent partition of the data that the models were never exposed to.  The holdout set is a way for the modeler to best score each model’s performance in as close to a real-world scenario as possible.

![Project goals](../../assets/datarobot.png)

The table below shows the top models chosen from the DataRobot output and allowed the data scientist to discuss the best choice for implementation with the SME and business. Note that both clean dataset #1 and clean dataset #2 are shown below for comparison.

![Project goals](../../assets/model_comparison.png)

Ultimately, the XGboost implementation of the multiclass labeler was chosen to be the model based on its overall performance and speed at which predictions could be made, providing the business with the fastest results. The dataset that provided the highest balanced accuracy was clean dataset 2, also seen in the table.  Across the board, XGboost performed the best on limited training and prediction speed, it also had a much better recall score than the next best model (LGBM).  DataRobot’s trial license does not provide the Data Scientist with the ability to export the code required to build and deploy the model, so the model had to be rebuilt.  Although rebuilding the model can be time consuming, having the ability to quickly step through many different algorithms and help the Data Scientist to choose the most appropriate model to tune is extremely value adding and cost saving.

## Winning Model: XGBoost <a name="xgboost">
When comparing both workstreams, the DataRobot XGBoost showed a clear advantage over any other model with both clean datasets. The conventional methods in workstream 1 barely achieved two thirds of the balanced accuracy of the DataRobot XGBoost model. Due to this, the XGBoost model using clean dataset 2 is the clear winner. The model understanding can be best shown below in figure X, which is a blueprint representation of the model building process, it shows all the necessary steps at a high level:

![Project goals](../../assets/xgboost_steps.png)

A feature importance plot will allow us to understand the most impactful information our model is using to determine the class labels. From the plot in Figure 6, we can see that the pad itself is one of the best variables at predicting a certain label.  At first, the project team wasn’t sure if the model was experiencing target leakage so we consulted with the SME. The SME viewed the results and agreed that pads, in general, should be rather predictive due to some of the cyclical and recurring problems that will occur on them from time to time.  These problems can occur due to location, elevation, proximity, and facility design.

![Project goals](../../assets/feature_impact.png)

Confusions matrices are the best way to interpret the results of the model’s ability to accurately predict and label downtime codes from alarm data, below we will discuss each of the four codes and the model’s performance. The table below shows the confusion matrix for the predicted codes on the holdout data set.

![Project goals](../../assets/confusion_matrix.png)

Industrial action / 3rd party was the most represented label within our dataset and the results for the model’s ability to accurate label are shown in Figure 7.  We can see that, overall, the model is quite good at labeling this correctly 77 percent of the time.  In the right side of the figure we see what the model is most likely to confuse the label with and how often.

![Project goals](../../assets/data_robot_metrics.png)

In the Misc-Other label we can see similar results within Figure 8: 

![Project goals](../../assets/data_robot_metrics_2.png)

In the Repair / Failure label we can see similar results in Figure 9:

![Project goals](../../assets/data_robot_metrics_3.png)

And finally, we can view the Weather label results within Figure 10:

![Project goals](../../assets/data_robot_metrics_4.png)

Overall, the visualizations show that the XGboost classifier works well at classifying the alarm codes with the correct tier event with a high degree of accuracy.  This will provide a significant time savings over hand-coding each event and allow operators time to focus on more productive tasks.  

# Dashboards <a name="dashboards">
Throughout the course of our project, the team relied on Tableau to construct data visualizations to help us understand the data set provided by the company. The final set of dashboards includes an [Executive Summary](https://public.tableau.com/profile/alex.schroeder#!/vizhome/abc_oil_dashboard_v2/draft?publish=yes), [Executive Summary Mobile](https://public.tableau.com/profile/alex.schroeder#!/vizhome/abc_oil_dashboard_v2/draft_mobile?publish=yes), [Lost Production](https://public.tableau.com/profile/alex.schroeder#!/vizhome/abc_oil_dashboard_v2/lost_production?publish=yes), and [Downtime](https://public.tableau.com/profile/alex.schroeder#!/vizhome/abc_oil_dashboard_v2/downtime_dashboard?publish=yes). While technically all of these dashboards are able to be viewed on mobile, the team specifically engineered the executive summary mobile utilizing Tableau’s mobile application functionality to ensure visuals displayed and interactivity operated as expected for the CEO and executive leadership team.

## Executive Dashboard <a name="exec_dash">
The first dashboard, Executive Summary, provides the CEO and executive leadership team with a high-level snapshot of production and performance for the CEO’s entire organization. Across the top of the dashboard there are a series of metrics, Number of Wells, Total Gas Production, Total Oil Production, Year Over Year (YoY) Downtime, YoY Lost Gas and Lost Operator Production (hrs). All of these metrics, with the exception of Number of Wells, are considered Key Performance Indicators (KPIs). While Number of Wells is not considered a KPI, the team decided to include it in the dashboard because the CEO announced plans to drastically increase the number of wells in the near future. The team built interactive functionality into the dashboards so that an end user can simply click on one of the counties and the metrics across the top and that other visualizations filter based on the selection. The team thought this functionality was intuitive and allows the end-user to quickly and easily answer some of the expected questions, for example - “What is the primary driver of downtime in Marshall county?” One click, and a user can see that the primary driver is ‘Industrial Action / 3rd Party’. 

![Project goals](../../assets/executive_dash.png)

![Project goals](../../assets/exec_dash_drilldown.png)

Another key feature that was developed into the executive dashboard was the ability to drill-down and filter by downtime code. The team valued the interactive ability of dashboards because it provides a cleaner and more simplistic view of data. Large amounts of filters take up valuable dashboard real estate and can cause confusion. The team’s dashboards also have the ability to be setup on a subscription so that the content of the dashboard could be pushed to the CEO in an email on a regular basis. Lastly, there is the ability to set alerts on dashboards. These are driven by user-defined criteria and could notify the CEO if a certain threshold is crossed. For example, one could set an alert on YoY Downtime so that if it went below 25 percent for the entire portfolio, it would notify the CEO and anyone else. Alerts are a useful functionality for ensuring that metrics do not slip over time.

## Mobile Application <a name="mobile_app">
While the above dashboards provide sufficient intelligence to the CEO, the team also understood that more and more work is being done on the go and outside of traditional office space. For this reason, the team developed a mobile version of the executive dashboard that allowed on-the-go access to real time information. Similar to the executive summary, the team utilized click-to-filter functionality, allowing for the maximization of the limited dashboarding real estate available on mobile phones. 

![Project goals](../../assets/mobile_dash.png)

## Operations Dashboards <a name="operation_dash">
The final set of dashboards the team developed were created with the field operators in mind. While the field operators could review the executive dashboard and see how the organization is doing as a whole, the operations dashboards allow field operators to drill into the pads and specific wells they support to gather detailed information about downtime and lost production. These dashboards give the field operators and easy to use, self-service tool that allows them to identify problem areas and develop plans to address any potential issues.

![Project goals](../../assets/operations_dash.png)

# Web Application <a name="web_app">
The team constructed a mobile-friendly web application as a proof-of-concept to demonstrate the model. It shows how inputs from the original data might be used to automatically populate values to describe an outage. For instance, it allows users to select season, field and alarm condition to view what the model would output as the outage code. This web application is a simple HTML page powered by JavaScript to present the results calculated by our model. Currently, it integrates with the data processed in batches, stored in a shared Google Sheets repository. The Google Sheets contains precomputed values for different inputs, so accurately represents what the model might look like in production, separate from the company’s own software.

![Project goals](../../assets/data_recording_app.png)

If the team were to use this application in production, it would move away from Google services and instead integrate with ABC Oil & Gas’s own SCADA software. Alarm data would be stored in a SQL database (or other relational database), then ingested by the model. The application demonstrated in the PoC would then consume results output by the model. Ideally, a project team would build an API (application programming interface) to connect to ABC Oil & Gas’s original SoR to automatically populate the outage forms.

![Project goals](../../assets/web_app_architecture.png)

A cloud-based architecture might be useful when trying new models or modifying existing models, but because the company already maintains its own data centers and sensor information databases, it makes little sense to undertake a massive migration to the cloud at this time. The team recommends that ABC Oil & Gas maintain application data and software on-premise for reasons of cost and security.

# Conclusions <a name="conclusions">
Throughout the project, the project team continually encountered difficulties with the given datasets. The data were messy, redundant, and occasionally unorganized--characteristics likely to be typical of any dataset. Despite the challenges, the project team was able to deliver a model that is accurate roughly 60 percent of the time. This allows ABC Oil & Gas to implement a model to predict the downtime for each well on a given day and then have the field operator validate the data. Below, we describe key conclusions from the project. 
1. Class imbalance led to the data needing to coalesce the original 15 outage codes into 4 simplified codes. This modification to the data model still preserves the majority of nuance conveyed through the original 15 codes.
2. The model was able to capture 60 percent accuracy when compared to what operators input. 
3. Analyzing feature importance, each pad seems to show its own behavior in relating alarms to downtime, which makes practical sense as each pad has equipment differing by age, model, geography, and is thus subject to different types of problems.
4. Reducing the full-time equivalent time required to enter downtime by 75 percent as the algorithm will be able to get the downtime code correct but will still need validation by the operator to ensure accurate data for training the models.
5. Previous efforts of entering downtime took each of the 35 field operators 20 minutes per day to enter, or 700 minutes per day. This project will decrease this value to just 175 minutes, or 5 minutes per operator per day. **This translates to $4MM savings per year in operator time alone. This time can be spent optimizing production, which will show even more value to ABC Oil & Gas.**

However, it ought to be reiterated that this modeling required the use of simplified encodings to describe outages. As the original 15 causes could be easily coalesced into 4 slightly broader categories, it stands to reason that the initial 15 categories were not particularly useful. If the information described by them is truly valuable, then a reconsideration of ABC Oil & Gas’s data modeling might be appropriate. Notably, most of the outages were coded as being caused by third-parties. Team members of this project noted that this is likely because outages categorized as third-party outages do not negatively affect the metrics used by the company. This suggests that data may be subject to manipulation in order to produce more favorable metrics and inaccurate recording may be incentivized. Though we created a model based on production data, if this data does not reflect the actual outage causes it may be difficult to accurately assess and review outages and actually improve production.

# Recommendations <a name="recommendations">
The project team created a model that can accurately predict the downtime code about 60 percent of the time. This enables ABC Oil & Gas to implement this model and reduce operator time spent entering downtime. While the model accuracy is acceptable for this project, there is always a way to glean more value from any project. As an outcome of this project, the project team has the following recommendations for ABC. These will begin capturing immediate value from this project as well as poise future models to have greater accuracy.
1. Implement final model to reduce operator time spent on manual data entry.
2. Require validation of automated entries to inform future iterations of the model by correcting incorrect predictions.
3. Continue to collect downtime and alarm data. This will improve future versions of the model and assist in reducing the class imbalance with periodic model refreshes. These model updates should be executed bi-annually.
4. Empower the field operators by distributing and training how to use the operator level dashboard and mobile app. Immediate value will be captured by reducing lost production, arming the operators with insight.
5. Begin collecting real time production data. Coupling the real time alarm and production data would enable the algorithms to better identify the important alarms by informing the model when production was down and knowing that the alarms preceding this event are what should inform the model to identify the downtime code. See graphic below for illustration.

![Project goals](../../assets/alarm_data.png)

# Project Retrospective <a name="retrospective">
The project remained generally on-track for the June deliverable. The team experienced its first difficulty as it underwent the EDA and data-wrangling phase, but built the project plan to accommodate unforeseen challenges along the way. 

The team learned that forays into bleeding-edge technology can greatly accelerate project production. Additionally, implementing existing solutions offered by other companies may save time which subsequently saves money. Iterating through models was accelerated at least tenfold by using the trial license of DataRobot. While DataRobot licensing is not cheap, the time spent iterating through models manually was at such a slow pace in Workstream 2 that a model achieving barely 50 percent accuracy may never have been achieved. Furthermore, buying a product from another company can provide additional and ongoing support, instead of relying on well operators to maintain, retrain, monitor, and troubleshoot custom modeling software. A data scientist up to speed on such tools is crucial to a successful analytics project.
