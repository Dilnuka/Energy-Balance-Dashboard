# 02. System Specifications and Scope of Work (SOW)
**Context:** This document details the exact technical requirements and expected functionalities necessary to build the Energy Balance Dashboard.

## 1. Frontend & Dashboard Features
The platform must support highly interactive, customizable visualizations for the following categories:
*   **Electricity, Petroleum, Biomass, Coal:** Visualizing generation, load profiles, sales, capacity, and imports.
*   **Grid Emissions:** Calculating Operating Margin, Built Margin, and Average Emission Factors.
*   **Building Sector Energy Use (ISIC-Based):** Displaying stacked bar charts (energy mix by fuel), trendlines, and Energy Use Intensity (EUI in kWh/m²/year).
*   **Energy Balance:** Implementing complex visualizations like **Sankey diagrams** (for energy flow) and **Sunburst charts** (consumption portfolio).

### UX/UI Requirements
*   **Interactive Tables:** Support column sorting, hiding, and multi-dimensional filtering.
*   **Dynamic Export:** Allow users to export filtered charts and tables into Excel, CSV, JPEG, PNG, or PDF. Exports must embed metadata and citations (e.g., *Source: SLSEA, YYYY*).
*   **Time-Series Analysis:** Checkboxes, sliders, and dropdowns for selecting monthly, quarterly, or annual time ranges.

## 2. Mathematical & Computational Engine
The backend must house a robust engine capable of processing:
*   **Unit Conversions:** Automatic toggling between mass/volume and different energy metrics (ktoe ↔ PJ ↔ GWh ↔ TJ) and currencies (LKR ↔ USD).
*   **Automated Balancing:** Calculating gross/net supply, transformation losses, and final demand.
*   **AI/Forecasting:** Implementing basic linear/exponential forecasting and rule-based smart annotations for anomalies.
*   *Note:* All conversion factors and emission matrices must be dynamically configurable by admins.

## 3. Data Submission & Workflow
The platform will replace manual workflows with secure web portals for data providers (e.g., CEB, CPC, private entities).
*   **Bulk Upload:** Users can download standardized Excel templates, fill them, and upload them in bulk.
*   **Automated Validation:** The system must run sanity checks (e.g., no negative values, consistency with historical trends) and provide real-time error feedback upon upload.
*   **Drafting & Approvals:** Providers can save drafts, track submission status, and receive revision requests from SLSEA verifiers.

## 4. Backend Administration & RBAC
*   **Role-Based Access Control:** Distinct roles for *Data Providers*, *Verifiers*, *Administrators*, and *Viewers*.
*   **Dynamic Forms:** Admins must be able to create new data input forms to accommodate future energy resources (e.g., Green Hydrogen, EVs).
*   **Audit Logging:** Every configuration change, data overwrite, or user permission adjustment must be logged in a searchable audit trail.

## 5. Interoperability APIs
The system must be designed to securely connect and exchange data with external platforms:
*   National Energy Benchmarking Portal
*   Electricity Dispatch Data Dashboard
*   *Requirement:* Implement RESTful APIs or secure connectors capable of mapping external data fields to the internal schema.
