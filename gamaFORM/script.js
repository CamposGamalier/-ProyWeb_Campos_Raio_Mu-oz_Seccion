document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form");
    const signUpButton = document.getElementById("SignUp");
    const reportButton = document.getElementById("reportButton");
    const userData = document.getElementById("userData");
    const deleteButton = document.getElementById("deleteButton"); // Nuevo botón para eliminar usuarios
    

    // Función para obtener y mostrar los usuarios
    function getUsers() {
        fetch('http://localhost:3000/usuarios')
            .then(response => response.json())
            .then(data => {
                userData.innerHTML = ""; // Limpiar datos anteriores
                data.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nombre}</td>
                        <td>${user.apellido}</td>
                        <td>${user.correo}</td>
                        <td>${user.telefono}</td>
                        <td><button class="delete-btn" data-id="${user.id}">Eliminar</button></td>
                    `;
                    userData.appendChild(row);
                    // Actualizar el contador de ID para evitar duplicados
                    const userId = parseInt(user.id);
                    if (userId >= nextUserId) {
                        nextUserId = userId + 1;
                    }
                });
            })
            .then(() => {
                // Agregar el evento click a los botones de eliminar después de que se hayan creado
                const deleteButtons = document.querySelectorAll(".delete-btn");
                deleteButtons.forEach(button => {
                    button.addEventListener("click", function() {
                        const userId = button.getAttribute("data-id");
                        eliminarUsuario(userId);
                    });
                });
            })
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    // Obtener y mostrar usuarios al cargar la página
    getUsers();

    // Evento para enviar datos del formulario
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });
        userData.id = nextUserId.toString(); // Establecer el nuevo ID secuencial

        // Validación de datos del formulario
        if (validarDatos(userData)) {
            fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Usuario agregado:', data);
                // Actualizar la tabla mostrando los nuevos datos
                getUsers();
                // Incrementar el contador de ID para el próximo usuario
                nextUserId++;
                form.reset();
                alert('Registro exitoso');
            })
            .catch(error => console.error('Error al agregar usuario:', error));
        } else {
            console.log('Los datos del formulario no son válidos.');
        }
    });

     // Evento para abrir el modal y mostrar los datos del reporte
     reportButton.addEventListener("click", function() {
        // Obtener y mostrar los usuarios en la tabla
        fetch('http://localhost:3000/usuarios')
            .then(response => response.json())
            .then(data => {
                reportData.innerHTML = ""; // Limpiar datos anteriores
                data.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nombre}</td>
                        <td>${user.apellido}</td>
                        <td>${user.correo}</td>
                        <td>${user.telefono}</td>
                    `;
                    reportData.appendChild(row);
                });
                const lastUser = data[data.length - 1];
                if (lastUser) {
                    nextUserId = parseInt(lastUser.id) + 1;
                }
            })
            .catch(error => console.error('Error al obtener usuarios:', error));

        // Mostrar el modal
        reportModal.style.display = "block";
    });

    // Función para validar los datos del formulario
    function validarDatos(userData) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nombreWarning = document.getElementById("nombreWarning");
        const telefonoWarning = document.getElementById("telefonoWarning");
        const correoWarning = document.getElementById("correoWarning");
        const passwordWarning = document.getElementById("passwordWarning");
        const apellidoWarning = document.getElementById("apellidoWarning");
        const direccionWarning = document.getElementById("direccionWarning");

        nombreWarning.innerHTML = "";
        telefonoWarning.innerHTML = "";
        correoWarning.innerHTML = "";
        passwordWarning.innerHTML = "";
        apellidoWarning.innerHTML = "";
        direccionWarning.innerHTML = "";

        let isValid = true;

        const nombre = userData.nombre;
        const telefono = userData.telefono;
        const correo = userData.correo;
        const password = userData.password;
        const apellido = userData.apellido;
        const direccion = userData.dire;

        if (nombre.length < 6) {
            nombreWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> El nombre no es válido';
            isValid = false;
        }

        if (telefono.length < 7) {
            telefonoWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> El teléfono no es válido';
            isValid = false;
        }

        if (!regexEmail.test(correo)) {
            correoWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> Email no válido';
            isValid = false;
        }

        if (password.length < 8) {
            passwordWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> La contraseña no es válida';
            isValid = false;
        }

        if (apellido.length < 6) {
            apellidoWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> El apellido no es válido';
            isValid = false;
        }

        if (direccion.trim() === "") {
            direccionWarning.innerHTML = '<i class="fas fa-exclamation-circle"></i> La dirección es obligatoria';
            isValid = false;
        }

        return isValid;
    }

    // Función para eliminar un usuario por ID
    function eliminarUsuario(userId) {
        fetch(`http://localhost:3000/usuarios/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log(`Usuario con ID ${userId} eliminado correctamente.`);
                // Actualizar la tabla después de eliminar
                getUsers();
            } else {
                console.error(`Error al eliminar el usuario con ID ${userId}.`);
            }
        })
        .catch(error => console.error('Error al eliminar usuario:', error));
    }

    // Agregar evento al botón de eliminar dentro del modal
    deleteButton.addEventListener("click", function() {
        const userId = prompt("Ingrese el ID del usuario que desea eliminar:");
        if (userId) {
            eliminarUsuario(userId);
        }
    });

    const reportModal = document.getElementById("reportModal");
    const closeReportModal = document.querySelector("#reportModal .close");
    const reportData = document.getElementById("reportData");

    // Cerrar el modal cuando se hace clic en el botón de cerrar
    closeReportModal.addEventListener("click", function() {
        reportModal.style.display = "none";
    });

    // Cerrar el modal si el usuario hace clic fuera de él
    window.addEventListener("click", function(event) {
        if (event.target === reportModal) {
            reportModal.style.display = "none";
        }
    });
    
});
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el botón de cerrar
    const closeButton = document.getElementById("closeButton");

    // Agregar un evento de clic al botón de cerrar
    closeButton.addEventListener("click", function() {
        // Redirigir a la página de index.html
        window.location.href = "file:///C:/Users/Servidor.OSARCH/Desktop/webprincipal/web/index.html";
    });
});
function evaluarSeguridadContraseña(password) {
    // Definir expresiones regulares para evaluar la contraseña
    const regexLongitud = /.{8,}/; // Al menos 8 caracteres
    const regexMayuscula = /[A-Z]/; // Al menos una letra mayúscula
    const regexMinuscula = /[a-z]/; // Al menos una letra minúscula
    const regexNumero = /[0-9]/; // Al menos un número
    const regexCaracterEspecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Al menos un carácter especial

    // Evaluar cada criterio de seguridad
    const longitudValida = regexLongitud.test(password);
    const tieneMayuscula = regexMayuscula.test(password);
    const tieneMinuscula = regexMinuscula.test(password);
    const tieneNumero = regexNumero.test(password);
    const tieneCaracterEspecial = regexCaracterEspecial.test(password);

    // Calcular la puntuación de seguridad basada en los criterios cumplidos
    let puntuacion = 0;
    if (longitudValida) puntuacion += 20;
    if (tieneMayuscula) puntuacion += 20;
    if (tieneMinuscula) puntuacion += 20;
    if (tieneNumero) puntuacion += 20;
    if (tieneCaracterEspecial) puntuacion += 20;

    // Definir mensajes de seguridad basados en la puntuación
    let mensaje = "";
    if (puntuacion === 100) {
        mensaje = "Excelente";
    } else if (puntuacion >= 80) {
        mensaje = "Muy seguro";
    } else if (puntuacion >= 60) {
        mensaje = "Seguro";
    } else if (puntuacion >= 40) {
        mensaje = "Poco seguro";
    } else {
        mensaje = "Muy poco seguro";
    }

    // Retornar la puntuación y el mensaje de seguridad
    return { puntuacion, mensaje };
    
}
// Obtener el campo de contraseña
const passwordField = document.getElementById("password");

// Agregar un evento de escucha para el evento input
passwordField.addEventListener("input", function() {
    // Obtener el valor del campo de contraseña
    const password = passwordField.value;
    
    // Obtener el elemento donde mostrar la seguridad de la contraseña
    const passwordStrengthDiv = document.getElementById("passwordStrength");
    
    // Evaluar la seguridad de la contraseña
    const { puntuacion, mensaje } = evaluarSeguridadContraseña(password);
    
    // Actualizar el contenido del elemento con el resultado de la evaluación
    passwordStrengthDiv.innerHTML = `Seguridad: ${mensaje}`;
});

