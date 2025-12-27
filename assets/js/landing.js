// Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if already setup
    if (localStorage.getItem('med_assist_config')) {
        window.location.href = 'dashboard.html';
    }
});

function openSetup() {
    document.getElementById('setupModal').style.display = 'flex';
}

function toggleApiKey() {
    const input = document.getElementById('apiKey');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function handleSetup(e) {
    e.preventDefault();

    const config = {
        profile: {
            name: document.getElementById('name').value,
            stase: document.getElementById('stase').value,
            dpjp: document.getElementById('dpjp').value
        },
        api: {
            key: document.getElementById('apiKey').value,
            model: 'gemini-2.5-flash' // Hardcoded as per requirement
        },
        setupDate: new Date().toISOString()
    };

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Testing Connection...';
    btn.disabled = true;

    // Helper to save and redirect
    const saveAndRedirect = () => {
        try {
            localStorage.setItem('med_assist_config', JSON.stringify(config));

            if (!localStorage.getItem('med_assist_db_version')) {
                localStorage.setItem('med_assist_db_version', '1.0');
            }

            btn.textContent = 'Success! Redirecting...';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            alert('Gagal menyimpan data local storage. Pastikan browser anda mendukungnya.');
            console.error(error);
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };

    // Test Connection if service available
    if (window.GeminiService) {
        window.GeminiService.testConnection(config.api.key)
            .then(isConnected => {
                if (!isConnected) {
                    if (!confirm('Koneksi ke Gemini API Gagal. Lanjut tanpa validasi? (Fitur AI mungkin tidak berjalan)')) {
                        // User cancelled
                        btn.textContent = originalText;
                        btn.disabled = false;
                        return;
                    }
                }
                saveAndRedirect();
            })
            .catch(error => {
                console.error(error);
                alert('Terjadi kesalahan saat testing API: ' + error.message);
                btn.textContent = originalText;
                btn.disabled = false;
            });
    } else {
        // Fallback
        console.warn('GeminiService not found, skipping test');
        saveAndRedirect();
    }
}

// Close modal on outside click
document.getElementById('setupModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('setupModal')) {
        document.getElementById('setupModal').style.display = 'none';
    }
});
