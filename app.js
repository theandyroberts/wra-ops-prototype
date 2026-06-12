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
const pageParams = new URLSearchParams(window.location.search);
let activeJob = jobs[0];
let activeLocationId = 'downtown-rooftop';
let locationMode = 'overview';
let activeLocationSection = 'overview';
let resourceView = 'calendar';
let resourceGroup = 'resource';

const jobLocations = [
  {
    id: 'downtown-rooftop',
    name: 'Downtown Rooftop',
    address: '123 Main St, Los Angeles, CA',
    gps: '34.0522, -118.2437',
    airspace: 'Needs LAANC',
    poa: 'POA Draft',
    docs: 'Docs Pending',
    uasfm: '100 ft',
    context: 'Class B',
    tfr: 'None detected',
    authorization: 'LAANC likely needed',
    requestedAltitude: '100 ft',
    mapLabel: 'Saved Google Maps rooftop view'
  },
  {
    id: 'pasadena-bridge',
    name: 'Pasadena Bridge',
    address: 'Pasadena, CA',
    gps: '34.1478, -118.1445',
    airspace: 'Clear',
    poa: 'No POA',
    docs: 'Docs Pending',
    uasfm: '400 ft',
    context: 'Uncontrolled / review final coordinates',
    tfr: 'None detected',
    authorization: 'No LAANC expected',
    requestedAltitude: '200 ft',
    mapLabel: 'Saved Google Maps bridge view'
  },
  {
    id: 'granada-hills-road',
    name: 'Granada Hills Road',
    address: 'Sesnon Blvd, Granada Hills, CA',
    gps: '34.3064, -118.5231',
    airspace: 'Needs Review',
    poa: 'POA Needed',
    docs: 'Docs Pending',
    uasfm: 'Check needed',
    context: 'Near hills / verify restrictions',
    tfr: 'Check before shoot',
    authorization: 'Review before pilot email',
    requestedAltitude: 'TBD',
    mapLabel: 'Saved Google Maps road view'
  }
];

function currentLocation() {
  return jobLocations.find(l => l.id === activeLocationId) || jobLocations[0];
}

function locationIndex() {
  return jobLocations.findIndex(l => l.id === activeLocationId);
}

function cycleLocation(direction) {
  const currentIndex = locationIndex();
  const nextIndex = (currentIndex + direction + jobLocations.length) % jobLocations.length;
  activeLocationId = jobLocations[nextIndex].id;
  activeLocationSection = 'overview';
}

function badge(status) {
  const cls = status.includes('Prep') || status.includes('Booked') ? 'ok' :
    status.includes('Docs') || status.includes('Bid') ? 'warn' : '';
  return `<span class="badge ${cls}">${status}</span>`;
}

