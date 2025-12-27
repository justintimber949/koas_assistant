// Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    if (!window.db.loadConfig()) {
        window.location.href = 'index.html';
        return;
    }

    // Load Data
    window.db.loadData();

    // Init UI
    initDashboard();
});

function initDashboard() {
    updateUserProfile();
    refreshUI();
}

function updateUserProfile() {
    const profile = window.appState.config.profile;
    if (profile) {
        document.getElementById('userDisplay').textContent = profile.name || 'User';
        document.getElementById('staseDisplay').textContent = profile.stase || 'Koas';
        document.getElementById('avatarDisplay').textContent = getInitials(profile.name);

        // Settings Display
        const key = window.appState.config.api?.key || '';
        document.getElementById('displayApiKey').textContent = key ? '••••••••' + key.slice(-4) : 'Not Configured';
    }
}

function refreshUI() {
    renderBriefing();
    renderStats();
    renderPatients();
    renderSOAP();
    renderTasks();
}

function refreshData() {
    window.db.loadData();
    refreshUI();
}

// --- AI FEATURES ---

async function analyzePatient(id) {
    const patient = window.appState.patients.find(p => p.id === id);
    if (!patient) return;

    // Open Chat
    toggleChat();

    // Send Prompt
    const prompt = `Analisis pasien ini secara ringkas:
    ID: ${patient.id}
    Nama: ${patient.name}
    Usia: -
    Diagnosa: ${patient.diagnosa}
    Stase: ${patient.stase}
    
    Berikan poin-poin penting yang harus diperhatikan (Red Flags) dan saran monitoring.`;

    // Simulate user typing
    const input = document.getElementById('chatInput');
    input.value = `Analisis kasus pasien ${patient.name} (${patient.diagnosa})`;
    sendMessage(prompt); // Custom function to send prompt but display friendly text?
    // Actually sendMessage() takes value from input. Let's modify sendMessage slightly or just set value and click.
    // simpler:
    await sendMessage(); // This will send what's in input.
}

async function suggestPlan(patientId) {
    const patient = window.appState.patients.find(p => p.id === patientId);
    // Find latest SOAP
    const soap = window.appState.soap.find(s => s.patientId === patientId); // Just grab first found for demo

    if (!patient || !soap) {
        alert('Data SOAP tidak ditemukan untuk analisis.');
        return;
    }

    toggleChat();
    const input = document.getElementById('chatInput');
    input.value = `Saran tatalaksana untuk ${patient.name}`;

    const contextPrompt = `Berikan saran Planning (P) untuk SOAP berikut:
    Pasien: ${patient.name} (${patient.diagnosa})
    S: ${soap.s}
    O: ${soap.o}
    A: ${soap.a}
    
    Berikan 3-4 poin rencana terapi/monitoring yang spesifik.`;

    // We need a way to send HIDDEN prompt but show visible text.
    // For now, let's just send the visible text and let the AI ask for context OR we append context.
    // Hack for demo: We replace the sendMessage logic or just pre-fill.

    // Better approach: Just send the context prompt directly as user message but it might look long.
    // Let's just send it.
    input.value = contextPrompt;
    await sendMessage();
}

// --- RENDERERS ---

function renderBriefing() {
    const list = document.getElementById('briefingList');
    const urgentTasks = window.appState.tasks.filter(t => t.tags.includes('urgent') && t.status === 'pending');

    const countEl = document.getElementById('urgentCount');
    if (countEl) countEl.textContent = `${urgentTasks.length} Items`;

    if (list) {
        list.innerHTML = urgentTasks.length ? urgentTasks.map(t => `
            <li class="list-item">
                <div>
                    <div style="font-weight:600; margin-bottom:4px;">${t.text}</div>
                    <div class="text-sm text-light">⏰ Deadline: ${t.deadline}</div>
                </div>
                <button class="btn" style="padding: 4px 12px; font-size: 0.8rem;">Done</button>
            </li>
        `).join('') : '<li class="list-item text-light">Tidak ada task urgent. Good job! 👍</li>';
    }
}

function renderStats() {
    const activePatients = window.appState.patients.filter(p => p.status === 'Active').length;
    const pendingTasks = window.appState.tasks.filter(t => t.status === 'pending').length;

    const el1 = document.getElementById('statsActivePatients');
    const el2 = document.getElementById('statsPendingTasks');
    const el3 = document.getElementById('statsUpcomingDeadlines');

    if (el1) el1.textContent = activePatients;
    if (el2) el2.textContent = pendingTasks;
    if (el3) el3.textContent = window.appState.tasks.filter(t => t.deadline.includes('Besok') || t.deadline.includes('30 Des')).length;
}

function renderPatients() {
    const tbody = document.getElementById('patientList');
    if (tbody) {
        tbody.innerHTML = window.appState.patients.map(p => `
            <tr>
                <td><span style="font-family:'JetBrains Mono'">${p.id}</span></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.stase}</td>
                <td>${p.diagnosa}</td>
                <td>${p.dpjp}</td>
                <td>
                    <div style="margin-bottom:4px;">
                        <span class="tag ${p.status === 'Active' ? 'tag-info' : 'tag-success'}">${p.status}</span>
                        ${p.tags.includes('urgent') ? '<span class="tag tag-urgent">!</span>' : ''}
                    </div>
                    <button onclick="analyzePatient('${p.id}')" class="btn" style="padding: 2px 8px; font-size: 0.7rem; color: var(--primary); border-color: var(--primary); margin-top:4px;">
                        🤖 Analyze
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function renderTasks() {
    const list = document.getElementById('fullTaskList');
    if (list) {
        list.innerHTML = window.appState.tasks.map(t => `
            <li class="list-item" style="border-left: 3px solid ${t.status === 'completed' ? 'var(--secondary)' : 'var(--accent)'}">
                <div style="flex:1">
                    <div style="${t.status === 'completed' ? 'text-decoration:line-through; color:var(--text-light)' : ''}">${t.text}</div>
                    <div class="text-sm text-light">
                        ${t.deadline ? `🕒 ${t.deadline}` : ''} 
                        ${t.tags.map(tag => `#${tag}`).join(' ')}
                    </div>
                </div>
                <span class="tag ${t.status === 'completed' ? 'tag-success' : 'tag-warning'}">${t.status}</span>
            </li>
        `).join('');
    }
}

function renderSOAP() {
    const container = document.getElementById('soapList');
    if (container) {
        container.innerHTML = window.appState.soap.map(note => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <strong>${note.patientName} (${note.patientId})</strong>
                        <div class="text-sm text-light">${note.date}</div>
                    </div>
                    <button onclick="suggestPlan('${note.patientId}')" class="btn" style="font-size: 0.8rem;">
                        💡 Suggest Plan
                    </button>
                </div>
                <div style="display:grid; gap:12px;">
                    <div><strong style="color:var(--primary)">S:</strong> ${note.s}</div>
                    <div><strong style="color:var(--primary)">O:</strong> ${note.o}</div>
                    <div><strong style="color:var(--secondary)">A:</strong> ${note.a}</div>
                    <div><strong style="color:var(--secondary)">P:</strong> <pre style="font-family:inherit; display:inline;">${note.p}</pre></div>
                </div>
            </div>
        `).join('');
    }
}

// --- NAVIGATION ---
function navigate(viewName) {
    // Update active sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.getElementById(`nav-${viewName}`);
    if (navItem) navItem.classList.add('active');

    // Toggle Views
    ['dashboard', 'patients', 'soap', 'tasks', 'settings'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
            if (v === viewName) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });
}

// --- UTILS ---
function getInitials(name) {
    if (!name) return 'DR';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}
