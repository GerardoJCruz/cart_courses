//Variables 
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas un curso presionando agregar 'Agregar al carrito'
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Muestra los cursos del local storage 
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito') ) || [];
        carritoHTML();
        
    })

    //vaciar cursos del carrito 
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = [];
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
        limpiarHTML();
    })
}


//Functions
function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Elimina un curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        console.log(e.target.getAttribute('data-id'))
        const cursoId = e.target.getAttribute('data-id');
        
        //Elimina del arreglo por el data-id
        articulosCarrito = articulosCarrito.filter(curso  => curso.id !== cursoId);
        //console.log(articulosCarrito);

        //volvemos a iterar sobre el carrito y sobreescribir el html

        carritoHTML();
    }
}



//Lee el contenido del html y extraes la informacion del curso

function leerDatosCurso(curso) {
    //console.log(curso);

    // crear objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }


    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //Actualizamos la cantidad 
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; //retorna el objeto actualizado
            } else {
                return curso; //retorna los objeetos no duplicados
            }
        });

        articulosCarrito = [...cursos];
    } else {
        //Agregamos el curso al carrito

        //Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //console.log(infoCurso);

    //Agrega elementos al arreglo de carrito
    //console.log(articulosCarrito);

    carritoHTML();
}

//Muestra el carrito del compras en el html
function carritoHTML() {
    //limpiar el HTML
    limpiarHTML();


    //Recorre el carriito y agrega el hmtl
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> <img src='${imagen}' width = '100'></td>
        <td> ${titulo}</td >
        <td>${precio}</td>
        <td>${cantidad} </td>
        <td> <a href='#' class='borrar-curso' data-id='${curso.id}'>X</a></td>
            `;

        //Agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Sincronizar con storage 
    sicronizarStorage();
}

function sicronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
    //Forma lenta
    //contenedorCarrito.innerHTML = '';

    //Forma rapida
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}