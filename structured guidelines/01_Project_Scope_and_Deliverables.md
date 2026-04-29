# 01. Project Scope and Deliverables
**Context:** This document outlines the overarching goals, tasks, and delivery milestones for the Energy Balance Dashboard, an initiative by the Sri Lanka Sustainable Energy Authority (SLSEA) under the PEEB Cool programme.

## 1. Project Objectives
- **Digitization:** Convert the existing Excel-based National Energy Balance into a structured, web-based digital platform.
- **Enhanced Transparency Framework (ETF):** Support the Paris Agreement climate reporting requirements (Biennial Transparency Reports, National Inventory Reports).
- **Core Functionality:** Enable systematic data submission, automated energy calculations, data validation, and dynamic visualization for multi-sector energy data.

## 2. Core Project Tasks (Work Breakdown)

### Phase 1: Planning and Architecture
*   **Task 1: Inception & Validation.** Refine dashboard logic, validate analytical needs, and define the architecture, data flows, and RBAC models.
*   **Task 2: UI/UX & Data Architecture.** Design database schema mapping to the National Energy Balance and ISIC classification. Build wireframes and apply responsive, accessible design.

### Phase 2: Core Development
*   **Task 3: Mathematical Engine.** Build the backend to compute energy balances, conversions (PJ, ktoe, LKR-USD), and grid emission factors. Ensure coefficients are admin-editable.
*   **Task 4: Dashboard & Visualization.** Develop interactive charts (Sankey, Sunburst, Trends) for Electricity, Petroleum, Biomass, Coal, and Building Sector Energy Use.
*   **Task 5: Exporting & Reporting.** Create user-configurable data tables with multi-dimensional filtering and export capabilities (CSV, Excel, PDF).
*   **Task 6: Data Submission Interfaces.** Implement web-based interfaces and Excel bulk-upload templates with automated plausibility checks for data providers.
*   **Task 8: Backend Admin Panel.** Allow administrators to manage users, roles, templates, and dynamic input forms.

### Phase 3: Integration, Security & Migration
*   **Task 7: RBAC & Security.** Implement role-based access for Providers, Verifiers, and Admins.
*   **Task 9: Interoperability.** Develop APIs/connectors for data exchange with existing national platforms.
*   **Task 10: Testing.** Conduct functional, security, and User Acceptance Testing (UAT).
*   **Task 11: Historical Data Migration.** Clean and map decades of Excel-based historical data into the new database.

### Phase 4: Delivery & Support
*   **Task 12: Training.** Deliver manuals and train SLSEA staff.
*   **Task 13: Handover.** Deploy the system, and provide full source code and documentation.
*   **Task 14: Maintenance.** 1-year defects liability period and long-term operation support.

## 3. Milestones & Timeline
| Milestone | Deliverable | Target | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **M1** | Inception Report and Work Plan | Week 4 | Approved scope, timeline, and risk analysis. |
| **M2** | Methodology & Architecture | Week 12 | Approved data flow, methodologies, and technical architecture. |
| **M3** | Wireframes & Sample Dashboards | Week 22 | Validated UI/UX designs and user journeys. |
| **M4** | Pilot System & Sample Data | Week 32 | Functional pilot deployed with historical sample data. |
| **M5** | Full Launch, Training & Handover | Week 40 | System accepted by SLSEA; complete code and manuals handed over. |
