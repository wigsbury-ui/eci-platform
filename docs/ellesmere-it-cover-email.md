# Cover email — send to Ellesmere IT with the launch guide

**Subject:** Action required: DNS for `international.ellesmere.com` (ECI site — not Finalsite)

---

Hello,

We are ready to launch the Ellesmere College International (ECI) website on a school subdomain:

**`https://international.ellesmere.com`**

This is a **separately hosted** application. It is **not** built in Finalsite and must **not** be pointed at `ellesmerecom.finalsite.com` or configured as a Finalsite Composer domain.

### What we need from IT

1. Create a **CNAME** record:
   - **Host:** `international`
   - **Points to:** *[ECI team to paste hosting CNAME target here before sending]*
2. Leave `www.ellesmere.com`, apex, MX, and existing TXT records **unchanged**.
3. Optionally add a normal hyperlink from the main Finalsite site to `https://international.ellesmere.com` (nav/International page only — no Finalsite domain setup).

Full step-by-step instructions, checks, and rollback are in the attached guide:

**`ellesmere-it-subdomain-launch-guide.md`**

Please reply with confirmation once the CNAME is live, and with the name of the person who owns DNS for `ellesmere.com` going forward.

Thank you,  
*[Name / ECI project owner]*  
*[Email / phone]*
