// Lógica de Costos Pro

const store = {
    costs: JSON.parse(localStorage.getItem('costs-pro-data')) || [],

    save() {
        localStorage.setItem('costs-pro-data', JSON.stringify(this.costs));
        this.render();
    },

    addCost(description, amount, category) {
        const newCost = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category,
            date: new Date().toISOString()
        };
        this.costs.unshift(newCost);
        this.save();
    },

    render() {
        const listContainer = document.getElementById('costs-list');
        const totalDisplay = document.getElementById('total-amount');

        if (this.costs.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">No hay costos registrados</div>';
            totalDisplay.textContent = '$0';
            return;
        }

        let total = 0;
        listContainer.innerHTML = this.costs.map(cost => {
            total += cost.amount;
            return `
                <div class="cost-item">
                    <div class="cost-info">
                        <span class="cost-desc">${cost.description}</span>
                        <span class="cost-date">${new Date(cost.date).toLocaleDateString()}</span>
                    </div>
                    <span class="cost-amount">$${cost.amount.toLocaleString()}</span>
                </div>
            `;
        }).join('');

        totalDisplay.textContent = `$${total.toLocaleString()}`;
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    store.render();

    const modal = document.getElementById('cost-modal');
    const addBtn = document.getElementById('add-cost-btn');
    const cancelBtn = document.getElementById('cancel-modal');
    const saveBtn = document.getElementById('save-cost-btn');

    addBtn.onclick = () => modal.style.display = 'flex';
    cancelBtn.onclick = () => modal.style.display = 'none';

    saveBtn.onclick = () => {
        const desc = document.getElementById('cost-description').value;
        const amount = document.getElementById('cost-amount-input').value;

        if (desc && amount) {
            store.addCost(desc, amount, 'General');
            modal.style.display = 'none';
            document.getElementById('cost-description').value = '';
            document.getElementById('cost-amount-input').value = '';
        }
    };

    // Cerrar modal al tocar fuera
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
});
