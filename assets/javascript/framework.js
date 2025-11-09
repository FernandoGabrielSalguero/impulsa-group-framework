/* =========================================================
   Success UI Framework v2.0 (js)
   - Utilidades DOM y componentes base
   - Limpieza de duplicados y comentarios exhaustivos
   ========================================================= */

// Utilidad: atajo de selectores
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* ---------- Sidebar / Navbar ---------- */
function toggleSidebar() {
    const sidebar = $('#sidebar');
    const toggleIcon = $('#collapseIcon');
    const isMobile = window.innerWidth <= 768;

    if (!sidebar) return;

    if (isMobile) {
        sidebar.classList.toggle('open');
        // En mobile, no cambiamos ícono de colapso lateral (se oculta off-canvas)
    } else {
        sidebar.classList.toggle('collapsed');
        if (toggleIcon) {
            toggleIcon.textContent = sidebar.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';
        }
        const btn = sidebar.querySelector('.sidebar-footer .btn-icon');
        if (btn) btn.setAttribute('aria-expanded', !sidebar.classList.contains('collapsed'));
    }
}

/* ---------- Modal ---------- */
function openModal() { $('#modal')?.classList.remove('hidden'); }
function closeModal() { $('#modal')?.classList.add('hidden'); }

/* ---------- Spinner global ---------- */
function showSpinner() { $('#globalSpinner')?.classList.remove('hidden'); }
function hideSpinner() { $('#globalSpinner')?.classList.add('hidden'); }

/* ---------- Tabs ---------- */
function initTabs() {
    const tabButtons = $$('.tab-button');
    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // activar botón
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // mostrar contenido
            const contents = $$('.tab-content');
            contents.forEach(content => content.classList.toggle('active', content.id === tabId));
        });
    });
}

/* ---------- Input Icons + validaciones mínimas ---------- */
function initInputIcons() {
    const mappings = {
        "input-icon-name": "person",
        "input-icon-dni": "badge",
        "input-icon-age": "hourglass_bottom",
        "input-icon-email": "mail",
        "input-icon-phone": "phone",
        "input-icon-date": "event",
        "input-icon-address": "home",
        "input-icon-cuit": "badge",
        "input-icon-cp": "markunread_mailbox",
        "input-icon-globe": "public",
        "input-icon-city": "location_city",
        "input-icon-comment": "comment"
    };

    $$('.input-icon').forEach(wrapper => {
        const input = wrapper.querySelector('input, select, textarea');
        if (!input) return;

        // Insertar ícono si no existe
        if (!wrapper.querySelector('span.material-icons')) {
            const icon = document.createElement('span');
            icon.classList.add('material-icons');
            for (const cls in mappings) {
                if (wrapper.classList.contains(cls)) icon.textContent = mappings[cls];
            }
            if (!icon.textContent) icon.textContent = 'input';
            wrapper.prepend(icon);
        }

        // Atributos por tipo
        if (wrapper.classList.contains('input-icon-dni')) {
            input.type = 'text';
            input.maxLength = 8;
            input.pattern = '^[0-9]{7,8}$';
            input.inputMode = 'numeric';
            input.required = true;
        }
        if (wrapper.classList.contains('input-icon-age')) {
            input.type = 'number'; input.min = '0'; input.max = '120'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-name')) {
            input.type = 'text'; input.minLength = 2; input.maxLength = 60; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-email')) {
            input.type = 'email'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-phone')) {
            input.type = 'tel'; input.pattern = '[0-9\\+\\-\\s]{7,20}'; input.inputMode = 'tel'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-date')) {
            input.type = 'date'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-cuit')) {
            input.type = 'text'; input.pattern = '^[0-9]{2}-[0-9]{8}-[0-9]{1}$'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-cp')) {
            input.type = 'text'; input.pattern = '^[0-9]{4,6}$'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-address')) {
            input.type = 'text'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-city')) {
            input.type = 'text'; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-comment')) {
            input.maxLength = 233; input.required = true;
        }
        if (wrapper.classList.contains('input-icon-globe')) {
            input.required = true;
        }
    });
}

/* ---------- Contador de caracteres en <textarea> ---------- */
function initTextareaCounters() {
    $$('textarea[maxlength]').forEach(textarea => {
        const id = textarea.id;
        const max = parseInt(textarea.getAttribute('maxlength'), 10);
        const counter = document.querySelector(`.char-count[data-for="${id}"]`);
        if (!counter) return;

        const updateCount = () => {
            const currentLength = textarea.value.length;
            const remaining = max - currentLength;
            counter.textContent = `Quedan ${remaining} caracteres.`;
            counter.classList.toggle('warning', remaining <= 20);
        };

        textarea.addEventListener('input', updateCount);
        updateCount();
    });
}

