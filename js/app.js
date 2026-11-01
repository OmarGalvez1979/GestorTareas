// Gestor de tareas - Etapa 2: crear tareas

let tareas = [];

// Elementos del HTML
const formulario = document.getElementById('formulario');
const inputTitulo = document.getElementById('titulo');
const selectPrioridad = document.getElementById('prioridad');
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
    li.innerHTML = `
      <span class="titulo">${tarea.titulo}</span>
      <span class="prioridad ${tarea.prioridad}">${tarea.prioridad}</span>`;
    lista.appendChild(li);
  });
}

// ---------- Crear ----------

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

  tareas.push({
    id: Date.now(),
    titulo: titulo,
    prioridad: prioridad,
    completada: false,
    fecha: Date.now()
  });

  formulario.reset();
  actualizar();
});

// ---------- Inicio ----------

mostrarTareas();
