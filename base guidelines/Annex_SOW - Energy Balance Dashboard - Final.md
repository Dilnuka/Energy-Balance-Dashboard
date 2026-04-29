

## 1

Specifications for the Development of an Interactive Web Portal for Digitalisation of Sri Lanka Energy
## Balance

Sri  Lanka  ratified  the  Paris  Agreement  in  2016,  holding  a  stake  in  the  global  efforts  of  limiting  the
temperature  rise  to  well  below  2°C  while  striving  to  restrict  it  to  1.5°C  above  pre-industrial  levels.
Recognising the existential threat posed by climate change, the country has consistently taken steps to
strengthen its climate action agenda through policy integration, sectoral interventions, and international
cooperation. Climate action formally commenced in Sri Lanka, with the submission of its initial Nationally
Determined  Contributions  (NDCs)  in  2016,  which  outlined  economy-wide  targets  and  sector-specific
commitments  aimed  at  reducing  greenhouse  gas  (GHG)  emissions,  enhancing  climate  resilience,  and
addressing loss and damage.

In 2021, Sri Lanka updated its NDCs for the period 2021–2030, strengthening its commitment to climate
actions through more ambitious mitigation targets and an enhanced focus on climate resilience. Sri Lanka
developed a comprehensive NDC Implementation Plan in 2022, which provided a structured roadmap for
translating commitments into concrete actions. This plan outlined sector-specific strategies, institutional
responsibilities, financing mechanisms, and monitoring frameworks to ensure effective execution.

In the present context, climate reporting has been deemed an essential and an obligatory requirement.
Reporting  and  transparency  are  essential  in climate  action,  from  tracking  emissions to  achieving  global
climate  goals  and  supporting  tracking  of  greenhouse gas  emissions  and  progress  toward  global  climate
goals.   Reporting   also   encourages   the   accountability   among   governments,   businesses,   and   other
stakeholders. The Enhanced Transparency Framework (ETF) under the Paris Agreement is considered the
universal  standard  for  climate  reporting,  aiming  to  provide  clear  and  comparable  data  across  nations.
Since Sri Lanka ratified the Paris Agreement in 2016, the country is required to report climate data under
the Enhanced Transparency Framework, via the three following core components.

## (1) Biennial Transparency Reports
(2) National Inventory Reports (NIRs)
(3) Tracking progress on NDCs.

Within the NDC Implementation Plan for the Electricity Sector (2021–2030), particular emphasis is placed
on  Demand  Side  Management  (DSM).  NDC  2  specifically  calls  for  the  promotion  of  energy-efficient
equipment,  technologies,  and  system  upgrades  under  a  national  Energy  Efficiency  Improvement  and
Conservation (EEI&C) programme. The building energy-related commitments are outlined in the following
sub-targets:

(1) NDC 2.2 – Realise energy saving of 5,189 GWh by introducing efficient lighting, fans, refrigerators,
and chillers as a conditional measure
(2) NDC 2.3 – Implement energy efficiency building code on a mandatory basis

## 2

(3) NDC 2.4 – Promote High Efficiency Motors (HEM), Variable Frequency Drives (VFD), tri-generation,
and other energy efficiency measures in the industrial sectors

A robust mechanism is therefore, needed to streamline the collection, analyses and reporting of energy
data across all sectors. However, the data reporting mechanisms in place for monitoring energy data in
industries/ commercial establishments, are not up to date and of substandard quality. The absence of an
appropriate mechanism  for  data  collection  and  reporting  in  the  industries/  commercial establishments
poses a severe challenge to implement the ETF under the Paris Agreement.

## The Assignment
Therefore, the Sri Lanka Sustainable Energy Authority envisages building an interactive energy data portal
to capture building energy, among other energy parameters, with the long term view of streamlining the
reporting mechanism to support the ETF under the Paris Agreement.

## Objectives
The long-term objective of the assignment is to streamline data capture, analyses and reporting, in order
to support the Enhanced Transparency Framework under the Paris Agreement.

