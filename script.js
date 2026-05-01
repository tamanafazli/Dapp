const API_URL = "http://localhost:3001";

function showMessage(text, type = 'success') {
    const el = document.getElementById('message');
    el.style.display = 'block';
    el.innerText = text;
    el.className = type === 'success' ? 'success' : 'error';
    setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// Load candidates
async function loadCandidates() {
    const res = await fetch(`${API_URL}/candidates`);
    const data = await res.json();

    const list = document.getElementById("candidatesList");
    list.innerHTML = "";

    data.forEach(c => {
        const li = document.createElement("li");
        li.innerText = `ID: ${c.id} | ${c.name} | Votes: ${c.votes}`;
        list.appendChild(li);
    });

    // Disable vote controls if user has already voted (frontend restriction)
    const voted = localStorage.getItem('voted');
    const voteBtn = document.getElementById('voteBtn');
    const candidateInput = document.getElementById('candidateId');
    if (voted === 'true') {
        voteBtn.disabled = true;
        candidateInput.disabled = true;
        voteBtn.innerText = 'Already voted';
    } else {
        voteBtn.disabled = false;
        candidateInput.disabled = false;
        voteBtn.innerText = 'Vote';
    }
}

// Vote
async function vote() {
    const idEl = document.getElementById("candidateId");
    const id = idEl.value && idEl.value.trim();
    if (!id) {
        showMessage('Please enter a candidate ID', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidateId: Number(id) })
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || 'Vote failed');
        }

        showMessage('Vote successful', 'success');
        localStorage.setItem('voted', 'true');
        // Update UI
        document.getElementById('voteBtn').disabled = true;
        document.getElementById('candidateId').disabled = true;
        loadCandidates();
    } catch (err) {
        showMessage(err.message || 'Vote failed', 'error');
    }
}

// Add candidate
async function addCandidate() {
    const nameEl = document.getElementById('candidateName');
    const name = nameEl.value && nameEl.value.trim();
    if (!name) {
        showMessage('Please enter a candidate name', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/addCandidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || 'Add candidate failed');
        }

        showMessage('Candidate added', 'success');
        nameEl.value = '';
        loadCandidates();
    } catch (err) {
        showMessage(err.message || 'Add candidate failed', 'error');
    }
}

// Load results
async function loadResults() {
    const res = await fetch(`${API_URL}/results`);
    const data = await res.json();

    const list = document.getElementById("resultsList");
    list.innerHTML = "";

    data.forEach(r => {
        const li = document.createElement("li");
        li.innerText = `${r.name}: ${r.votes} votes`;
        list.appendChild(li);
    });
}

// Load on start
loadCandidates();