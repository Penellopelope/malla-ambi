const CICLOS = 10;
const mallaDiv = document.getElementById('malla');

let data = {};
let colors = {};
let estadoCursos = {};

// Cargar archivos JSON
async function cargarDatos() {
  const resMalla = await fetch('data/data_AMB.json');
  const resColors = await fetch('data/colors_AMB.json');
  data = await resMalla.json();
  colors = await resColors.json();

  const saved = localStorage.getItem('estadoCursos');
  if (saved) estadoCursos = JSON.parse(saved);

  generarMalla();
  actualizarColores();
}

// Verificar si se cumplen los requisitos
function requisitosCumplidos(reqs) {
  return reqs.every(cod => estadoCursos[cod] === 'A');
}

// Generar visualmente la malla
function generarMalla() {
  for (let i = 1; i <= CICLOS; i++) {
    const cicloKey = 's' + i;
    const cursos = data[cicloKey] || [];

    const divCiclo = document.createElement('div');
    divCiclo.className = 'ciclo';
    divCiclo.innerHTML = `<h2>S${i}</h2>`;

    cursos.forEach(curso => {
      const [nombre, codigo, _, __, tipo, prereq] = curso;

      const divCurso = document.createElement('div');
      divCurso.className = 'curso';
      divCurso.dataset.codigo = codigo;
      divCurso.innerText = `${codigo} - ${nombre}`;
      divCurso.style.borderLeftColor = colors[tipo]?.[0] || "#999";

      if (contarHijos(codigo) >= 5) {
        divCurso.classList.add('relevante'); // 🔥
      }

      if (!estadoCursos[codigo]) estadoCursos[codigo] = 'P';

      if (prereq.length === 0) {
        divCurso.classList.add('desbloqueado');
      }

      // Cambiar estado al hacer click
      divCurso.addEventListener('click', () => {
        const actual = estadoCursos[codigo];
        estadoCursos[codigo] = actual === 'P' ? 'E' : actual === 'E' ? 'A' : 'P';
        actualizarColores();
        guardarProgreso();
      });

      // Hover para resaltar los hijos desbloqueables
      divCurso.addEventListener('mouseenter', () => {
        resaltarHijos(codigo, true);
      });
      divCurso.addEventListener('mouseleave', () => {
        resaltarHijos(codigo, false);
      });

      divCiclo.appendChild(divCurso);
    });

    mallaDiv.appendChild(divCiclo);
  }
}

// Guardar progreso
function guardarProgreso() {
  localStorage.setItem('estadoCursos', JSON.stringify(estadoCursos));
}

// Contar cuántos cursos dependen de este
function contarHijos(cod) {
  let count = 0;
  Object.values(data).forEach(cursos => {
    cursos.forEach(curso => {
      if (curso[5].includes(cod)) count++;
    });
  });
  return count;
}

// Función para resaltar cursos desbloqueados por otro
function resaltarHijos(codigo, resaltar) {
  Object.values(data).forEach(cursos => {
    cursos.forEach(curso => {
      if (curso[5].includes(codigo)) {
        const hijo = document.querySelector(`[data-codigo="${curso[1]}"]`);
        if (hijo) {
          hijo.classList.toggle('resaltado', resaltar);
        }
      }
    });
  });
}

// Actualizar colores y estados visuales
function actualizarColores() {
  document.querySelectorAll('.curso').forEach(div => {
    const codigo = div.dataset.codigo;
    div.classList.remove('aprobado', 'en-curso', 'pendiente', 'desbloqueado');

    const estado = estadoCursos[codigo];
    div.classList.add(
      estado === 'A' ? 'aprobado' :
      estado === 'E' ? 'en-curso' : 'pendiente'
    );

    const curso = buscarCursoPorCodigo(codigo);
    if (curso && requisitosCumplidos(curso[5])) {
      div.classList.add('desbloqueado');
    }
  });
}

// Buscar curso por código
function buscarCursoPorCodigo(cod) {
  for (let key in data) {
    const encontrado = data[key].find(c => c[1] === cod);
    if (encontrado) return encontrado;
  }
  return null;
}

cargarDatos();
