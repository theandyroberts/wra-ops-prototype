const jobs = [
  {
    id: 'radical-lexus',
    company: 'Radical',
    name: 'Lexus',
    status: 'Prep',
    group: 'Booked / Active',
    date: 'Jun 24',
    crew: 'Drew + Nate + Jake',
    drone: 'Inspire 3',
    location: 'Downtown LA',
    jobNo: '26099'
  },
  {
    id: 'hungry-amazon',
    company: 'Hungry Man',
    name: 'Amazon',
    status: 'Docs On Production Side',
    group: 'Booked / Active',
    date: 'Jun 27',
    crew: 'TBD',
    drone: 'Alta X',
    location: 'Granada Hills',
    jobNo: '26007'
  },
  {
    id: 'mjz-nike',
    company: 'MJZ',
    name: 'Nike',
    status: 'Bid Sent',
    group: 'Pending / Potential',
    date: 'Jul 08',
    crew: 'TBD',
    drone: 'Unknown',
    location: 'TBD',
    jobNo: '-'
  },
  {
    id: 'smuggler-apple',
    company: 'Smuggler',
    name: 'Apple',
    status: 'Job Inquiry / Hold',
    group: 'Pending / Potential',
    date: 'Jul 12',
    crew: 'TBD',
    drone: 'Inspire 3',
    location: 'Los Angeles',
    jobNo: '-'
  }
];

const screens = [...document.querySelectorAll('.screen')];
const navs = [...document.querySelectorAll('.nav')];
let activeJob = jobs[0];

function badge(status) {
  const cls = status.includes('Prep') || status.includes('Booked') ? 'ok' :
    status.includes('Docs') || status.includes('Bid') ? 'warn' : '';
  return `<span class="badge ${cls}">${status}</span>`;
}

function show(screen) {
  screens.forEach(s => s.classList.toggle('active', s.id === screen));
  navs.forEach(n => n.classList.toggle('active', n.dataset.screen === screen));
  window.scrollTo(0, 0);
}

function jobRows(group) {
  return jobs.filter(j => j.group === group).map(j => `
    <tr class="click-row" data-open-job="${j.id}">
      <td><strong>${j.date}</strong></td>
      <td>${j.company}</td>
      <td>${j.name}</td>
      <td>${badge(j.status)}</td>
      <td>${j.crew}</td>
      <td>${j.drone}</td>
      <td>${j.location}</td>
    </tr>
  `).join('');
}

