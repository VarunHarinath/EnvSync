# EnvSync 1.0.0 release-candidate report

Date: 2026-09-27. **Overall: FAIL — release gates remain open. Not declared production-ready.**

Implementation is in this repository; no packages, container images, Git tags or releases were published. The live `envsync` Docker project was not upgraded. Tests use independent projects, ports and volumes. Status labels below distinguish implementation evidence from broader deployment guarantees.

## 1. Architecture summary

PASS — one React frontend, Express API, PostgreSQL database, encryption/access services and STDIO MCP adapter. Personal and Business share the same application and schema. A separate dependency-free npm CLI orchestrates container images, not a second application. Node/Python SDKs remain independent packages. Proposed-feature-01 was not implemented.

## 2. Personal profile

PASS — database-persisted profile, owner ID and MCP setting; backend capability map; owner-only human authentication. User administration, teammates and resource-sharing routes reject Personal requests. Navigation hides user administration/sharing and organization settings. Projects, environments, secret values, keys, agents and audit remain available. Default port is 8088, loopback only.

UNVERIFIED — full manual browser/device accessibility and usability review. Automated HTTP tests are not visual verification.

## 3. Business profile

PASS — existing deployments default to Business. Local admins retain user management and centralized agent governance. Resource ownership/sharing is now enforced independently of global read/write ceilings. Explicit READ shares do not grant WRITE. SDK pull permission remains administrator-controlled. Personal/Business conversion is not exposed.

NOT APPLICABLE — SMTP invitations: not implemented, not advertised as available. Administrators can create users locally.

## 4. CLI architecture

PASS — `cli/` is the standalone package, target name `envsync`, version 1.0.0, `bin/envsync.js`. Built-in Node modules only; no runtime npm dependencies. Commands: setup/start/stop/restart/status/doctor/logs/backup/restore/update/version/help and MCP serve/status. Shell-free Docker invocation; hidden interactive password; noninteractive owner-only JSON input; generic secret-safe failures; known Docker port/storage/network-pool errors receive actionable hints.

Configuration: `~/.envsync`, overridden by `ENVSYNC_HOME`. `instance.json` is allowlisted non-secret metadata; `runtime.env` holds cryptographic/database material. Unix directory/file modes 0700/0600. Passwords go to bootstrap stdin, not argv or persisted CLI settings.

UNVERIFIED — interactive Ctrl+C behavior on every platform and Windows ACL hardening. No unsafe auto-updater was added.

## 5. Installation flow

PASS — actual `npm pack`, installation into an isolated global prefix, installed executable setup, owner creation and image-based lifecycle were exercised for both profiles on this macOS Docker host. No server dependencies were installed into the CLI package.

**PREPARED — REGISTRY RELEASE NOT VERIFIED.** `npm view envsync` returned E404 during the audit. This does not establish name ownership or publishing rights. `runtime/release.json` intentionally has no published image references. Setup currently needs explicit trusted `--api-image`/`--web-image` values. The public `npm install -g envsync` experience is not claimed to work today.

## 6. Runtime architecture

PASS — PostgreSQL 16, Node 22 API, built static frontend in Nginx; health-based Compose startup; private database network; loopback web port; persistent named data volume; restart policies; bounded 10 MiB × 3 container logs in the installed manifest. API is non-root. Migrations run before API listen.

Existing checkout volume `envsync-data-v2` is preserved and is not automatically adopted by the new CLI. Runtime PostgreSQL credentials still use the initialized database owner; separate migration/runtime least-privilege roles need follow-up. Remote TLS/public hostname deployment is not automated by the CLI. No hosts-file changes were made.

## 7. npm package size

PASS — the CLI publish allowlist contains exactly six files: README.md, package.json, bin/envsync.js, lib/runtime.js, runtime/compose.yml, runtime/release.json. No `.env`, credentials, database, test fixtures, screenshots, pitch artifacts, node_modules or runtime source is included.

