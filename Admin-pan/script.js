// Manejo simple de navegación simulada por secciones
const content = document.getElementById('content');
const links = document.querySelectorAll('.sidebar a');

const products = [];
const sales = [];
const employees = [];

const sections = {
    dashboard: {
        title: 'Dashboard',
        html: (
            '<div class="cards-grid">'
            + '<div class="card">'
            +   '<h3>Ventas del día</h3>'
            +   '<p class="metric">$0.00</p>'
            +   '<p class="muted">Actualizado hace un momento</p>'
            + '</div>'
            + '<div class="card">'
            +   '<h3>Productos más vendidos</h3>'
            +   '<ul class="list">'
            +     '<li>Pan francés</li>'
            +     '<li>Conchas</li>'
            +     '<li>Cuernitos</li>'
            +   '</ul>'
            + '</div>'
            + '<div class="card">'
            +   '<h3>Empleados activos</h3>'
            +   '<p class="metric">0</p>'
            +   '<p class="muted">En turno</p>'
            + '</div>'
            + '<div class="card">'
            +   '<h3>Inventario bajo</h3>'
            +   '<p class="metric status-ok">Sin alertas</p>'
            +   '<p class="muted">Último chequeo hoy</p>'
            + '</div>'
            + '</div>'
        )
    },
    inventario: {
        title: 'Inventario',
        html: (
            '<div class="card">'
            +   '<h3>Inventario</h3>'
            +   '<form id="product-form" class="form">'
            +       '<div class="form-row">'
            +           '<label>Nombre<input required type="text" name="name" class="input" placeholder="Ej. Concha" /></label>'
            +           '<label>Precio<input required type="number" step="0.01" min="0" name="price" class="input" placeholder="Ej. 12.50" /></label>'
            +       '</div>'
            +       '<div class="form-row">'
            +           '<label>Cantidad<input required type="number" min="0" name="quantity" class="input" placeholder="Ej. 24" /></label>'
            +           '<label>Categoría<input required type="text" name="category" class="input" placeholder="Ej. Pan dulce" /></label>'
            +       '</div>'
            +       '<div class="form-actions">'
            +           '<button type="submit" class="btn">Agregar producto</button>'
            +       '</div>'
            +   '</form>'
            +   '<div class="table-wrap">'
            +       '<table class="table" id="products-table">'
            +           '<thead><tr>'
            +               '<th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Categoría</th>'
            +           '</tr></thead>'
            +           '<tbody></tbody>'
            +       '</table>'
            +   '</div>'
            + '</div>'
        )
    },
    ventas: {
        title: 'Ventas',
        html: (
            '<div class="card">'
            +   '<h3>Registro de ventas</h3>'
            +   '<form id="sales-form" class="form">'
            +       '<div class="form-row">'
            +           '<label>Producto<input required type="text" name="product" class="input" placeholder="Ej. Concha" /></label>'
            +           '<label>Cantidad<input required type="number" min="1" name="amount" class="input" placeholder="Ej. 2" /></label>'
            +       '</div>'
            +       '<div class="form-actions">'
            +           '<button type="submit" class="btn">Registrar venta</button>'
            +       '</div>'
            +   '</form>'
            +   '<div class="table-wrap">'
            +       '<ul id="sales-list" class="list" style="list-style: none; padding: 12px; margin: 0;"></ul>'
            +   '</div>'
            + '</div>'
        )
    },
    empleados: {
        title: 'Empleados',
        html: (
            '<div class="card">'
            +   '<h3>Empleados</h3>'
            +   '<form id="employee-form" class="form">'
            +       '<div class="form-row">'
            +           '<label>Nombre<input required type="text" name="name" class="input" placeholder="Ej. Juan Pérez" /></label>'
            +           '<label>Puesto<input required type="text" name="role" class="input" placeholder="Ej. Panadero" /></label>'
            +       '</div>'
            +       '<div class="form-actions">'
            +           '<button type="submit" class="btn">Agregar empleado</button>'
            +       '</div>'
            +   '</form>'
            +   '<div class="table-wrap">'
            +       '<table class="table" id="employees-table">'
            +           '<thead><tr>'
            +               '<th>Nombre</th><th>Puesto</th>'
            +           '</tr></thead>'
            +           '<tbody></tbody>'
            +       '</table>'
            +   '</div>'
            + '</div>'
        )
    },
    reportes: {
        title: 'Reportes',
        html: '<div class="card"><h3>Reportes</h3><p>Gráficas y estadísticas próximamente...</p></div>'
    }
};

function setActive(link) {
    links.forEach(a => a.classList.remove('active'));
    link.classList.add('active');
}

function renderSection(key) {
    const section = sections[key];
    if (!section) return;
    content.innerHTML = `<h2>${section.title}</h2>${section.html}`;
    if (key === 'inventario') {
        setupInventario();
    }
    if (key === 'ventas') {
        setupVentas();
    }
    if (key === 'empleados') {
        setupEmpleados();
    }
}

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const key = link.getAttribute('data-section');
        setActive(link);
        renderSection(key);
        history.pushState({ key }, '', `#${key}`);
    });
});

window.addEventListener('popstate', (e) => {
    const key = (e.state && e.state.key) || location.hash.replace('#','') || 'dashboard';
    const active = Array.from(links).find(a => a.getAttribute('data-section') === key);
    if (active) setActive(active);
    renderSection(key);
});

// Inicialización
const initialKey = location.hash.replace('#','') || 'dashboard';
const initialLink = Array.from(links).find(a => a.getAttribute('data-section') === initialKey) || links[0];
if (initialLink) setActive(initialLink);
renderSection(initialKey);

function setupInventario() {
    const form = document.getElementById('product-form');
    const tableBody = document.querySelector('#products-table tbody');

    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = products.map(p => (
            `<tr>`
            + `<td>${escapeHtml(p.name)}</td>`
            + `<td>$${Number(p.price).toFixed(2)}</td>`
            + `<td>${Number(p.quantity)}</td>`
            + `<td>${escapeHtml(p.category)}</td>`
            + `</tr>`
        )).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const price = parseFloat(String(data.get('price') || '0'));
        const quantity = parseInt(String(data.get('quantity') || '0'), 10);
        const category = String(data.get('category') || '').trim();

        if (!name || !category || isNaN(price) || isNaN(quantity)) {
            return;
        }

        products.push({ name, price, quantity, category });
        form.reset();
        renderTable();
    });

    renderTable();
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function setupVentas() {
    const form = document.getElementById('sales-form');
    const list = document.getElementById('sales-list');

    function renderSales() {
        if (!list) return;
        list.innerHTML = sales.map(s => (
            `<li>Venta: ${Number(s.amount)} x ${escapeHtml(s.product)}</li>`
        )).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const product = String(data.get('product') || '').trim();
        const amount = parseInt(String(data.get('amount') || '1'), 10);
        if (!product || isNaN(amount) || amount < 1) {
            return;
        }
        sales.push({ product, amount });
        form.reset();
        renderSales();
    });

    renderSales();
}

function setupEmpleados() {
    const form = document.getElementById('employee-form');
    const tableBody = document.querySelector('#employees-table tbody');

    function renderEmployees() {
        if (!tableBody) return;
        tableBody.innerHTML = employees.map(e => (
            `<tr>`
            + `<td>${escapeHtml(e.name)}</td>`
            + `<td>${escapeHtml(e.role)}</td>`
            + `</tr>`
        )).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const role = String(data.get('role') || '').trim();
        if (!name || !role) {
            return;
        }
        employees.push({ name, role });
        form.reset();
        renderEmployees();
    });

    renderEmployees();
}

