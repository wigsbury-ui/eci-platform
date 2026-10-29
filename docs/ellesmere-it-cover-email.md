# Cover email — send to Ellesmere IT with the launch guide

**Subject:** Action required: DNS for `international.ellesmere.com` (Vercel — not Finalsite)

---

Hello,

We are ready to launch the Ellesmere College International (ECI) website on a school subdomain:

**`https://international.ellesmere.com`**

The app already runs on **Vercel** (temporary URL: `https://eci-platform-seven.vercel.app`). It is **not** built in Finalsite and must **not** be pointed at `ellesmerecom.finalsite.com` or configured as a Finalsite Composer domain. Please **do not** change nameservers for `ellesmere.com`.

### What we need from IT

1. Create a **CNAME** record (exact value from our Vercel Domains panel):
   - **Host:** `international`
   - **Points to:** *[paste the CNAME shown in Vercel → Project → Settings → Domains for international.ellesmere.com]*
2. If Vercel also shows a verification record, add:
   - **TXT** host `_vercel` with the value Vercel displays
3. Leave `www.ellesmere.com`, apex A records, MX, nameservers, and existing TXT records **unchanged** (aside from the new `_vercel` TXT if required).
4. Optionally add a normal hyperlink from the main Finalsite site to `https://international.ellesmere.com` (nav/International page only — no Finalsite domain setup).

Full step-by-step instructions, checks, and rollback are in the attached guide:

**`Ellesmere-IT-international-ellesmere-com-launch-guide`**

Please reply with confirmation once the CNAME is live, and with the name of the person who owns DNS for `ellesmere.com` going forward.

Thank you,  
*[Name / ECI project owner]*  
*[Email / phone]*