Final `npm pack --dry-run --json`: **8,027 bytes packed / 21,106 bytes unpacked**, six files. Prior root-package dry-run included 175 files / 1,515,946 bytes packed / 2,189,255 bytes unpacked, including unrelated pitch artifacts; the private root must never be published.

Node SDK dry-run: 2,011 bytes packed / 5,090 bytes unpacked, four files. Python packaging is separately verified; it does not include the server.

## 8. Docker image sizes

PASS — builds completed. Before: API approximately 185 MB, web 62.9 MB, PostgreSQL 288 MB. Final build: API **180,245,779 bytes**, web **62,882,464 bytes**, PostgreSQL **288,111,398 bytes**; about 531.24 MB logical sum. This is not a deduplicated clean-install disk measurement.

Multi-stage API build excludes development dependencies and npm cache. Frontend compiler/dependencies are absent from the final Nginx image.

UNVERIFIED — multiarchitecture images, container CVE scans, Docker Desktop disk overhead and clean-machine total footprint.

## 9. Frontend bundle size

PASS — production build and lint pass without warnings after hook dependency fixes. Baseline JS 365.58 kB / 108.35 kB gzip; CSS 66.29 kB / 13.25 kB gzip. Updated root-workspace build JS 395.52 kB / 117.23 kB gzip; Docker standalone-lock build JS 366.14 kB / 108.71 kB gzip. CSS remains 66.29 kB. Root resolved React 19.3.0; standalone frontend lock resolves 19.2.3, explaining differing artifacts. Both build paths were tested; Docker is the delivery artifact.

The increase is disclosed, not reported as an optimization. No large animation or installer dependencies were added. Lighthouse/CLS/LCP performance budgets were not measured in this task.

## 10. Dependency audit results

PASS — current npm audit reports zero known CRITICAL/HIGH findings in root shipped runtime and standalone backend runtime. Backend: zero findings. Frontend standalone audit was reduced from 18 findings (10 HIGH) to two MODERATE package entries using compatible updates, without `--force`.

Remaining: react-router / react-router-dom 6.30.6, [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) (redirect handling) and [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) (SSR hydration). No SSR is used; application navigation paths are constructed locally rather than accepting arbitrary external targets. A tested upgrade to 7.18+ is still required, or explicit documented risk acceptance. A major upgrade was not applied blindly.

CLI, Node SDK and Python SDK have no third-party runtime dependencies. Python build-tool and Docker OS-layer vulnerability scans are UNVERIFIED. npm audit results do not cover those layers.

## 11. Security review

PASS — fixed broad resource IDOR access; applied per-resource ownership/sharing checks and list filtering; matched Express case-insensitive paths; limited SDK endpoints to application keys and rejected scope overrides; constrained cross-project secret attachments in PostgreSQL; blocked agent writes affecting unassigned environments; blocked access to archived projects; bounded login/enrollment limits; removed raw database error logging; checked Origin on state-changing browser requests; retained restrictive CORS and security headers.

Rate limiting is process-local, not a distributed ingress control. Database owners/Docker operators remain trusted. This review is not an independent penetration test. Request/permission concurrency beyond covered cases requires continued review.

## 12. Authentication tests

PASS — bcrypt verification, encryption tamper detection, signed-token checks, correct/wrong login, session-bound access tokens, concurrent refresh (one success/one rejection), old-token invalidation, and logout invalidation. Passwords cannot silently exceed bcrypt's 72-byte input limit. Client refresh requests are single-flight. HTTP loopback cookies work; HTTPS public URLs enable Secure cookies.

UNVERIFIED — browser-specific cookie behavior under external TLS proxies, distributed brute-force resistance and comprehensive fault injection around simultaneous account changes. Existing users must sign in again after this session-binding change.

## 13. Authorization tests

PASS — owner, administrator and unrelated member; default-deny project discovery; READ environment sharing; READ_WRITE rename; non-admin user-management denial; global SDK permission ceiling; SDK environment override denial; revoked application key denial; cross-environment agent denial; shared-value write denial; expired grant and revoked credential denial. Mixed-case resource routes are included in final regression tests. Human shared-secret mutations recheck access under a row lock.