The objectives are to;
▪ Build a dashboard to display energy statistics of buildings, inclusive of industries and commercial
establishments, in relation to NDCs of the electricity sector.
▪ Construct an interactive energy database to comply with the reporting requirements of the other
NDCs of the electricity sector.
▪ Facilitate  the  introduction of  the  International  System  of  Industry  Classification  (ISIC)  to obtain
disaggregated energy data to report on NDCs.
▪ Enable custom generation of charts and tables in accordance with user preferences.

## Background
At present, the Energy Balance (EB) exists in the form of a complex spreadsheet database using the MS
Excel software with data spanning over four decades. It consists of the following Excel workbooks.

1) Electricity data
2) Petroleum data
3) Biomass data
4) Key economic and social indicators
## 5) Grid Emission Factor
## 6) Annual Energy Balances

Each workbook contains multiple worksheets, which are updated every year, after careful insertion of an
additional data column for the latest year elapsed, using data obtained from all the energy sector entities.

## 3

In each workbook, data is entered into ‘data input’ sheets, from which data is extracted and calculated in
other sheets, within the same book. Other than the Annual Energy Balance workbook, all other workbooks
in the above list are standalone workbooks. The Annual Energy Balance workbook is a summary display
sheet, connected to all other workbooks.

The following diagram illustrates a simplified schematic of the existing EB database and the annual output:


















The annual output is currently published as a report by SLSEA, and the same has to be  replicated in an
interactive web-based environment. The solution shall also migrate and integrate historical data from the
existing Excel-based Energy Balance database, covering all available years, into the new system’s backend.
This data must be:

- Structured to align with the portal's database schema.
- Available  for visualisation,  comparison,  and  reporting  in  the  same  manner  as  newly  submitted
data.
- Filterable and exportable by time range, source, and sector.

The description below is limited to the present understanding of the user requirements, but the selected
service provider is expected to conduct sound business intelligence / analytics need assessment in
designing the web-based database.
## Energy Balance Database
## Electricity
## Petroleum
## Biomass
## Conversion
factors
## Analyses
## Publications
## Sri Lanka
## Energy
## Balance
## 20xx
## Energy
## Statistics

## 4

- Expected tables

1.1 The following tables need to be displayed under the Electricity category
1.1.1      Overview (reference in the Elect workbook – Overview.aD)
1.1.2      Load profile (ref: LoadProf.aD)
1.1.3      Financial data (ref: FinaData.bD)
1.1.4      Sales (ref: SaleTrif.bD)
1.1.5      Generation summary (ref: GrosGenE.cD)
1.1.6      Detailed generation (ref: GrosGenE.dD)
1.1.7      Generation – Major Hydro (ref: GrosGenH.bD)
1.1.8      Generation- Thermal Power (ref: GrosGenT.bD)
1.1.9      Capacities of power plants (ref: Capacity.aI)
1.1.10 Fuel consumption in power plants (ref: FuelCons.aI)
1.1.11 Summary of fuel consumption (ref: FuelCons.bD)

1.2 The following tables should be displayed under the Petroleum category
1.2.1 Imports (ref: PetImpo.cD)
1.2.2 Refinery products (ref: RefinPro.aD)
1.2.3 Product sales (ref: PetSales.aI)
1.2.4 Crude oil price movement (ref: CruPrice.aD)
1.2.5 Product import price variation (ref: ImpPrice.aD)
1.2.6 Price variation of locally sold petroleum products (ref: LocPrice.aI)
1.2.7 Financial information (ref: EmpFinan.aI)
1.3 The ability to convert 1.Error! Reference source not found., 1.Error! Reference source not
found. and 1.Error! Reference source not found. from mass to volume and vice versa is
necessary
1.4 Conversion from LKR to USD for 1.Error! Reference source not found., 1.Error! Reference
source not found. and 1.Error! Reference source not found. and vice versa is necessary.
1.5 The following tables should be displayed under the Coal category
1.5.1 Imports (ref: Coal.Impor.aD)
1.5.2 Consumption (ref: CoalCons.aD)
1.6 The following tables should be displayed under the Biomass category
1.6.1 Fuelwood consumption (ref: FWoodCon.aD)
1.6.2 Charcoal and Biogas production and consumption (ref: CharBaga.aD & CharCons.aD)
1.7 The following tables should be displayed under the Economic Indicators category
1.7.1 Key energy indicators (ref: EnerIndi.aI) – unit options in ktoe or PJ
1.7.2 Impact of petroleum product imports on the trade balance (ref: PetImpor.aD)
1.7.3 Population and GDP (ref:  GDP&CCPI.aD & PopUrban.aD)
1.8 The following tables should be displayed under the Energy Balance category

