# Master Implementation Guide: Energy Balance Dashboard

> [!IMPORTANT]
> This document is the single source of truth for the technical implementation, architectural design, and system requirements for the Sri Lanka Sustainable Energy Authority (SLSEA) Energy Balance Dashboard. It aggregates all specifications into a comprehensive technical blueprint.

---

## 1. Executive Summary & Objectives
The goal of this project is to digitize Sri Lanka’s decades-old, complex Excel-based National Energy Balance into a highly interactive, auditable, and automated web-based platform. This modernization directly supports the **Enhanced Transparency Framework (ETF)** under the Paris Agreement for climate reporting.

---

## 2. System Architecture & Tech Stack Guidelines

> [!TIP]
> Prioritize **Open-Source** software. The client strongly prefers license-free server stacks, databases, and application frameworks to ensure long-term sustainability without recurring proprietary fees.

*   **Architecture Paradigm:** Modular, scalable, web-based platform capable of handling concurrent multi-tenant data submissions.
*   **Database:** Relational database designed to align strictly with **ISIC** (International Standard Industrial Classification) standards. Must support dynamic schema expansion for future energy sources (e.g., Green Hydrogen, Electric Vehicles).
*   **Interoperability:** The system must expose and consume RESTful APIs to integrate with external systems, specifically the *National Energy Benchmarking Portal* and the *Electricity Dispatch Data Dashboard*.
*   **Responsiveness:** The frontend must be fully responsive across desktops, tablets, and mobile (vertical) screens.

---

## 3. Core Modules & Functional Specifications

### 3.1 Data Submission & Workflow Automation
This module replaces manual data collection from entities like the Ceylon Electricity Board (CEB) and Ceylon Petroleum Corporation (CPC).

*   **Input Methods:** Secure web-based manual entry forms AND bulk-upload features via standardized Excel templates.
*   **Real-Time Validation:** The upload engine must perform automatic sanity checks:
    *   Flagging negative consumption values.
    *   Checking historical consistency (detecting sudden drops/spikes).
    *   Validating unit conversions.
*   **Approval Workflow:** Users can save drafts, track submission status, and receive revision requests from SLSEA Verifiers.

### 3.2 Mathematical & Computational Engine
The "brain" of the dashboard must handle complex calculations on the fly.

*   **Unit Conversions:** Dynamic, real-time toggling across the platform between mass/volume, monetary values (LKR ↔ USD), and energy units (PJ ↔ ktoe ↔ GWh ↔ TJ).
*   **Energy Balancing:** Automated computation of primary supply, transformation losses, and final sector consumption.
*   **Grid Emissions Estimates:** Automatic calculation of Operating Margins, Built Margins, and Average Emission Factors.
*   **Dynamic Coefficients:** All emission factors and conversion matrices must be securely editable by Administrators via the backend, complete with version control.
*   **Advanced Analytics:** Integrate basic forecasting algorithms (linear/exponential) and AI-driven smart annotations to highlight anomalies in graphs.

### 3.3 Interactive Dashboards & UI/UX
The presentation layer must be highly visual, responsive, and intuitive.

*   **Required Visualizations:**
    *   **Sankey Diagrams:** To map energy flows from generation sources to end-user sectors.
    *   **Sunburst Charts:** To display the consumption portfolio.
    *   **Trendlines & Stacked Bars:** For multi-year comparisons of building sector energy use and Energy Use Intensity (EUI).
*   **Interactive Tables:** Data tables must allow column sorting, multi-dimensional filtering (e.g., Year + Fuel Type + Sector), and side-by-side historical comparisons.
*   **Export Capabilities:** All charts and tables must be exportable to Excel, CSV, PDF, and PNG/JPEG. **Critical:** All visual exports must auto-embed citation metadata (e.g., *Source: SLSEA, 2026*).

### 3.4 Role-Based Access Control (RBAC) & Admin Panel
The system will accommodate hundreds of users across the energy sector.

| User Role | Permissions |
| :--- | :--- |
| **Data Providers** | Public/Private entities submitting data. Can only access forms relevant to their organization. |
| **Verifiers (SLSEA)** | Review, request revisions, and formally validate submitted data. |
| **Administrators** | Full system control. Can manage users, create new dynamic input forms, and update mathematical coefficients. |
| **Viewers** | Read-only access for public observers or researchers. |

---

## 4. Security, Compliance & Data Protection

> [!CAUTION]
> As a national system handling critical infrastructure data, security protocols must be rigorous.

*   **Authentication:** **Multi-Factor Authentication (MFA)** is mandatory for all Administrator accounts.
*   **Threat Protection:** Implement robust firewalls, DDoS mitigation, and robotic access prevention. Enforce encryption for data both at rest and in transit (SSL).
*   **Data Protection Law:** Strict adherence to the **Sri Lanka Personal Data Protection Act (No. 9 of 2022)** and the **EU GDPR** (Privacy by Design).
*   **Auditability:** Every system action—from an admin tweaking a conversion factor to a data provider overriding an upload—must be captured in a permanent, searchable audit log.
*   **Backups:** Automated monthly backups with an administrative interface for manual triggers and health monitoring.

---

## 5. Execution Roadmap (14 Key Tasks)

### Phase 1: Foundation
*   **Task 1 & 2:** Requirements validation, ISIC database architecture, UI wireframing, and inception planning.

### Phase 2: Core Build
*   **Task 3 & 4:** Develop the Math Engine and build the frontend interactive dashboards (Sankey, Sunburst).
*   **Task 5 & 6:** Implement Data Tables, Export tools, and secure Data Submission Interfaces with Excel bulk uploads.
*   **Task 8:** Build the Admin backend for dynamic form generation and user management.

### Phase 3: Integration & Migration
*   **Task 7 & 9:** Implement MFA/RBAC security and build Interoperability APIs.
*   **Task 11:** The critical task of migrating, cleaning, and mapping **decades of historical Excel data** into the new database.

### Phase 4: Delivery
*   **Task 10 & 12:** Extensive UAT, penetration testing, and SLSEA staff training.
*   **Task 13 & 14:** Final deployment on SLSEA servers, complete source code handover, and commencement of the 1-year defects liability period.

---

> [!NOTE]
> **Intellectual Property Clause:** SLSEA and GIZ retain absolute, irrevocable ownership of all source code, databases, and artifacts produced during this project.
