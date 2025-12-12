document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LÓGICA DE REGISTRO (registrarse.html)
    // ==========================================
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuario = document.getElementById('nombreUsuario').value.trim();
            const email = document.getElementById('emailRegistro').value.trim();
            const pass = document.getElementById('passRegistro').value;
            const passConfirm = document.getElementById('passConfirm').value;
            const mensajeBox = document.getElementById('mensajeRegistro');

            if (pass !== passConfirm) {
                mostrarMensaje(mensajeBox, "Las contraseñas no coinciden.", "error");
                return;
            }

            if (pass.length < 4) {
                mostrarMensaje(mensajeBox, "La contraseña es muy corta.", "error");
                return;
            }

            const nuevoUsuario = {
                username: usuario,
                email: email,
                password: pass
            };

            localStorage.setItem('usuarioRegistrado', JSON.stringify(nuevoUsuario));

            mostrarMensaje(mensajeBox, "¡Cuenta creada! Redirigiendo...", "success");

            setTimeout(() => {
                window.location.href = 'acceder.html';
            }, 2000);
        });
    }

    // ==========================================
    // 2. LÓGICA DE LOGIN (acceder.html)
    // ==========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('emailLogin').value.trim();
            const passInput = document.getElementById('passLogin').value;
            const mensajeBox = document.getElementById('mensajeLogin');

            const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

            if (!usuarioGuardado) {
                mostrarMensaje(mensajeBox, "No hay usuarios registrados.", "error");
                return;
            }

            if (usuarioGuardado.email === emailInput && usuarioGuardado.password === passInput) {
                
                const sesionActiva = {
                    username: usuarioGuardado.username,
                    email: usuarioGuardado.email,
                    isLoggedIn: true
                };
                
                localStorage.setItem('sesionActiva', JSON.stringify(sesionActiva));

                mostrarMensaje(mensajeBox, "¡Bienvenido! Entrando...", "success");

                setTimeout(() => {
                    window.location.href = 'cuenta.html';
                }, 1500);

            } else {
                mostrarMensaje(mensajeBox, "Correo o contraseña incorrectos.", "error");
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DE CUENTA / PERFIL (cuenta.html)
    // ==========================================
    const profileCard = document.getElementById('profileCard');

    // Esta lógica solo se ejecuta si estamos en la página que tiene la tarjeta de perfil
    if (profileCard) {
        
        // a) Verificar si hay sesión
        const sesion = JSON.parse(localStorage.getItem('sesionActiva'));

        if (!sesion || !sesion.isLoggedIn) {
            // Si no hay sesión, mandar al login
            window.location.href = 'acceder.html';
        } else {
            // b) Si hay sesión, mostrar datos
            profileCard.style.display = 'block'; // Mostrar la tarjeta
            document.getElementById('displayUser').textContent = sesion.username;
            document.getElementById('displayEmail').textContent = sesion.email;

            // c) Lógica de Cerrar Sesión
            const btnLogout = document.getElementById('btnLogout');
            btnLogout.addEventListener('click', () => {
                // Borrar sesión
                localStorage.removeItem('sesionActiva');
                // Redirigir al inicio o login
                window.location.href = 'index.html';
            });
        }
    }

    // ==========================================
    // FUNCIÓN DE UTILIDAD
    // ==========================================
    function mostrarMensaje(elemento, texto, tipo) {
        elemento.textContent = texto;
        elemento.style.display = 'block';
        elemento.className = 'message-box';
        
        if (tipo === 'error') {
            elemento.classList.add('message-error');
        } else if (tipo === 'success') {
            elemento.classList.add('message-success');
        }
    }

});