function renderHome() {
  document.querySelector('#home').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Command Center</p>
        <h1>Home</h1>
        <p class="sub">Active work, upcoming jobs, and calendar changes needing review.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-screen-link="newJob">New Job</button>
        <button class="btn">Upload Document</button>
        <button class="btn" data-screen-link="calendar">Open Calendar</button>
      </div>
    </div>

    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Upcoming Booked Jobs</h2></div>
        <table class="table">
          <thead><tr><th>Date</th><th>Production</th><th>Job</th><th>Status</th><th>Crew</th><th>Drone</th><th>Location</th></tr></thead>
          <tbody>${jobRows('Booked / Active')}</tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Calendar Changes</h2></div>
        <div class="panel-body">
          <p><strong>Radical / Lexus - Shoot Day 1</strong></p>
          <p class="muted">Changed externally in Google Calendar. Review before updating job dates.</p>
          <button class="btn">Review Change</button>
        </div>
      </div>
      <div class="panel wide">
        <div class="panel-head"><h2>Pending / Potential</h2></div>
        <table class="table">
          <thead><tr><th>Date</th><th>Production</th><th>Job</th><th>Status</th><th>Crew</th><th>Drone</th><th>Location</th></tr></thead>
          <tbody>${jobRows('Pending / Potential')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderJobs() {
  document.querySelector('#jobs').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Date-sorted worklist</p>
        <h1>Jobs</h1>
        <p class="sub">Grouped by booked/active and pending/potential, then sorted by next date.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-screen-link="newJob">New Job</button>
        <button class="btn">Pipeline View</button>
        <button class="btn">Archive</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Booked / Active</h2></div>
      <table class="table">
        <thead><tr><th>Date</th><th>Production Co.</th><th>Job Name</th><th>Status</th><th>Crew</th><th>Drone</th><th>Location</th></tr></thead>
        <tbody>${jobRows('Booked / Active')}</tbody>
      </table>
    </div>
    <br>
    <div class="panel">
      <div class="panel-head"><h2>Pending / Potential</h2></div>
      <table class="table">
        <thead><tr><th>Date</th><th>Production Co.</th><th>Job Name</th><th>Status</th><th>Crew</th><th>Drone</th><th>Location</th></tr></thead>
        <tbody>${jobRows('Pending / Potential')}</tbody>
      </table>
    </div>
  `;
}

function renderNewJob() {
  document.querySelector('#newJob').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Quick Create</p>
        <h1>New Job Inquiry</h1>
        <p class="sub">Create the useful shell now. Assign job number later when money is involved.</p>
      </div>
      <button class="btn" data-screen-link="jobs">Back to Jobs</button>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="form-grid">
          <div class="field"><label>Production Company</label><div class="input">Radical</div></div>
          <div class="field"><label>Job Name / Title</label><div class="input">Lexus</div></div>
          <div class="field"><label>Primary Contact</label><div class="input">Taylor Steadman / Production Supervisor</div></div>
          <div class="field"><label>Status</label><div class="input">Job Inquiry / Hold</div></div>
          <div class="field"><label>Drone Type</label><div class="input">Unknown / Inspire 3 / Alta X / FPV</div></div>
          <div class="field"><label>Payment Default</label><div class="input">Unknown / Production TC / WRA Payroll</div></div>
          <div class="field wide"><label>Date Blocks</label><div class="input">Scout: + Add date &nbsp;&nbsp; Shoot: + Add date/range &nbsp;&nbsp; Travel: + Add date</div></div>
          <div class="field wide"><label>Notes from inquiry</label><div class="input">Paste email/request details here...</div></div>
        </div>
        <br>
        <button class="btn primary" data-open-job="radical-lexus">Create Job Shell</button>
      </div>
    </div>
  `;
}

function renderJob() {
  const j = activeJob;
  document.querySelector('#job').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Job Workspace</p>
        <h1>${j.company} / ${j.name}</h1>
        <p class="sub">Status: ${j.status} · Job #: ${j.jobNo} · Drone: ${j.drone}</p>
      </div>
      <div class="actions">
        <button class="btn">Generate Job Notes</button>
        <button class="btn">Upload Paperwork</button>
        <button class="btn dark">Export Packet</button>
      </div>
    </div>

    <div class="tabs">
      ${['Overview','Dates','Crew','Locations','POA','Paperwork','Notes','Billing','Archive'].map((t, i) => `
        <button class="tab ${i === 0 ? 'active' : ''}" data-job-tab="${t.toLowerCase()}">${t}</button>
      `).join('')}
    </div>

    <div id="tab-overview" class="job-tab active">${jobOverview(j)}</div>
    <div id="tab-dates" class="job-tab">${datesTab()}</div>
    <div id="tab-crew" class="job-tab">${crewTab()}</div>
    <div id="tab-locations" class="job-tab">${locationsTab()}</div>
    <div id="tab-poa" class="job-tab">${poaTab()}</div>
    <div id="tab-paperwork" class="job-tab">${paperworkTab()}</div>
    <div id="tab-notes" class="job-tab">${notesTab()}</div>
    <div id="tab-billing" class="job-tab">${billingTab()}</div>
    <div id="tab-archive" class="job-tab">${archiveTab()}</div>
  `;
}

function jobOverview(j) {
  return `
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Core Info</h2></div>
        <div class="panel-body">
          <p><strong>Production:</strong> ${j.company}</p>
          <p><strong>Job:</strong> ${j.name}</p>
          <p><strong>Status:</strong> ${j.status}</p>
          <p><strong>Estimate:</strong> QB-1234 / $12,500</p>
          <p><strong>PO:</strong> Pending</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Actions</h2></div>
        <div class="panel-body actions">
          <button class="btn">Assign Job Number</button>
          <button class="btn">Generate Job Notes</button>
          <button class="btn">Create POA</button>
          <button class="btn">Generate Pilot Email</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Dates</h2></div>
        <div class="panel-body">
          <p>Scout: Jun 18</p><p>Prep: Jun 22</p><p>Shoot: Jun 24, Jun 26, Jun 27</p><p>Travel: Jun 23, Jun 28</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Locations / Airspace</h2></div>
        <div class="panel-body">
          <p>Downtown Rooftop · <span class="badge warn">Needs LAANC</span> · POA Draft</p>
          <p>Pasadena Bridge · <span class="badge ok">Clear</span> · POA Not Started</p>
        </div>
      </div>
    </div>
  `;
}

function datesTab() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Date Blocks</h2><button class="btn">+ Add Date</button></div>
      <table class="table">
        <thead><tr><th>Type</th><th>Date / Range</th><th>Time</th><th>Calendar Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>Scout</td><td>Jun 18</td><td>TBD</td><td>${badge('Synced')}</td><td><button class="btn">Edit</button></td></tr>
          <tr><td>Prep</td><td>Jun 22</td><td>TBD</td><td>${badge('Synced')}</td><td><button class="btn">Edit</button></td></tr>
          <tr><td>Shoot</td><td>Jun 24</td><td>TBD</td><td>${badge('Calendar changed')}</td><td><button class="btn">Review</button></td></tr>
          <tr><td>Shoot</td><td>Jun 26, Jun 27</td><td>TBD</td><td>${badge('Synced')}</td><td><button class="btn">Edit</button></td></tr>
          <tr><td>Travel</td><td>Jun 23, Jun 28</td><td>TBD</td><td>${badge('Synced')}</td><td><button class="btn">Edit</button></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function crewTab() {
  return `
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Crew</h2><button class="btn">Generate Availability Message</button></div>
        <table class="table">
          <thead><tr><th>Role</th><th>Person</th><th>Notes</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>Pilot</td><td>Drew Roberts</td><td>Potential</td><td><button class="btn">Change</button></td></tr>
            <tr><td>Camera Operator</td><td>Jake Capistron</td><td>Holding</td><td><button class="btn">Change</button></td></tr>
            <tr><td>1st AC / Drone Tech</td><td>Nate Labruzza</td><td>Holding</td><td><button class="btn">Change</button></td></tr>
            <tr><td>VO</td><td>TBD</td><td>Needed?</td><td><button class="btn">Assign</button></td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Paperwork Coverage</h2></div>
        <div class="panel-body">
          <p><strong>Pilots listed:</strong> Drew Roberts, Colin Burgess, Tony Thompson</p>
          <p><strong>Aircraft listed:</strong> Inspire 3 x3</p>
          <button class="btn">Add Pilot For Paperwork</button>
          <button class="btn">Add Aircraft For Paperwork</button>
        </div>
      </div>
      <div class="panel wide">
        <div class="panel-head"><h2>Deal Memo Setup</h2><button class="btn primary">Generate Draft Memos</button></div>
        <table class="table">
          <thead><tr><th>Crew</th><th>Role</th><th>Rate</th><th>Scout</th><th>Prep</th><th>Shoot</th><th>Travel</th><th>Idle</th></tr></thead>
          <tbody>
            <tr><td>Drew</td><td>Pilot</td><td>$1,697.08</td><td>8hr</td><td>8hr</td><td>10hr</td><td>Half</td><td>-</td></tr>
            <tr><td>Nate</td><td>1st AC</td><td>$751.63</td><td>8hr</td><td>8hr</td><td>10hr</td><td>Half</td><td>-</td></tr>
            <tr><td>Jake</td><td>Camera Op</td><td>$1,038.95</td><td>8hr</td><td>8hr</td><td>10hr</td><td>Half</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function locationsTab() {
  return `
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Locations</h2><button class="btn">Add Location</button></div>
        <table class="table">
          <thead><tr><th>Location</th><th>Airspace</th><th>POA</th><th>Docs</th></tr></thead>
          <tbody>
            <tr><td>Downtown Rooftop</td><td>${badge('Needs LAANC')}</td><td>Draft</td><td>Pending</td></tr>
            <tr><td>Pasadena Bridge</td><td>${badge('Clear')}</td><td>None</td><td>Pending</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Downtown Rooftop</h2></div>
        <div class="panel-body">
          <p><strong>Address:</strong> 123 Main St, Los Angeles, CA</p>
          <p><strong>GPS:</strong> 34.0522, -118.2437</p>
          <p><strong>Airspace:</strong> Class B · UASFM 100 ft · No TFR detected</p>
          <div class="map">Saved Google Maps view</div>
          <br>
          <button class="btn primary" data-job-tab-link="poa">Create POA</button>
        </div>
      </div>
      <div class="panel wide">
        <div class="panel-head"><h2>Location Airspace / Pilot Email</h2><button class="btn primary">Copy Pilot Email</button></div>
        <div class="panel-body">
          <div class="grid two">
            <div>
              <p><strong>UASFM max altitude:</strong> 100 ft</p>
              <p><strong>Airspace context:</strong> Class B</p>
              <p><strong>TFR status:</strong> none detected</p>
              <p><strong>Authorization:</strong> LAANC likely needed</p>
              <p><strong>Requested altitude:</strong> 100 ft</p>
            </div>
            <div>
              <p><strong>To:</strong> Drew Roberts</p>
              <p><strong>Subject:</strong> LAANC details - Radical / Lexus - Downtown Rooftop</p>
              <div class="input" style="min-height: 110px;">Generated email with job, location, GPS, date blocks, requested altitude, UASFM result, TFR status, pilot/aircraft list, and producer contact.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function poaTab() {
  return `
    <div class="poa-layout">
      <div class="panel">
        <div class="panel-head"><h2>POA Text Details</h2></div>
        <div class="panel-body">
          <div class="field"><label>Pilots</label><div class="input">Drew Roberts, Colin Burgess</div></div><br>
          <div class="field"><label>Activity</label><div class="input">Filming actors and scenery on a closed set.</div></div><br>
          <div class="field"><label>Local Times</label><div class="input">Jun 24 0600-1800</div></div><br>
          <div class="field"><label>Registered Aircraft</label><div class="input">Inspire 3 x3</div></div><br>
          <div class="field"><label>Security</label><div class="input">Secure takeoff/landing zone. 30 ft perimeter.</div></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Map Annotation</h2><div class="actions"><button class="btn primary">Preview POA</button><button class="btn">Export PDF</button></div></div>
        <div class="panel-body">
          <div class="map">Annotated map canvas</div>
          <div class="tool-row">
            ${['Text','Circle','Polygon','Path','Arrow','Launch','Spotter','Restricted','Auto Legend'].map(t => `<button class="btn">${t}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function paperworkTab() {
  return `
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Paperwork By Type</h2><button class="btn">Upload Document</button></div>
        <table class="table">
          <thead><tr><th>Type</th><th>Document</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Insurance</td><td>AON Questionnaire</td><td>${badge('Needs Review')}</td></tr>
            <tr><td>Location / Permit</td><td>Pasadena Questionnaire</td><td>${badge('Mapped')}</td></tr>
            <tr><td>Contract / Agreement</td><td>WRA Service Agreement</td><td>${badge('Ready')}</td></tr>
            <tr><td>Crew / Deal Memos</td><td>Drew Deal Memo</td><td>${badge('Draft')}</td></tr>
            <tr><td>Supporting Docs</td><td>Pilot Certs / UAS Registrations</td><td>${badge('Attached')}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Mapping / Q&A Memory</h2></div>
        <div class="panel-body">
          <p><strong>Template match:</strong> AON Questionnaire v2 · 82% confidence</p>
          <p><strong>Suggested answer:</strong> Purpose of UAS use → Aerial photography</p>
          <p><strong>Source:</strong> Insurance Q&A memory</p>
          <div class="input">Save corrected answer for future Insurance forms · Scope: Document Type</div>
          <br>
          <button class="btn primary">Review Mapping</button>
          <button class="btn">Generate Draft</button>
        </div>
      </div>
    </div>
  `;
}

function notesTab() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Notes / Communication</h2><div class="actions"><button class="btn primary">Generate Job Notes</button><button class="btn">Copy Notes</button></div></div>
      <div class="panel-body">
        <p><strong>Apple Notes remains destination for MVP.</strong></p>
        <div class="input" style="min-height: 160px;">Generated structured job notes preview...</div>
        <br>
        <div class="field"><label>WhatsApp Group Link</label><div class="input">Paste link here...</div></div>
      </div>
    </div>
  `;
}

function billingTab() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Billing / Wrap</h2></div>
      <div class="panel-body form-grid">
        <div class="field"><label>Estimate #</label><div class="input">QB-1234</div></div>
        <div class="field"><label>Amount</label><div class="input">$12,500</div></div>
        <div class="field"><label>Bid Sent</label><div class="input">Jun 10</div></div>
        <div class="field"><label>Approved</label><div class="input">Jun 12</div></div>
        <div class="field"><label>PO / Client Job #</label><div class="input">Pending</div></div>
        <div class="field"><label>Advance Billing</label><div class="input">Not sent</div></div>
      </div>
    </div>
  `;
}

function archiveTab() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Archive / Dropbox Export</h2><button class="btn primary">Export to Dropbox</button></div>
      <div class="panel-body">
        <p>Export includes final/approved production files only. Originals, drafts, mappings, and audit trail remain in app.</p>
        <pre class="input" style="white-space: pre-wrap;">/26099 Radical Lexus/
  /Insurance/
  /Location Docs/
  /POA/
  /Crew Info/
  /Billing/
  /Supporting Drone Pilot Docs/</pre>
      </div>
    </div>
  `;
}

function renderCalendar() {
  const days = ['Mon Jun 22', 'Tue Jun 23', 'Wed Jun 24', 'Thu Jun 25', 'Fri Jun 26', 'Sat Jun 27'];
  const events = {
    0: [['PREP', 'Radical / Lexus - Prep']],
    1: [['TRAVEL', 'Radical / Lexus - Travel']],
    2: [['SHOOT', 'Radical / Lexus - Shoot Day 1'], ['HOLD', 'MJZ / Nike - Hold']],
    4: [['SHOOT', 'Radical / Lexus - Shoot Day 2']],
    5: [['SHOOT', 'Radical / Lexus - Shoot Day 3']]
  };
  document.querySelector('#calendar').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Week default</p>
        <h1>Calendar</h1>
        <p class="sub">One event per date block. External edits require review.</p>
      </div>
      <div class="actions"><button class="btn primary">Week</button><button class="btn">Month</button><button class="btn">Agenda</button></div>
    </div>
    <div class="calendar-grid">
      ${days.map((d, i) => `
        <div class="day">
          <div class="day-head">${d}</div>
          ${(events[i] || []).map(e => `<div class="event"><span class="badge">${e[0]}</span><br><strong>${e[1]}</strong><br><span class="muted">Drew / Inspire 3</span></div>`).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderResources() {
  document.querySelector('#resources').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Warn-only conflicts</p>
        <h1>Resources</h1>
        <p class="sub">Crew, drones, vehicles, assigned jobs, and overlaps.</p>
      </div>
      <div class="actions"><button class="btn primary">All</button><button class="btn">Crew</button><button class="btn">Drones</button><button class="btn">Vehicles</button></div>
    </div>
    <div class="panel">
      <table class="table">
        <thead><tr><th>Resource</th><th>Jun 22</th><th>Jun 23</th><th>Jun 24</th><th>Jun 25</th><th>Jun 26</th></tr></thead>
        <tbody>
          <tr><td>Drew Roberts</td><td>Prep</td><td>Travel</td><td>Shoot</td><td>-</td><td>Shoot</td></tr>
          <tr><td>Colin Burgess</td><td>-</td><td>-</td><td>Hold</td><td>-</td><td>Hold</td></tr>
          <tr><td>Inspire 3 A</td><td>Prep</td><td>Travel</td><td><span class="badge warn">Conflict</span></td><td>-</td><td>Shoot</td></tr>
          <tr><td>Van 1</td><td>Prep</td><td>Travel</td><td>Shoot</td><td>-</td><td>Shoot</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderSimple(id, title) {
  document.querySelector(`#${id}`).innerHTML = `
    <div class="page-head"><div><p class="eyebrow">Prototype placeholder</p><h1>${title}</h1><p class="sub">Reusable database/settings area. Detailed design comes after workflow validation.</p></div></div>
    <div class="panel"><div class="panel-body">Crew, aircraft, clients, templates, insurance answers, and user/admin settings live here.</div></div>
  `;
}

function bind() {
  document.body.addEventListener('click', e => {
    const screenLink = e.target.closest('[data-screen-link]');
    if (screenLink) show(screenLink.dataset.screenLink);

    const nav = e.target.closest('.nav');
    if (nav) show(nav.dataset.screen);

    const openJob = e.target.closest('[data-open-job]');
    if (openJob) {
      activeJob = jobs.find(j => j.id === openJob.dataset.openJob) || jobs[0];
      renderJob();
      show('job');
    }

    const tab = e.target.closest('[data-job-tab]');
    if (tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.job-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`#tab-${tab.dataset.jobTab}`)?.classList.add('active');
    }

    const tabLink = e.target.closest('[data-job-tab-link]');
    if (tabLink) {
      const name = tabLink.dataset.jobTabLink;
      document.querySelector(`[data-job-tab="${name}"]`)?.click();
    }
  });
}

renderHome();
renderJobs();
renderNewJob();
renderJob();
renderCalendar();
renderResources();
renderSimple('libraries', 'Libraries');
renderSimple('settings', 'Settings');
bind();
