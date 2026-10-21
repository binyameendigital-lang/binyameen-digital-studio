BINYAMEEN DIGITAL STUDIO — WEBSITE + PRIVATE FEEDBACK ADMIN

WHAT IS INCLUDED
- Responsive portfolio website (index.html)
- Three actual supplied book mockups retained: The Jesus Girl, Good but Not Good for You, Life on Campus. Dating on Campus removed as requested.
- Three generated visual website/landing-page concept images plus CSS-built book, workbook, guide, cookbook and children’s-book sample mockups.
- Private feedback submission API, moderation dashboard (admin.html), persistent Netlify Blobs storage, and public display of approved feedback only.
- Optional email and WhatsApp notifications when provider credentials are configured.

IMPORTANT HONESTY NOTE
Portfolio pieces marked as concepts/samples are illustrative concepts, not completed client projects. Replace them with real projects as you create them. Only publish genuine feedback and respect each person's quote-permission choice. The earlier test submission should not be shown as a real client review.

DEPLOYMENT REQUIREMENT — READ BEFORE UPLOADING
This ZIP is prepared for a Git-connected Netlify deployment because it uses Netlify Functions and Netlify Blobs. Simply dragging the ZIP into Netlify Drop will NOT activate the approval dashboard, dynamic publishing, or notifications.

ONE-TIME SETUP
1. Extract this ZIP on your computer. Keep index.html, admin.html, package.json, netlify.toml, and the netlify/ and assets/ folders together at the project root.
2. Put the project in a private or public GitHub repository (GitHub account required), then in Netlify choose Add new site > Import an existing project and connect that repository. Netlify will install package dependencies and deploy the functions.
3. In Netlify site settings, add environment variable ADMIN_PASSWORD with a strong unique password of at least 12 characters. Do not put this password in website files or share it. Redeploy after adding variables.
4. Open https://YOUR-SITE.netlify.app/admin.html and sign in with that password. Incoming submissions remain private/pending until you approve or reject them.
5. Netlify Blobs stores feedback persistently; approving a review with public quote permission makes it appear on the public website automatically. Rejecting/deleting takes effect without re-uploading website files.

EMAIL NOTIFICATIONS (OPTIONAL)
- Create a Resend account/API key, verify an allowed sender domain/address, and add Netlify environment variables RESEND_API_KEY, NOTIFICATION_EMAIL (binyameendigital@gmail.com), RESEND_FROM_EMAIL (a sender verified in Resend), and SITE_URL (your live Netlify URL).
- Redeploy after setting variables. Email provider limits and sender verification apply. Without these variables, feedback is stored but no email alert is sent.

WHATSAPP NOTIFICATIONS (OPTIONAL; REQUIRES PROVIDER SETUP)
- Twilio WhatsApp credentials are required. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (approved Twilio WhatsApp sender, e.g. whatsapp:+14155238886 only if enabled for your account), and TWILIO_WHATSAPP_TO (your number in whatsapp:+countrycode format).
- WhatsApp Business/provider policies, sender approval, opt-in, and any charges apply. Without these variables, no WhatsApp alert is sent. Email notifications are simpler to start with.

SECURITY NOTES
- Use a strong unique ADMIN_PASSWORD. Do not share admin.html password.
- Public site API returns only approved feedback for which the author gave quote permission. All new feedback is private and pending.
- Netlify Functions/Blobs require a Netlify deployment, not plain static ZIP hosting.
- Test submission, approval, rejection, notifications and persistence on the live deployment before launch.

CONTACTS ALREADY IN SITE
Email: binyameendigital@gmail.com
WhatsApp: https://wa.me/923052648919
Fiverr: https://www.fiverr.com/muhanmadyameen0
