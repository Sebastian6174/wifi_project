# WiFi Project 🌐

Bienvenido al proyecto WiFi. Esta aplicación consta de un frontend con React/Vite y un backend con FastAPI.

## 🚀 Guía de Inicio Rápido

### 💻 Frontend

El frontend se encuentra en la carpeta `/frontend`.

1.  **Navegar al directorio:**
    ```bash
    cd frontend
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Es necesario configurar el archivo `.env.local` con las credenciales de Supabase:
    - `VITE_SUPABASE_URL` .
    - `VITE_SUPABASE_ANON_KEY` .

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

---

### ⚙️ Backend

El backend se encuentra en la carpeta `/backend`.

1.  **Navegar al directorio:**
    ```bash
    cd backend
    ```
2.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configurar variables de entorno:**
    Es necesario configurar las variables de entorno para la base de datos y otros servicios (puedes basarte en `example.env`).

4.  **Iniciar el servidor:**
    ```bash
    uvicorn main:app --reload
    ```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Python, FastAPI, Uvicorn, LangChain, LangGraph.
- **Servicios:** Supabase (Auth/DB).

---

## 📋 Requisitos Previos

- **Node.js** e **npm** instalados.
- **Python** y **pip** instalados.
