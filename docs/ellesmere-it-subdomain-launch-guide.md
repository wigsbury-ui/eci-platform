# Launch guide: `international.ellesmere.com`

**Audience:** Ellesmere College IT / DNS administrators  
**Requested hostname:** `international.ellesmere.com`  
**Purpose:** Point this subdomain at the **Ellesmere College International (ECI)** web platform  
**Main site today:** Finalsite (`www.ellesmere.com` → `ellesmerecom.finalsite.com`)  
**DNS provider today:** GoDaddy (`ns43.domaincontrol.com` / `ns44.domaincontrol.com`)

---

## 1. What you are being asked to do

Ellesmere College International is launching a **separate website** (Next.js application with its own hosting and backend). It is **not** a Finalsite Composer page, microsite, or Finalsite subdomain landing page.

| Hostname | Platform | Action |
| --- | --- | --- |
| `www.ellesmere.com` | Finalsite | **Leave unchanged** |
| `ellesmere.com` (apex) | Finalsite / existing records | **Leave unchanged** |
| `international.ellesmere.com` | External ECI host (not Finalsite) | **Create new DNS record** |

Your work is almost entirely **DNS**. Optional Finalsite work is limited to adding a normal hyperlink from the main site navigation or an International page — not hosting the ECI app inside Finalsite.

---

## 2. Critical: do **not** use the Finalsite subdomain pattern

Finalsite’s standard docs say: create a CNAME for a subdomain → `[keyword].finalsite.com`, then open a Finalsite Support ticket so Composer can claim that hostname.

**That pattern is wrong for this launch.**

If `international.ellesmere.com` is pointed at Finalsite:

- Finalsite will try to serve Composer content
- The ECI platform will never receive traffic
- SSL and auth for the ECI app will fail

**Correct pattern:** DNS for `international` points to the **ECI hosting provider** (CNAME target supplied by the ECI project team). Finalsite Support does **not** need a ticket to “claim” this hostname.

---

## 3. Roles and hand-offs

| Party | Owns |
| --- | --- |
| **Ellesmere IT** | DNS for `ellesmere.com` (GoDaddy); confirm no conflicting `international` record; optional Finalsite nav/link |
| **ECI project / web team** | Application hosting, SSL on the host, environment variables, Supabase auth allow-list, go-live of the app |
| **Finalsite Support** | Not required for DNS of this subdomain. Only contact if you later need help adding a link *from* the main Finalsite site |

Before DNS cutover, the ECI team must send you:

1. The **CNAME target** for `international.ellesmere.com` (example shapes below)  
2. Confirmation that the app is ready to accept that hostname  
3. Preferred go-live window (optional)

### Example CNAME targets (fill in the real value from the host)

| Host | Typical CNAME target |
| --- | --- |
| Vercel | `cname.vercel-dns.com` **or** a project-specific `*.vercel-dns-*.com` value shown in the Vercel domain UI |
| Netlify | `something.netlify.app` (or the value Netlify shows for custom domains) |
| Cloudflare Pages | The target Cloudflare shows for the custom domain |
| Azure / other | Whatever the host’s “custom domain / CNAME” panel lists |

> **Placeholder for IT:** once received, record the live target here:  
> `international.ellesmere.com` → `______________________________`

---

## 4. Pre-flight checks (Ellesmere IT)

Complete these before changing DNS.

1. **Confirm who can edit DNS** for `ellesmere.com` in GoDaddy (or wherever DNS is managed if it later moves).
2. **Search existing records** for anything named `international` (A, AAAA, CNAME, TXT).  
   As of the pre-launch check, `international.ellesmere.com` did **not** resolve — treat this as “create new,” but re-check before you publish.
3. **Do not change** existing records for:
   - apex `ellesmere.com`
   - `www`
   - MX / mail (`ellesmere-com.mail.protection.outlook.com` today)
   - existing TXT / verification records
4. **Confirm with the ECI team** that hosting already has `international.ellesmere.com` added as a custom domain (so SSL can be issued as soon as DNS appears).
5. Agree a **rollback**: if something breaks, delete or disable the new `international` CNAME only — never touch `www`.

---

## 5. Step-by-step: create the DNS record (GoDaddy)

These steps assume DNS remains on GoDaddy Domain Control. If DNS is elsewhere, create the same record type in that provider.

### 5.1 Open DNS management

1. Sign in to GoDaddy.
2. Open **Domain Portfolio** → select **`ellesmere.com`**.
3. Open **DNS** / **Manage DNS**.

### 5.2 Add the subdomain record

Create **one** new record:

| Field | Value |
| --- | --- |
| Type | **CNAME** |
| Name / Host | `international` |
| Value / Points to | *(CNAME target from ECI team — see §3)* |
| TTL | `600` seconds (10 minutes) for launch; raise to 1 hour later if preferred |

Notes:

- Enter only `international` in the Name field (GoDaddy appends `.ellesmere.com`).
- Do **not** create an A record for `international` unless the hosting provider explicitly requires A/AAAA (rare for modern app hosts; Vercel/Netlify/Cloudflare Pages normally want CNAME).
- Do **not** point this CNAME at `ellesmerecom.finalsite.com` or any `*.finalsite.com` / Finalsite CDN hostname.