function initials(name) {
  return name.split(/\s|\+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

function jobIcon(job) {
  return `<span class="job-icon">${initials(`${job.company} ${job.name}`)}</span>`;
}

function crewCell(crew) {
  if (crew === 'TBD') return '<span class="muted">TBD</span>';
  const names = crew.split('+').map(name => name.trim()).filter(Boolean);
  return `
    <div class="crew-cell">
      <div class="avatar-stack">${names.map(name => `<span class="avatar">${initials(name)}</span>`).join('')}</div>
      <span>${crew}</span>
    </div>
  `;
}

function show(screen) {
  screens.forEach(s => s.classList.toggle('active', s.id === screen));
  navs.forEach(n => n.classList.toggle('active', n.dataset.screen === screen));
  window.scrollTo(0, 0);
}

function syncThemeButton() {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) themeToggle.textContent = document.body.dataset.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function jobRows(group) {
  return jobs.filter(j => j.group === group).map(j => `
    <tr class="click-row" data-open-job="${j.id}">
      <td><strong>${j.date}</strong></td>
      <td>${j.company}</td>
      <td><div class="job-cell">${jobIcon(j)}<div><strong>${j.name}</strong><small>${j.company} / ${j.jobNo}</small></div></div></td>
      <td>${badge(j.status)}</td>
      <td>${crewCell(j.crew)}</td>
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
        <p class="sub">Active work, upcoming jobs, and the details producers need first.</p>
      </div>
      <div class="actions">
        <button class="btn primary" data-screen-link="newJob">New Job</button>
        <button class="btn">Upload Document</button>
        <button class="btn" data-screen-link="calendar">Open Calendar</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric"><strong>3</strong><span>Booked jobs</span></div>
      <div class="metric"><strong>2</strong><span>Pending jobs</span></div>
      <div class="metric"><strong>7</strong><span>Crew assigned</span></div>
      <div class="metric"><strong>$12.5k</strong><span>Billing this month</span></div>
      <div class="metric"><strong>9</strong><span>Shoot days</span></div>
      <div class="metric"><strong>4</strong><span>Drone packages</span></div>
    </div>

    <div class="review-strip">
      <div>
        <strong>1 calendar change needs review</strong>
        <span>Radical / Lexus - Shoot Day 1 changed externally in Google Calendar.</span>
      </div>
      <button class="btn">Review</button>
    </div>

    <div class="grid">
      <div class="panel">
        <div class="panel-head"><h2>Upcoming Booked Jobs</h2><button class="btn">View All Booked</button></div>
        <table class="table">
          <thead><tr><th>Date</th><th>Production</th><th>Job</th><th>Status</th><th>Crew</th><th>Drone</th><th>Location</th></tr></thead>
          <tbody>${jobRows('Booked / Active')}</tbody>
        </table>
      </div>
      <div class="panel">
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
  return locationMode === 'detail' ? locationDetailView() : locationOverviewView();
}

function locationOverviewView() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Locations</h2><button class="btn">Add Location</button></div>
      <div class="location-overview-list">
        ${jobLocations.map(location => `
          <button class="location-row-card" data-location-open="${location.id}">
            <div class="location-row-info">
              <h3>${location.name}</h3>
              <p class="muted">${location.address}</p>
              <p><strong>GPS:</strong> ${location.gps}</p>
              <div class="location-meta">${badge(location.airspace)} ${badge(location.poa)} ${badge(location.docs)}</div>
            </div>
            <div class="map location-row-map">${location.mapLabel}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function locationDetailView() {
  const selected = currentLocation();
  const index = locationIndex() + 1;
  const sections = [
    ['overview', 'Overview'],
    ['maps', 'Maps & Airspace'],
    ['poa', 'POA Builder'],
    ['paperwork', 'Paperwork'],
    ['notes', 'Notes']
  ];
  return `
    <div class="location-detail">
      <div class="location-detail-head">
        <button class="btn" data-location-back>Back to All Locations</button>
        <div>
          <p class="eyebrow">Location ${index} of ${jobLocations.length}</p>
          <h2>${selected.name}</h2>
          <p class="sub">${selected.address}</p>
        </div>
        <div class="actions">
          <button class="btn" data-location-cycle="-1">Previous</button>
          <button class="btn" data-location-cycle="1">Next</button>
          <button class="btn primary" data-location-section="poa">Create POA</button>
        </div>
      </div>
      <div class="tabs location-subtabs">
        ${sections.map(([id, label]) => `
          <button class="tab ${activeLocationSection === id ? 'active' : ''}" data-location-section="${id}">${label}</button>
        `).join('')}
      </div>
      ${locationDetailSection(selected)}
    </div>
  `;
}

function locationDetailSection(location) {
  if (activeLocationSection === 'maps') {
    return `
      <div class="grid two">
        <div class="panel">
          <div class="panel-head"><h2>Saved Maps</h2><button class="btn">Open Google Maps</button></div>
          <div class="panel-body">
            <div class="map">${location.mapLabel}</div>
            <br>
            <div class="map map-chart">Airspace chart / UASFM layer</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Airspace / Pilot Email</h2><button class="btn primary">Copy Pilot Email</button></div>
          <div class="panel-body">
            <p><strong>UASFM max altitude:</strong> ${location.uasfm}</p>
            <p><strong>Airspace context:</strong> ${location.context}</p>
            <p><strong>TFR status:</strong> ${location.tfr}</p>
            <p><strong>Authorization:</strong> ${location.authorization}</p>
            <p><strong>Requested altitude:</strong> ${location.requestedAltitude}</p>
            <div class="input" style="min-height: 110px;">Subject: LAANC details - Radical / Lexus - ${location.name}<br><br>Generated pilot email with job, location, GPS, date blocks, altitude, TFR status, aircraft list, and producer contact.</div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeLocationSection === 'poa') {
    return `
      <div class="poa-layout">
        <div class="panel">
          <div class="panel-head"><h2>POA Text Details</h2></div>
          <div class="panel-body">
            <div class="field"><label>Location</label><div class="input">${location.name}</div></div><br>
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
            <div class="map">Annotated POA map for ${location.name}</div>
            <div class="tool-row">
              ${['Text','Circle','Polygon','Path','Arrow','Launch','Spotter','Restricted','Auto Legend'].map(t => `<button class="btn">${t}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeLocationSection === 'paperwork') {
    return `
      <div class="panel">
        <div class="panel-head"><h2>Location Paperwork</h2><button class="btn">Attach Document</button></div>
        <table class="table">
          <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>FilmLA Location Form</td><td>Permit</td><td>${badge('Draft')}</td><td><button class="btn">Open</button></td></tr>
            <tr><td>Insurance COI Request</td><td>Insurance</td><td>${badge('Pending')}</td><td><button class="btn">Generate</button></td></tr>
            <tr><td>Site Map Export</td><td>Supporting</td><td>${badge(location.poa)}</td><td><button class="btn">Export</button></td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  if (activeLocationSection === 'notes') {
    return `
      <div class="panel">
        <div class="panel-head"><h2>Location Notes</h2><button class="btn">Copy To Job Notes</button></div>
        <div class="panel-body">
          <div class="input" style="min-height: 180px;">Parking, basecamp, launch/landing restrictions, jurisdiction contacts, neighborhood notes, and prior-job notes for ${location.name}.</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Overview</h2></div>
        <div class="panel-body">
          <p><strong>Address:</strong> ${location.address}</p>
          <p><strong>GPS:</strong> ${location.gps}</p>
          <p><strong>Airspace:</strong> ${location.context}</p>
          <p><strong>Authorization:</strong> ${location.authorization}</p>
          <p><strong>POA:</strong> ${location.poa}</p>
          <p><strong>Documents:</strong> ${location.docs}</p>
          <div class="location-action-row">
            <button class="btn" data-location-section="maps">Maps & Airspace</button>
            <button class="btn primary" data-location-section="poa">Create POA</button>
            <button class="btn" data-location-section="paperwork">Paperwork</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Primary Map</h2></div>
        <div class="panel-body"><div class="map">${location.mapLabel}</div></div>
      </div>
    </div>
  `;
}

function poaTab() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>POAs By Location</h2><button class="btn">Export All POAs</button></div>
      <table class="table">
        <thead><tr><th>Location</th><th>Status</th><th>Last Export</th><th>Action</th></tr></thead>
        <tbody>
          ${jobLocations.map(location => `
            <tr>
              <td><strong>${location.name}</strong><br><span class="muted">${location.address}</span></td>
              <td>${badge(location.poa)}</td>
              <td>${location.poa.includes('Draft') ? 'Draft only' : '-'}</td>
              <td><button class="btn" data-location-open="${location.id}" data-location-open-section="poa">Open POA Builder</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
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
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = [
    ['22', 'PREP', 'start', 'Radical / Lexus'],
    ['23', 'TRAVEL', 'mid', 'Radical / Lexus'],
    ['24', 'SHOOT 1', 'mid', 'Radical / Lexus'],
    ['25', 'IDLE', 'mid', 'Radical / Lexus'],
    ['26', 'SHOOT 2', 'mid', 'Radical / Lexus'],
    ['27', 'SHOOT 3', 'mid', 'Radical / Lexus'],
    ['28', 'WRAP', 'end', 'Radical / Lexus'],
    ['29', '', ''],
    ['30', '', ''],
    ['1', 'HOLD', 'start', 'MJZ / Nike'],
    ['2', 'SCOUT', 'end', 'MJZ / Nike'],
    ['3', '', ''],
    ['4', '', ''],
    ['5', '', '']
  ];
  document.querySelector('#calendar').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Month default</p>
        <h1>Calendar</h1>
        <p class="sub">Connected job blocks with day-type tags. External edits require review.</p>
      </div>
      <div class="actions"><button class="btn primary">Month</button><button class="btn">Week</button><button class="btn">Agenda</button></div>
    </div>
    <div class="month-weekdays">
      ${weekdays.map(d => `<div>${d}</div>`).join('')}
    </div>
    <div class="month-grid">
      ${days.map((d, i) => `
        <div class="month-day">
          <div class="date-num">${d[0]}</div>
          ${d[1] ? `<div class="bar ${d[2]}"><span class="day-tag">${d[1]}</span><br>${d[3]}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderResources() {
  const dates = ['Jun 22','Jun 23','Jun 24','Jun 25','Jun 26','Jun 27','Jun 28','Jun 29','Jun 30','Jul 1','Jul 2','Jul 3','Jul 4','Jul 5'];
  document.querySelector('#resources').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Warn-only conflicts</p>
        <h1>Resources</h1>
        <p class="sub">Calendar, timeline, and list views for crew, drones, vehicles, gear, assigned jobs, and overlaps.</p>
      </div>
      <div class="actions"><button class="btn primary">2 Weeks</button><button class="btn">Month</button></div>
    </div>
    <div class="tabs">
      ${['calendar','timeline','list'].map(view => `
        <button class="tab ${resourceView === view ? 'active' : ''}" data-resource-view="${view}">${view[0].toUpperCase() + view.slice(1)}</button>
      `).join('')}
    </div>
    ${resourceView === 'calendar' ? resourceCalendarView() : resourceView === 'timeline' ? resourceTimelineView(dates) : resourceListView()}
  `;
}

function resourceCalendarView() {
  const days = ['Mon Jun 22','Tue Jun 23','Wed Jun 24','Thu Jun 25','Fri Jun 26','Sat Jun 27','Sun Jun 28'];
  const jobEvents = {
    'Mon Jun 22': [{ type: 'PREP', title: 'Radical / Lexus', items: ['Drew', 'Nate', 'Jake', 'Inspire 3 A', 'Van 1', 'Camera kit'] }],
    'Tue Jun 23': [{ type: 'TRAVEL', title: 'Radical / Lexus', items: ['Drew', 'Inspire 3 A', 'Van 1', 'Batteries'] }],
    'Wed Jun 24': [
      { type: 'SHOOT 1', title: 'Radical / Lexus', items: ['Drew', 'Nate', 'Jake', 'Inspire 3 A', 'Van 1', 'Camera kit'] },
      { type: 'HOLD', title: 'MJZ / Nike', items: ['Colin', 'Inspire 3 A'], conflict: true }
    ],
    'Thu Jun 25': [{ type: 'IDLE', title: 'Radical / Lexus', items: ['Drew', 'Inspire 3 A', 'Van 1'] }],
    'Fri Jun 26': [{ type: 'SHOOT 2', title: 'Radical / Lexus', items: ['Drew', 'Nate', 'Jake', 'Inspire 3 A', 'Van 1'] }],
    'Sat Jun 27': [{ type: 'SHOOT 3', title: 'Radical / Lexus', items: ['Drew', 'Nate', 'Jake', 'Inspire 3 A', 'Van 1'] }],
    'Sun Jun 28': [{ type: 'WRAP', title: 'Radical / Lexus', items: ['Drew', 'Van 1', 'Returns'] }]
  };
  const resourceEvents = {
    'Mon Jun 22': [{ type: 'CREW', title: 'Drew + Nate + Jake', items: ['Radical / Lexus prep', 'Inspire 3 A', 'Van 1'] }],
    'Tue Jun 23': [{ type: 'TRAVEL', title: 'Drew + Van 1', items: ['Radical / Lexus travel', 'Inspire 3 A'] }],
    'Wed Jun 24': [
      { type: 'CREW', title: 'Drew + Nate + Jake', items: ['Radical / Lexus shoot', 'Inspire 3 A', 'Van 1'] },
      { type: 'DRONE CONFLICT', title: 'Inspire 3 A', items: ['Radical / Lexus shoot', 'MJZ / Nike hold'], conflict: true }
    ],
    'Thu Jun 25': [{ type: 'IDLE', title: 'Drew + Inspire 3 A', items: ['Radical / Lexus idle', 'Van 1'] }],
    'Fri Jun 26': [{ type: 'CREW', title: 'Drew + Nate + Jake', items: ['Radical / Lexus shoot', 'Inspire 3 A', 'Van 1'] }],
    'Sat Jun 27': [{ type: 'CREW', title: 'Drew + Nate + Jake', items: ['Radical / Lexus shoot', 'Inspire 3 A', 'Van 1'] }],
    'Sun Jun 28': [{ type: 'WRAP', title: 'Drew + Van 1', items: ['Radical / Lexus wrap', 'Returns'] }]
  };
  const eventsByDay = resourceGroup === 'resource' ? resourceEvents : jobEvents;
  const resourceLanes = [
    ['Drew Roberts', ['Prep', 'Travel', 'Shoot 1', 'Idle', 'Shoot 2', 'Shoot 3', 'Wrap']],
    ['Nate Labruzza', ['Prep', '', 'Shoot 1', '', 'Shoot 2', 'Shoot 3', '']],
    ['Jake Capistron', ['Prep', '', 'Shoot 1', '', 'Shoot 2', 'Shoot 3', '']],
    ['Inspire 3 A', ['Prep', 'Travel', 'Conflict', 'Idle', 'Shoot 2', 'Shoot 3', '']],
    ['Van 1', ['Prep', 'Travel', 'Shoot 1', 'Idle', 'Shoot 2', 'Shoot 3', 'Wrap']],
    ['Camera kit', ['Prep', '', 'Shoot 1', '', '', '', '']],
    ['Batteries', ['', 'Travel', 'Shoot 1', 'Idle', 'Shoot 2', 'Shoot 3', '']]
  ];
  return `
    <div class="panel">
      <div class="panel-head">
        <h2>Resource Calendar</h2>
        <div class="actions">
          <button class="btn ${resourceGroup === 'resource' ? 'primary' : ''}" data-resource-group="resource">Group By Resource</button>
          <button class="btn ${resourceGroup === 'job' ? 'primary' : ''}" data-resource-group="job">Group By Job</button>
        </div>
      </div>
      <div class="panel-note">${resourceGroup === 'resource' ? 'Main Resources view. Each crew member, drone, vehicle, and gear item keeps its own row so it can be tracked across the week.' : 'Job grouping shows familiar job blocks with the used crew, drones, vehicles, and gear inside each day.'}</div>
      ${resourceGroup === 'resource' ? `
      <div class="resource-lanes">
        <div class="resource-lane-head">
          <div>Resource</div>
          ${days.map(day => `<div>${day}</div>`).join('')}
        </div>
        ${resourceLanes.map(row => `
          <div class="resource-lane-row">
            <div class="resource-lane-label">${row[0]}</div>
            ${row[1].map(item => `
              <div class="resource-lane-day">
                ${item ? `<div class="resource-lane-block ${item === 'Conflict' ? 'conflict' : ''}"><strong>${item}</strong><span>${item === 'Conflict' ? 'Radical / Lexus + MJZ / Nike' : 'Radical / Lexus'}</span></div>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      ` : `
      <div class="resource-gcal">
        <div class="resource-gcal-head">
          ${days.map(day => `<div>${day}</div>`).join('')}
        </div>
        <div class="resource-gcal-grid">
          ${days.map(day => `
            <div class="resource-gcal-day">
              ${(eventsByDay[day] || []).map(event => `
                <div class="resource-event ${event.conflict ? 'conflict' : ''}">
                  <div class="resource-event-top">
                    <span>${event.type}</span>
                    ${event.conflict ? '<strong>Overlap</strong>' : ''}
                  </div>
                  <h3>${event.title}</h3>
                  <div class="resource-item-list">
                    ${event.items.map(item => `<em>${item}</em>`).join('')}
                  </div>
                </div>
              `).join('')}
              ${(eventsByDay[day] || []).length === 0 ? '<p class="muted">No resources assigned</p>' : ''}
            </div>
            `).join('')}
        </div>
      </div>
      `}
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Warnings</h2><button class="btn">Show All</button></div>
      <div class="panel-body">
        <p><strong>Inspire 3 A</strong> has a Jun 24 overlap between Radical / Lexus shoot and MJZ / Nike hold. Warning only.</p>
      </div>
    </div>
  `;
}

function resourceTimelineView(dates) {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Resource Calendar</h2><div class="actions"><button class="btn">Crew</button><button class="btn">Drones</button><button class="btn">Vehicles</button></div></div>
      <div class="panel-note">Two-week scale shown. Month scale expands this same timeline so prep, shoot, wrap, holds, and travel are visible together.</div>
      <div class="resource-scroll">
        <div class="resource-calendar">
          <table class="table">
            <thead><tr><th>Resource</th>${dates.map(d => `<th>${d}</th>`).join('')}</tr></thead>
            <tbody>
              <tr><td>Drew Roberts</td><td>Prep</td><td>Travel</td><td>Shoot</td><td>Idle</td><td>Shoot</td><td>Shoot</td><td>Wrap</td><td>-</td><td>-</td><td>Hold</td><td>Scout</td><td>-</td><td>-</td><td>-</td></tr>
              <tr><td>Colin Burgess</td><td>-</td><td>-</td><td>Paperwork</td><td>-</td><td>Paperwork</td><td>Paperwork</td><td>-</td><td>-</td><td>-</td><td>Hold</td><td>Hold</td><td>-</td><td>-</td><td>-</td></tr>
              <tr><td>Inspire 3 A</td><td>Prep</td><td>Travel</td><td><span class="badge warn">Conflict</span></td><td>Idle</td><td>Shoot</td><td>Shoot</td><td>Wrap</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
              <tr><td>Van 1</td><td>Prep</td><td>Travel</td><td>Shoot</td><td>Idle</td><td>Shoot</td><td>Shoot</td><td>Wrap</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function resourceListView() {
  return `
    <div class="panel">
      <div class="panel-head"><h2>Resource List View</h2><div class="actions"><button class="btn">Sort By Date</button><button class="btn">Show Conflicts</button></div></div>
      <table class="table">
        <thead><tr><th>Resource</th><th>Type</th><th>Date Range</th><th>Status</th><th>Jobs / Notes</th></tr></thead>
        <tbody>
          <tr><td>Drew Roberts</td><td>Crew</td><td>Jun 22-Jun 28</td><td>${badge('Booked')}</td><td>Radical / Lexus</td></tr>
          <tr><td>Inspire 3 A</td><td>Drone</td><td>Jun 24</td><td>${badge('Conflict')}</td><td>Radical / Lexus, MJZ / Nike hold</td></tr>
          <tr><td>Van 1</td><td>Vehicle</td><td>Jun 22-Jun 28</td><td>${badge('Booked')}</td><td>Radical / Lexus</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderMetrics() {
  document.querySelector('#metrics').innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Company intelligence</p>
        <h1>Metrics</h1>
        <p class="sub">Read-only analytics with changeable views, filters, and AI-assisted business trends.</p>
      </div>
      <div class="actions"><button class="btn primary">This Quarter</button><button class="btn">YTD</button><button class="btn">By Client</button><button class="btn">By Drone</button></div>
    </div>
    <div class="metrics-hero">
      <div>
        <p class="eyebrow">AI trend summary</p>
        <h2>Inspire 3 work is driving most booked shoot days this month.</h2>
        <p class="sub">Billing delays are longest on jobs with location permit packets. Repeat clients are responsible for 64% of booked revenue.</p>
      </div>
      <button class="btn dark">Generate Insights</button>
    </div>
    <div class="metric-grid">
      <div class="metric"><strong>12</strong><span>Jobs booked</span></div>
      <div class="metric"><strong>$148k</strong><span>Booked revenue</span></div>
      <div class="metric"><strong>31</strong><span>Shoot days</span></div>
      <div class="metric"><strong>18</strong><span>Crew hires</span></div>
      <div class="metric"><strong>64%</strong><span>Repeat client revenue</span></div>
      <div class="metric"><strong>7.4d</strong><span>Avg closeout</span></div>
    </div>
    <div class="grid two">
      <div class="panel">
        <div class="panel-head"><h2>Revenue By Drone Package</h2><button class="btn">Change View</button></div>
        <div class="chart-bars">
          <div><span>Inspire 3</span><strong style="width: 82%"></strong><em>$89k</em></div>
          <div><span>Alta X</span><strong style="width: 42%"></strong><em>$38k</em></div>
          <div><span>FPV</span><strong style="width: 24%"></strong><em>$21k</em></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Workload By Day Type</h2><button class="btn">Filter</button></div>
        <div class="chart-bars">
          <div><span>Shoot</span><strong style="width: 90%"></strong><em>31 days</em></div>
          <div><span>Prep</span><strong style="width: 62%"></strong><em>21 days</em></div>
          <div><span>Travel</span><strong style="width: 38%"></strong><em>13 days</em></div>
          <div><span>Wrap</span><strong style="width: 35%"></strong><em>12 days</em></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Client / Production Patterns</h2></div>
        <table class="table">
          <thead><tr><th>Client</th><th>Jobs</th><th>Revenue</th><th>Trend</th></tr></thead>
          <tbody>
            <tr><td>Radical</td><td>3</td><td>$42k</td><td>${badge('Growing')}</td></tr>
            <tr><td>Hungry Man</td><td>2</td><td>$31k</td><td>${badge('Stable')}</td></tr>
            <tr><td>MJZ</td><td>2</td><td>$26k</td><td>${badge('Pending')}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Paperwork Friction</h2></div>
        <table class="table">
          <thead><tr><th>Area</th><th>Volume</th><th>AI Note</th></tr></thead>
          <tbody>
            <tr><td>Location permits</td><td>14 packets</td><td>Highest producer admin load</td></tr>
            <tr><td>Insurance forms</td><td>9 forms</td><td>Good candidate for template memory</td></tr>
            <tr><td>Deal memos</td><td>18 memos</td><td>Rates and day types drive variation</td></tr>
          </tbody>
        </table>
      </div>
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

    const themeToggle = e.target.closest('[data-theme-toggle]');
    if (themeToggle) {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = nextTheme;
      syncThemeButton();
    }

    const openJob = e.target.closest('[data-open-job]');
    if (openJob) {
      activeJob = jobs.find(j => j.id === openJob.dataset.openJob) || jobs[0];
      locationMode = 'overview';
      activeLocationSection = 'overview';
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

    const locationOpen = e.target.closest('[data-location-open]');
    if (locationOpen) {
      activeLocationId = locationOpen.dataset.locationOpen;
      activeLocationSection = locationOpen.dataset.locationOpenSection || 'overview';
      locationMode = 'detail';
      document.querySelector('[data-job-tab="locations"]')?.click();
      const locationTab = document.querySelector('#tab-locations');
      if (locationTab) locationTab.innerHTML = locationsTab();
    }

    const locationBack = e.target.closest('[data-location-back]');
    if (locationBack) {
      locationMode = 'overview';
      activeLocationSection = 'overview';
      const locationTab = document.querySelector('#tab-locations');
      if (locationTab) locationTab.innerHTML = locationsTab();
    }

    const locationCycle = e.target.closest('[data-location-cycle]');
    if (locationCycle) {
      cycleLocation(Number(locationCycle.dataset.locationCycle));
      const locationTab = document.querySelector('#tab-locations');
      if (locationTab) locationTab.innerHTML = locationsTab();
    }

    const locationSection = e.target.closest('[data-location-section]');
    if (locationSection) {
      activeLocationSection = locationSection.dataset.locationSection;
      locationMode = 'detail';
      const locationTab = document.querySelector('#tab-locations');
      if (locationTab) locationTab.innerHTML = locationsTab();
    }

    const resourceViewButton = e.target.closest('[data-resource-view]');
    if (resourceViewButton) {
      resourceView = resourceViewButton.dataset.resourceView;
      renderResources();
    }

    const resourceGroupButton = e.target.closest('[data-resource-group]');
    if (resourceGroupButton) {
      resourceGroup = resourceGroupButton.dataset.resourceGroup;
      renderResources();
    }
  });
}

renderHome();
renderJobs();
renderNewJob();
renderJob();
renderCalendar();
renderResources();
renderMetrics();
renderSimple('libraries', 'Libraries');
renderSimple('settings', 'Settings');
if (pageParams.get('theme') === 'dark') document.body.dataset.theme = 'dark';
syncThemeButton();
if (pageParams.get('screen') && document.getElementById(pageParams.get('screen'))) show(pageParams.get('screen'));
bind();
