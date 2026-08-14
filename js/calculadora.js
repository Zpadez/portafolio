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
    // Precio por cada integración seleccionada. Puedes darle un
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

  const calcForm = document.getElementById("calcForm");
  const calcTipo = document.getElementById("calcTipo");
  const calcProductosField = document.getElementById("calcProductosField");
  const calcProductosInput = document.getElementById("calcProductos");
  const calcResult = document.getElementById("calcResult");
  const calcResultValue = document.getElementById("calcResultValue");
  const calcResultHint = document.getElementById("calcResultHint");

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
        0
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

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const datos = {
        tipo: calcTipo.value,
        paginasExtra:
          parseInt(document.getElementById("calcPaginasExtra").value, 10) || 0,
        integraciones: Array.from(
          document.querySelectorAll(
            '#calcIntegracionesGrid input[name="integraciones"]:checked'
          )
        ).map((checkbox) => checkbox.value),
        admin: document.getElementById("calcAdmin").checked,
        productos:
          parseInt(document.getElementById("calcProductos").value, 10) || 0,
      };

      if (!datos.tipo) {
        calcResult.hidden = false;
        calcResultValue.textContent = "—";
        calcResultHint.textContent = "Selecciona un tipo de proyecto.";
        return;
      }

      const total = calcularEstimado(datos);

      calcResult.hidden = false;
      calcResultValue.textContent = `$${total.toLocaleString("es")} USD`;
      calcResultHint.textContent =
        "Estimado de referencia. La cotización final puede variar según el alcance real del proyecto.";
      calcResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
});
