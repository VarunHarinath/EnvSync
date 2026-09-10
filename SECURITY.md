# EnvSync security model

EnvSync protects a database-only disclosure with authenticated AES-256-GCM encryption; the master key stays outside PostgreSQL. TLS is required in production because encryption at rest does not protect traffic. API-key and refresh-token digests prevent their recovery from a database-only leak. Active access tokens remain bearer credentials.

Administrators are trusted with instance-wide access. Operating-system root, simultaneous access to the database and master key, or runtime-process access are outside the application threat boundary. Rotate keys after suspected exposure and reset sessions by changing passwords. Report vulnerabilities privately without real secrets or database dumps.
