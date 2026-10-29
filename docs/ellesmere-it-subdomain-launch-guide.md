# Launch guide: `international.ellesmere.com`

**Audience:** Ellesmere College IT / DNS administrators  
**Requested hostname:** `international.ellesmere.com`  
**Purpose:** Point this subdomain at the **Ellesmere College International (ECI)** web platform on **Vercel**  
**ECI app today (temporary URL):** `https://eci-platform-seven.vercel.app`  
**Main site today:** Finalsite (`www.ellesmere.com` → `ellesmerecom.finalsite.com`)  
**DNS provider today:** GoDaddy (`ns43.domaincontrol.com` / `ns44.domaincontrol.com`)

---

## 1. What you are being asked to do

Ellesmere College International runs on **Vercel** (Next.js). It is **not** a Finalsite Composer page, microsite, or Finalsite subdomain landing page.

| Hostname | Platform | Action |
| --- | --- | --- |
| `www.ellesmere.com` | Finalsite | **Leave unchanged** |
| `ellesmere.com` (apex) | Finalsite / existing records | **Leave unchanged** |
| `international.ellesmere.com` | **Vercel** (ECI project) | **Create one new CNAME** |

Your work is almost entirely **DNS at GoDaddy**. Do **not** move `ellesmere.com` nameservers to Vercel — that would break Finalsite and school email. Optional Finalsite work is limited to adding a normal hyperlink from the main site — not hosting the ECI app inside Finalsite.

---

## 2. Critical: do **not** use the Finalsite subdomain pattern

Finalsite’s standard docs say: create a CNAME for a subdomain → `[keyword].finalsite.com`, then open a Finalsite Support ticket so Composer can claim that hostname.

**That pattern is wrong for this launch.**

If `international.ellesmere.com` is pointed at Finalsite:

- Finalsite will try to serve Composer content
- Vercel will never receive traffic
- SSL for the ECI app will fail

**Correct pattern:** DNS for `international` is a **CNAME to Vercel** (exact target from the Vercel Domains UI). Finalsite Support does **not** need a ticket to “claim” this hostname.

---

## 3. Roles and hand-offs

| Party | Owns |
| --- | --- |
| **Ellesmere IT** | DNS for `ellesmere.com` (GoDaddy); confirm no conflicting `international` record; optional Finalsite nav/link; optional `_vercel` TXT if Vercel asks for verification |
| **ECI project / web team** | Vercel project, add custom domain in Vercel, SSL (automatic on Vercel), env vars, Supabase auth allow-list, go-live |
| **Finalsite Support** | Not required for DNS of this subdomain. Only contact if you later need help adding a link *from* the main Finalsite site |

### Order of operations (important)

1. **ECI team** adds `international.ellesmere.com` in **Vercel → Project → Settings → Domains**.  
2. Vercel shows the **exact DNS records** to create (CNAME for traffic; sometimes a TXT for verification).  
3. ECI team sends those values to Ellesmere IT.  
4. **Ellesmere IT** creates the record(s) in GoDaddy.  
5. Vercel marks the domain **Valid** and issues HTTPS automatically.

### What Ellesmere IT will receive from the ECI team

Copy the values **exactly** from Vercel’s Domains panel for this project. Do not reuse another project’s CNAME.

Typical traffic record for a subdomain:

| Type | Name / Host | Value / Points to |
| --- | --- | --- |
| **CNAME** | `international` | A Vercel target such as `cname.vercel-dns.com`, `cname.vercel-dns-0.com`, **or** a **project-specific** host like `xxxx.vercel-dns-017.com` |

> **Vercel’s current docs:** each project may show a **unique** CNAME (example shape: `d1d4fc829fe7bc7c.vercel-dns-017.com`). Always prefer the value on the domain card in the ECI Vercel project over any example in this document.

Sometimes Vercel also asks for domain verification:

| Type | Name / Host | Value |
| --- | --- | --- |
| **TXT** | `_vercel` | *(value shown in Vercel — on the apex `ellesmere.com` zone)* |

> **Placeholder for IT — paste the live values here before cutover:**  
> CNAME `international` → `______________________________`  
> TXT `_vercel` (if required) → `______________________________`

---

## 4. Pre-flight checks (Ellesmere IT)

Complete these before changing DNS.

1. **Confirm who can edit DNS** for `ellesmere.com` in GoDaddy.
2. **Search existing records** for anything named `international` (A, AAAA, CNAME, TXT).  
   As of the pre-launch check, `international.ellesmere.com` did **not** resolve — treat this as “create new,” but re-check before you publish.
