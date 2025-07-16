async function cargarMalla() {
  const urlParams = new URLSearchParams(window.location.search);
  const carrera = urlParams.get('m') || 'AMB';

  const dataRes = await fetch(`data/data_${carrera}.json`);
  const colorRes = await fetch(`data/colors_${carrera}.json`);
  const data = await dataRes.json();
  const colors = await colorRes.json();

  const contenedor = document.getElementById('malla');

  Object.keys(data).forEach((sem) => {
    const divSemestre = document.createElement('div');
    divSemestre.className = 'semestre';
    const h2 = document.createElement('h2');
    h2.textContent = sem.toUpperCase();
    divSemestre.appendChild(h2);

    data[sem].forEach((curso) => {
      const divCurso = document.createElement('div');
      divCurso.className = `curso ${curso[4]}`;
      divCurso.textContent = `${curso[1]} - ${curso[0]}`;
      divSemestre.appendChild(divCurso);
    });

    contenedor.appendChild(divSemestre);
  });
}

cargarMalla();
