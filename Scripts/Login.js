// Scripts/Login.js
// Sistema de autenticación para Imperium Motors - Versión compatible

(function() {
    'use strict';
    
    console.log('🚗 Imperium Motors - Sistema de Login cargado');

    // Simulación de localStorage con usuarios de prueba
    const storage = {
        'admin@imperium.com': JSON.stringify({
            name: 'Admin Imperium',
            email: 'admin@imperium.com',
            password: '123456'
        }),
        'test@test.com': JSON.stringify({
            name: 'Usuario Test',
            email: 'test@test.com',
            password: 'password'
        })
    };

    // Variables globales para los elementos
    let loginForm = null;
    let registerForm = null;
    let toggleSwitch = null;
    let loginError = null;
    let registerSuccess = null;

    // Funciones de utilidad para almacenamiento
    function getUserFromStorage(email) {
        console.log('🔍 Buscando usuario:', email);
        try {
            const userData = storage[email];
            const user = userData ? JSON.parse(userData) : null;
            console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
            return user;
        } catch (error) {
            console.error('❌ Error al obtener usuario:', error);
            return null;
        }
    }

    function saveUserToStorage(user) {
        console.log('💾 Guardando usuario:', user.name);
        try {
            storage[user.email] = JSON.stringify(user);
            console.log('✅ Usuario guardado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar usuario:', error);
            return false;
        }
    }

    function setCurrentUser(user) {
        console.log('🔐 Estableciendo sesión para:', user.name);
        try {
            storage['currentUser'] = JSON.stringify(user);
            console.log('✅ Sesión establecida');
        } catch (error) {
            console.error('❌ Error al guardar sesión:', error);
        }
    }

    // Función para mostrar mensajes
    function showMessage(elementId, message, isSuccess = false, duration = 4000) {
        console.log(`📢 Mostrando mensaje (${isSuccess ? 'ÉXITO' : 'ERROR'}):`, message);
        
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('❌ Elemento no encontrado:', elementId);
            return;
        }

        // Cambiar estilo según el tipo de mensaje
        if (isSuccess) {
            element.style.color = '#155724';
            element.style.backgroundColor = '#d4edda';
            element.style.border = '1px solid #c3e6cb';
        } else {
            element.style.color = '#721c24';
            element.style.backgroundColor = '#f8d7da';
            element.style.border = '1px solid #f5c6cb';
        }

        element.textContent = message;
        element.style.display = 'block';
        element.style.opacity = '0';
        
        // Animación de entrada
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
        
        // Ocultar después del tiempo especificado
        setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }, duration);
    }

    function hideMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    function clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            console.log('🧹 Formulario limpiado:', formId);
        }
    }

    // Validaciones
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password && password.length >= 6;
    }

    // Función para manejar el login
    function handleLogin(event) {
        event.preventDefault();
        console.log('🔑 Procesando login...');
        
        const formData = new FormData(event.target);
        const email = formData.get('email')?.trim() || '';
        const password = formData.get('password')?.trim() || '';
        
        console.log('📧 Email ingresado:', email);
        console.log('🔒 Password ingresado:', password ? '***' : 'VACÍO');
        
        // Limpiar mensajes previos
        hideMessage('login-error');
        
        // Validaciones básicas
        if (!email || !password) {
            console.log('❌ Campos vacíos');
            showMessage('login-error', 'Por favor, completa ambos campos.');
            return;
        }
        
        if (!isValidEmail(email)) {
            console.log('❌ Email inválido');
            showMessage('login-error', 'Por favor, ingresa un email válido.');
            return;
        }
        
        // Buscar usuario
        const user = getUserFromStorage(email);
        
        if (!user) {
            console.log('❌ Usuario no encontrado');
            showMessage('login-error', 'El usuario no existe. Por favor, regístrate primero.');
            return;
        }
        
        if (user.password !== password) {
            console.log('❌ Contraseña incorrecta');
            showMessage('login-error', 'Contraseña incorrecta. Inténtalo de nuevo.');
            return;
        }
        
        // Login exitoso
        console.log('✅ Login exitoso para:', user.name);
        showMessage('login-error', `¡Bienvenido ${user.name}! Redirigiendo...`, true, 2000);
        
        // Guardar sesión
        setCurrentUser({
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        });
        
        // Limpiar formulario
        clearForm('login-form');
        
        // Simular redirección
        setTimeout(() => {
            alert(`¡Bienvenido ${user.name}!\n\nEn un proyecto real, aquí se redirigiría a PaginaPrincipal.html`);
            console.log('🎉 Usuario logueado exitosamente:', user.name);
        }, 2000);
    }

    // Función para manejar el registro
    function handleRegister(event) {
        event.preventDefault();
        console.log('📝 Procesando registro...');
        
        const formData = new FormData(event.target);
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const password = formData.get('password')?.trim() || '';
        
        console.log('👤 Datos de registro:', { name, email, password: password ? '***' : 'VACÍO' });
        
        // Limpiar mensajes previos
        hideMessage('register-success');
        
        // Validaciones básicas
        if (!name || !email || !password) {
            console.log('❌ Campos incompletos');
            showMessage('register-success', 'Por favor, completa todos los campos.');
            return;
        }
        
        if (name.length < 2) {
            console.log('❌ Nombre muy corto');
            showMessage('register-success', 'El nombre debe tener al menos 2 caracteres.');
            return;
        }
        
        if (!isValidEmail(email)) {
            console.log('❌ Email inválido');
            showMessage('register-success', 'Por favor, ingresa un email válido.');
            return;
        }
        
        if (!isValidPassword(password)) {
            console.log('❌ Contraseña muy corta');
            showMessage('register-success', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        // Verificar si el usuario ya existe
        if (getUserFromStorage(email)) {
            console.log('❌ Usuario ya existe');
            showMessage('register-success', 'Este email ya está registrado. Ve al login para iniciar sesión.');
            
            // Cambiar al login después de 2 segundos
            setTimeout(() => {
                if (toggleSwitch) {
                    toggleSwitch.checked = false;
                    console.log('🔄 Cambiando a formulario de login');
                }
            }, 2000);
            return;
        }
        
        // Guardar nuevo usuario
        const newUser = { name, email, password };
        const saved = saveUserToStorage(newUser);
        
        if (!saved) {
            console.log('❌ Error al guardar');
            showMessage('register-success', 'Error al registrar usuario. Inténtalo de nuevo.');
            return;
        }
        
        // Registro exitoso
        console.log('✅ Registro exitoso para:', name);
        showMessage('register-success', `¡Registro exitoso, ${name}! Cambiando al login...`, true);
        
        // Limpiar formulario
        clearForm('register-form');
        
        // Cambiar al login después de mostrar el mensaje
        setTimeout(() => {
            if (toggleSwitch) {
                toggleSwitch.checked = false;
                console.log('🔄 Cambiando a formulario de login tras registro');
            }
        }, 2500);
    }

    // Función para manejar el toggle
    function handleToggle() {
        console.log('🔄 Toggle cambiado');
        setTimeout(() => {
            clearForm('login-form');
            clearForm('register-form');
            hideMessage('login-error');
            hideMessage('register-success');
        }, 100);
    }

    // Función para encontrar elementos del DOM
    function findElements() {
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        toggleSwitch = document.querySelector('.toggle');
        loginError = document.getElementById('login-error');
        registerSuccess = document.getElementById('register-success');

        console.log('🔍 Elementos encontrados:');
        console.log('  - Login form:', loginForm ? '✅' : '❌');
        console.log('  - Register form:', registerForm ? '✅' : '❌');
        console.log('  - Toggle switch:', toggleSwitch ? '✅' : '❌');
        console.log('  - Login error:', loginError ? '✅' : '❌');
        console.log('  - Register success:', registerSuccess ? '✅' : '❌');

        return loginForm && registerForm && toggleSwitch && loginError && registerSuccess;
    }

    // Función para agregar event listeners
    function addEventListeners() {
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            console.log('✅ Event listener agregado al formulario de login');
        }

        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
            console.log('✅ Event listener agregado al formulario de registro');
        }

        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', handleToggle);
            console.log('✅ Event listener agregado al toggle');
        }
    }

    // Función principal de inicialización
    function initialize() {
        console.log('🚀 Inicializando sistema de autenticación...');

        const elementsFound = findElements();
        
        if (!elementsFound) {
            console.log('⏳ Algunos elementos no encontrados, reintentando en 100ms...');
            setTimeout(initialize, 100);
            return;
        }

        addEventListeners();

        // Mostrar usuarios de prueba disponibles
        console.log('📋 Usuarios de prueba disponibles:');
        console.log('  - Email: admin@imperium.com | Password: 123456');
        console.log('  - Email: test@test.com | Password: password');
        
        console.log('🎯 Sistema de autenticación listo para usar');
        
        // Marcar como inicializado
        window.imperiumAuthReady = true;
    }

    // Múltiples estrategias de inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
        console.log('⏳ Esperando DOMContentLoaded...');
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initialize();
    }

    // Backup adicional
    setTimeout(initialize, 500);
    setTimeout(initialize, 1000);

})();