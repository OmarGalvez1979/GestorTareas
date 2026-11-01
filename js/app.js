// Gestor de tareas - Etapa 7: persistencia con localStorage

const CLAVE = 'gestor_tareas';

let tareas = [];
let idEditando = null;
let filtroActual = 'todas';

// Elementos del HTML
const formulario = document.getElementById('formulario');
const inputTitulo = document.getElementById('titulo');
const selectPrioridad = document.getElementById('prioridad');
const botonGuardar = document.getElementById('btn-guardar');
const mensajeError = document.getElementById('error');
const lista = document.getElementById('lista');
const inputBuscar = document.getElementById('buscar');
const botonesFiltro = document.querySelectorAll('.filtros button');
const selectOrden = document.getElementById('orden');
const totalTexto = document.getElementById('total');
const pendientesTexto = document.getElementById('pendientes');
const completadasTexto = document.getElementById('completadas');

// Se llama después de cada cambio en las tareas
function actualizar() {
  mostrarTareas();
  actualizarDashboard();
  guardarTareas();
}

// ---------- Mostrar tareas ----------

// Devuelve las tareas según el filtro y la búsqueda
function obtenerTareasVisibles() {
  const texto = inputBuscar.value.toLowerCase();

  return tareas.filter((tarea) => {
    if (filtroActual === 'pendientes' && tarea.completada) return false;
    if (filtroActual === 'completadas' && !tarea.completada) return false;
    return tarea.titulo.toLowerCase().includes(texto);
  });
}

// Ordena el arreglo según la opción elegida
const pesoPrioridad = { Alta: 1, Media: 2, Baja: 3 };

function ordenarTareas(arreglo) {
  if (selectOrden.value === 'prioridad') {
    arreglo.sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad]);
  } else if (selectOrden.value === 'antiguas') {
    arreglo.sort((a, b) => a.fecha - b.fecha);
  } else {
    arreglo.sort((a, b) => b.fecha - a.fecha);
  }
}

function mostrarTareas() {
  const visibles = obtenerTareasVisibles();
  ordenarTareas(visibles);
  lista.innerHTML = '';

  if (visibles.length === 0) {
    lista.innerHTML = '<li>No hay tareas para mostrar.</li>';
    return;
  }

  visibles.forEach((tarea) => {
    const li = document.createElement('li');
    if (tarea.completada) {
      li.classList.add('completada');
    }

    li.innerHTML = `
      <input type="checkbox" ${tarea.completada ? 'checked' : ''}>
      <span class="titulo">${tarea.titulo}</span>
      <span class="prioridad ${tarea.prioridad}">${tarea.prioridad}</span>
      <button class="btn-editar">Editar</button>
      <button class="btn-eliminar">Eliminar</button>`;

    li.querySelector('input').addEventListener('change', () => cambiarEstado(tarea.id));
    li.querySelector('.btn-editar').addEventListener('click', () => editarTarea(tarea.id));
    li.querySelector('.btn-eliminar').addEventListener('click', () => eliminarTarea(tarea.id));

    lista.appendChild(li);
  });
}

// ---------- Dashboard ----------

function actualizarDashboard() {
  const completadas = tareas.filter((tarea) => tarea.completada).length;

  totalTexto.textContent = tareas.length;
  completadasTexto.textContent = completadas;
  pendientesTexto.textContent = tareas.length - completadas;
}

// ---------- Crear, editar, completar y eliminar ----------

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();
  const prioridad = selectPrioridad.value;

  // Validación de campos vacíos
  if (titulo === '' || prioridad === '') {
    mensajeError.textContent = 'Completa el título y la prioridad.';
    return;
  }
  mensajeError.textContent = '';

  if (idEditando === null) {
    tareas.push({
      id: Date.now(),
      titulo: titulo,
      prioridad: prioridad,
      completada: false,
      fecha: Date.now()
    });
  } else {
    const tarea = tareas.find((t) => t.id === idEditando);
    tarea.titulo = titulo;
    tarea.prioridad = prioridad;
    idEditando = null;
    botonGuardar.textContent = 'Agregar';
  }

  formulario.reset();
  actualizar();
});

function cambiarEstado(id) {
  const tarea = tareas.find((t) => t.id === id);
  tarea.completada = !tarea.completada;
  actualizar();
}

function editarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  inputTitulo.value = tarea.titulo;
  selectPrioridad.value = tarea.prioridad;
  idEditando = id;
  botonGuardar.textContent = 'Guardar cambios';
}

function eliminarTarea(id) {
  if (!confirm('¿Eliminar esta tarea?')) return;

  // Si se estaba editando esa tarea, se limpia el formulario
  if (idEditando === id) {
    idEditando = null;
    formulario.reset();
    botonGuardar.textContent = 'Agregar';
  }

  tareas = tareas.filter((t) => t.id !== id);
  actualizar();
}

// ---------- Filtros, búsqueda y orden ----------

inputBuscar.addEventListener('input', mostrarTareas);
selectOrden.addEventListener('change', mostrarTareas);

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtroActual = boton.dataset.filtro;
    botonesFiltro.forEach((b) => b.classList.remove('activo'));
    boton.classList.add('activo');
    mostrarTareas();
  });
});

// ---------- localStorage ----------

function guardarTareas() {
  localStorage.setItem(CLAVE, JSON.stringify(tareas));
}

function cargarTareas() {
  const datos = localStorage.getItem(CLAVE);
  if (datos !== null) {
    tareas = JSON.parse(datos);
  }
}

// ---------- Inicio ----------

cargarTareas();
mostrarTareas();
actualizarDashboard();
