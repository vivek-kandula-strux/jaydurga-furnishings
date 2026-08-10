# Enquiry form → Google Sheet (Apps Script) — 10-minute setup

The homepage enquiry form currently POSTs to a placeholder called `GAS_ENDPOINT_URL`. Follow the six steps below to deploy the receiving script and wire in the real URL. Every enquiry then lands in your Google Sheet **and** pings your email.

---

## Step 1 — Create the Sheet

1. Go to <https://sheets.new> (signed into the account that should own the leads).
2. Rename the file to **Jay Durga · Enquiries**.
3. Rename the first tab (`Sheet1`) to **Leads**.
4. In row 1, paste these headers exactly, left-to-right, one per column:

   ```
   Timestamp | Name | Phone | Interest | Area | Notes | Source | Page URL
   ```

5. Freeze row 1: *View → Freeze → 1 row*.

---

## Step 2 — Open the Apps Script editor

Inside the same sheet: *Extensions → Apps Script*. Delete anything already in the editor (usually a blank `function myFunction()`).

---

## Step 3 — Paste this script

Copy the whole block below into the editor and save (`Ctrl+S`). Give the project a name when prompted — e.g. `Jay Durga Enquiries`.

```javascript
// ─── Jay Durga Furnishings · enquiry endpoint ─────────────────
// Receives POSTs from the homepage form, appends to the Leads
// sheet, and emails a notification.

// The two constants below are the only things you may need to edit.
const SHEET_NAME       = 'Leads';
const NOTIFY_EMAIL     = 'CHANGE_ME@example.com';   // where new leads should be emailed
const NOTIFY_FROM_NAME = 'Jay Durga · Website';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const p = e.parameter || {};

    // Honeypot — silently accept, do not record
    if (p._gotcha) {
      return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    }

    const row = [
      p.submittedAt || new Date().toISOString(),
      p.name        || '',
      p.phone       || '',
      p.interest    || '',
      p.area        || '',
      p.notes       || '',
      p.source      || '',
      p.pageUrl     || ''
    ];

    sheet.appendRow(row);

    // Notification email
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf('CHANGE_ME') === -1) {
      const subject = 'New enquiry · ' + (p.interest || 'Website') + ' · ' + (p.name || 'Unnamed');
      const body =
        'New enquiry from the Jay Durga website:\n\n' +
        'Name:     ' + (p.name || '') + '\n' +
        'Phone:    ' + (p.phone || '') + '\n' +
        'Interest: ' + (p.interest || '') + '\n' +
        'Area:     ' + (p.area || '') + '\n' +
        'Notes:    ' + (p.notes || '') + '\n\n' +
        'Source:   ' + (p.source || '') + '\n' +
        'Page:     ' + (p.pageUrl || '') + '\n' +
        'When:     ' + (p.submittedAt || '') + '\n';

      MailApp.sendEmail({
        to:      NOTIFY_EMAIL,
        subject: subject,
        body:    body,
        name:    NOTIFY_FROM_NAME
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Jay Durga enquiries endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

Edit `NOTIFY_EMAIL` at the top to the address that should receive new-lead emails (e.g. `enquiries@jaydurga.in`). Save again.

---

## Step 4 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear ⚙️ next to *Select type* → choose **Web app**.
3. Fill in:
   - **Description:** `Jay Durga enquiries v1`
   - **Execute as:** *Me (your@gmail.com)*
   - **Who has access:** **Anyone** *(this is required — the form is on a public site; the script only accepts the fields it expects)*
4. Click **Deploy**.
5. On the first deploy Google will ask for permissions — click **Authorize access**, pick the same account, then **Advanced → Go to Jay Durga Enquiries (unsafe) → Allow**. (It says "unsafe" because you wrote the script yourself; it is your script.)
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

---

## Step 5 — Paste the URL into the site

Open `index.html` in your editor and find the line (near the bottom, inside `<script>`):

```js
var GAS_ENDPOINT_URL = 'GAS_ENDPOINT_URL';
```

Replace the second `'GAS_ENDPOINT_URL'` with the URL you copied. Save.

That's it — the form is live.

---

## Step 6 — Test end-to-end

1. Open the homepage in your browser.
2. Scroll to the **Enquire** section, fill in a real (fake-name) test lead, submit.
3. Confirm three things:
   - The form shows the green **"Thanks — we'll reply within the same working day"** message.
   - A new row appears in the **Leads** tab of the Sheet.
   - An email lands in the `NOTIFY_EMAIL` inbox.
4. Delete the test row from the Sheet.

---

## Ongoing — updating the script later

If you change the script (add a field, change the email address, etc.), you must **re-deploy**:

- *Deploy → Manage deployments → pencil icon next to the active deploy → Version: New version → Deploy.*
- The URL **stays the same**, so nothing needs to change on the website.

If you accidentally create a fresh deployment instead (new URL), paste the new URL into `index.html` again.

---

## Failure modes to be aware of

| What happens | Why | Fix |
|---|---|---|
| Form shows "Something went wrong" | URL is wrong, or deployment is set to "Only me" | Re-check Step 4 point 3 — access must be **Anyone** |
| Sheet gets rows but no email | `NOTIFY_EMAIL` still says `CHANGE_ME@example.com`, or Gmail daily quota exceeded (100/day free) | Edit the constant, re-deploy |
| Duplicate rows for one submit | Someone double-clicked Send | The submit button auto-disables during send — a legitimate duplicate is extremely rare |
| Spam / bot submissions | Any public form attracts some | The honeypot field silently discards obvious bots; if volume grows, add reCAPTCHA later |

---

Once this endpoint is live and tested, we'll wire the same form to the Contact page during the next pass. The Sheet becomes your single lead inbox for the site.