## 5

1.8.1 Sri  Lanka  Energy  Balance  (ref:  EBal1976 – Ebal2018  (The  latest  updated  year  should
appear    on the display page. The rest of the years should be available in the dropdown
menu. The display page should have two tables, one under the other. One in original
units and the other in TJ. An archives link  should be given to the third table with the
unit ktoe or this can be given in a separate dropdown menu.
1.8.2 Primary energy supply by sources (ref: SuppDema.aD) – unit options – default is PJ with
the option of selecting ktoe
1.8.3 Energy consumption by source (ref: EnerCons.aD) - unit options – default is PJ with the
option of selecting ktoe
1.8.4 Energy consumption by sector (ref: SectCons.aD) - unit options – default is PJ with the
option of selecting ktoe
1.8.5 Energy  and  GDP  (ref:  EnergGDP.aD) - unit  options – default  is  PJ  with  the  option  of
selecting ktoe
1.9 The following tables should be displayed under the Grid Emissions category
1.9.1 Description page
1.9.2 Three tables in one page
a). Operating Margin
b). Built margin
c). Grid emissions factors
1.9.3 Average emissions factor
It shall be possible to automatically calculate the above figures based on the stipulated equations and
assumptions using available data inputs.
1.10 The following tables shall be displayed to represent energy use in the building sector
1.10.1 Annual energy consumption by building type and sector in line with ISIC classification
standard, disaggregated by
## • Electricity
- Petroleum fuels (diesel, petrol, kerosene, furnace oil, etc.)
- Biomass (fuelwood, paddy husk, sawdust, etc.)
## • Coal
## • LPG
- Solar energy
- Other renewable sources (biogas, mini hydro, etc.)
- Total energy consumption (in TJ, ktoe, or GWh)

1.10.2 Energy use intensity (EUI) by building type, expressed in
- kWh/m²/year for electricity and renewable energy
- MJ/m²/year or ktoe/m²/year for total energy and other energy sources




## 6




## 2. Expected Graphical Representations
2.1. The following charts need to be displayed under the Electricity category
2.1.1. Gross Generation to the Grid (GWh) (ref:  GrosGenE.dD) – to be extracted from a list where
categories can be ticked off. The categories should include the following.

a) Major hydro
b) CEB thermal (oil)
c) IPP thermal (oil)
d) Hired thermal
e) CEB thermal (coal)
f) CEB wind
g) SPP hydro
h) SPP biomass
i) SPP wind
j) SPP solar
k) Micro power producers (solar)
l) Other generation (marginal)

2.1.2. Installed Capacity (MW) (ref: Capacity.bD) - – to be extracted from a list where categories
can be ticked off. The categories should include the following.

a) Major hydro
b) CEB thermal (oil)
c) IPP thermal (oil)
d) Hired thermal (oil)
e) CEB thermal (coal)
f) CEB wind
g) SPP hydro
h) SPP biomass
i) SPP wind
j) SPP solar
k) Micro power producers (solar)
l) Other capacity (marginal)

2.1.3. Projects Connected to the grid (Nos.) (ref: Capacity.aI) - – to be extracted from a list where
categories can be ticked off. The categories should include the following.


## 7

a) Major hydro
b) CEB thermal (oil)
c) IPP thermal (oil)
d) CEB thermal (coal)
e) CEB wind
f) SPP hydro
g) SPP biomass
h)  SPP wind
i)  SPP solar
j) Micro power producers (solar)

2.1.4. Load profile (ref: LoadProf.cI)
2.1.5. Total electricity use (GWh) (ref: Sale.Trif.bD)
2.1.6. Fuel usage in power plants (litres/kg) (FuelCons.bD) - the ability to convert mass to volume
and vice versa is necessary.
2.1.7. Load profile – the present load profile should be the default
2.1.8. Consumer Accounts (Nos.) (ref: FinaData.bD)
2.1.9. Average Selling Price of Electricity (LKR/kWh) (ref: FinaData.bD)

