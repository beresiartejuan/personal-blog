---
author: Juan Beresiarte
pubDatetime: 2024-02-28T19:01:13Z
title: "Axios: Cliente HTTP por excelencia"
slug: cliente-http-axios
featured: true
draft: false
tags:
  - javascript
  - librerias
description: Uno de los mejores clientes HTTP
---

## Table of contents

## Introducción: ¿Que es Axios?

En el mundo del desarrollo web, la comunicación cliente-servidor es fundamental y en ese sentido JavaScript juega un papel importante. Es aquí donde entra en juego Axios, una librería JavaScript que simplifica en gran medida el proceso de realizar solicitudes HTTP. Es un cliente http isomorfico, es decir que funciona tanto en el servidor como en el cliente, basado en promesas.

Esta libreria es compatible con la mayoria de navegadores y frameworks(como React o Angular). Ademas de tener un excelente soporte para trabajar con APIs RESTful y facilitar las pruebas y la manipulación de datos.

## Instalación de Axios

Usando npm:

```bash
npm install axios
```

Usando un CDN:

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## Peticiones con Axios

Con Axios, hacer una solicitud es tan sencillo como llamar a la funciones: get, post, put, delete. Y pasarle la URL del recurso al que deseamos acceder. Por ejemplo:

```javascript
axios
  .get("/api/users")
  .then(function (response) {
    console.log("Datos de usuarios:", response.data);
  })
  .catch(function (error) {
    console.error("Error al obtener datos de usuarios:", error);
  });
```

Usualmente las funciones antes mencionadas reciben como primer parametro la URL del recurso y como segundo parametro la configuración de la petición, pero hay execpciones:

`axios.get(url, config)`

```javascript
axios
  .get(`/api/users/${user_id}`)
  .then(function (response) {
    console.log("Datos de usuarios:", response.data);
  })
  .catch(function (error) {
    console.error("Error al obtener datos de usuarios:", error);
  });
```

`axios.post(url, data, config)`

```javascript
// Definir los datos que se enviarán en la solicitud POST
const postData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

// Realizar la solicitud POST
axios
  .post("/api/users", postData)
  .then(function (response) {
    // Manejar la respuesta exitosa
    console.log("Usuario creado:", response.data);
  })
  .catch(function (error) {
    // Manejar el error
    console.error("Error al crear usuario:", error);
  });
```

`axios.put(url, data, config)`

```javascript
axios
  .put(`/api/users/${user_id}`, {
    email: "nuevo@email.com",
  })
  .then(function (response) {
    console.log("Usuario actualizado:", response.data);
  })
  .catch(function (error) {
    console.error("Error al actualizar usuario:", error);
  });
```

`axios.delete(url, config)`

```javascript
axios
  .delete(`/api/users/${user_id}`)
  .then(function (response) {
    console.log("Usuario eliminado correctamente");
  })
  .catch(function (error) {
    console.error("Error al eliminar un usuario:", error);
  });
```

## ¿Que son los interceptores?

A menudo necesitamos realizar acciones adicionales antes o después de enviar o recibir una solicitud y aquí es donde entran en juego los interceptores de Axios.

Los interceptores en Axios son funciones que nos permiten interceptar y modificar solicitudes HTTP _antes de que sean enviadas y después de que sean recibidas_. Esto nos brinda la capacidad de agregar encabezados personalizados, transformar los datos de la solicitud o respuesta, manejar errores de manera centralizada y mucho más.

