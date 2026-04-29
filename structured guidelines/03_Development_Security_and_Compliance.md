# 03. Development, Security, and Compliance Guidelines
**Context:** This document extracts the strict architectural, security, data protection, and IP guidelines governing the development of the system.

## 1. Architectural & Technology Guidelines
*   **Open-Source Preference:** The solution should ideally be built using open-source, license-free software stacks (OS, databases, and application servers).
*   **Scalability:** The database must be highly modular to accommodate future data points (e.g., electric mobility, new policy shifts) without requiring system overhauls.
*   **Responsive Design:** Front-end must be fully compatible with modern browsers across desktops, tablets, and mobile devices (vertical screens).

## 2. Security and Authentication
The platform must be hardened against cyber threats (e.g., DDoS, SQL injection, unauthorized access):
*   **Firewalls & Detection:** Implement robotic access prevention and intrusion detection systems.
*   **Authentication:** Mandatory **Multi-Factor Authentication (MFA)** for all Administrator-level access.
*   **Data Encryption:** Ensure SSL certificates are configured for encryption in transit. Data at rest must also be protected.

## 3. Data Protection and Compliance
*   **Sri Lanka Personal Data Protection Act (No. 9 of 2022) & GDPR:** The platform must strictly adhere to data protection regulations. Personal or sensitive data must be processed with privacy-by-design principles.
*   **Data Backups:** The system architecture must facilitate automated monthly backups to prevent data loss. Administrators need an interface to trigger manual backups and test recovery points.
*   **Code of Conduct:** Development teams must operate in compliance with GIZ’s Code of Conduct, ensuring fair labour practices and zero tolerance for terrorism financing or embargo violations.

## 4. Intellectual Property & Code Ownership
*   **Total Ownership:** SLSEA and GIZ retain exclusive, irrevocable, and unlimited rights to all source code, software, documentation, databases, and visual materials generated during this project.
*   **Waiver of Rights:** The contractor assigns all intellectual property to GIZ and waives the right to be named as the originator.
*   **Confidentiality:** All datasets provided by SLSEA (especially raw stakeholder data) are strictly confidential and subject to the need-to-know principle.

## 5. Deployment and Handover Standards
*   The final product must be deployed on SLSEA-provided or SLSEA-approved hosting infrastructure.
*   The delivery must include:
    *   A binary copy on physical storage.
    *   Fully documented Source Code.
    *   Comprehensive Build and Deployment Guides.
    *   Admin and User Manuals.
