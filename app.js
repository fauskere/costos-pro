const state = {
    ingredients: JSON.parse(localStorage.getItem('cp-ingredients')) || [],
    products: JSON.parse(localStorage.getItem('cp-products')) || [],
    categories: ['Chocolates', 'Budin', 'Roscas', 'Tortas', 'Pan Dulce', 'Miga', 'Pizza'],
    currentCategory: 'Chocolates',
    view: 'dashboard' // 'dashboard', 'ingredients', 'settings'
};

const store = {
    save() {
        localStorage.setItem('cp-ingredients', JSON.stringify(state.ingredients));
        localStorage.setItem('cp-products', JSON.stringify(state.products));
        ui.render();
    },

    addIngredient(name, purchasePrice, purchaseQty, unit) {
        const id = Date.now();
        state.ingredients.push({ id, name, purchasePrice: parseFloat(purchasePrice), purchaseQty: parseFloat(purchaseQty), unit });
        this.save();
    },

    addProduct(data) {
        // data: { name, category, type: 'resale'|'recipe', ... }
        const id = Date.now();
        state.products.push({ id, ...data });
        this.save();
    }
};

const ui = {
    render() {
        if (state.view === 'dashboard') this.renderDashboard();
        if (state.view === 'ingredients') this.renderIngredients();
    },

    renderDashboard() {
        const container = document.getElementById('costs-list');
        const categoryTitle = document.querySelector('h2');
        categoryTitle.textContent = state.currentCategory;

        const filtered = state.products.filter(p => p.category === state.currentCategory);

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay productos en esta categoría</div>';
            return;
        }

        container.innerHTML = filtered.map(p => this.createProductCard(p)).join('');
    },

    createProductCard(p) {
        const cost = this.calculateProductCost(p);
        return `
            <div class="cost-item">
                <div class="cost-info">
                    <span class="cost-desc">${p.name}</span>
                    <span class="cost-date">${p.type === 'resale' ? 'Venta Directa' : 'Receta'}</span>
                </div>
                <div class="cost-amount-block">
                    <span class="cost-amount">$${cost.toLocaleString()}</span>
                </div>
            </div>
        `;
    },

    calculateProductCost(p) {
        if (p.type === 'resale') {
            return (p.purchasePrice / p.purchaseQty) + (p.packaging || 0);
        }

        // Lógica de receta
        let recipeTotal = 0;
        p.ingredients.forEach(item => {
            const ing = state.ingredients.find(i => i.id === item.id);
            if (ing) {
                recipeTotal += (ing.purchasePrice / ing.purchaseQty) * item.usedQty;
            }
        });

        return recipeTotal / (p.yield || 1);
    },

    showIngredientModal() {
        const modal = document.getElementById('cost-modal');
        modal.querySelector('h3').textContent = "Nuevo Ingrediente";
        modal.querySelector('.modal-content').innerHTML = `
            <h3>Nuevo Ingrediente</h3>
            <input type="text" id="ing-name" placeholder="Nombre (ej. Harina)">
            <div style="display:flex; gap:10px; margin:15px 0">
                <input type="number" id="ing-price" placeholder="Precio ($)">
                <input type="number" id="ing-qty" placeholder="Cant. Compra">
            </div>
            <input type="text" id="ing-unit" placeholder="Unidad (KG, L, UN)">
            <button onclick="ui.saveNewIngredient()" class="primary-btn" style="margin-top:20px">Guardar</button>
            <button onclick="document.getElementById('cost-modal').style.display='none'" class="nav-item" style="width:100%; margin-top:15px">Cancelar</button>
        `;
        modal.style.display = 'flex';
    },

    saveNewIngredient() {
        const name = document.getElementById('ing-name').value;
        const price = document.getElementById('ing-price').value;
        const qty = document.getElementById('ing-qty').value;
        const unit = document.getElementById('ing-unit').value;

        if (name && price && qty) {
            store.addIngredient(name, price, qty, unit);
            document.getElementById('cost-modal').style.display = 'none';
        }
    }

    renderIngredients() {
        const container = document.getElementById('costs-list');
        document.querySelector('h2').textContent = "Biblioteca de Ingredientes";

        container.innerHTML = `
            <button class="primary-btn" onclick="ui.showIngredientModal()" style="margin-bottom:20px"> + Nuevo Ingrediente</button>
            ${state.ingredients.map(ing => `
                <div class="cost-item">
                    <div class="cost-info">
                        <span class="cost-desc">${ing.name}</span>
                        <span class="cost-date">$${ing.purchasePrice} x ${ing.purchaseQty}${ing.unit}</span>
                    </div>
                    <span class="cost-amount">$${(ing.purchasePrice / ing.purchaseQty).toFixed(2)} / ${ing.unit}</span>
                </div>
            `).join('')}
        `;
    },

    switchCategory(cat) {
        state.currentCategory = cat;
        state.view = 'dashboard';
        this.render();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Generar botones de categoría
    const header = document.querySelector('header');
    const catBar = document.createElement('div');
    catBar.className = 'category-bar';
    catBar.innerHTML = state.categories.map(c => `
        <button class="cat-btn ${c === state.currentCategory ? 'active' : ''}" onclick="ui.switchCategory('${c}')">${c}</button>
    `).join('');
    header.after(catBar);

    // Nav listeners
    const navItems = document.querySelectorAll('.nav-item');
    navItems[0].onclick = () => { state.view = 'dashboard'; ui.render(); };
    navItems[1].onclick = () => { state.view = 'ingredients'; ui.render(); };

    ui.render();
});
