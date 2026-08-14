document.addEventListener("DOMContentLoaded", function () {
  /* ------------------------------------------
     Calculadora de servicios
     ------------------------------------------
     Estima el precio (en USD) de un proyecto según:
       1. Tipo base: Landing Page / Portafolio / E-commerce
       2. + un monto fijo por cada página adicional
       3. + un monto fijo por cada integración extra
          (WhatsApp, pagos, formularios, etc.)
       4. + un monto fijo si necesita panel de administración
       5. (solo e-commerce) + un monto según la cantidad de
          productos a cargar, por tramos

     👉 Todos los precios están en 0 a propósito — reemplázalos
     por tus tarifas reales en el objeto PRECIOS de abajo.
  ------------------------------------------ */
  const PRECIOS = {
    base: {
      landing: 30,
      portafolio: 50,
      ecommerce: 80,
    },
    porPaginaExtra: 5,
    // Precio por cada integración seleccionada. Puedes darle otro
    // valor distinto a cada una según su complejidad real.
    integraciones: {
      whatsapp: 2,
      instagram: 2,
      pagos: 2,
      soporte: 2,
      blog: 2,
      foro: 2,
      galeria: 2,
    },
    panelAdmin: 30,
    // Tramos de productos para e-commerce: se usa el primer tramo
    // cuya cantidad "hasta" sea mayor o igual a los productos ingresados.
    tramosProductos: [
      { hasta: 20, costo: 30 },
      { hasta: 50, costo: 50 },
      { hasta: 100, costo: 80 },
      { hasta: Infinity, costo: 105 },
    ],
  };

  // 👉 Número de WhatsApp donde llegarán los estimados (formato
  // internacional, sin "+", sin espacios ni guiones).
  const WHATSAPP_NUMERO = "584129526003";

  // Etiquetas legibles para armar el mensaje de WhatsApp.
  const ETIQUETAS_TIPO = {
    landing: "Landing Page",
    portafolio: "Portafolio",
    ecommerce: "E-commerce",
  };

  const ETIQUETAS_INTEGRACIONES = {
    whatsapp: "Chat de WhatsApp",
    instagram: "Perfil de Instagram",
    pagos: "Sistema de pagos",
    soporte: "Chat de soporte",
    blog: "Blog",
    foro: "Foro",
    galeria: "Galería de imágenes",
  };

  const calcForm = document.getElementById("calcForm");
  const calcTipo = document.getElementById("calcTipo");
  const calcProductosField = document.getElementById("calcProductosField");
  const calcProductosInput = document.getElementById("calcProductos");
  const calcResult = document.getElementById("calcResult");
  const calcResultValue = document.getElementById("calcResultValue");
  const calcResultHint = document.getElementById("calcResultHint");
  const calcWhatsappBtn = document.getElementById("calcWhatsappBtn");

  if (calcForm) {
    // Muestra el campo de "cantidad de productos" solo si el tipo es
    // e-commerce, y lo limpia para cualquier otro tipo.
    calcTipo.addEventListener("change", () => {
      const esEcommerce = calcTipo.value === "ecommerce";
      calcProductosField.hidden = !esEcommerce;

      if (!esEcommerce) {
        calcProductosInput.value = 0;
      }
    });

    function costoPorProductos(cantidad) {
      const tramo = PRECIOS.tramosProductos.find((t) => cantidad <= t.hasta);
      return tramo ? tramo.costo : 0;
    }

    function costoPorIntegraciones(seleccionadas) {
      return seleccionadas.reduce(
        (total, valor) => total + (PRECIOS.integraciones[valor] || 0),
        0,
      );
    }

    function calcularEstimado({
      tipo,
      paginasExtra,
      integraciones,
      admin,
      productos,
    }) {
      let total = PRECIOS.base[tipo] || 0;

      total += paginasExtra * PRECIOS.porPaginaExtra;
      total += costoPorIntegraciones(integraciones);

      if (admin) total += PRECIOS.panelAdmin;

      if (tipo === "ecommerce") {
        total += costoPorProductos(productos);
      }

      return total;
    }

    // Arma el texto del mensaje con todos los campos del formulario
    // y el total, listo para enviar por WhatsApp.
    function construirMensajeWhatsapp(datos, total) {
      const lineas = [];

      lineas.push("Hola Tony, quiero consultarte sobre este estimado:");
      lineas.push("");
      lineas.push(
        `Tipo de proyecto: ${ETIQUETAS_TIPO[datos.tipo] || datos.tipo}`,
      );
      lineas.push(`Páginas adicionales: ${datos.paginasExtra}`);

      if (datos.tipo === "ecommerce") {
        lineas.push(`Cantidad de productos: ${datos.productos}`);
      }

      const integracionesTexto = datos.integraciones.length
        ? datos.integraciones
            .map((valor) => ETIQUETAS_INTEGRACIONES[valor] || valor)
            .join(", ")
        : "Ninguna";
      lineas.push(`Integraciones: ${integracionesTexto}`);

      lineas.push(`Panel de administración: ${datos.admin ? "Sí" : "No"}`);

      if (datos.requerimientos) {
        lineas.push("");
        lineas.push(`Requerimientos extras: ${datos.requerimientos}`);
      }

      lineas.push("");
      lineas.push(`Inversión estimada: $${total.toLocaleString("es")} USD`);

      return lineas.join("\n");
    }

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const datos = {
        tipo: calcTipo.value,
        paginasExtra:
          parseInt(document.getElementById("calcPaginasExtra").value, 10) || 0,
        integraciones: Array.from(
          document.querySelectorAll(
            '#calcIntegracionesGrid input[name="integraciones"]:checked',
          ),
        ).map((checkbox) => checkbox.value),
        admin: document.getElementById("calcAdmin").checked,
        productos:
          parseInt(document.getElementById("calcProductos").value, 10) || 0,
        requerimientos: document
          .getElementById("calcRequerimientos")
          .value.trim(),
      };

      if (!datos.tipo) {
        calcResult.hidden = false;
        calcResultValue.textContent = "—";
        calcResultHint.textContent = "Selecciona un tipo de proyecto.";
        calcWhatsappBtn.hidden = true;
        return;
      }

      const total = calcularEstimado(datos);

      calcResult.hidden = false;
      calcResultValue.textContent = `$${total.toLocaleString("es")} USD`;
      calcResultHint.textContent =
        "Estimado de referencia. La cotización final puede variar según el alcance real del proyecto.";

      const mensaje = construirMensajeWhatsapp(datos, total);
      calcWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
        mensaje,
      )}`;
      calcWhatsappBtn.hidden = false;

      calcResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
});
