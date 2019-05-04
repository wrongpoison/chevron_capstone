---
layout: page
title: Project Goals
---

We will utilize Company ABC’s streaming data and our own modeling to accomplish the following:
- Reduce the time required to manually enter data
- Improve data accuracy
- Provide actionable insights based off of alarm data

All in order to ultimately reduce well downtime and increase production

![ ](../../assets/drums and pipes.png)

## Background
The dawn of the oil era started in Titusville, PA, when Edwin Drake drilled the first oil well. Drillers knew that, located in the Appalachian Basin, the Marcellus Shale formation contained valuable gas resources. However, due to technology limitations, it was not deemed to be a feasible source and so was avoided. In 2004, a company hydraulically fractured a Marcellus Shale well, successfully unlocking the large quantities of natural gas trapped inside. This sparked a new boom in drilling wells in the Appalachian basin. ABC Oil & Gas bought into the region, purchasing a company that had a sizeable lease in the area. ABC Oil & Gas now operates  approximately 400 gas and oil-producing wells across the Southwestern Pennsylvania and Northern West Virginia area. These wells are drilled in the Marcellus and Utica shale formations. Current well location inventory supports adding 100 wells per year for the next 15 years. 

![Map](../../assets/map.png)

## Business Opportunity
The objective of the field operations function is to maximize production. This requires minimizing the amount of time that wells are inoperable and not producing any resources. This can happen to any well at any given time throughout the day. Sensor data on the wells streams into a Supervisory Control and Data Acquisition (SCADA) system. The SCADA systems are monitored constantly by an operations control center. Some of these sensors have alarms that will notify the operations control center when events indicate some type of system abnormality. In some cases, these abnormalities cannot be resolved remotely, so the well stops producing until a field operator is dispatched and can manually remediate the issue.

![An example well failure](../../assets/well_failure.png)

Each day, field operators must manually enter metadata into a system of record (SoR) to capture the root cause of any downtime from the previous day. Each well with downtime requires twelve different fields populated in order to characterize the problems and to meet the SoR requirements.

![SoR form](../../assets/form.png)

This can be very inefficient if there are many wells down. If each of the 35 field operators spend 20 minutes each day entering this data, that would add up to ten and a half hours of manual, error-prone data entry performed by highly talented operators. As a result, there exists a large opportunity to automate this process using the streaming SCADA data. Not only will this add value by reducing the time required for manual data entry, but it will also increase data accuracy. By increasing the data accuracy, the production engineers also benefit when retrospectives are performed, enabling much faster analysis and more profound insight on downtime trends. 
![Sensor alerts](/assets/sensor_alerts.png)

Due to the nature of the data, it is suspected that patterns exist in the alarm data that will correlate to the downtime codes. The figure above illustrates a well and associated process equipment that might detect anomalous data, registering an alarm.
![Project goals](../../assets/project_goals.png)

## Data
ABC oil and gas has provided a snapshot of data from both the SCADA alarm system and the downtime SoR. The alarm philosophy underwent a major overhaul in mid-2017, which completely changed the system, specifically the thresholds that trigger alarms. As a result, the data is only available starting in Q4 2017 through the end of Q1 2019. This data is housed in two separate tables: Alarm Data and Downtime Data. Each table has some unique characteristics, which are described in the table below. 

| Downtime Data | Alarm Data|
|-------|--------|
| One downtime entry per well per day | May be multiple alarms per well each day|
|No pad down time, only well level downtime | Alarms may be specific to a single well or an entire group of wells (a pad). Alarms may also indicate problems a piece of equipment shared across a pad.|
|Entries have date, but no time|Alarms have sequence, indicated by timestamps|
|Downtime is described by four different-tiered codes indicating the precise nature of the downtime (planned work, natural disaster, and so on)|Some alarms may be false positives or not indicate actual well failure|

Note: a pad is a collection of wells in the same geographical area.

## Project Plan
Throughout the next several weeks our team will be developing innovative classification techniques to evaluate alarm data and automatically populate downtime coding fields. The utilization of a predictive algorithm to automate the manual process will enhance productivity, improve the production of wells, and eliminate data entry errors. All of this is critical in achieving ABC Oil & Gas’s expansions goals while keeping operating expenses on budget.

In order to achieve our desired results, we plan on using Python to develop an array of models from linear-regression to neural networks while maximizing both accuracy and utility. We will also be developing a mobile application for technicians to review and approve machine generated downtime codes, allowing technicians to monitor well activity wherever their activities take them. One portion of the mobile app will provide an interactive dashboard to provide visibility to production and downtime. The dashboard will allow for easy identification of problematic pads or regions.

Below, we share a brief schedule of our major project milestones and key delivery dates. Our most critical date will be May 28, when we submit our final product to the CEO. Other important dates are May 12, when we share our initial findings, and June 2, when we present our product. We are using an agile approach and have built some amount of  flexibility into our schedule to accommodate unforeseen challenges and obstacles.

![Timeline](../../assets/timeline.png)