Permission assertions are server-side. UI visibility is not the authorization boundary. Large-resource list performance (current per-resource checks) is UNVERIFIED.

## 14. Secret handling review

PASS — AES-256-GCM with random nonces; hashed application/agent/refresh credentials; plaintext only on explicit authenticated retrieval; no secret values in tested audit/operational logs; ciphertext-at-rest check; metadata allowlist; current working-tree credential-pattern scan; CLI publish-file allowlist inspection.

**FAIL — historical credential-shaped material found** in `Client/src/pages/Landing.jsx` at reachable commits:

- `7818dc011a83b6930cb28ca04f3479bb835dbf80`
- `89e1218a3a3e6fdafa477e86f64920aefed578ec`
- `ae960c2ec2548b008f2a67402c887850504b71e0`

Values were not printed. This local scan covered 61 reachable commits. Determine whether these are real credentials; rotate/revoke any real ones, then approve an appropriate history-remediation plan. No history rewrite or push-protection bypass was performed.

UNVERIFIED — provider-aware/binary scanning. Third-party scanner execution was blocked by the permission reviewer because repository history could expose previously flagged credential material; explicit operator approval is needed. CI uses the local-only pattern scanner and will fail on these findings.

## 15. MCP tests

PASS — STDIO protocol negotiation, tool listing, whoami, denial handling, unknown-tool rejection and reconnect against an automated MCP client. Real backend HTTP tests cover assignment, permission, TTL, shared-secret protection and revocation. Request timeout added. Disabled-profile capability blocks MCP HTTP routes.

MCP is client-launched STDIO, **not an HTTP MCP endpoint**. `doctor` deliberately reports actual AI-client connectivity as UNVERIFIED. Claude Desktop, Codex and Cursor end-to-end client tests are UNVERIFIED. SDK/protocol tests do not establish those results.

## 16. SDK tests

PASS — three Node SDK tests, two Python SDK tests; installed-runtime retrieval with the actual Node SDK. Node SDK publish list inspected (README, package metadata, source, type declarations). Python wheel and source distribution built successfully in an isolated temporary virtual environment; wheel contains two source modules and three metadata files, with no server/runtime credentials. Source archive contents were inspected too. Python SDK runtime has no dependencies. Registry publication and installed Python SDK retrieval against the Docker runtime are UNVERIFIED.

## 17. Backup/restore tests

PASS — database custom-format archive, owner-only file creation, independent empty-instance restoration, login and successful decryption of a known synthetic secret. Both profiles were tested. Restore over a populated database is refused. Sensitive encryption/config material must be backed up separately; archive alone is insufficient.

Restore trusts its SQL archive and uses a single transaction; only trusted backups should be used. Interrupted archives are retained for diagnosis, not treated as verified backups. Large-data recovery, offsite custody and restore time objectives are UNVERIFIED. See [recovery procedure](BACKUP_RECOVERY.md).

## 18. Migration tests

PASS — fresh schema, repeated startup, parallel migration processes, backup/restored schema. Migration checks/application share a PostgreSQL advisory lock; each migration is transactional. Checksums are enforced after first adoption; unknown newer versions refuse downgrade. Older checksum-less installs adopt checksums once rather than rewriting existing migration files.

UNVERIFIED — rollback/upgrade from every historical release snapshot. The existing live database was not migrated by this task. Cross-project attachment corruption now fails migration safely for operator review.

## 19. Cross-platform status

PASS — macOS Node CLI with Docker Desktop Linux containers.

LINUX — UNVERIFIED on a native clean host. Linux CI is prepared but was not run remotely.

WINDOWS — UNVERIFIED. Paths use Node APIs and Docker is invoked without shell syntax in the shipped CLI; ACLs and interactive terminal behavior still need real testing.

CLEAN MACHINE — UNVERIFIED. Local cached images and an existing Docker installation were used.

## 20. Known limitations

