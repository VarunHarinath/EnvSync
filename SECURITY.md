Security Policy

Security is a fundamental part of EnvSync’s design.

EnvSync is built to give developers, applications, and AI agents controlled access to sensitive configuration while keeping infrastructure ownership in the hands of its operators.

This document describes EnvSync’s security model, trust boundaries, operational requirements, and vulnerability reporting process.

[!IMPORTANT]
Release Status: 1.0.0 Release Candidate

EnvSync has not yet been declared production-ready or independently security-audited.

Review the security considerations below before deploying EnvSync with sensitive credentials.

⸻

1. Security Model

EnvSync follows a straightforward principle:

Secrets should only be accessible to authorized identities within their permitted scope.

The platform’s security model includes:

Security Control	Implementation
Encryption at Rest	AES-256-GCM authenticated encryption
Master Key	Stored outside PostgreSQL
API Key Protection	Cryptographic digests stored instead of recoverable API keys
Refresh Token Protection	Token digests prevent recovery from database-only disclosure
Access Tokens	Bearer credentials requiring secure handling
Transport Security	TLS required for production deployments
Administrative Access	Administrators are trusted with instance-wide access

These controls are intended to reduce the impact of specific credential and database exposure scenarios.

They do not eliminate the need for secure infrastructure configuration.

⸻

2. Encryption at Rest

EnvSync uses AES-256-GCM to encrypt stored secret values.

AES-GCM provides authenticated encryption, protecting confidentiality and detecting unauthorized modifications to encrypted values.

The encryption master key is maintained separately from PostgreSQL.

What This Protects Against

If an attacker obtains only the PostgreSQL database, without access to the encryption master key, encrypted secret values should remain protected, assuming the encryption implementation and key management remain secure.

What This Does Not Protect Against

Encryption at rest does not protect against:

* Exposure of the encryption master key
* Compromise of the application runtime
* An attacker obtaining both the database and master key
* Authorized users intentionally or accidentally disclosing retrieved secrets
* Unencrypted traffic transmitted without TLS

[!WARNING]
Protect the encryption master key.

Losing the master key may make encrypted secrets unrecoverable. Exposing it may compromise the confidentiality of stored secrets.

⸻

3. Credential Protection

EnvSync uses cryptographic digests to protect certain stored credentials.

API Keys

API keys are stored as digests rather than recoverable plaintext values.

This reduces the risk of credential recovery from a database-only compromise.

Refresh Tokens

Refresh tokens are also stored as digests.

A database-only disclosure should not directly reveal the original refresh-token values.

Access Tokens

Active access tokens remain bearer credentials.

Anyone who obtains a valid access token may be able to exercise its associated permissions until the token expires or becomes invalid.

Access tokens must therefore be protected during storage, transmission, and application execution.

⸻

4. Transport Security

Encryption at rest does not secure data transmitted between clients and servers.

TLS is required for production deployments.

Production operators should ensure that:

* Client-to-server communication uses HTTPS.
* TLS certificates are valid and appropriately managed.
* Sensitive credentials are not transmitted over unencrypted public connections.
* Reverse proxies and network configurations are reviewed before exposing EnvSync externally.

Local development configurations should not be treated as production security configurations.

⸻

5. Trust Boundaries

EnvSync’s application security model assumes that certain infrastructure components and privileged identities are trusted.

Trusted Administrators

EnvSync administrators are trusted with instance-wide access.

Administrative privileges must only be granted to individuals authorized to manage the deployment and its sensitive resources.

Infrastructure-Level Access

The following scenarios are outside EnvSync’s application threat boundary:

Scenario	Security Boundary
Operating-system root compromise	Outside application protection
Database and master-key compromise	Outside database-only disclosure protection
Application runtime compromise	Outside application protection
Trusted administrator misuse	Outside the untrusted-user threat model

EnvSync does not claim to protect secrets from an attacker who has unrestricted control over the host or application runtime.

Self-hosting provides infrastructure control, not automatic infrastructure security.

⸻

6. Incident Response

If credential exposure or unauthorized access is suspected, operators should respond promptly.

Recommended Actions

1. Restrict access to affected systems.
2. Identify potentially exposed credentials and resources.
3. Rotate affected API keys and application secrets.
4. Rotate encryption keys where appropriate, using a reviewed recovery or migration procedure.
5. Reset affected user sessions through password changes.
6. Review available logs and audit records.
7. Investigate the source of the exposure before restoring normal operations.

[!CAUTION]
Changing the encryption master key without an appropriate re-encryption or recovery process may make existing encrypted secrets unreadable.

Do not replace the master key without understanding the consequences for stored data.

⸻

7. Responsible Vulnerability Disclosure

We appreciate security researchers and developers who help improve EnvSync.

If you discover a potential vulnerability, please report it privately.

Security Contact

📩 varunharinath@envsync.me

When reporting a vulnerability, please include:

* A clear description of the issue
* The affected component or functionality
* Steps to reproduce the behavior
* The potential security impact
* Relevant logs or screenshots with sensitive information removed

Please Do Not

* Publish unpatched vulnerabilities before coordinated disclosure
* Include real API keys, passwords, or production secrets
* Share database dumps containing sensitive information
* Attempt unauthorized access to systems or data
* Perform destructive testing against deployments you do not own

Reports will be reviewed and investigated based on their potential impact.

⸻

8. Security Limitations

EnvSync implements security controls designed to protect sensitive configuration, but no software system can guarantee absolute security.

Security depends on both the application and the environment in which it operates.

Operators remain responsible for:

* Host and container security
* TLS configuration
* Master-key protection
* Network access controls
* Credential rotation
* Backup and recovery procedures
* Appropriate administrative access

The current release candidate should be evaluated carefully before use with production secrets.

For additional deployment considerations, see the Backup and Recovery Guide and 1.0 Release Report.

⸻

<div align="center">

Security through explicit access. Control through ownership.

EnvSync

Secrets should go where they’re needed. Not everywhere.

Website · GitHub

</div>