3. **Do not change** existing records for:
   - apex `ellesmere.com`
   - `www` (must stay on Finalsite)
   - MX / mail (`ellesmere-com.mail.protection.outlook.com` today)
   - existing TXT / verification records (except adding a new `_vercel` TXT if Vercel requests it)
4. **Do not change nameservers** from GoDaddy (`ns43` / `ns44.domaincontrol.com`) to Vercel.
5. Confirm with the ECI team that `international.ellesmere.com` is already listed under the ECI Vercel project’s **Domains** page.
6. Agree a **rollback**: if something breaks, delete or disable only the new `international` CNAME (and any new `_vercel` TXT added for this launch) — never touch `www`.

---

## 5. Step-by-step: create the DNS record (GoDaddy)

These steps assume DNS remains on GoDaddy Domain Control.

### 5.1 Open DNS management

1. Sign in to GoDaddy.
2. Open **Domain Portfolio** → select **`ellesmere.com`**.
3. Open **DNS** / **Manage DNS**.

### 5.2 Add the Vercel CNAME

Create **one** new record for site traffic:

| Field | Value |
| --- | --- |
| Type | **CNAME** |
| Name / Host | `international` |
| Value / Points to | *(exact Vercel CNAME from the ECI project Domains UI)* |
| TTL | `600` seconds (10 minutes) for launch; raise later if preferred |

Notes:

- Enter only `international` in the Name field (GoDaddy appends `.ellesmere.com`).
- If GoDaddy complains about a trailing dot, omit the trailing `.` — use e.g. `cname.vercel-dns.com` not `cname.vercel-dns.com.`
- Do **not** create an A or AAAA record for `international`. Vercel serves this subdomain via **CNAME**, not via Finalsite IPs and not via Vercel’s apex A record (`76.76.21.21` — that A target is only for apex domains, which we are **not** changing).
- Do **not** point this CNAME at `ellesmerecom.finalsite.com`, `eci-platform-seven.vercel.app`, or any `*.finalsite.com` hostname. Point it only at the **Vercel DNS CNAME target** shown in Domains settings.

### 5.3 Add verification TXT only if Vercel asks

If the Vercel Domains UI shows a verification TXT:

| Field | Value |
| --- | --- |
| Type | **TXT** |
| Name / Host | `_vercel` |
| Value | *(exact string from Vercel)* |

This does not move the domain to Vercel and does not affect Finalsite.

### 5.4 Save and wait for propagation

1. Save the record(s).
2. Expect propagation in roughly **minutes to a few hours** (rarely up to 24–48 hours).
3. Verify from your network:

```bash
dig +short international.ellesmere.com CNAME
dig +short international.ellesmere.com A
```

You should see a **Vercel** CNAME chain (hostname containing `vercel-dns`) and then Vercel edge IPs — **not** Finalsite’s `ellesmerecom.finalsite.com`.

Browser check:

- `https://international.ellesmere.com` should load the ECI site (or briefly show Vercel provisioning while the certificate issues).
- `https://www.ellesmere.com` must still be the unchanged Finalsite site.
- The temporary URL `https://eci-platform-seven.vercel.app` can keep working; production traffic should use the custom domain.

---

## 6. SSL / HTTPS

Ellesmere IT does **not** need to install a certificate in Finalsite, GoDaddy, or on school servers.

- **Vercel** issues and renews TLS for `international.ellesmere.com` automatically (Let’s Encrypt) once DNS is correct and the domain is attached to the project.
- In Vercel → Domains, wait until the domain status is **Valid**.
- If the browser shows a certificate name mismatch, DNS is wrong or the domain is not yet attached/verified in Vercel — fix DNS/Vercel config; do not buy a separate cert for Finalsite.

Force-HTTPS is handled by Vercel.

---

## 7. Application-side tasks (ECI team — Vercel / Supabase)

Ellesmere IT can treat this as the ECI checklist running in parallel.

1. In **Vercel → ECI project → Settings → Domains**, add `international.ellesmere.com` and copy the shown CNAME (and TXT if any) to IT.  
2. Confirm Production env vars on Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional LLM keys).  
3. In **Supabase Auth → URL configuration**, allow:
   - Site URL: `https://international.ellesmere.com`
   - Redirect URLs including:  
     `https://international.ellesmere.com/**`  
     `https://international.ellesmere.com/auth/callback`  
   - Keep the existing `*.vercel.app` URL in redirect allow-lists if preview/staging still needs it.
