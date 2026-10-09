---
author: Juan Beresiarte
pubDatetime: 2026-10-09T15:00:00Z
title: "AbortController: cómo cancelar un fetch (y por qué conviene)"
slug: abortcontroller-cancelar-fetch
featured: false
draft: false
tags:
  - javascript
  - async
  - fetch
description: Aprendé a cancelar peticiones HTTP con AbortController, evitar condiciones de carrera en la UI y limpiar efectos en React o en código vanilla.
---

## El fetch que sigue vivo cuando ya no lo necesitás

Imaginá que el usuario escribe en un buscador. Cada tecla dispara un `fetch` al backend. Si escribe rápido, podés tener tres o cuatro peticiones en vuelo al mismo tiempo. La que termina última no siempre es la más reciente: a veces una respuesta vieja pisa el resultado nuevo y la UI muestra datos incorrectos.

Lo mismo pasa si el usuario cambia de página o cierra un modal mientras una petición sigue pendiente. El `fetch` no se cancela solo. Seguir esperando esa respuesta gasta red, puede actualizar estado de un componente que ya no existe y, en el peor caso, te deja con un bug difícil de reproducir.

Para eso existe **`AbortController`**: una API del navegador (y de Node) que te deja señalar “pará” a una operación asíncrona. `fetch` la entiende de fábrica.

## Qué es AbortController

`AbortController` es un objeto chico con dos piezas:

1. Un **`signal`** que le pasás a quien tiene que escuchar la cancelación.
2. Un método **`abort()`** que marca ese signal como abortado.

Cuando llamás `abort()`, cualquier `fetch` asociado a ese signal se rechaza con un error de tipo `AbortError` (en la práctica, un `DOMException`). No es un fallo de red: es una cancelación intencional.

```javascript
const controller = new AbortController();

fetch("/api/buscar?q=zapatillas", { signal: controller.signal })
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("La petición se canceló a propósito");
      return;
    }
    throw err;
  });

// Más tarde, si ya no necesitás la respuesta:
controller.abort();
```

El punto clave: **un controller, un signal**. Si querés cancelar un grupo de peticiones juntas, compartís el mismo `signal`. Si querés cancelarlas por separado, creás un controller por petición.

## El patrón más útil: cancelar la búsqueda anterior

En un input de búsqueda, lo habitual es abortar la petición anterior antes de disparar la nueva:

```javascript
let controller = null;

async function buscar(query) {
  controller?.abort();
  controller = new AbortController();

  try {
    const res = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") return null; // se canceló; no es un error real
    throw err;
  }
}
```

Así solo la última consulta “gana”. Las anteriores mueren en silencio y no actualizan la lista de resultados.

## Timeouts con AbortSignal.timeout

A veces no querés cancelar porque el usuario se fue, sino porque la petición tarda demasiado. En navegadores modernos podés usar `AbortSignal.timeout(ms)` sin armar el controller a mano:

```javascript
try {
  const res = await fetch("/api/lento", {
    signal: AbortSignal.timeout(5000), // 5 segundos
  });
  const data = await res.json();
} catch (err) {
  if (err.name === "TimeoutError" || err.name === "AbortError") {
    console.log("Se agotó el tiempo de espera");
  } else {
    throw err;
  }
}
```

Si necesitás compatibilidad más amplia o combinar timeout con cancelación manual, creás el controller vos y usás `setTimeout(() => controller.abort(), 5000)`.

## En React: limpiar el efecto

En un `useEffect` que dispara un `fetch`, la función de cleanup es el lugar natural para abortar:

```javascript
useEffect(() => {
  const controller = new AbortController();

  async function cargar() {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setUsuario(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err);
    }
  }

  cargar();
  return () => controller.abort();
}, [id]);
```

Cuando cambia `id` o el componente se desmonta, React corre el cleanup, abortás el fetch viejo y evitás el clásico warning de “Can't perform a React state update on an unmounted component” (y, más importante, evitás mostrar datos del id anterior).

## Errores comunes

1. **Tratar `AbortError` como un fallo de la app**  
   Si mostrás un toast genérico en el `catch`, el usuario va a ver errores fantasmas cada vez que cancelás. Filtrá por `err.name === "AbortError"` (o `err.name === "TimeoutError"`) y salí sin alarma.

2. **Reutilizar un controller ya abortado**  
   Una vez que llamaste `abort()`, ese signal queda abortado para siempre. Para la siguiente petición creá un **nuevo** `AbortController`.

3. **Olvidar pasar el `signal`**  
   Llamar `controller.abort()` sin haber pasado `signal` al `fetch` no cancela nada. El controller solo habla con quien escucha su signal.

4. **Abortar demasiado tarde**  
   Si abortás después de haber parseado el JSON y justo antes de `setState`, igual podés pisar estado. Lo ideal es abortar la petición; si además querés ser defensivo, chequeá un flag o ignorá el resultado si el signal ya está abortado.

## No solo sirve para fetch

Cualquier API que acepte un `AbortSignal` puede cancelarse igual: `addEventListener` (con `{ signal }`), algunas APIs de streams, librerías de HTTP como Axios (vía `signal` o adaptadores), y cada vez más APIs del ecosistema. La idea es la misma: una señal compartida para decir “esto ya no hace falta”.

## Conclusión

`AbortController` no hace tu código más “moderno” por sí solo: te da control sobre operaciones que, de otra forma, siguen vivas cuando la UI ya cambió de idea. En búsquedas, cambios de ruta y efectos de React, cancelar a tiempo evita condiciones de carrera y trabajo innecesario.

Mi consejo es simple: **cada vez que un `fetch` pueda quedar obsoleto antes de terminar, acompañalo de un `AbortController`**. Empezá por el patrón de “abortá el anterior, creá uno nuevo” en búsquedas y por el cleanup del `useEffect`. Con eso cubrís la mayoría de los casos reales, y el resto (timeouts, cancelación en lote) encaja encima sin inventar infraestructura rara.

Si querés el detalle de la API, MDN lo documenta bien: [AbortController](https://developer.mozilla.org/es/docs/Web/API/AbortController) y [AbortSignal](https://developer.mozilla.org/es/docs/Web/API/AbortSignal).
