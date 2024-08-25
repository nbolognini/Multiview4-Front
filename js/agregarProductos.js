const select = document.querySelector('#nombre');

async function obtenersignalDeProductos() {
    try {
        const response = await fetch('http://localhost:3000/multiview/sistemas26');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos');
        }
        const data = await response.json();
        return data.map(signal => signal.signal_type); // Asumiendo que quieres los tipos de señales como signal de productos
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

obtenersignalDeProductos().then(signal => {
    console.log('signal de productos obtenidos:', signal);

//muesto por consola lo que obtengo de la base de datos
    signal.forEach(nombre => {
        console.log(nombre);
    });
}

signal.forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre; 
    option.textContent = nombre; 
    select.appendChild(option);
});


document.addEventListener('DOMContentLoaded', cargarEventListeners);

function cargarEventListeners() {
    document.querySelector('#productoForm').addEventListener('submit', agregarProductoAlLocalStorage);
    document.querySelector('#limpiarLocalStorage').addEventListener('click', limpiarLocalStorage);
}

function agregarProductoAlLocalStorage(e) {
    e.preventDefault();
    const nombre = document.querySelector('#nombre').value;
    const precio = document.querySelector('#precio').value;
    const stock = document.querySelector('#stock').value;

    // Verificar si el campo 'precio' o 'stock' están vacíos
    if (precio.trim() === '' || stock.trim() === '') {
        console.log('El valor unitario y la cantidad no pueden estar vacíos');
        return; // Detener la ejecución de la función
    }

    const producto = { nombre, precio, stock };
    let productos = obtenerProductosLocalStorage();
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
    alert('Producto agregado');
    document.querySelector('#productoForm').reset();
    location.reload(); // Recarga la página para mostrar el nuevo producto en la lista
}

function obtenerProductosLocalStorage() {
    let productos;
    if(localStorage.getItem('productos') === null) {
        productos = [];
    } else {
        productos = JSON.parse(localStorage.getItem('productos'));
    }
    return productos;
}

function limpiarLocalStorage() {
    // Limpio el formulario
    document.querySelector('#productoForm').reset();
    // Limpio específicamente el item 'productos' del localStorage
    localStorage.removeItem('productos');
    //Inicializo localStorage vacio
    location.reload();
    consonle.log('LocalStorage limpiado');
}

document.addEventListener('DOMContentLoaded', function() {
    const resultadoHTML = document.getElementById('resultadoHTML');
    const productos = JSON.parse(localStorage.getItem('productos'));

    if (productos) {
        let contenido = '<ul>';
        productos.forEach(producto => {
            contenido += `<li>Tipo: ${producto.nombre}, Precio: ${producto.precio}, Stock: ${producto.stock}</li>`;
        });
        contenido += '</ul>';
        resultadoHTML.innerHTML = contenido;
    } else {
        resultadoHTML.innerHTML = 'No hay productos pre-cargados.';
    }
});

function renderizarProductos(productos) {
    const elementoRenderizarProductos = document.getElementById('renderizarProductos');
    let html = '';
    productos.forEach(producto => {
        html += `
            <div class="row">
                <div class="nine columns">
                    <div class="card2">
                        <img src="img/${producto.nombre}.jpg" class="imagen-producto u-full-width">
                        <div class="info-card">
                            <h4>${producto.nombre}</h4>
                            <p>stock: ${producto.stock}</p>
                            <p></p>
                                <h4><textoDerecha class="center">Valor: $${producto.precio}</textoDerecha></p>
                            <a href="#" class="u-full-width button-primary2 button input agregar-carrito" onclick="eliminarProducto(${producto.id})">Borrar</a>
                        </div>
                    </div>
                </div>
            </div>
             
        `;
    });
    elementoRenderizarProductos.innerHTML = html;
}

// Función para recuperar productos de localStorage y mostrarlos
function mostrarProductosDesdeLocalStorage() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    renderizarProductos(productos);
}

// Llamar a mostrarProductosDesdeLocalStorage cuando se carga la pag de nuevo
document.addEventListener('DOMContentLoaded', mostrarProductosDesdeLocalStorage);


document.getElementById('guardarEnBD').addEventListener('click', function() {
    // Recuperar el array de productos de localStorage
    const productos = JSON.parse(localStorage.getItem('productos'));

    if (!productos) {
        alert('No hay productos para guardar.');
        return;
    }

    // Enviar los productos al backend
    fetch('http://127.0.0.1:3000/guardarProductos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productos }), // Back va recibir un  array de objetos
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error en la solicitud: ' + response.statusText);
    })
    .then(data => {
        console.log(data); // Procesar la respuesta del servidor
        alert('Productos guardados con éxito');
        limpiarLocalStorage();
    })
    .catch(error => {
        console.error('Error al guardar los productos:', error);
        alert('Productos guardados con éxito');
        limpiarLocalStorage();
    });
});