4. Confirm portals (`/login`, `/investor`, `/agent`, `/school`, `/team`) on the custom domain.  
5. Smoke-test public routes: `/`, `/schools`, `/investors`, `/agents`.

---

## 8. Optional Finalsite work (links only)

If Marketing/International want visitors on the main school site to find ECI:

1. In Finalsite Composer, edit the relevant nav item or International page.
2. Add a normal external link to `https://international.ellesmere.com`.
3. Do **not** create a Finalsite Domain / Host Name for `international.ellesmere.com`.
4. Do **not** ask Finalsite Support to “point the subdomain at a Composer page.”

Suggested labels: “Ellesmere College International”, “International”, or “Our international schools”.

---

## 9. Email and other services

| Item | Guidance |
| --- | --- |
| `international@ellesmere.com` | Mailbox is independent of this website DNS change. **Do not alter MX records.** |
| SPF / DKIM / DMARC | No change required solely for the website subdomain. |
| Microsoft 365 / Google Classroom TXT | Leave existing TXT verification records alone (unless adding the new `_vercel` TXT above). |
| Nameservers | Stay on GoDaddy. **Do not** switch the zone to Vercel nameservers. |

---

## 10. Go-live checklist

**Ellesmere IT**

- [ ] Received exact Vercel CNAME (and TXT if shown) from ECI team  
- [ ] Confirmed no conflicting `international` DNS record  
- [ ] Created CNAME `international` → Vercel target  
- [ ] Added `_vercel` TXT only if Vercel requested it  
- [ ] Verified with `dig` that the name resolves via `vercel-dns`, **not** Finalsite  
- [ ] Confirmed `https://www.ellesmere.com` still loads Finalsite  
- [ ] (Optional) Added Finalsite nav/page link to the new URL  

**ECI team**

- [ ] Domain added on Vercel project; status **Valid**; SSL issued  
- [ ] Supabase auth URLs updated for the custom domain  
- [ ] Production env vars set on Vercel  
- [ ] Public + portal smoke tests passed on `https://international.ellesmere.com`  
- [ ] Stakeholders notified of the live URL  

---

## 11. Rollback

1. In GoDaddy DNS, **delete** (or disable) only the `international` CNAME.  
2. Remove any `_vercel` TXT that was added solely for this launch (if present).  
3. Leave all Finalsite / `www` / mail / nameserver settings untouched.  
4. Tell the ECI team so they can remove or pause the domain in Vercel → Domains.

No Finalsite “Domain is live” change is involved, because this hostname was never added to Composer.

---

## 12. Suggested message you can send Finalsite (only if needed)

> We are launching a separately hosted Ellesmere College International application on Vercel at `international.ellesmere.com`. This hostname must remain a DNS CNAME to Vercel and must **not** be configured as a Finalsite Composer domain or Finalsite subdomain landing page. The primary site `www.ellesmere.com` stays on Finalsite unchanged. We may add a standard hyperlink from Composer to `https://international.ellesmere.com`. Nameservers for `ellesmere.com` remain with the school’s current DNS provider.

---

## 13. Contacts / blanks for the school to fill

| Role | Name | Email |
| --- | --- | --- |
| Ellesmere IT / DNS owner | | |
| ECI project owner | | |
| Vercel project / team | ECI (`eci-platform` / `eci-platform-seven.vercel.app`) | |
| Agreed Vercel CNAME target | | |
| `_vercel` TXT required? | Yes / No — value: | |
| Target go-live date | | |

---

## Appendix A — Current DNS snapshot (reference)

Observed before launch (for orientation; re-verify at cutover):

| Name | Type | Points to / value (summary) |
| --- | --- | --- |
| `ellesmere.com` | A | Finalsite/Cloudflare edge (`104.17.71.73`) |
| `www.ellesmere.com` | CNAME | `ellesmerecom.finalsite.com` |
| Nameservers | NS | `ns43.domaincontrol.com`, `ns44.domaincontrol.com` |
| Mail | MX | `ellesmere-com.mail.protection.outlook.com` |
| Temporary ECI URL | HTTPS | `https://eci-platform-seven.vercel.app` (Vercel) |
| `international.ellesmere.com` | — | **Not configured** (ready to create → Vercel CNAME) |

## Appendix B — Why this is separate from Finalsite

The ECI platform is a Next.js application on **Vercel** (public marketing pages plus password-controlled investor, agent, school, and team portals) with a Supabase backend. Finalsite remains the system of record for the UK main school website. Only the `international` subdomain is delegated by CNAME to Vercel; the rest of the `ellesmere.com` DNS zone stays as it is.
