# Enquiry form → Google Sheet (Apps Script) — 10-minute setup

The enquiry form appears on every page (Home, Contact, Collections, Gallery, About) and currently POSTs to a placeholder called `GAS_ENDPOINT_URL` in `js/enquiry-form.js`. Follow the six steps below to deploy the receiving script and wire in the real URL. Every enquiry then lands in your Google Sheet **and** pings your email.

---

## Step 1 — Prepare your existing Sheet

Your leads sheet is already created:
- **Sheet:** [Jay Durga Website Leads](https://docs.google.com/spreadsheets/d/1rSFf5tbfMOjMi3LEEdCh4fQQEBk_w90e4QMMsjI6oO0/edit?usp=sharing)
- **Tab name:** `Website Leads`

1. Open the sheet and make sure the tab is named exactly **Website Leads**.
2. In row 1 of that tab, paste these headers exactly, left-to-right, one per column:

   ```
   Timestamp | Name | Phone | Interest | Area | Notes | Source | Page URL
   ```

3. Freeze row 1: *View → Freeze → 1 row*.

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
const SHEET_NAME       = 'Website Leads';
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

Open `js/enquiry-form.js` in your editor and find the line near the top:

```js
var GAS_ENDPOINT_URL = 'GAS_ENDPOINT_URL';
```

Replace the second `'GAS_ENDPOINT_URL'` with the URL you copied. Save.

That's it — the form is live on every page that includes `<div data-enquiry-form></div>`.

---

## Step 6 — Test end-to-end

1. Open any page in your browser (e.g. the Contact page).
2. Scroll to the **Enquire** section, fill in a real (fake-name) test lead, submit.
3. Confirm three things:
   - The form shows the green **"Thanks — we'll reply within the same working day"** message.
   - A new row appears in the **Website Leads** tab of the Sheet.
   - An email lands in the `NOTIFY_EMAIL` inbox.
4. Delete the test row from the Sheet.

---

## Ongoing — updating the script later

If you change the script (add a field, change the email address, etc.), you must **re-deploy**:

- *Deploy → Manage deployments → pencil icon next to the active deploy → Version: New version → Deploy.*
- The URL **stays the same**, so nothing needs to change on the website.

If you accidentally create a fresh deployment instead (new URL), paste the new URL into `js/enquiry-form.js` again.

---

## Failure modes to be aware of

| What happens | Why | Fix |
|---|---|---|
| Form shows "Something went wrong" | URL is wrong, or deployment is set to "Only me" | Re-check Step 4 point 3 — access must be **Anyone** |
| Sheet gets rows but no email | `NOTIFY_EMAIL` still says `CHANGE_ME@example.com`, or Gmail daily quota exceeded (100/day free) | Edit the constant, re-deploy |
| Duplicate rows for one submit | Someone double-clicked Send | The submit button auto-disables during send — a legitimate duplicate is extremely rare |
| Spam / bot submissions | Any public form attracts some | The honeypot field silently discards obvious bots; if volume grows, add reCAPTCHA later |

---

## Final Google Sheet headers

After Step 1, row 1 of the **Website Leads** tab should look exactly like this (left-to-right):

```
Timestamp | Name | Phone | Interest | Area | Notes | Source | Page URL
```

Every form submit writes one row with:
- **Timestamp** — ISO date/time the form was submitted
- **Name** — the visitor's name
- **Phone** — the visitor's phone number
- **Interest** — the selected interest (Curtains, Mattresses, etc.)
- **Area** — the visitor's area/locality
- **Notes** — any additional message
- **Source** — which page the enquiry came from (e.g. `contact`, `collections`, `homepage-modern`)
- **Page URL** — the full browser URL at the time of submission