- No configured public image/update channel; no registry release.
- CLI-managed runtime is loopback-only, with no automatic remote TLS setup.
- No automatic conversion/adoption of legacy installations or deployment profiles.
- Cloned environments share secret records; they do not create independent values.
- Two moderate router findings remain; CI currently gates HIGH/CRITICAL.
- No SMTP invitations, hardware-backed key custody, master-key rotation flow or distributed rate limiting.
- PostgreSQL runtime uses the database owner, not a separate least-privilege role.
- Test artifacts/volumes are retained; test containers/networks are removed after runs to avoid exhausting Docker network pools.
- Personal browser usability and complete mobile navigation need manual acceptance.
- Full license/third-party notice packaging should receive release-operator review.

## 21. Unverified items

Registry ownership/publishing; published immutable images; clean-machine installation; Windows/native Linux; real AI clients; container CVEs; provider-aware/binary secret scanning; external TLS; performance/load/fault-injection matrices; large-scale recovery; CI remote execution; comprehensive browser acceptance; independent security review. These remain UNVERIFIED, not PASS.

## 22. Release blockers

FAIL — historical credential-pattern findings require review/remediation. No unauthorized history rewrite will be performed.

FAIL — registry/runtime delivery is not configured, so the advertised public installation path is not yet verified.

UNVERIFIED — the platform, browser, AI-client and clean-machine gates above must be completed or explicitly narrowed in supported-release scope. Complete image CVE scanning and assess remaining dependency risks before production sign-off.

The code is a tested release candidate, not a completed public production release. External release authority cannot be inferred from this implementation request.

## 23. Exact controlled-release commands

Run from the repository root after reviewing changes:

```sh
npm ci
npm run check
npm --prefix WebService run check
npm --prefix cli test
npm --prefix cli run check
node scripts/scan-secrets.js
node scripts/scan-history.js
npm audit --omit=dev --audit-level=high
docker build -t envsync-release-api:1.0.0 WebService
docker build -t envsync-release-web:1.0.0 Client
node scripts/release-integration.js
```

Inspect distributables in their actual package directories (do not pack the private root):

```sh
cd cli
npm pack --dry-run --json
npm pack
```

```sh
cd sdk/node
npm pack --dry-run --json
```

```sh
python -m build sdk/python
```

Before publishing: resolve history findings with authorization; verify final registry names/owners; publish reviewed multiarchitecture container artifacts to the chosen registry; set immutable references in `cli/runtime/release.json`; rebuild/retest the exact package; test registry installation on clean supported machines. Registry image URLs cannot be invented in this report.

Only after separate explicit release authorization, from each correct package directory:

```sh
npm whoami
npm publish --access public
```

For the Python distribution, after verifying PyPI name/ownership and built artifacts:

```sh
python -m twine check sdk/python/dist/*
python -m twine upload sdk/python/dist/*
```

No publish command above was executed. Production sign-off remains withheld until the stated gates are satisfied.

### Final local verification

| Check | Result |
| --- | --- |
| Backend tests | PASS — 12 |
| Node SDK tests | PASS — 3 |
| Python SDK tests | PASS — 2 |
| CLI validation tests | PASS — 3 |
| Frontend lint / production build | PASS — no warnings |
| Final installed-tarball integration, both profiles | PASS |
| Concurrent migrations / refresh, mixed-case authorization | PASS |
| Persistence and independent backup/restore, both profiles | PASS |
| Python wheel / source archive build and file inspection | PASS |
| CLI and Node SDK package file inspection | PASS |
| Current working-tree pattern scan / diff whitespace | PASS |
| Reachable-history pattern scan | FAIL — three commits listed above |
| Live original containers | PASS — still healthy; not redeployed |

Final integration data/config/archives remain in the owner-only temporary directory `envsync-release-q7tx8w` under the host temporary directory. Test containers and networks were removed without deleting their volumes. Earlier runs exhausted Docker network pools because cleanup only stopped containers; test cleanup now removes its own containers/networks while preserving volumes. The final rerun passed after that fix. No unrelated Docker resources were pruned.
