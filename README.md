📱 Aplicación React con Capacitor para Android
Aplicación móvil con menú interactivo que incluye:

Perfil personal

Calculadora

Traductor numérico

Tablas de multiplicar

Video de experiencia

🚀 Características principales
Tecnologías: React, Capacitor, Material-UI

Diseño mobile-first optimizado para Android

Traductor numérico (1-1000) sin usar APIs

Integración con Android Studio para generar APK

Video explicativo de la experiencia de desarrollo

🛠 Instalación
Clonar repositorio:

bash
git clone https://github.com/tuusuario/tu-repositorio.git
cd tu-repositorio
Instalar dependencias:

bash
npm install
Configurar Capacitor:

bash
npx cap init
npx cap add android
▶️ Ejecución
Modo desarrollo:

bash
npm start
Generar APK:

bash
npm run build
npx cap copy android
npx cap open android
(Luego generar APK desde Android Studio)

🎥 Video demostración
Video experiencia
![image](https://github.com/user-attachments/assets/154e456f-7841-4f89-b0d1-7bb4e6e3e7a0)


📂 Estructura de archivos
src/
├── components/       # Componentes reutilizables
├── pages/            # Vistas principales
│   ├── Inicio.js     # Perfil personal
│   ├── Sumadora.js   # Calculadora
│   ├── Traductor.js  # Traductor numérico
│   ├── TablaMultiplicar.js
│   └── Experiencia.js # Video explicativo
├── App.js            # Router principal
└── index.css         # Estilos globales
🛠 Dependencias principales
json
"dependencies": {
  "@capacitor/android": "^5.x",
  "@capacitor/core": "^5.x",
  "@mui/material": "^5.x",
  "react": "^18.x",
  "react-router-dom": "^6.x"
}
🌟 Créditos
Desarrollado por [Tu Nombre] - [2023]
[Incluir enlaces a tu portfolio/LinkedIn si lo deseas]