/* ---------- Habilitar botón de publicación si el formulario está completo ---------- */
function initPublicacionButton() {
    const form = $('#form-publicacion');
    const btn = $('#btn-guardar');
    if (!form || !btn) return;

    const camposRequeridos = form.querySelectorAll('[required]');

    const validarCampos = () => {
        const completo = Array.from(camposRequeridos).every(campo => campo.value.trim());
        btn.disabled = !completo;
        btn.classList.toggle('btn-disabled', !completo);
        btn.classList.toggle('btn-aceptar', completo);
        btn.textContent = completo ? 'Publicar' : 'Completar datos...';
    };

    form.addEventListener('input', validarCampos);
    validarCampos();
}

/* ---------- Acordeón simple ---------- */
function toggleAccordion(element) {
    const body = element.nextElementSibling;
    const isOpen = body.style.display === 'block';
    body.style.display = isOpen ? 'none' : 'block';
    element.setAttribute('aria-expanded', String(!isOpen));
}

/* ---------- Smart selector (filtro interno) ---------- */
function initSmartSelectors() {
    $$('.smart-selector').forEach(selector => {
        const input = selector.querySelector('.smart-selector-search');
        const options = selector.querySelectorAll('.smart-selector-list label');
        if (!input || !options.length) return;

        input.addEventListener('input', () => {
            const search = input.value.toLowerCase();
            options.forEach(label => {
                const text = label.textContent.toLowerCase();
                label.style.display = text.includes(search) ? 'flex' : 'none';
            });
        });
    });
}

/* ---------- Alertas / Toasts ---------- */
function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `floating-alert ${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 6000);
}

function showToast(type = 'info', message = 'Mensaje') {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function showToastBoton(type = 'info', message = 'Mensaje') {
    const container = $('#toast-container-boton');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-boton ${type}`;
    toast.innerHTML = `
    <button class="toast-close material-icons" aria-label="Cerrar notificación">close</button>
    <span>${message}</span>
  `;
    toast.querySelector('.toast-close')?.addEventListener('click', () => toast.remove());
    container.appendChild(toast);
}

/* ---------- Categorías con subniveles ---------- */
function toggleSubcategorias(btn) {
    const all = $$('.subcategorias');
    all.forEach(ul => { if (ul !== btn.nextElementSibling) ul.style.display = 'none'; });

    const sub = btn.nextElementSibling;
    const isOpen = sub.style.display === 'block';
    sub.style.display = isOpen ? 'none' : 'block';
    btn.setAttribute('aria-expanded', String(!isOpen));
}

/* ---------- Inicialización global ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initInputIcons();
    initTextareaCounters();
    initPublicacionButton();
    initSmartSelectors();
    initDropdownMulti();
});


/* ---------- Dropdown multiselección con checkboxes ---------- */
/**
 * Estructura esperada:
 * <div class="dropdown dropdown-multi" data-name="frutas">
 *   <button class="dropdown-toggle">...</button>
 *   <input type="hidden" name="frutas">
 *   <div class="dropdown-panel">
 *     <label class="dropdown-option"><input type="checkbox" value="..."><span>Texto</span></label>
 *     ...
 *   </div>
 * </div>
 */
function initDropdownMulti() {
    const dropdowns = $$('.dropdown.dropdown-multi');
    if (!dropdowns.length) return;

    // Cierre global al clickear fuera
    document.addEventListener('click', (ev) => {
        dropdowns.forEach(dd => {
            if (!dd.contains(ev.target)) {
                dd.classList.remove('open');
                const btn = dd.querySelector('.dropdown-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    dropdowns.forEach(dd => {
        const btn = dd.querySelector('.dropdown-toggle');
        const hidden = dd.querySelector('input[type="hidden"]');
        const checks = dd.querySelectorAll('.dropdown-option input[type="checkbox"]');

        if (!btn || !hidden || !checks.length) return;

        // Abrir/cerrar panel
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dd.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(isOpen));
        });

        // Actualizar etiqueta y valor serializado (CSV)
        const refresh = () => {
            const values = Array.from(checks)
                .filter(c => c.checked)
                .map(c => c.value.trim());
            hidden.value = values.join(',');
            btn.textContent = values.length ? values.join(', ') : 'Seleccioná frutas';
        };

        checks.forEach(c => c.addEventListener('change', refresh));
        // Estado inicial
        refresh();
    });
}
