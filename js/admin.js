document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     CONFIGURACIÓN
     ⚠️ Esto es protección básica del lado del cliente,
     no seguridad real: cualquiera con acceso al código
     fuente puede ver esta contraseña. Sirve para evitar
     que un visitante casual entre por error, no para
     proteger datos sensibles de verdad.
  ============================================ */
  const ADMIN_PASSWORD = 'cambia-esta-clave';
  const STORAGE_KEY = 'tony_admin_facturas';
  const COUNTER_KEY = 'tony_admin_factura_counter';
  const SESSION_KEY = 'tony_admin_session';

  /* ============================================
     ELEMENTOS
  ============================================ */
  const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');
  const loginStatus = document.getElementById('loginStatus');

  const adminPanel = document.getElementById('adminPanel');
  const logoutBtn = document.getElementById('logoutBtn');

  const invoiceForm = document.getElementById('invoiceForm');
  const invoiceStatus = document.getElementById('invoiceStatus');
  const invoiceTableBody = document.getElementById('invoiceTableBody');
  const emptyState = document.getElementById('emptyState');

  const fFecha = document.getElementById('fFecha');

  const printView = document.getElementById('invoicePrintView');
  const printBtn = document.getElementById('printBtn');
  const closePrintBtn = document.getElementById('closePrintBtn');

  /* ============================================
     LOGIN / SESIÓN
  ============================================ */
  function mostrarPanel() {
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    renderInvoices();
  }

  function mostrarLogin() {
    adminPanel.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  }

  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    mostrarPanel();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loginPassword.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      loginStatus.textContent = '';
      loginForm.reset();
      mostrarPanel();
    } else {
      loginStatus.textContent = 'Contraseña incorrecta.';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    mostrarLogin();
  });

  /* ============================================
     UTILIDADES DE DATOS
  ============================================ */
  function getFacturas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function guardarFacturas(facturas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facturas));
  }

  function siguienteNumero() {
    const actual = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
    const siguiente = actual + 1;
    localStorage.setItem(COUNTER_KEY, String(siguiente));
    return String(siguiente).padStart(4, '0');
  }

  function formatoMoneda(monto, codigo) {
    const numero = Number(monto).toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${codigo} ${numero}`;
  }

  /* ============================================
     FORMULARIO — CREAR FACTURA
  ============================================ */
  fFecha.valueAsDate = new Date();

  invoiceForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const factura = {
      numero: siguienteNumero(),
      fecha: document.getElementById('fFecha').value,
      cliente: document.getElementById('fCliente').value.trim(),
      marca: document.getElementById('fMarca').value.trim(),
      plan: document.getElementById('fPlan').value,
      montoUsd: parseFloat(document.getElementById('fMontoUsd').value),
      moneda: document.getElementById('fMoneda').value,
      montoLocal: parseFloat(document.getElementById('fMontoLocal').value),
    };

    const facturas = getFacturas();
    facturas.unshift(factura);
    guardarFacturas(facturas);

    invoiceStatus.textContent = `Factura N.º ${factura.numero} guardada.`;
    invoiceForm.reset();
    fFecha.valueAsDate = new Date();

    renderInvoices();
  });

  /* ============================================
     TABLA — LISTAR / ELIMINAR / VER FACTURAS
  ============================================ */
  function renderInvoices() {
    const facturas = getFacturas();
    invoiceTableBody.innerHTML = '';

    emptyState.classList.toggle('hidden', facturas.length > 0);

    facturas.forEach((factura, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${factura.numero}</td>
        <td>${factura.fecha}</td>
        <td>${escapeHtml(factura.cliente)}</td>
        <td>${escapeHtml(factura.marca)}</td>
        <td>${escapeHtml(factura.plan)}</td>
        <td>${formatoMoneda(factura.montoUsd, 'USD')}</td>
        <td>${formatoMoneda(factura.montoLocal, factura.moneda)}</td>
        <td class="row-actions">
          <button class="icon-btn" data-action="ver" data-index="${index}">Ver</button>
          <button class="icon-btn" data-action="pdf" data-index="${index}">PDF</button>
          <button class="icon-btn icon-btn--danger" data-action="eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;

      invoiceTableBody.appendChild(tr);
    });
  }

  function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  invoiceTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const index = parseInt(btn.dataset.index, 10);
    const facturas = getFacturas();
    const factura = facturas[index];
    if (!factura) return;

    if (btn.dataset.action === 'eliminar') {
      const confirmar = confirm(`¿Eliminar la factura N.º ${factura.numero}?`);
      if (confirmar) {
        facturas.splice(index, 1);
        guardarFacturas(facturas);
        renderInvoices();
      }
    }

    if (btn.dataset.action === 'ver') {
      mostrarVistaImprimible(factura);
    }

    if (btn.dataset.action === 'pdf') {
      descargarFacturaPDF(factura);
    }
  });

  /* ============================================
     DESCARGA DIRECTA DE PDF (sin abrir vista previa)
  ============================================ */
  function descargarFacturaPDF(factura) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('TONY.dev', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Desarrollo web', 20, 31);

    doc.setFontSize(10);
    doc.text(`Factura N.º ${factura.numero}`, 150, 25);
    doc.text(`Fecha: ${factura.fecha}`, 150, 31);

    doc.setDrawColor(200);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text('CLIENTE', 20, 50);
    doc.text('MARCA', 110, 50);

    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.setFont('helvetica', 'bold');
    doc.text(factura.cliente, 20, 57);
    doc.text(factura.marca, 110, 57);

    doc.setDrawColor(230);
    doc.line(20, 70, 190, 70);

    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.setFont('helvetica', 'normal');
    doc.text('CONCEPTO', 20, 80);
    doc.text('MONTO USD', 110, 80);
    doc.text('MONTO LOCAL', 150, 80);

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Plan ${factura.plan}`, 20, 88);
    doc.text(formatoMoneda(factura.montoUsd, 'USD'), 110, 88);
    doc.text(formatoMoneda(factura.montoLocal, factura.moneda), 150, 88);

    doc.setDrawColor(230);
    doc.line(20, 95, 190, 95);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Gracias por confiar en TONY.dev', 20, 280);

    doc.save(`factura-${factura.numero}.pdf`);
  }

  /* ============================================
     VISTA IMPRIMIBLE
  ============================================ */
  function mostrarVistaImprimible(factura) {
    document.getElementById('pvNumero').textContent = factura.numero;
    document.getElementById('pvFecha').textContent = factura.fecha;
    document.getElementById('pvCliente').textContent = factura.cliente;
    document.getElementById('pvMarca').textContent = factura.marca;
    document.getElementById('pvPlan').textContent = factura.plan;
    document.getElementById('pvMontoUsd').textContent = formatoMoneda(factura.montoUsd, 'USD');
    document.getElementById('pvMontoLocal').textContent = formatoMoneda(factura.montoLocal, factura.moneda);

    printView.classList.remove('hidden');
  }

  closePrintBtn.addEventListener('click', () => {
    printView.classList.add('hidden');
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });

});