2.2. The following charts should be displayed under the Petroleum category
2.2.1. Imports (ref: PetImpo.cD) – to be extracted from a tickable table
2.2.2. Refinery Products (ref: RefinPro.aD) – to be extracted from a tickable table
2.2.3. Product Sales (ref: PetSales.aI) – to be extracted from a tickable table

2.3. The following charts should be displayed under the Coal category
2.3.1. Imports (ref: Coal.Impor.aD)
2.3.2. Consumption (ref: CoalCons.aD)

2.4. The following charts should be displayed under the Biomass category
2.4.1. Fuelwood consumption (ref: FWoodCon.aD)
2.5. The following charts should be displayed under the Economic Indicators category
2.5.1. Impact of petroleum product imports on the trade balance (ref: PetImpor.aD)

2.6. The following charts should be displayed under the Energy Balance category
2.6.1. Sanki diagram (a proportionally representative  infographic of the energy supply,  flow  and
demand for a particular year) - Sri Lanka Energy Balance (PJ) (ref: EBal1976 – Ebal2018).
2.6.2. The consumption portfolio (PJ) – a sunburst graph
2.6.3. Primary Energy Supply by Sources (PJ) (ref: SuppDema.aD)
2.6.4. Energy Consumption by Source (PJ) (ref: EnerCons.aD)
2.6.5. Energy Consumption by Sector (PJ) (ref: SectCons.aD)

## 8


2.7. The following charts should be displayed under the Grid Emissions category
## 2.7.1. Grid Emission Factor
## 2.7.2. Average Emission Factor

2.8. Annual Energy Consumption by ISIC-Based Building Type and Sector
## • Stacked Bar Charts
o Annual energy consumption by ISIC category disaggregated by:
## • Electricity
- Petroleum fuels
## • Biomass
## • Coal
## • LPG
- Solar energy
- Other renewable sources
o Unit options: GWh, TJ, ktoe
o Filter: Year, ISIC code

## • Multiyear Trendline Charts
o Annual trends of fuel-specific consumption by ISIC sector

- Pie or Sunburst Charts
o Energy mix by fuel type for a selected ISIC building type and year

2.8.2. Energy Use Intensity (EUI) by ISIC Building Type
## • Grouped Bar Charts
o Electricity  EUI  (kWh/m²/year)  and  total  energy  EUI  (MJ/m²/year  or  ktoe/m²/year)
across ISIC-coded building types
- EUI Time Series Charts
o Annual EUI trends by ISIC code, selectable by energy carrier
## • Scatter Plots
o EUI vs. total floor area or occupancy for ISIC sectors

2.9. A Sankey diagram shall be displayed tracking energy flow from the source of generation to the
point of usage




## 9

- Interactive and Customisable Data Tables and Visualisations

The web portal shall provide user-friendly, interactive tools for exploring, analysing, and exporting energy-
related data. These tools must offer the following capabilities:

## Custom Data Tables

