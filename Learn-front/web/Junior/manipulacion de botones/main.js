//recuperamos el boton
const button = document.querySelectorAll('#myButton');

const tamaño = button.length
button.forEach(button => {
    console.log(tamaño);
    //al hacer click en el boton, tenemos que ejecutar una funcion
    button.addEventListener('click', function () {


        alert('¡Botón clickeado!');
        //obtenemos el valor del atributo data-id
        const id = button.getAttribute('data-id');

        //llamar a un servicio para actualizar si me gusta
        // togglelike(id);

        console.log(`El ID del elemento es: ${id}`);

        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            button.textContent = 'Me gusta';
        } else {
            button.classList.add('liked');
            button.innerText = 'No me gusta';
        }
    });
})

