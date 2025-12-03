// BOT DE WHATSAPP - ONE CARD (VERSIÓN CORREGIDA)
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

process.setMaxListeners(15);

// Sistema mejorado de control de mensajes
const mensajesProcesados = new Map(); // Cambio a Map para incluir timestamp

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('📱 Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot One Card conectado y funcionando!');
    console.log('📱 Listo para atender clientes');
    console.log('⏰ Hora de inicio:', new Date().toLocaleString());
});

// Función de limpieza de caché (cada 5 minutos)
setInterval(() => {
    const ahora = Date.now();
    for (const [msgId, timestamp] of mensajesProcesados.entries()) {
        // Eliminar mensajes procesados hace más de 5 minutos
        if (ahora - timestamp > 300000) {
            mensajesProcesados.delete(msgId);
        }
    }
    console.log(`🧹 Caché limpiado. Mensajes en memoria: ${mensajesProcesados.size}`);
}, 300000);

// CAMBIO CRÍTICO: Usar 'message' en lugar de 'message_create'
client.on('message', async msg => {
    try {
        // FILTRO 1: Ignorar mensajes del bot
        if (msg.fromMe) {
            return;
        }

        // FILTRO 2: Ignorar mensajes de grupos
        const chat = await msg.getChat();
        if (chat.isGroup) {
            console.log('⚠️ Mensaje de grupo ignorado');
            return;
        }

        // FILTRO 3: Verificar si ya fue procesado
        const msgId = msg.id._serialized;
        if (mensajesProcesados.has(msgId)) {
            console.log('⚠️ Mensaje duplicado detectado, ignorando...');
            return;
        }
        
        // Registrar mensaje con timestamp
        mensajesProcesados.set(msgId, Date.now());
        
        // FILTRO 4: Validar que hay contenido
        const texto = msg.body ? msg.body.toLowerCase().trim() : '';
        
        if (!texto || texto.length === 0) {
            console.log('⚠️ Mensaje vacío, ignorando...');
            return;
        }

        // FILTRO 5: Ignorar URLs y medios
        if (texto.includes('http') || msg.hasMedia) {
            console.log('⚠️ URL o media detectado, ignorando...');
            return;
        }
        
        console.log(`\n📨 Mensaje recibido: "${msg.body}"`);
        console.log(`📍 De: ${msg.from}`);
        console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);

        // Variable para controlar si ya se respondió
        let respondido = false;

        // ========== MENÚ PRINCIPAL ==========
        const palabrasMenu = ['menu', 'hola', 'ayuda', 'inicio', 'buenas', 'buenos dias', 
                             'buenas tardes', 'buenas noches', 'ola', 'info', 'hey', 'holi'];
        
        if (palabrasMenu.some(palabra => texto === palabra || texto.startsWith(palabra))) {
            console.log('✅ Activando MENÚ PRINCIPAL...');
            await client.sendMessage(msg.from, `🔷 *Bienvenido a ONE CARD* 🔷

💳 *Soluciones inteligentes en monederos electrónicos*

📋 *NUESTROS PRODUCTOS:*

1️⃣ *Vales de Despensa*
2️⃣ *Tarjeta de Gasolina*
3️⃣ *Viáticos y Gastos*
4️⃣ *Tarjetas de Premios*
5️⃣ *Información de la Empresa*
6️⃣ *Contacto y Soporte*

_Escribe el número de la opción que necesites_

💡 Todas nuestras soluciones están autorizadas por el SAT
✅ +14 años de experiencia
🏪 Aceptadas en +500,000 establecimientos

*One Card - Contigo Siempre* 💙`);
            respondido = true;
            console.log('✅ Menú enviado correctamente\n');
            return;
        }

        // ========== 1. VALES DE DESPENSA ==========
        if ((texto === '1' || texto.includes('despensa') || texto.includes('vale')) && !respondido) {
            console.log('📋 Enviando info de Vales de Despensa...');
            await client.sendMessage(msg.from, `🛒 *VALES DE DESPENSA ONE CARD*

La solución ideal para ofrecer prestaciones inteligentes y deducibles a tus colaboradores.

✅ *BENEFICIOS:*
• 100% Deducible de impuestos
• Autorizado por el SAT
• Aceptado en +500,000 establecimientos
• Dispersión rápida y eficiente
• Ahorra hasta 80% en tiempos de comprobación
• Consulta saldo en app 24/7

💳 *CARACTERÍSTICAS:*
• Pago seguro y sin efectivo
• Define cuánto y cuándo depositar
• Reportes en tiempo real
• App disponible iOS y Android
• Soporte 24/7, 365 días

📱 *PARA COTIZAR:*
Escribe *cotizar despensa* y te contactamos

_¿Necesitas más información?_
Escribe *menu* para regresar`);
            respondido = true;
            console.log('✅ Info despensa enviada\n');
            return;
        }

        // ========== 2. TARJETA DE GASOLINA ==========
        if ((texto === '2' || texto.includes('gasolina') || texto.includes('combustible')) && !respondido) {
            console.log('⛽ Enviando info de Gasolina...');
            await client.sendMessage(msg.from, `⛽ *TARJETA DE GASOLINA ONE CARD*

Control total del consumo de combustible de tu empresa con una sola factura.

✅ *BENEFICIOS:*
• 100% Deducible de impuestos
• Una sola CFDI mensual
• Aceptada en TODAS las gasolineras de México
• Control en tiempo real
• Elimina manejo de efectivo
• Sin necesidad de pedir facturas

💳 *CARACTERÍSTICAS:*
• Cobertura nacional
• App móvil (iOS/Android)
• Bloquea/desbloquea desde la app
• Consulta de saldo web, SMS o app
• Servicio 24/7 en caso de robo

🔧 *IDEAL PARA:*
• Flotillas de transporte
• Equipos de ventas
• Distribuidores
• Prestación a empleados

📱 *PARA COTIZAR:*
Escribe *cotizar gasolina*

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Info gasolina enviada\n');
            return;
        }

        // ========== 3. VIÁTICOS Y GASTOS ==========
        if ((texto === '3' || texto.includes('viatico') || texto.includes('gasto')) && !respondido) {
            console.log('💼 Enviando info de Viáticos...');
            await client.sendMessage(msg.from, `💼 *VIÁTICOS Y GASTOS ONE CARD*

Gestiona y controla los gastos de viáticos y caja chica de tu empresa.

✅ *BENEFICIOS:*
• Control total de gastos empresariales
• Elimina comprobación física
• Define límites de gasto
• Reportes detallados en tiempo real
• Retiro en OXXO disponible
• Compras en línea con CVV dinámico

💳 *CARACTERÍSTICAS:*
• Aceptada en cualquier comercio
• Configura categorías permitidas
• Bloquea/desbloquea desde app
• Consulta movimientos al instante
• Múltiples tarjetas por usuario

🎯 *USOS:*
• Viajes de negocios
• Gastos operativos
• Caja chica digital
• Compras corporativas

📱 *PARA COTIZAR:*
Escribe *cotizar viaticos*

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Info viáticos enviada\n');
            return;
        }

        // ========== 4. TARJETAS DE PREMIOS ==========
        if ((texto === '4' || texto.includes('premio') || texto.includes('incentivo')) && !respondido) {
            console.log('🎁 Enviando info de Premios...');
            await client.sendMessage(msg.from, `🎁 *TARJETAS DE PREMIOS ONE CARD*

Incentiva y fideliza a tus colaboradores o clientes de forma innovadora.

✅ *BENEFICIOS:*
• Aumenta motivación del equipo
• Programas de lealtad personalizables
• Mayor aceptación que efectivo
• Fácil administración
• Reportes de uso en tiempo real

💳 *CARACTERÍSTICAS:*
• Uso en comercios sin restricción
• Montos personalizables
• Entrega inmediata o programada
• Tarjetas personalizables con tu marca
• Control total desde plataforma web

🎯 *IDEAL PARA:*
• Reconocimiento de empleados
• Programas de lealtad
• Incentivos de ventas
• Bonos especiales
• Recompensas

📱 *PARA COTIZAR:*
Escribe *cotizar premios*

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Info premios enviada\n');
            return;
        }

        // ========== 5. INFORMACIÓN DE LA EMPRESA ==========
        if ((texto === '5' || texto.includes('empresa') || texto.includes('nosotros') || texto.includes('quienes')) && !respondido) {
            console.log('🏢 Enviando info de la empresa...');
            await client.sendMessage(msg.from, `🏢 *SOBRE ONE CARD*

_"Las mejores soluciones en previsión social y control del gasto empresarial"_

📊 *QUIÉNES SOMOS:*
Empresa líder en emisión y administración de tarjetas de prepago en México, con más de 14 años de experiencia.

✨ *NUESTRA MISIÓN:*
Exceder las expectativas de nuestros clientes con innovación y soluciones integrales de tecnología financiera.

🎯 *NUESTRA VISIÓN:*
Ser los mejores en soluciones con valor agregado dentro de la industria fintech en México.

💎 *VALORES:*
• Transparencia y honestidad
• Innovación constante
• Servicio de excelencia
• Compromiso con resultados

📈 *CIFRAS:*
• +14 años en el mercado
• +500,000 establecimientos afiliados
• Cobertura en toda la República
• Soporte 24/7, 365 días

🏆 *ÁREAS DE ESPECIALIZACIÓN:*
1. Empresas - Control de gastos
2. Comercios - Programas de lealtad
3. Gobierno - Programas sociales

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Info empresa enviada\n');
            return;
        }

        // ========== 6. CONTACTO Y SOPORTE ==========
        if ((texto === '6' || texto.includes('contacto') || texto.includes('soporte')) && !respondido) {
            console.log('📞 Enviando información de contacto...');
            await client.sendMessage(msg.from, `📞 *CONTACTO Y SOPORTE ONE CARD*

Estamos para ayudarte 24/7

🏢 *VENTAS Y COTIZACIONES:*
📧 Email: serviciocliente@onecard.mx
☎️ Tel: (81) 8248-8250
🌐 Web: www.onecard.mx

💬 *SOPORTE TÉCNICO:*
📧 Email: mesadeayuda@onecard.mx
⏰ Disponible 24/7, 365 días

📱 *DESCARGA NUESTRA APP:*
🍎 iOS: App Store
🤖 Android: Google Play
_Busca: "One Card OCSI"_

🌐 *SÍGUENOS:*
📘 Facebook: /OneCardMX
📸 Instagram: @onecardmx

📝 *¿QUIERES UNA COTIZACIÓN?*
Escribe cualquiera de estos:
• *cotizar despensa*
• *cotizar gasolina*
• *cotizar viaticos*
• *cotizar premios*

_Un asesor te contactará a la brevedad_

*One Card - Contigo Siempre* 💙

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Contacto enviado\n');
            return;
        }

        // ========== SOLICITUDES DE COTIZACIÓN ==========
        if (texto.includes('cotizar') && !respondido) {
            console.log('📋 Solicitando datos para cotización...');
            
            let producto = 'Información General';
            if (texto.includes('despensa')) producto = 'Vales de Despensa';
            else if (texto.includes('gasolina')) producto = 'Tarjeta de Gasolina';
            else if (texto.includes('viatico')) producto = 'Viáticos y Gastos';
            else if (texto.includes('premio')) producto = 'Tarjetas de Premios';

            await client.sendMessage(msg.from, `✅ *SOLICITUD DE COTIZACIÓN*
_${producto}_

Para brindarte la mejor atención, por favor proporciónanos:

📋 *DATOS REQUERIDOS:*
1. Nombre de tu empresa
2. Nombre completo
3. Teléfono de contacto
4. Correo electrónico
5. Número aproximado de tarjetas

📧 *ENVÍA TUS DATOS A:*
serviciocliente@onecard.mx

☎️ *O LLÁMANOS:*
(81) 8248-8250

⏰ Un asesor se comunicará contigo en menos de 24 horas hábiles.

💡 *NOTA:* Este NO es un trámite de tarjeta de crédito ni ayuda del gobierno. Es una cotización empresarial.

_Escribe *menu* para regresar al inicio_`);
            respondido = true;
            console.log('✅ Info cotización enviada\n');
            return;
        }

        // ========== CONSULTA DE SALDO ==========
        if ((texto.includes('saldo') || texto.includes('consultar')) && !respondido) {
            console.log('💰 Info consulta de saldo...');
            await client.sendMessage(msg.from, `💰 *CONSULTA TU SALDO ONE CARD*

Puedes consultar tu saldo de 3 formas:

📱 *1. APP MÓVIL (Recomendado)*
• Descarga "One Card OCSI"
• Regístrate con tu tarjeta
• Consulta saldo y movimientos
• Disponible iOS y Android

🌐 *2. WEB*
• Visita: www.onecard.mx
• Ingresa a tu cuenta
• Revisa saldo en tiempo real

📞 *3. SOPORTE*
• WhatsApp/Tel: (81) 8248-8250
• Email: mesadeayuda@onecard.mx

🔒 *SEGURIDAD:*
• Bloquea tu tarjeta desde la app
• Reporta extravío 24/7
• Protección de fondos garantizada

_Escribe *menu* para regresar_`);
            respondido = true;
            console.log('✅ Info saldo enviada\n');
            return;
        }

        // ========== PREGUNTAS FRECUENTES ==========
        if ((texto.includes('donde') || texto.includes('usar') || texto.includes('comercio')) && !respondido) {
            console.log('❓ Respondiendo FAQ...');
            await client.sendMessage(msg.from, `❓ *PREGUNTAS FRECUENTES*

*¿Dónde puedo usar mi tarjeta One Card?*
En más de 500,000 establecimientos en México que acepten tarjetas de débito/crédito.

*¿Funciona en supermercados?*
Sí, Walmart, Soriana, HEB, Chedraui, Bodega Aurrera, etc.

*¿Puedo comprar en línea?*
Sí, con CVV dinámico para mayor seguridad.

*¿Qué pasa si la pierdo?*
Bloquéala inmediatamente desde la app o llamando al (81) 8248-8250. Tus fondos están protegidos.

*¿Es deducible de impuestos?*
Sí, todos nuestros productos están autorizados por el SAT.

*¿Tiene costo?*
Consulta con tu asesor, depende del producto y volumen.

_¿Más dudas? Escribe *contacto*_
_Regresar: *menu*_`);
            respondido = true;
            console.log('✅ FAQ enviado\n');
            return;
        }

        // ========== RESPUESTA POR DEFECTO (Solo si no se respondió nada) ==========
        if (!respondido) {
            console.log('📋 Mensaje no reconocido, enviando menú...');
            await client.sendMessage(msg.from, `Hola, gracias por contactar a *One Card* 💙

Te muestro nuestro menú de opciones:

📋 *NUESTROS PRODUCTOS:*

1️⃣ *Vales de Despensa*
2️⃣ *Tarjeta de Gasolina*
3️⃣ *Viáticos y Gastos*
4️⃣ *Tarjetas de Premios*
5️⃣ *Información de la Empresa*
6️⃣ *Contacto y Soporte*

_Escribe el número de la opción que necesites_

💡 Si necesitas ayuda inmediata:
☎️ (81) 8248-8250
📧 serviciocliente@onecard.mx

*One Card - Contigo Siempre* 💙`);
            console.log('✅ Menú automático enviado\n');
        }

    } catch (error) {
        console.error('❌ Error procesando mensaje:', error.message);
        console.error('Stack:', error.stack);
    }
});

client.on('auth_failure', (msg) => {
    console.error('❌ Fallo de autenticación:', msg);
    console.log('💡 Intenta eliminar la carpeta .wwebjs_auth y reiniciar');
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot desconectado:', reason);
    console.log('🔄 Intentando reconectar...');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Error no manejado:', error);
});

client.initialize();

console.log('🚀 Iniciando bot One Card...');
console.log('📱 Prepárate para escanear el código QR');
console.log('⏰', new Date().toLocaleString());