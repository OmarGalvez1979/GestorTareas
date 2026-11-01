// Gestor de tareas - Etapa 3: editar, eliminar y completar

let tareas = [];
let idEditando = null;

// Elementos del HTML
const formulario = document.getElementById('formulario');
const inputTitulo = document.getElementById('titulo');
const selectPrioridad = document.getElementById('prioridad');
const botonGuardar = document.getElementById('btn-guardar');
const mensajeError = document.getElementById('error');
const lista = document.getElementById('lista');

// Se llama después de cada cambio en las tareas
function actualizar() {
  mostrarTareas();
}

// ---------- Mostrar tareas ----------

function mostrarTareas() {
  lista.innerHTML = '';

  if (tareas.length === 0) {
    lista.innerHTML = '<li>No hay tareas para mostrar.</li>';
    return;
  }

  tareas.forEach((tarea) => {
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

// ---------- Inicio ----------

mostrarTareas();
