// Database Service

const DUMMY_PATIENTS = [
    { id: 'PS001', name: 'Ny. S', status: 'Active', stase: 'IPD', diagnosa: 'DM Type 2, Hipertensi', dpjp: 'dr. Ahmad', tags: ['urgent', 'lab'] },
    { id: 'PS002', name: 'Tn. B', status: 'Follow-up', stase: 'Bedah', diagnosa: 'Post-appendectomy', dpjp: 'dr. Budi', tags: ['post-op'] },
    { id: 'PS003', name: 'Ny. A', status: 'Active', stase: 'IPD', diagnosa: 'Hipertensi Stage 2', dpjp: 'dr. Ahmad', tags: ['monitoring'] },
    { id: 'PS004', name: 'Ny. D', status: 'Active', stase: 'IPD', diagnosa: 'CAP + Sepsis', dpjp: 'dr. Ahmad', tags: ['urgent', 'icu'] },
    { id: 'PS005', name: 'Tn. E', status: 'Discharged', stase: 'Obgyn', diagnosa: 'Post-partum normal', dpjp: 'dr. Siti', tags: ['discharged'] }
];

const DUMMY_TASKS = [
    { id: 1, text: '[PS001] Cek GDP Ny. S', deadline: 'Hari ini 09:00', tags: ['urgent', 'lab'], status: 'pending' },
    { id: 2, text: '[PS004] Monitor vital signs Ny. D setiap 4 jam', deadline: 'Hari ini', tags: ['urgent', 'monitoring'], status: 'pending' },
    { id: 3, text: 'Visite ruangan IPD - 3 pasien aktif', deadline: '09:00 - 11:00', tags: ['visite'], status: 'pending' },
    { id: 4, text: '[PS001] Cek hasil HbA1c, ureum, kreatinin', deadline: '30 Des', tags: ['lab'], status: 'pending' },
    { id: 5, text: '[PS001] Edukasi diet DM Ny. S', deadline: '27 Des', tags: [], status: 'completed' },
    { id: 6, text: '[PS002] Discharge planning Tn. B', deadline: '26 Des', tags: [], status: 'completed' }
];

const DUMMY_SOAP = [
    {
        patientId: 'PS001',
        patientName: 'Ny. S',
        date: '2024-12-28 08:15',
        s: 'Lemas berkurang, masih sering haus tapi sudah lebih baik',
        o: 'GDP 180 mg/dL (↓ dari 250), TD 150/85 mmHg',
        a: 'DM Type 2 respon baik terhadap terapi',
        p: '- Lanjut Metformin 500mg 2x1\n- Naikkan Amlodipine → 10mg 1x1'
    },
    {
        patientId: 'PS002',
        patientName: 'Tn. B',
        date: '2024-12-26 10:00',
        s: 'Nyeri luka post-op berkurang',
        o: 'Luka operasi kering, TD 120/80',
        a: 'Post-appendectomy H+6, penyembuhan baik',
        p: '- Boleh pulang, control 30 Des'
    }
];

// Shared State
window.appState = {
    patients: [],
    tasks: [],
    soap: [],
    config: {}
};

// Functions
window.db = {
    loadConfig: function () {
        const configStr = localStorage.getItem('med_assist_config');
        if (configStr) {
            window.appState.config = JSON.parse(configStr);
            return true;
        }
        return false;
    },

    loadData: function () {
        // Initialize if empty
        if (!localStorage.getItem('med_assist_db_version')) {
            localStorage.setItem('med_assist_db_version', '1.0');
        }

        if (!localStorage.getItem('med_patients')) {
            window.appState.patients = DUMMY_PATIENTS;
            localStorage.setItem('med_patients', JSON.stringify(window.appState.patients));
        } else {
            window.appState.patients = JSON.parse(localStorage.getItem('med_patients'));
        }

        if (!localStorage.getItem('med_tasks')) {
            window.appState.tasks = DUMMY_TASKS;
            localStorage.setItem('med_tasks', JSON.stringify(window.appState.tasks));
        } else {
            window.appState.tasks = JSON.parse(localStorage.getItem('med_tasks'));
        }

        if (!localStorage.getItem('med_soap')) {
            window.appState.soap = DUMMY_SOAP;
            localStorage.setItem('med_soap', JSON.stringify(window.appState.soap));
        } else {
            window.appState.soap = JSON.parse(localStorage.getItem('med_soap'));
        }
    },

    saveConfig: function (config) {
        localStorage.setItem('med_assist_config', JSON.stringify(config));
        window.appState.config = config;
    },

    clearData: function () {
        if (confirm('Yakin ingin reset semua data? (Config tidak akan hilang)')) {
            localStorage.removeItem('med_patients');
            localStorage.removeItem('med_tasks');
            localStorage.removeItem('med_soap');
            location.reload();
        }
    }
};
