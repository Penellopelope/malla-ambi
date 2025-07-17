const malla = document.getElementById('malla');

async function cargarData() {
  const cursosRes = await fetch('data/data_AMB.json');
  const colorsRes = await fetch('data/colors_AMB.json');

  const cursos = await cursosRes.json();
  const colores = await colorsRes.json();

  cursos.forEach((ciclo, index) => {
    const divCiclo = document.createElement('div');
    divCiclo.classList.add('ciclo');
    const titulo = document.createElement('h3');
    titulo.textContent = `S${index + 1}`;
    divCiclo.appendChild(titulo);

    ciclo.forEach(curso => {
      const divCurso = document.createElement('div');
      divCurso.classList.add('curso', curso.tipo);
      divCurso.textContent = `${curso.codigo} - ${curso.nombre}`;
      divCurso.dataset.codigo = curso.codigo;

      divCurso.addEventListener('click', () => {
        divCurso.classList.toggle('aprobado');
      });

      divCiclo.appendChild(divCurso);
    });

    malla.appendChild(divCiclo);
  });
}

cargarData();
