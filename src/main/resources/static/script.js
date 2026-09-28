const API_URL = '/applications';
const form = document.getElementById('applicationForm');
const rows = document.getElementById('applicationRows');
const notice = document.getElementById('notice');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const refreshButton = document.getElementById('refreshButton');
const submitButton = document.getElementById('submitButton');
const connectionStatus = document.getElementById('connectionStatus');
const connectionLabel = document.getElementById('connectionLabel');
const totalCount = document.getElementById('totalCount');
const progressCount = document.getElementById('progressCount');
const interviewCount = document.getElementById('interviewCount');
const offerCount = document.getElementById('offerCount');
const resultCount = document.getElementById('resultCount');

let applications = [];

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function setConnection(connected) {
  connectionStatus.classList.toggle('is-connected', connected);
  connectionLabel.textContent = connected ? 'API connected' : 'API unavailable';
}

function showNotice(message, type = 'info') {
  notice.textContent = message;
  notice.className = `notice notice-${type}`;
  notice.hidden = false;
}

function getJobLabel(application) {
  const job = application.jobOpening;
  if (!job) return 'Not linked';
  return job.title || job.position || (job.id ? `Opening #${job.id}` : 'Linked opening');
}

function updateMetrics() {
  const inProgress = applications.filter(({ status }) => !['Hired', 'Rejected'].includes(status));
  totalCount.textContent = applications.length;
  progressCount.textContent = inProgress.length;
  interviewCount.textContent = applications.filter(({ status }) => status === 'Interview').length;
  offerCount.textContent = applications.filter(({ status }) => ['Offer', 'Hired'].includes(status)).length;
}

function renderApplications() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const filtered = applications.filter((application) => {
    const matchesSearch = !query || [application.candidateName, application.email, getJobLabel(application)]
      .some((value) => String(value || '').toLowerCase().includes(query));
    return matchesSearch && (!selectedStatus || application.status === selectedStatus);
  });

  resultCount.textContent = filtered.length;
  updateMetrics();
  if (!filtered.length) {
    rows.innerHTML = `<tr><td class="table-message" colspan="5">${applications.length ? 'No applications match your filters.' : 'No applications yet. Add the first candidate to begin.'}</td></tr>`;
    return;
  }

  rows.innerHTML = filtered.map((application) => {
    const id = application.id;
    const status = application.status || 'Applied';
    const resume = application.resumeLink
      ? `<a class="resume-link" href="${escapeHtml(application.resumeLink)}" target="_blank" rel="noopener noreferrer">View resume <span aria-hidden="true">↗</span></a>`
      : '<span class="muted">Not added</span>';
    const actions = id
      ? `<button class="icon-button delete-button" type="button" data-action="delete" data-id="${escapeHtml(id)}" aria-label="Delete ${escapeHtml(application.candidateName)}" title="Delete application">&times;</button>`
      : '<span class="muted">&mdash;</span>';
    return `<tr>
      <td><div class="candidate-cell"><span class="avatar" aria-hidden="true">${escapeHtml((application.candidateName || '?').charAt(0).toUpperCase())}</span><span><strong>${escapeHtml(application.candidateName || 'Unnamed candidate')}</strong><small>${escapeHtml(application.email)}</small></span></div></td>
      <td><span class="job-label">${escapeHtml(getJobLabel(application))}</span></td>
      <td><select class="status-pill status-${escapeHtml(status.toLowerCase())}" data-action="status" data-id="${escapeHtml(id || '')}" aria-label="Status for ${escapeHtml(application.candidateName)}">${['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map((option) => `<option ${option === status ? 'selected' : ''}>${option}</option>`).join('')}</select></td>
      <td>${resume}</td><td class="actions-cell">${actions}</td>
    </tr>`;
  }).join('');
}

async function loadApplications() {
  refreshButton.disabled = true;
  refreshButton.classList.add('is-loading');
  try {
    const response = await fetch(API_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    applications = await response.json();
    setConnection(true);
    notice.hidden = true;
    renderApplications();
  } catch (error) {
    setConnection(false);

    rows.innerHTML = '<tr><td class="table-message" colspan="5">Applications are unavailable right now.</td></tr>';
    updateMetrics();
  } finally {
    refreshButton.disabled = false;
    refreshButton.classList.remove('is-loading');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.textContent = 'Adding application...';
  const formData = new FormData(form);
  const payload = { candidateName: formData.get('candidateName').trim(), email: formData.get('email').trim(), resumeLink: formData.get('resumeLink').trim(), status: formData.get('status') };
  const jobOpeningId = formData.get('jobOpeningId').trim();
  if (jobOpeningId) payload.jobOpening = { id: Number(jobOpeningId) };
  try {
    const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    form.reset();
    showNotice('Application added to the pipeline.', 'success');
    await loadApplications();
  } catch (error) {
    showNotice('', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Add application';
  }
});

rows.addEventListener('change', async (event) => {
  const control = event.target.closest('[data-action="status"]');
  if (!control || !control.dataset.id) return;
  try {
    const response = await fetch(`${API_URL}/${control.dataset.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(control.value) });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const application = applications.find(({ id }) => String(id) === control.dataset.id);
    if (application) application.status = control.value;
    control.className = `status-pill status-${control.value.toLowerCase()}`;
    updateMetrics();
    showNotice('Application status updated.', 'success');
  } catch (error) {
    showNotice('The status could not be updated.', 'error');
    renderApplications();
  }
});

rows.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button || !window.confirm('Remove this application from the pipeline?')) return;
  button.disabled = true;
  try {
    const response = await fetch(`${API_URL}/${button.dataset.id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    applications = applications.filter(({ id }) => String(id) !== button.dataset.id);
    renderApplications();
    showNotice('Application removed.', 'success');
  } catch (error) {
    button.disabled = false;
    showNotice('The application could not be removed.', 'error');
  }
});

searchInput.addEventListener('input', renderApplications);
statusFilter.addEventListener('change', renderApplications);
refreshButton.addEventListener('click', loadApplications);
loadApplications();
