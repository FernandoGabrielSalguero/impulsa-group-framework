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

/* ---------- Input Icons + validaciones mínimas (DRY) ---------- */
function initInputIcons() {
    const config = {
        "input-icon-name": { icon: "person", attrs: { type: "text", minLength: 2, maxLength: 60, required: true } },
        "input-icon-dni": { icon: "badge", attrs: { type: "text", maxLength: 8, pattern: '^[0-9]{7,8}$', inputMode: 'numeric', required: true } },
        "input-icon-age": { icon: "hourglass_bottom", attrs: { type: "number", min: "0", max: "120", required: true } },
        "input-icon-email": { icon: "mail", attrs: { type: "email", required: true } },
        "input-icon-phone": { icon: "phone", attrs: { type: "tel", pattern: '[0-9\\+\\-\\s]{7,20}', inputMode: 'tel', required: true } },
        "input-icon-date": { icon: "event", attrs: { type: "date", required: true } },
        "input-icon-address": { icon: "home", attrs: { type: "text", required: true } },
        "input-icon-cuit": { icon: "badge", attrs: { type: "text", pattern: '^[0-9]{2}-[0-9]{8}-[0-9]{1}$', required: true } },
        "input-icon-cp": { icon: "markunread_mailbox", attrs: { type: "text", pattern: '^[0-9]{4,6}$', required: true } },
        "input-icon-globe": { icon: "public", attrs: { required: true } },
        "input-icon-city": { icon: "location_city", attrs: { type: "text", required: true } },
        "input-icon-comment": { icon: "comment", attrs: { maxLength: 233, required: true } }
    };

    $$('.input-icon').forEach(wrapper => {
        const input = wrapper.querySelector('input, select, textarea');
        if (!input) return;

        // Detectar configuración por clase
        let cfg;
        for (const cls in config) {
            if (wrapper.classList.contains(cls)) { cfg = config[cls]; break; }
        }

        // Insertar ícono si corresponde
        if (!wrapper.querySelector('span.material-icons')) {
            const iconEl = document.createElement('span');
            iconEl.classList.add('material-icons');
            iconEl.textContent = cfg?.icon || 'input';
            wrapper.prepend(iconEl);
        }

        // Aplicar atributos declarativos
        if (cfg && cfg.attrs) {
            Object.entries(cfg.attrs).forEach(([k, v]) => {
                if (v === true) input.setAttribute(k, '');
                else input.setAttribute(k, String(v));
            });
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

/* ---------- Acordeón simple (sin estilos inline) ---------- */
function toggleAccordion(element) {
    const container = element.closest('.accordion');
    if (!container) return;
    const isOpen = container.classList.toggle('open');
    element.setAttribute('aria-expanded', String(isOpen));
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

    // Remoción más robusta: esperar fin de animación CSS
    toast.addEventListener('animationend', (e) => {
        if (e.animationName === 'fadeOut') toast.remove();
    });

    container.appendChild(toast);
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

/* ---------- Categorías con subniveles (sin estilos inline) ---------- */
function toggleSubcategorias(btn) {
    const all = $$('.subcategorias');
    all.forEach(ul => { if (ul !== btn.nextElementSibling) ul.classList.remove('open'); });

    const sub = btn.nextElementSibling;
    const isOpen = sub.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
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
/* Sin cambios de API pública; micro-optimizaciones y cierre global */
function initDropdownMulti() {
    const dropdowns = $$('.dropdown.dropdown-multi');
    if (!dropdowns.length) return;

    document.addEventListener('click', (ev) => {
        dropdowns.forEach(dd => {
            if (!dd.contains(ev.target)) {
                dd.classList.remove('open');
                dd.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
        });
    });

    dropdowns.forEach(dd => {
        const btn = dd.querySelector('.dropdown-toggle');
        const hidden = dd.querySelector('input[type="hidden"]');
        const checks = dd.querySelectorAll('.dropdown-option input[type="checkbox"]');
        if (!btn || !hidden || !checks.length) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dd.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(isOpen));
        });

        const refresh = () => {
            const values = [];
            checks.forEach(c => { if (c.checked) values.push(c.value.trim()); });
            hidden.value = values.join(',');
            btn.textContent = values.length ? values.join(', ') : 'Seleccioná frutas';
        };

        checks.forEach(c => c.addEventListener('change', refresh));
        refresh();
    });
}

