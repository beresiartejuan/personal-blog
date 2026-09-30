---
author: Juan Beresiarte
pubDatetime: 2026-09-30T19:35:00Z
title: "Fetch API: peticiones HTTP sin librerías"
slug: fetch-api-javascript
featured: false
draft: false
tags:
  - javascript
  - http
  - apis
description: Aprende a hacer peticiones HTTP con la Fetch API nativa de JavaScript. GET, POST, manejo de errores y JSON sin instalar nada.
---

## ¿Para qué sirve `fetch`?

Casi cualquier aplicación web moderna necesita hablar con un servidor: cargar una lista de productos, enviar un formulario o guardar preferencias. Durante mucho tiempo eso se hacía con `XMLHttpRequest` (verboso y poco amigable) o con librerías como Axios.

Hoy el navegador (y Node moderno) traen **`fetch`** de fábrica. Es una función que recibe una URL, hace la petición HTTP y te devuelve una **Promise** con la respuesta. Sin instalar paquetes, sin configuraciones raras.

```javascript
const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const data = await respuesta.json();
console.log(data);
```

En tres líneas ya tenés un GET que parsea JSON. Simple, ¿no?

## Anatomía de una petición

`fetch` acepta dos argumentos: la URL y un objeto opcional de opciones (`method`, `headers`, `body`, etc.).

### GET (el caso más común)

Si no pasás opciones, `fetch` asume `GET`:

```javascript
async function obtenerPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status}`);
  }

  return res.json();
}
```

Ojo con un detalle importante: **`fetch` solo rechaza la Promise si hay un error de red** (sin conexión, DNS, CORS bloqueado). Un `404` o un `500` **no** lanzan error automáticamente; por eso conviene chequear `res.ok` o `res.status`.

### POST con JSON

Para enviar datos, configurás el método, los headers y el cuerpo:

```javascript
async function crearPost(titulo, cuerpo) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: titulo,
      body: cuerpo,
      userId: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo crear el post (${res.status})`);
  }

  return res.json();
}
```

`JSON.stringify` convierte el objeto a texto; el header `Content-Type` le avisa al servidor que lo que llega es JSON.

## Leer la respuesta: no siempre es `.json()`

La respuesta de `fetch` es un objeto `Response`. Según lo que esperes, usás distintos métodos:

- `res.json()` → parsea JSON
- `res.text()` → texto plano
- `res.blob()` → archivos binarios (imágenes, PDFs)
- `res.formData()` → formularios multipart

Solo podés consumir el body **una vez**. Si necesitás reutilizarlo, guardalo en una variable:

```javascript
const data = await res.json();
// a partir de acá usás `data`, no vuelvas a llamar res.json()
```

## Manejo de errores sin drama

Una forma limpia de encapsular `fetch` es envolverlo en un helper:

```javascript
async function api(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const detalle = await res.text();
      throw new Error(`HTTP ${res.status}: ${detalle}`);
    }

    // Si no hay cuerpo (204), devolvemos null
    if (res.status === 204) return null;

    return res.json();
  } catch (error) {
    console.error("Falló la petición:", error.message);
    throw error;
  }
}
```

Así tu código de negocio queda más claro:

```javascript
const posts = await api("https://jsonplaceholder.typicode.com/posts");
```

## Abortar peticiones (cuando el usuario se va)

Si el usuario cambia de página o cancela una búsqueda, no tiene sentido seguir esperando la respuesta. Ahí entra `AbortController`:

```javascript
const controller = new AbortController();

const promesa = fetch("/api/buscar?q=astro", {
  signal: controller.signal,
});

// Si el usuario cancela:
controller.abort();
```

Cuando abortás, la Promise se rechaza con un error de tipo `AbortError`. Es una buena práctica en buscadores con debounce o en componentes que se desmontan.

## ¿Fetch o Axios?

Ambos sirven. Regla práctica:

- **Fetch**: cero dependencias, suficiente para la mayoría de apps, estándar del lenguaje.
- **Axios**: interceptores, timeouts nativos, transformación automática de datos y un manejo de errores un poco más cómodo out-of-the-box.

Si tu proyecto es chico o querés evitar dependencias, empezá con `fetch`. Si ya usás Axios en el equipo y te gusta su API, no hay drama en seguir con él.

## Resumen rápido

1. `fetch(url)` hace un GET y devuelve una Promise.
2. Siempre revisá `res.ok` (los 4xx/5xx no lanzan solos).
3. Para POST/PUT, pasá `method`, `headers` y `body` con `JSON.stringify`.
4. Elegí `json()`, `text()` o `blob()` según el tipo de respuesta.
5. Usá `AbortController` cuando necesites cancelar.

Con esto ya podés hablar con cualquier API REST sin instalar una sola librería. ¡A experimentar!
