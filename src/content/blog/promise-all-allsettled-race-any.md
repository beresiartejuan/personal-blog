---
author: Juan Beresiarte
pubDatetime: 2026-10-07T15:15:00Z
title: "Promise.all, allSettled, race y any: cuál usar para varias promesas"
slug: promise-all-allsettled-race-any
featured: false
draft: false
tags:
  - javascript
  - async
description: Entendé las cuatro formas de combinar promesas en JavaScript, qué devuelve cada una cuando algo falla y cuándo conviene elegir una u otra.
---

## Cuando una sola promesa no alcanza

Con `async/await` esperar una promesa es fácil. El problema aparece cuando tenés varias: pedir un usuario, sus pedidos y sus notificaciones, por ejemplo. Lo primero que sale suele ser esto:

```javascript
const usuario = await obtenerUsuario(id);
const pedidos = await obtenerPedidos(id);
const notificaciones = await obtenerNotificaciones(id);
```

Funciona, pero cada `await` espera a que termine el anterior. Si cada pedido tarda 300 ms, esperás casi un segundo cuando las tres cosas podrían ir en paralelo, porque ninguna depende de la otra.

Para eso JavaScript tiene cuatro métodos estáticos en `Promise`: `all`, `allSettled`, `race` y `any`. Los cuatro reciben un array (o cualquier iterable) de promesas y devuelven una sola promesa nueva. Lo que cambia es **cuándo se resuelve** y **qué pasa si algo falla**.

## Promise.all: todas o ninguna

`Promise.all` espera a que **todas** las promesas se cumplan y te devuelve un array con los resultados, en el mismo orden en que las pasaste (no en el orden en que terminaron):

```javascript
const [usuario, pedidos, notificaciones] = await Promise.all([
  obtenerUsuario(id),
  obtenerPedidos(id),
  obtenerNotificaciones(id),
]);
```

Ahora las tres peticiones arrancan juntas y el tiempo total es el de la más lenta.

La contra es que es "todo o nada": si **una sola** se rechaza, `Promise.all` se rechaza enseguida con ese error y perdés los resultados de las demás.

```javascript
try {
  const datos = await Promise.all([pedidoOk(), pedidoQueFalla(), otroPedidoOk()]);
} catch (error) {
  // Llegás acá apenas falla pedidoQueFalla()
  console.error(error);
}
```

Usalo cuando necesitás **todos** los datos para seguir: si falta uno, igual no podrías mostrar la pantalla.

## Promise.allSettled: quiero saber cómo terminó cada una

`Promise.allSettled` espera a que todas terminen, salga bien o mal, y **nunca se rechaza**. A cambio, te devuelve un array de objetos que describen el resultado de cada una:

```javascript
const resultados = await Promise.allSettled([
  obtenerUsuario(id),
  obtenerPedidos(id),
  obtenerNotificaciones(id),
]);

// [
//   { status: "fulfilled", value: {...} },
//   { status: "rejected", reason: Error(...) },
//   { status: "fulfilled", value: [...] },
// ]
```

Después filtrás según lo que necesites:

```javascript
const exitosos = resultados
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);

const errores = resultados
  .filter((r) => r.status === "rejected")
  .map((r) => r.reason);
```

Es ideal cuando las tareas son **independientes** y un fallo no debería arruinar el resto: mandar varios emails, subir varios archivos o cargar widgets de un dashboard que pueden mostrarse por separado.

## Promise.race: la primera que termine

`Promise.race` se resuelve o se rechaza con **la primera promesa que termine**, sea cual sea el resultado. Las demás siguen corriendo, pero su resultado se ignora.

El uso más clásico es ponerle un tiempo límite a una operación:

```javascript
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Tardó más de ${ms} ms`)), ms)
  );
}

const respuesta = await Promise.race([
  fetch("/api/reportes"),
  timeout(5000),
]);
```

Si el `fetch` responde antes de 5 segundos, ganás la respuesta; si no, la promesa se rechaza con el error del timeout.

Ojo con un detalle: `race` no cancela nada. El `fetch` sigue en curso aunque "haya perdido". Si de verdad querés cortar la petición, para eso existe `AbortController` (o directamente `AbortSignal.timeout(5000)` en los navegadores y versiones de Node actuales).

## Promise.any: la primera que salga bien

`Promise.any` se parece a `race`, pero ignora los rechazos: se resuelve con **la primera promesa que se cumpla**. Solo se rechaza si **todas** fallan, y en ese caso te da un `AggregateError` con todos los errores juntos:

```javascript
try {
  const datos = await Promise.any([
    fetch("https://espejo-1.ejemplo.com/datos.json"),
    fetch("https://espejo-2.ejemplo.com/datos.json"),
  ]);
} catch (error) {
  // error es un AggregateError
  console.error(error.errors); // array con el error de cada promesa
}
```

Sirve cuando tenés varias fuentes equivalentes y te alcanza con una: servidores espejo, cachés alternativas o distintos proveedores de un mismo dato.

## Errores comunes

1. **Crear las promesas tarde**  
   Las promesas empiezan a ejecutarse cuando las creás, no cuando las pasás a `Promise.all`. Si hacés `await` dentro del array, volvés a ir de a una:

   ```javascript
   // Mal: sigue siendo secuencial
   await Promise.all([await pedidoA(), await pedidoB()]);

   // Bien
   await Promise.all([pedidoA(), pedidoB()]);
   ```

2. **Usar `forEach` con `async`**  
   `forEach` no espera nada, así que el código sigue antes de que terminen las tareas. Si querés procesar una lista en paralelo, combiná `map` con `Promise.all`:

   ```javascript
   const productos = await Promise.all(ids.map((id) => obtenerProducto(id)));
   ```

3. **Disparar miles de promesas a la vez**  
   `Promise.all` no limita cuántas corren en paralelo. Con una lista de 5.000 ids podés saturar una API o recibir errores por exceso de peticiones. En esos casos conviene procesar por tandas o usar una librería que limite la concurrencia, como `p-limit`.

4. **Confundir `race` con `any`**  
   Si la primera en terminar es un error, `race` se rechaza; `any` sigue esperando a que alguna salga bien. Para timeouts querés `race`; para "dame cualquiera que funcione", `any`.

## Cuál elegir

Una forma rápida de decidir es preguntarte qué te importa:

- **Necesito todos los resultados**: `Promise.all`.
- **Necesito saber qué salió bien y qué mal**: `Promise.allSettled`.
- **Me importa la primera en terminar, aunque falle**: `Promise.race`.
- **Me importa la primera que funcione**: `Promise.any`.

## Conclusión

Combinar promesas es de esas cosas que separan un código que "funciona" de uno que además responde rápido y se banca los errores con elegancia. Los cuatro métodos resuelven el mismo problema de fondo, esperar varias cosas a la vez, pero cada uno toma una decisión distinta sobre qué hacer cuando algo sale mal, y elegir bien es básicamente decidir cómo querés que se comporte tu app ante un fallo.

Mi consejo es que `Promise.all` sea tu opción por defecto cuando las tareas no dependen entre sí, y que pases a `allSettled` apenas un error parcial no debería tirar abajo todo lo demás. `race` y `any` se usan menos, pero cuando necesitás un timeout o un plan B entre varias fuentes, te ahorran escribir bastante lógica a mano.

Si querés profundizar, MDN tiene cada método bien explicado: [Promise.all](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [Promise.allSettled](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled), [Promise.race](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) y [Promise.any](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/any).
