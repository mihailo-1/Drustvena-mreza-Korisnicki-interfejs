function ucitajGrupe() {
    fetch("http://localhost:51509/api/groups")
        .then(response => {
            if (!response.ok) {
                throw new Error("Mrežna greška");
            }
            return response.json();
        })
        .then(data => {
            prikaziGrupe(data);
        })
        .catch(error => {
            console.error("Greška:", error);
            document.getElementById("status-poruka").innerText = "Greška pri učitavanju.";
        });
}

function prikaziGrupe(grupe) {
    const tbody = document.getElementById("groups-table-body");
    tbody.innerHTML = "";

    grupe.forEach(g => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${g.id}</td>
            <td>${g.ime}</td> 
            <td>
                <button onclick="obrisiGrupu(${g.id})">Obriši</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function obrisiGrupu(id) {
    if (confirm("Da li ste sigurni?")) {
        fetch(`http://localhost:51509/api/groups/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                ucitajGrupe(); 
            } else {
                alert("Brisanje nije uspelo.");
            }
        })
        .catch(error => console.error("Greška pri brisanju:", error));
    }
}

ucitajGrupe();