The portal shall enable users to interact with and configure data tables for in-depth analysis and reporting:
- Select and compare data by energy source, sector, fuel type, and time period.
- Apply  multi-dimensional filters (e.g., “SPP Solar” under generation, or “Industrial Sector” in
consumption).
- Show/hide specific table columns to customize the data view.
- Sort columns in ascending or descending order.
- Toggle  between  multiple  units  of  measurement  (e.g.,  PJ,  ktoe,  GWh,  LKR,  USD)  for  consistent
comparisons.
- View side-by-side historical data across selected years (e.g., compare petroleum imports in 2018,
2020, and 2023).
- Export filtered and formatted tables to Excel, CSV, or PDF, including source citations (e.g., Source:
## SLSEA, YYYY).
- Ensure exported Excel tables maintain source formatting and structure.

Interactive Graphs and Charts

The platform shall offer a user-friendly, dynamic charting interface with the following capabilities:
- Generate custom graphs based on selected filters and variables (e.g., sector-wise energy use over
time).
- Use dropdowns, sliders, and checkboxes to select time ranges (monthly, quarterly, annual).
- Create multi-year comparison and trend analysis charts (e.g., electricity demand 2020–2023).
- Toggle unit types dynamically on graphs for contextual understanding (e.g., ktoe vs. GWh).
- Ensure responsive design across devices (desktop, tablet, mobile).
- Provide  access to underlying calculation methods, allowing users to click on a chart or value to
view formulas, assumptions, and sources.
- Enable export of graphs as JPEG, PNG, or PDF formats with built-in citations referencing Sri Lanka
Sustainable Energy Authority (YYYY) or Sri Lanka Energy Balance (YYYY).
- Allow download of customised visual summaries or charts based on user-defined criteria.






## 10

Exporting and Reporting

The portal shall include  comprehensive tools for exporting data and generating reports in user-friendly
formats:
- Allow users to download underlying filtered datasets used in visualizations for further analysis in
## Excel.
- Provide custom report generation tools with options to:
o Select specific graphs and tables to be included in the report
o Define the reporting time period (e.g., monthly, quarterly, annual).

Advanced Time-Based and Analytical Features

To support deeper analytical functionality, the portal shall:
- Integrate  basic  forecasting  tools  for  projecting  energy  use  or  supply  trends  based  on  historical
data.
- Enable natural language queries (e.g., “Compare grid emission factors for 2019 and 2023”) that
auto-generate relevant charts or summaries.
- Provide smart annotations in graphs (e.g., Sankey diagrams) using rule-based AI/ML to highlight
key trends, anomalies, or significant events.


- Input Interfaces and Technical Data Submission Features
The  web-based  database  shall  enable  secure  and  structured  data  submission  from  a  wide  range  of
stakeholders, including key state institutions (e.g., CEB, CPC) and private sector entities (e.g., Laugfs PLC,
Litro Gas, Lanka IOC). The current manual process based on printed or offline datasets will be replaced by
streamlined  digital  interfaces,  including  the  ability  to  add  or  remove  new  data  providers  who  may  use
newer energy resources than those in use at present (e.g. LNG suppliers).
Key technical features include:
- Web-Based Forms and Templates: Stakeholders shall be able to submit data via structured online
forms or downloadable Excel templates, aligned with the database schema to support automated
population and integrity checks.

- Upload and Bulk Import: Users can upload Excel-based datasets using standard templates. Bulk
import  functionality shall include  real-time validation, plausibility checks, and user  feedback on
formatting or data quality issues.


## 11

- Submission Tracking Dashboards: Each organization shall have a dashboard to track submissions,
view feedback from SLSEA, and respond to revision requests.

- Manual Entry and Override by SLSEA: Where applicable, SLSEA officers may enter data manually
or override stakeholder-submitted values, with all such actions being logged for auditability.

User Roles and Access Control

The system shall implement a role-based access framework supporting multiple stakeholder groups. The
platform  must  be  capable  of  accommodating  several  hundred authorised data  providers,  each  with
designated access to relevant forms and submission features. User roles shall include:

- Data  Providers: Authorised representatives  from  public  and  private  energy  sector  entities
responsible for submitting and editing their organisation’s data.
- Verifiers: SLSEA personnel responsible for reviewing and validating submitted data.
- Administrators:   System   managers   with   privileges   to   configure   user   accounts,   templates,
validation parameters, and other backend settings.
- Viewers:  Users  with  read-only  access,  such  as  government  officials,  researchers,  or  public
observers.

Additional roles may be defined to support evolving portal needs.

## Data Submission Workflow

- Each user shall only access forms relevant to their organisation and reporting frequency.
- The system shall support multiple submission frequencies-daily, monthly, quarterly, or annually-
to reflect sector-specific requirements.
- Users shall be guided through the submission process with contextual help, validation hints, and
tooltips.
- Features shall include  draft  saving,  versioning,  and  automated  submission  routing  to  SLSEA  for
review and approval.

Data Validation and Quality Control

The portal shall implement automated validation mechanisms to ensure data quality. These checks shall
include:
- Completeness of all required fields.
- Numerical sanity checks, e.g., flagging negative consumption values and plausibility of reported
values when compared to historical values/trends.

## 12

- Historical  consistency,  with  alerts  triggered  if  submitted  values  deviate  significantly  from  past
trends.
- Unit conversion checks to ensure correct use of units and formatting.
- Automated   notifications   shall   be   sent   to   data   providers   when   data   requires   review   or
resubmission.
- Backend Administration and System Configuration

Administrative Access and Controls

The  backend  of  the  system  shall  provide  SLSEA-appointed  administrators  with  a  secure,  full-featured
control panel for managing all system components, including:

- Creation, modification, and deactivation of user accounts across all stakeholder roles.
- Role-based permission configuration to assign or revoke access rights as needed.
- Management of data input templates, reporting schedules, and form versions by stakeholder type
(e.g., electricity utilities, petroleum importers).
- Configuration of validation rules, thresholds, unit mappings, and metadata fields.

Data Source and Template Management

- System Flexibility: The backend shall be configurable, enabling SLSEA administrators to update
templates, data structures, and validation logic to reflect evolving sector needs (e.g., new
energy sources, plants or policy changes).
- Dynamic  form  generation  tools  shall  be  included  to  support  new  data  types  and  submission
templates with custom units and emission factors.
- Templates shall be version-controlled to maintain traceability and backward compatibility.

Audit and Activity Logging

- Every administrative action such as user role changes, form modifications, and template additions
shall be recorded in a detailed audit log.
- Logs shall be exportable and searchable by date, user, and action type for review and reporting.



## 13

- Mathematical Engine and Computational Framework
The system shall include a robust, modular mathematical engine responsible for performing automated
calculations,  aggregations,  conversions,  and  estimations  based  on  the  data  submitted  by  stakeholders.
This engine must be modular, configurable, scalable, expandable and fully integrated with the database
and visualisation components.
## Core Functionalities
## • Unit Conversions:
o Convert between multiple units of energy and monetary value (e.g., ktoe ↔ PJ ↔ GWh
↔ USD) using standardised conversion factors.
o Maintain a central conversion matrix to ensure consistency across all modules.

## • Energy Balance Calculations:
o Automatically  compute  net  energy  use,  losses,  imports/exports,  transformations,  and
sector-wise breakdowns using predefined formulas.
o Reconcile  supply   and  demand-side   entries   based  on  the  national  energy  balance
structure.

## • Emissions Estimation:
o Calculate  emissions  based  on  energy  consumption  data  using  configurable  emission
factors by fuel type and activity.
o Allow periodic updates to emission factors through the backend administration panel.

- Aggregation and Disaggregation:
o Aggregate data across timeframes (e.g., monthly to quarterly, quarterly to annual).
o Disaggregate where applicable using proportional allocation or historical ratios.

- Forecasting and Trend Analysis:
o Support linear or exponential forecasting models for energy demand or supply trends.

- Data Harmonisation and Validation Support:
o Harmonise mixed-frequency inputs (e.g., annual biomass + monthly electricity).
o Use historical averages, smoothing functions, or proportional rules to fill gaps or validate
outliers.
o Support retroactive data integration to maintain historical consistency when new
sources or categories are added.


## 14

Configuration and Customisation
- All formula, coefficients (e.g., conversion factors, emission factors), and thresholds shall be:
o Admin-configurable via a secure backend interface.
o Version-controlled with an audit trail of changes.
Performance and Optimisation
- The engine shall:
o Process  calculations  in  real-time  or  scheduled  batches  depending  on  data  volume  and
complexity.
o Be optimised for efficiency to support large datasets and concurrent user access.
o Allow modular integration with future analytical tools (e.g., machine learning for anomaly
detection or advanced forecasting).

- Interoperability and Data Integration

The  web-based energy  data  portal  shall  be  developed  with capabilities  to  integrate  and  exchange  data
with other  digital  platforms  as  needed.  Specifically,  it  should  support  interoperability  with  existing  and
future digital tools used by relevant stakeholders in the energy sector, including but not limited to:

## • The National Energy Benchmarking Portal
## • The Electricity Dispatch Data Dashboard
- Any other relevant database, digital dashboard, data repository, or portal maintained by public or
private sector stakeholders

The system should include:
- APIs  or  secure  data  connectors  to  enable  automatic  data  retrieval  and  updates  from  external
systems
- Flexibility to map and harmonize external data fields with the internal data structure of the energy
portal
- Logging and version control features to track changes in imported datasets

The service provider shall assess integration requirements during system development and ensure that
the  solution  can  evolve  with  future  needs,  enabling  seamless  collaboration  with  digital  systems  of
stakeholder agencies.



## 15

## 8. General

8.1. General Design and Development Requirements
- The web-based database shall be developed using proven success drivers, including:
o Appropriate content selection (from materials provided by SLSEA).
o Attractive graphics and user-friendly interfaces.
- The solution shall be created using the latest available software/tools that are:
o Proven products.
o Capable of withstanding persistent cyber-attacks (e.g., denial-of-service intrusions).
- The system shall be protected by advanced security features, including but not limited to:
o Firewalls.
o Robotic access detection and prevention.
o Intrusion detection and denial-of-service deterrents.
- It is recommended to build the solution using open-source and free software, with:
o No licensing costs.
o Full deployability on a completely open and free server software stack (including OS
and web/application servers).
o Avoidance of proprietary (fee-based) software or platforms.

8.2. Database Scalability and Future-Proofing
- The database shall be designed with scalability and modularity to:
o Allow for continuous evolution.
o Introduce new energy sources and transport systems (e.g., electric vehicles).
o Update or replace specific pages or modules with minimal disruption.

8.3. Content and Resource Provision
- Logos, pictures, data, and other content will be provided by SLSEA.
- All content integration must follow a structure that allows easy content management by
SLSEA’s team.

8.4. Technical Compatibility and Accessibility
- All pages shall be designed for display compatibility across:
o Desktops, laptops, tablets, and mobile (vertical screen) devices.
- All features and pages must be fully compatible with the latest versions of commonly used
web browsers.

8.5. Training and Capacity Building
- Training must be provided to SLSEA staff, enabling them to manage and update the
database content independently.


## 16

8.6. Data Security, Protection and Backup

- The service provider shall be responsible for:
o Monthly backups of all data to prevent data loss due to server failure or
catastrophic events.
o Ensuring data security during development, deployment, and maintenance phases.
o Obtaining SSL certificate for the web based platform
- Administrators shall have access to:
o Manual and scheduled backup controls.
o Tools to restore the system from previous backup states in case of failure.
o Notification settings to monitor backup success/failure alerts.
- Backend shall support integration of:
o Multi-factor authentication (MFA) for admin-level access.
o Role-based restriction of sensitive configurations to top-level admins only.
- System health monitoring tools shall be integrated to track:
o Server uptime and performance.
o Data storage capacity and backup status.
o Logs of failed login attempts, suspicious access patterns, or submission anomalies.

- Deliverables and Documentation

- A binary copy of the deployment-ready solution shall be provided on a portable storage
medium (e.g., USB flash drive or portable hard disk), including:
o All embedded and linked content.
o A deployment guide for initial installation.
- Source project files of the web application shall be provided along with:
o A detailed Build and Deployment Guide.
o Full source code documentation (with three printed copies).
- A User and Administrator Guide shall be developed to support:
o Content management.
o System administration functions (with three printed copies).
- A final documentation set shall be prepared in two parts:
o Part I: Final layout including sub-pages, and filenames of all associated content
(documents, images, etc.).
o Part II: User/Admin guide for:
▪ Content management by end-users.
▪ Hosting management and installation instructions on alternative server
environments (for post-contract continuity).
o Tools, software, and source codes used in development should also be listed and
provided with source code documentation.

## 17


- Hosting, Operation and Maintenance

- Hosting  space  will  be  provided  by  the  SLSEA.  Alternatively,  the  Developer  can  offer  a  hosting
solution which will ensure the functionality as specified in this scope of work.
- The Developer will be requested to enter into an Agreement for operating and maintaining the
web portal for a five-year period commencing at the end of the one year defects liability period
and  the  quoted  price  shall  include  the  cost  of  operations  and  maintenance  during  the  defects
liability period.
Cost of Operation and Maintenance for the period of five years subsequent to the completion of
defect liability period shall be mentioned separately.
The Agreement will be renewed as appropriate after the five-year period.
- The developer shall submit an operation manual for the web based dashboard