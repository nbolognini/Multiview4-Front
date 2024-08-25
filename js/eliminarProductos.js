document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();

    // Delegación de eventos para el botón "Borrar"
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.addEventListener('click', function(e) {
        // Verifica si el elemento clicado es un botón "Borrar"
        if (e.target.classList.contains('borrar')) {
            e.preventDefault(); // Previene la acción por defecto del botón (si es necesario)
            const idProducto = e.target.getAttribute('data-id'); // Obtiene el ID del producto
            borrarProducto(idProducto); // Llama a la función que maneja la eliminación
            eliminarProducto(idProducto); // Llama a la función que elimina el producto del servidor (opcional
            //Acá actualizo la pantalla
            cargarProductos();

        }
    });
});

function borrarProducto(idProducto) {
    console.log(`Borrar producto con ID: ${idProducto}`);

    // Aquí debes implementar la lógica para borrar el producto.
    // Esto podría incluir eliminar el elemento del DOM y/o enviar una solicitud al servidor para eliminar el producto de la base de datos.
}

function eliminarProducto(id) {
    fetch(`http://127.0.0.1:3000/eliminarProducto/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Producto eliminado con éxito');
        } else if (response.status === 404) {
            console.error('Producto no encontrado');
        } else {
            console.error('Error al eliminar el producto');
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}


// Variables
const carrito = document.querySelector('#carrito');
const listaProductos = document.querySelector('#lista-productos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
let articulosCarrito = [];

// Acá anuncio las funciones que voy a usar
// por ejemplo agregar-carrito, que ejecuta la funcion agregarProducto()
const agregarProducto = (e) => {
     e.preventDefault();
     // acá valido si el click fue en el boton agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          // acá selecciono el producto que voy a agregar al carrito
          const producto = e.target.parentElement.parentElement;
          // Enviamos el producto seleccionado para tomar sus datos
          
          leerDatosProducto(producto);
     }
};

// Listeners
cargarEventListeners();

function cargarEventListeners() {
};

// Lee los datos del producto
function leerDatosProducto(producto) {
};


function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
};

// Elimino los productos del carrito
function vaciarCarrito() {
    // Asume que 'elementoCarrito' es el contenedor del carrito
    const elementoCarrito = document.querySelector('#idDelElementoCarrito');

    // Verifica si el elemento existe antes de intentar acceder a 'firstChild'
    if (elementoCarrito) {
        while (elementoCarrito.firstChild) {
            elementoCarrito.removeChild(elementoCarrito.firstChild);
        }
    } else {
        console.error('El elemento del carrito no se encontró.');
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);

// Función para renderizar los productos
function renderizarProductos(productos) {
     const listaProductos = document.getElementById('lista-productos');
     let html = '';
     productos.forEach(producto => {
       html += `
         <div class="row">
              <div class="four columns">
                   <div class="card">
                        <img src="img/${producto.nombre}.jpg" class="imagen-producto u-full-width">
                        <div class="info-card">
                        <h4>${producto.nombre}</h4>
                        <p>cod: ${producto.id}</p>
                        <p class="cajaInf">stock:${producto.stock}  
                             <textoDerecha class="u-pull-right ">$${producto.precio}</textoDerecha></p>
                        <a href="#" class="u-full-width button-primary2 button input borrar" data-id="${producto.id}">Borrar</a>
                   </div>
              </div>
         </div> 
       `;
     });
     listaProductos.innerHTML = html;
   }
   
function cargarProductos() {
     // URL del backend que devuelve los datos de los productos
     fetch('http://127.0.0.1:3000/productos')
         .then(response => {
             // Verifica si la solicitud fue exitosa
             if (!response.ok) {
                 throw new Error('Error al cargar los productos');
             }
             return response.json(); // Convierte la respuesta en JSON
         })
         .then(datos => {
             // Acá mando a renderizar lo trajo del backend
             renderizarProductos(datos);
         })
         .catch(error => {
             console.error('Error al cargar los productos:', error);
         });
 }

  //Evento que se dispara EL BOTON al enviar el formulario
  document.getElementById('Guardar').onsubmit = (event) => {
     event.preventDefault(); // Evita que la página se recargue
     // Crea el objeto Producto con los datos del formulario
     let Producto = {
         nombre: document.getElementById('nombre').value,
         precio: document.getElementById('precio').value,
         stock: document.getElementById('stock').value,
         urlImagenProducto: document.getElementById('urlImagenProducto').value,
         disponibilidad: document.getElementById('disponibilidad').checked
     };
     // Llama a la función cargarProductoN con el objeto Producto, asi lo cargar en el array
     cargarProducto(Producto);
 };

  //Boton con evento que envía el array de objetos al backend
  document.getElementById('enviarProductos').onclick = () => {
     // Envío el array de objetos al backend
     enviarObjetoEnJSON(productos);
     }