![Representación grafica del funcionamiento de los interceptors](https://miro.medium.com/v2/resize:fit:720/format:webp/1*s4CmiOUvaKN4QlbqbA67sA.png)

### Interceptores de Solicitud (Request Interceptor)

El interceptor de solicitud nos permite realizar acciones antes de que la solicitud sea enviada al servidor. Algunos casos de uso comunes incluyen agregar encabezados personalizados, modificar los datos de la solicitud o realizar transformaciones en la misma, por ejemplo:

```javascript
axios.interceptors.request.use(function (config) {
  // Agregamos dos encabezados muy tipicos y se enviaran en cada solicitud
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});
```

### Interceptor de Respuesta (Response Interceptor)

El interceptor de respuesta nos permite realizar acciones después de recibir una respuesta del servidor, _pero antes de que la promesa se resuelva o rechace_. Algunos casos de uso comunes incluyen transformar los datos de respuesta, manejar errores de manera centralizada o realizar operaciones de limpieza. Por ejemplo:

```javascript
axios.interceptors.response.use(
  function (response) {
    // Retornamos la respues exitosa
    return response;
  },
  function (error) {
    // Manejamos el error
    if (error.response.status === 401) {
      // Redirigimos a la página de login si recibimos un error de autenticación
      window.location.href = "/login";
    }
    // Si es otro error inesperado, entoces lo retornamos
    return Promise.reject(error);
  }
);
```

### Ventajas de Utilizar Interceptores

- **Centralización de la lógica**: Los interceptores permiten centralizar la lógica de manejo de solicitudes y respuestas HTTP en un solo lugar, lo que facilita el mantenimiento y la organización del código.
- **Personalización de Solicitudes y Respuestas**: Los interceptores nos brindan la flexibilidad para personalizar las solicitudes y respuestas según las necesidades específicas de nuestra aplicación.

- **Manejo de Errores Centralizado**: Los interceptores de respuesta nos permiten manejar errores de manera centralizada, lo que facilita la implementación de lógica de manejo de errores coherente en toda la aplicación.

## Instancias en Axios

Cuando trabajamos con solicitudes HTTP en nuestras aplicaciones, a menudo necesitamos configurar ciertos parámetros como la URL base o los encabezados de manera consistente en todas nuestras solicitudes. Para facilitar esta tarea, Axios nos proporciona la capacidad de crear instancias personalizadas con **configuraciones específicas**.

En Axios, una instancia es una versión personalizada de la biblioteca Axios que se puede configurar con opciones específicas. Esto nos permite tener múltiples instancias de Axios con **diferentes configuraciones en una misma aplicación**. Cada instancia puede tener su propia URL base, encabezados personalizados, tiempos de espera y más.

Para crear una instancia personalizada en Axios, utilizamos el método axios.create(). Este método nos permite crear una nueva instancia de Axios con configuraciones específicas que se aplicarán a todas las solicitudes realizadas con esa instancia. Por ejemplo:

```javascript
const instancia = axios.create({
  baseURL: "https://tu-api.com/users",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axios.get("/").then(function (response) {
  // Esta petición fue hecha a la url actual
  // Y no tiene cabezera de autorización
});

instancia.get("/").then(function (response) {
  // Mientras que esta petición fue hecha a https://tu-api.com/users
  // Y con la cabezera de autorización especificada en la configuración
});
```

## Ejemplo práctico: Consulta a la API de JSONPlaceHolder

Para demostrar la utilidad de los interceptores y las instancias de Axios vamos a programar un codigo que use un recurso especifico de la API de JSONPlaceHolder.

1. Primero creamos una instancia de Axios llamada `api` con la url base del recurso y sus cabezeras. En este caso, vamos a consultar el recurso posts.

```javascript
const api = axios.create({
  // Configuramos una instancia de Axios con la URL base de la API y los encabezados necesarios
  baseURL: "https://jsonplaceholder.typicode.com/posts", // URL base de la API
  headers: {
    Accept: "application/json", // Encabezados requeridos para recibir datos JSON
  },
});
```

2. Analizando el recurso que nos brinda JsonPlaceHolder podemos notar que todos los posts tinen las siguientes propiedades: `userId`, `id`, `title` y `body`. Es importante destacar que la solicitud devuelve los datos de los posts en objetos javascript, y que cuando son más de un post los agrupa a todos en un array. Como actualmente `typeof` en javascript no nos permite diferenciar entre un array y un objeto, crearemos una función auxiliar que lo haga por medio de los prototipos:

```javascript
// Función auxiliar para obtener el tipo de dato de una variable
function getType(value) {
  const prototype = Object.prototype.toString.call(value);
  return prototype.split(" ").pop().slice(0, -1).toLowerCase();
} // Esto retorna "array", "object", "string", "number", "null", "function" ó "boolean"
```

3. Teniendo en cuenta lo anterior y usando la función auxiliar que acabamos de crear vamos a extraer de la respuesta los datos que nos interesan, por ejemplo, solo el titulo y el cuerpo de los posts. Para esto vamos a usar un interceptor de respuesta, si la respuesta es un objeto entonces la api solamente nos retorno un post pero si la respuesta es un array entonces la api nos habrá retornado más de uno.

```javascript
// Interceptor de respuesta de Axios
api.interceptors.response.use(function (response) {
  // Este interceptor se ejecuta antes de que se resuelvan las promesas devueltas por las solicitudes
  const data = response.data;
  // Verificamos el tipo de datos devueltos por la API
  if (getType(data) === "array") {
    // Si la respuesta es un array, formateamos cada elemento del array
    return data.map(post => ({
      title: post.title, // Extraemos el título del post
      body: post.body, // Extraemos el cuerpo del post
    }));
  }

  if (getType(data) === "object") {
    // Si la respuesta es un objeto, formateamos el objeto
    return {
      title: data.title, // Extraemos el título del post
      body: data.body, // Extraemos el cuerpo del post
    };
  }

  // Si la respuesta no es ni un array ni un objeto, la devolvemos sin cambios
  return response;
});
```

4. Y con esos simples pasos, ya podemos hacer consultas a la api de manera sencilla, sabiendo el tipo de dato que retornarán las promesas mientras no ocurra ningún error en la consulta. Por ejemplo:

```javascript
// Solicitar todos los posts
api.get("/").then(posts => {
  console.log(`Hay ${posts.length} posts`); // Imprimimos la cantidad de posts en la consola
  console.log(`El primer post es "${posts[0].title}"`); // E imprimos el titulo del primer post en el arreglo
});

// Solicitar un post específico
api.get("/1").then(post => {
  // Manejamos la respuesta de la solicitud de un post específico
  console.log(`${post.title}: ${post.body}`); // Imprimir el título y el cuerpo del post en la consola
});
```

Y por si fuera poco: lo que hicimos anteriormente es facilmente encapsulable. Podrías envolver la instancia ya sea en otro objeto(Creando metodos especificos que hagan las consultas y manejen los errores) o en un hook de React.
