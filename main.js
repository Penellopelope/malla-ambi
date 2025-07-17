const CICLOS = 10;
const mallaDiv = document.getElementById('malla');

let data = {};
let colors = {};
let estadoCursos = {}; // Guardar estado: Aprobado, En curso, Pendiente

// Cargar archivos JSON
async function cargarDatos() {
  const resMalla = await fetch('data/data_AMB.json');
  const resColors = await fetch('data/colors_AMB.json');
  data = await resMalla.json();
  colors = await resColors.json();
  generarMalla();
}

// Ver si los requisitos están cumplidos
function requisitosCumplidos(reqs) {
  return reqs.every(cod => estadoCursos[cod] === 'A');
}

// Dibujar la malla
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
      divCurso.className = 'curso pendiente';
      divCurso.innerText = `${codigo} - ${nombre}`;

      // Color por tipo
      divCurso.style.borderLeftColor = colors[tipo]?.[0] || "#999";

      // Si el curso tiene muchos hijos, ponle llama 🔥
      const desbloquea = contarHijos(codigo);
      if (desbloquea >= 5) {
        divCurso.classList.add('relevante');
      }

      // Guardar estado inicial
      estadoCursos[codigo] = 'P';

      // Si ya está desbloqueado, marcarlo visualmente
      if (prereq.length === 0) {
        divCurso.classList.add('desbloqueado');
      }

      // Click para cambiar estado
      divCurso.addEventListener('click', () => {
        const actual = estadoCursos[codigo];
        let nuevoEstado = 'P';
        if (actual === 'P') nuevoEstado = 'E';
        else if (actual === 'E') nuevoEstado = 'A';
        else nuevoEstado = 'P';

        estadoCursos[codigo] = nuevoEstado;
        actualizarColores();
      });

      divCiclo.appendChild(divCurso);
    });

    mallaDiv.appendChild(divCiclo);
  }
}

// Contar cuántos cursos dependen de este
function contarHijos(cod) {
  let count = 0;
  Object.values(data).forEach(cursos => {
    cursos.forEach(curso => {
      if (curso[5].includes(cod)) {
        count++;
      }
    });
  });
  return count;
}

// Cambiar color según estado actual
function actualizarColores() {
  document.querySelectorAll('.curso').forEach(div => {
    const codigo = div.innerText.split(' - ')[0];
    div.classList.remove('aprobado', 'en-curso', 'pendiente');

    const estado = estadoCursos[codigo];
    if (estado === 'A') div.classList.add('aprobado');
    else if (estado === 'E') div.classList.add('en-curso');
    else div.classList.add('pendiente');

    // Ver si ahora cumple los requisitos para desbloquearse
    const curso = buscarCursoPorCodigo(codigo);
    if (curso && requisitosCumplidos(curso[5])) {
      div.classList.add('desbloqueado');
    } else {
      div.classList.remove('desbloqueado');
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
