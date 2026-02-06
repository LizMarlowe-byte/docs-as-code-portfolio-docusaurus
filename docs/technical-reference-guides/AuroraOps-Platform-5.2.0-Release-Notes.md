# AuroraOps Platform 5.2.0 Release Notes

!!! abstract ""
    This document summarizes the new features, product enhancements, resolved issues, and known issues in **AuroraOps Platform 5.2.0**.

---

## <h2 id="auroraOps-5.2.0-overview">📄 AuroraOps 5.2.0 overview</h2> 

**Release Version:** 5.2.0  
**Release Date:** February 5, 2026

Welcome to the release of AuroraOps Platform 5.2.0. This document summarizes the new features, product enhancements, resolved issues, and known issues in **AuroraOps Platform 5.2.0**. This release builds on the major changes introduced in 5.0 and includes improvements rolled up from all 5.1.x hotfix releases.

For questions or support, contact the AuroraOps Support Team at *support@auroraops.com*.

---

## <h2 id="target-audience">🎯 Target audience</h2>

This document is intended for customers and partners who need to understand what’s new or improved in the AuroraOps Platform 5.2.0 release.

---

## <h2 id="new-features">🚀 New features </h2> 

This release introduces several new features designed to enhance usability, improve workflow efficiency, and expand the platform’s core capabilities.
	
	
### 1. New sign-in flow

Along with new graphics, the system sign-in page features a new flow that supports multiple authentication methods. 

When an employee enters their user name, the system presents a screen appropriate to the configured authentication method:

- DB or LDAP authentication: Password screen
- LDAP/SSO with Trusted Login: WFO portal
- SAML: IdP sign-in screen

---

### 2. Limit concurrent user sessions

You can now limit the number of concurrent sessions for each user. You can limit the number of IP addresses per user and/or the number of sessions a user can have per IP address. In mobile deployments, the service provider can set the user limits for each tenant.

---

### 3. New Authentication Configuration Guide

To consolidate authentication information, a new _Authentication Configuration Guide_ has been developed. This guide replaces the _SAML_, _OpenID Connect_, and _Active Directory Validation Tool_ guides.

---

### 4. Support for multiple certificate authorities

The platform now supports multiple certificate authorities. It is no longer required to have the same root certificate authority certificates deployed on system servers.

---

### 5. Unified logging

This release unifies log retention and centralizes the management of logging levels across all sub‑systems. To support unified logging, the Recorded Sessions logger was updated to be consistent with other loggers.

This utility enables users to: 

- Download files and folders from one or more servers from the same navigation place.
- Troubleshoot issues by listing common problematic use cases, and grouping all log and configuration files into a single view.
- Change the log settings of a component across one or more servers at one time.
- Update the latest version of this utility across all servers in a single click.

---

### 6. API rate limiting controls 

Administrators can now configure tenant-level API rate limits from the AuroraOps Admin Console.

Administrators can now:

- Set per-minute and burst limits 
- Monitor API throttling events  
- Export rate-limit logs for compliance reviews  

---

### 7. SSO role mapping 

AuroraOps now supports mapping SAML or OIDC attributes to AuroraOps user roles during login.

This includes:

- Allows auto-provisioning of users into groups  
- Reduces manual onboarding steps  
- Supports Okta, Azure AD, and Ping Identity  

---

## <h2 id="resolved-issues">🛠 Resolved issues </h2> 

| Issue ID | Description | Resolution |
|:----------|:-------------|:------------|
| AO-1923  | Workflow editor did not display step-level error messages during validation. | Updated validation engine to surface full error messages in UI. |
| AO-2044  | API key rotation logs displayed incorrect timestamps. | Corrected timestamp serialization and applied timezone normalization. |
| AO-2157  | Users with read-only permissions could see "Edit" on Job Schedules. | Updated UI permission checks to properly hide edit actions. |
| AO-2199  | High memory usage on the Notification Service during bulk event processing. | Optimized memory allocation and added queue backpressure handling. |

---

## <h2 id="known-issues">⚠️ Known issues </h2>


### 1. Delayed webhook delivery under high load
Under very high API traffic, webhook dispatch may experience a delay of up to 45 seconds.  
**Workaround:** Enable auto-retry in the Notification Settings page.

---

### 2. Inaccurate CPU metric spikes on the Monitoring dashboard
Some tenants may see intermittent CPU spikes due to metrics sampling drift.  
**Status:** Fix planned for version 5.2.1 (hotfix scheduled).

---

### 3. Incomplete auto-generated API documentation for custom connectors
Descriptions for custom connector schemas may generate without sample payloads.  
**Workaround:** Refer to the _Connector Developer Guide_ for sample schema definitions.

---

### 4. Saving a search twice produces an error
When saving from the **Advanced Search** dialog box, clicking the **Save** button twice can result in error notifications. The search has been saved and the notifications can be noted and ignored.
**Workaround:** Save one search, log out and log back into the system, and save the next search.

---

### 5. Limitation on Scheduling screen when groups are created during user session
A user creates a group, configures a scheduling period for the group, and assigns it to a queue. The user navigates to the Scheduling screen, but is unable to edit any scheduling values or run any other actions for the newly created group.
**Workaround:** Refresh the Scheduling screen. After refreshing the screen, the user privileges are updated and all the actions the user is entitled to are enabled.

## <h2 id="hotfixes">🔧 Hotfixes</h2>

| Hotfix ID | Release Date | Affected Version(s) | Description | Status |
|:-----------|:--------------|:---------------------|:-------------|:--------|
| HF‑5.1.12‑1 | Jan 30, 2026 | 5.1.12 | Resolved a deadlock in the event-processing engine affecting high-throughput tenants. | Included |
| HF‑5.1.11‑2 | Jan 27, 2026 | 5.1.10–5.1.11 | Fixed an issue where scheduled jobs did not trigger after a scheduler service restart. | Included |
| HF‑5.1.10‑1 | Jan 20, 2026 | 5.1.10 | Addressed a memory leak in the monitoring collector service. | Included |

---

## <h2 id="additional-notes">📚 Additional notes </h2>

### Deprecations

- The Legacy File Importer API (`/v1/import`) will be deprecated in version **5.3.0**.  

- The Classic Admin Panel will enter deprecation in version **5.4**.

---

### Upgrade Considerations

- A service restart is required for tenants using the Workflow Orchestrator.  

- API clients must refresh OAuth tokens after upgrading to support new rate-limit headers.

---