### 5.3 Save and wait for propagation

1. Save the record.
2. Expect propagation in roughly **minutes to a few hours** (rarely up to 24–48 hours depending on prior TTL and resolvers).
3. Verify from your network:

```bash
dig +short international.ellesmere.com CNAME
dig +short international.ellesmere.com A
```

You should see the ECI host’s CNAME chain and then the host’s IPs — **not** Finalsite’s `ellesmerecom.finalsite.com`.

Browser check:

- `https://international.ellesmere.com` should load the ECI site (or the host’s temporary “domain configured / certificate provisioning” page while SSL finishes).
- `https://www.ellesmere.com` must still be the unchanged Finalsite site.

---

## 6. SSL / HTTPS

Ellesmere IT does **not** need to install a certificate in Finalsite or on school servers for this hostname.

- The **ECI hosting provider** issues and renews TLS for `international.ellesmere.com` (Let’s Encrypt / platform-managed cert).
- After DNS is correct, wait for the host’s domain status to show **Valid** / **HTTPS ready**.
- If the browser shows a certificate name mismatch, DNS is still pointing at the wrong place or the host has not finished attaching the domain — fix DNS/host attachment; do not buy a separate cert for Finalsite.

Optional: force HTTPS redirects are handled by the ECI host, not Finalsite.

---

## 7. Application-side tasks (ECI team — not Finalsite)

Ellesmere IT can treat this section as a checklist the ECI team must complete in parallel.

1. Add custom domain `international.ellesmere.com` in the hosting console.  
2. Set production environment variables (Supabase URL/anon key, optional LLM keys).  
3. In **Supabase Auth → URL configuration**, allow:
   - Site URL: `https://international.ellesmere.com`
   - Redirect URLs including:  
     `https://international.ellesmere.com/**`  
     `https://international.ellesmere.com/auth/callback`
4. Confirm portals (`/login`, `/investor`, `/agent`, `/school`, `/team`) work on the new host.  
5. Smoke-test public routes: `/`, `/schools`, `/investors`, `/agents`.

---

## 8. Optional Finalsite work (links only)

If Marketing/International want visitors on the main school site to find ECI:

1. In Finalsite Composer, edit the relevant nav item or International page.
2. Add a normal external link to `https://international.ellesmere.com` (open in same tab or new tab per school preference).
3. Do **not** create a Finalsite Domain / Host Name for `international.ellesmere.com`.
4. Do **not** ask Finalsite Support to “point the subdomain at a Composer page.”

Suggested link label examples: “Ellesmere College International”, “International”, or “Our international schools”.

---

## 9. Email and other services

| Item | Guidance |
| --- | --- |
| `international@ellesmere.com` | Already used by ECI content; mailbox is independent of this website DNS change. **Do not alter MX records** for this launch. |
| SPF / DKIM / DMARC | No change required solely for the website subdomain. |
| Microsoft 365 / Google Classroom TXT | Leave existing TXT verification records alone. |

Creating the website CNAME does not affect mail unless someone mistakenly edits MX or root records — avoid that.

---

## 10. Go-live checklist

**Ellesmere IT**

- [ ] Received CNAME target in writing from ECI team  
- [ ] Confirmed no conflicting `international` DNS record  
- [ ] Created CNAME `international` → ECI host target  
- [ ] Verified with `dig` that the name does **not** resolve to Finalsite  
- [ ] Confirmed `https://www.ellesmere.com` still loads Finalsite  
- [ ] (Optional) Added Finalsite nav/page link to the new URL  

**ECI team**

- [ ] Custom domain attached on host; SSL valid  
- [ ] Supabase auth URLs updated  
- [ ] Production env vars set; site builds and serves  
- [ ] Public + portal smoke tests passed  
- [ ] Stakeholders notified of the live URL  

---

## 11. Rollback

If the launch must be undone:

1. In GoDaddy DNS, **delete** (or disable) only the `international` CNAME.  
2. Leave all Finalsite / `www` / mail records untouched.  
3. Tell the ECI team so they can remove or pause the custom domain on the host.

No Finalsite “Domain is live” change is involved, because this hostname was never added to Composer.

---

## 12. Suggested message you can send Finalsite (only if needed)

Use only if a Finalsite engineer asks why `international` is not pointed at Finalsite:

> We are launching a separately hosted Ellesmere College International application at `international.ellesmere.com`. This hostname must remain a DNS CNAME to our external application host and must **not** be configured as a Finalsite Composer domain or Finalsite subdomain landing page. The primary site `www.ellesmere.com` stays on Finalsite unchanged. We may add a standard hyperlink from Composer to `https://international.ellesmere.com`.

---

## 13. Contacts / blanks for the school to fill

| Role | Name | Email |
| --- | --- | --- |
| Ellesmere IT / DNS owner | | |
| ECI project owner | | |
| Hosting platform & project URL | | |
| Agreed CNAME target | | |
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
| `international.ellesmere.com` | — | **Not configured** (ready to create) |

## Appendix B — Why this is separate from Finalsite

The ECI platform is a modern application (public marketing pages plus password-controlled investor, agent, school, and team portals). It depends on its own hosting runtime and Supabase backend. Finalsite remains the system of record for the UK main school website; ECI is an adjacent brand property on a school-owned subdomain.
