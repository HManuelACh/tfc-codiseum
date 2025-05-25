# Codiseum

Proyecto de TFG que consta de backend (Spring Boot) y frontend (React Vite).

---

## Estructura del proyecto

- `/codiseum-backend`: Backend con Spring Boot y Maven.
- `/codiseum-frontend`: Frontend con React y Vite.
- `docker-compose.yml`: Configuración para levantar la app completa con contenedores.

---

## Requisitos previos

- Podman o Docker
- (Opcional) Maven y Node.js si quieres trabajar local sin contenedores

---

## Cómo levantar el proyecto

Desde la raíz del proyecto (donde se ubica el archivo `docker-compose.yml`), ejecutar uno de los siguientes comandos:

### Usando Podman Compose

```
podman compose up --build
```

### Usando Docker Compose

```
docker compose up --build
```

---

## Qué hace este comando

- Construye las imágenes de backend y frontend usando sus respectivos Dockerfiles.
- Levanta un contenedor de PostgreSQL con la base de datos necesaria.
- Levanta el backend y frontend, conectados entre sí.
- Expone los puertos:
  - Backend en `http://localhost:8080`
  - Frontend en `http://localhost:5173`
  - PostgreSQL en el puerto `5432`

---

## Variables de entorno

Las variables necesarias están configuradas en el `docker-compose.yml` para que el backend y frontend funcionen correctamente con la base de datos y URLs.

---

## Notas

- El frontend se comunica con el backend usando la URL `http://localhost:8080`.
- El backend usa PostgreSQL dentro del contenedor para almacenar datos.
- Las imágenes y archivos subidos se almacenan en un volumen Docker persistente.

---

Una vez ejecutado el comando mencionado anteriormente puedes abrir tu navegador en [http://localhost:5173](http://localhost:5173) y probar la aplicación.