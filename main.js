const ESTADOS = ['pendiente', 'en-curso', 'aprobado', 'planeado'];

async function cargarMalla() {
  const carrera = new URLSearchParams(window.location.search).get('m') || 'AMB';
  const dataRes = await fetch(`data/data_${carrera}.json`);
  const colorRes = await fetch(`data/colors_${carrera}.json`);
  const data = await dataRes.json();
  const colors = await colorRes.json();
  const contenedor = document.getElementById('malla');

  const estadoGuardado = JSON.parse(localStorage.getItem('estadoCursos') || '{}');

  Object.keys(data).forEach((sem) => {
    const divSemestre = document.createElement('div');
    divSemestre.className = 'semestre';
    const h2 = document.createElement('h2');
    h2.textContent = sem.toUpperCase();
    divSemestre.appendChild(h2);

    data[sem].forEach((curso) => {
      const codigo = curso[1];
      const nombre = curso[0];
      const tipo = curso[4];
      const requisitos = curso[5];

      const divCurso = document.createElement('div');
      divCurso.className = `curso ${tipo}`;

      const estado = estadoGuardado[codigo] || 'pendiente';
      divCurso.classList.add(estado);

      divCurso.textContent = `${codigo} - ${nombre}`;
      divCurso.title = requisitos.length > 0 ? `Requiere: ${requisitos.join(', ')}` : "Sin requisitos";

      divCurso.addEventListener('click', () => {
        let actual = estadoGuardado[codigo] || 'pendiente';
        let nextIndex = (ESTADOS.indexOf(actual) + 1) % ESTADOS.length;
        let next = ESTADOS[nextIndex];

        ESTADOS.forEach(est => divCurso.classList.remove(est));
        divCurso.classList.add(next);
        estadoGuardado[codigo] = next;
        localStorage.setItem('estadoCursos', JSON.stringify(estadoGuardado));
      });

      divSemestre.appendChild(divCurso);
    });

    contenedor.appendChild(divSemestre);
  });
}

cargarMalla();
