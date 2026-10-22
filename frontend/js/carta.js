// Frontend de la carta de platos (tarea T2.2.3).
const $ = (id) => document.getElementById(id);
const form = $("form-plato");
let categorias = [];

const formatoPrecio = (n) => "$ " + Number(n).toLocaleString("es-AR", { maximumFractionDigits: 2 });

async function api(url, opciones = {}) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opciones });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw datos;
  return datos;
}

function avisar(texto) {
  const a = $("aviso");
  a.textContent = texto; a.hidden = false;
  clearTimeout(avisar.t); avisar.t = setTimeout(() => (a.hidden = true), 2500);
}

function mostrarErrores(lista) {
  const caja = $("errores");
  if (!lista || !lista.length) { caja.hidden = true; caja.innerHTML = ""; return; }
  caja.innerHTML = lista.map((e) => `<div>• ${e}</div>`).join("");
  caja.hidden = false;
}

function esc(t) {
  return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function cargarCategorias() {
  categorias = await api("/api/categorias");
  $("categoria").innerHTML = '<option value="">Elegí una categoría</option>' +
    categorias.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join("");
}

async function cargarCarta() {
  const todos = $("ver-todos").checked ? "?todos=1" : "";
  const grupos = await api("/api/carta" + todos);
  const html = grupos.filter((g) => g.platos.length).map((g) => `
    <div class="categoria">
      <h3>${esc(g.categoria.nombre)}</h3>
      ${g.platos.map((p) => `
        <div class="plato ${p.activo ? "" : "inactivo"}" data-id="${p.id}">
          <div>
            <div class="nombre">${esc(p.nombre)}${p.activo ? "" : '<span class="etiqueta">Desactivado</span>'}</div>
            ${p.descripcion ? `<div class="desc">${esc(p.descripcion)}</div>` : ""}
          </div>
          <div class="botones">
            <span class="precio">${formatoPrecio(p.precio)}</span>
            <button class="btn chico" data-accion="editar">Editar</button>
            <button class="btn chico" data-accion="${p.activo ? "desactivar" : "activar"}">${p.activo ? "Desactivar" : "Activar"}</button>
          </div>
        </div>`).join("")}
    </div>`).join("");
  $("carta").innerHTML = html || '<p class="vacio">No hay platos cargados.</p>';
  $("carta").platos = grupos.flatMap((g) => g.platos);
}

function limpiarFormulario() {
  form.reset(); $("plato-id").value = "";
  $("titulo-form").textContent = "Nuevo plato";
  $("btn-guardar").textContent = "Agregar plato";
  $("btn-cancelar").hidden = true;
  mostrarErrores([]);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("plato-id").value;
  const datos = {
    nombre: $("nombre").value,
    categoria_id: $("categoria").value,
    descripcion: $("descripcion").value,
    precio: $("precio").value,
  };
  try {
    if (id) await api(`/api/platos/${id}`, { method: "PUT", body: JSON.stringify(datos) });
    else await api("/api/platos", { method: "POST", body: JSON.stringify(datos) });
    avisar(id ? "Plato modificado" : "Plato agregado a la carta");
    limpiarFormulario();
    await cargarCarta();
  } catch (err) {
    mostrarErrores(err.errores || [err.error || "No se pudo guardar el plato."]);
  }
});

$("btn-cancelar").addEventListener("click", limpiarFormulario);
$("ver-todos").addEventListener("change", cargarCarta);

$("carta").addEventListener("click", async (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;
  const id = boton.closest(".plato").dataset.id;
  const accion = boton.dataset.accion;
  if (accion === "editar") {
    const p = $("carta").platos.find((x) => String(x.id) === id);
    $("plato-id").value = p.id; $("nombre").value = p.nombre; $("categoria").value = p.categoriaId;
    $("descripcion").value = p.descripcion; $("precio").value = p.precio;
    $("titulo-form").textContent = "Editar plato"; $("btn-guardar").textContent = "Guardar cambios";
    $("btn-cancelar").hidden = false; mostrarErrores([]);
    $("nombre").focus();
    return;
  }
  if (accion === "desactivar" && !confirm("¿Desactivar este plato? Dejará de aparecer en la carta.")) return;
  await api(`/api/platos/${id}/${accion}`, { method: "PATCH" });
  avisar(accion === "desactivar" ? "Plato desactivado" : "Plato activado");
  await cargarCarta();
});

(async () => {
  try {
    await cargarCategorias();
    await cargarCarta();
  } catch {
    $("carta").innerHTML = '<p class="vacio">No se pudo conectar con el servidor.</p>';
  }
})();
