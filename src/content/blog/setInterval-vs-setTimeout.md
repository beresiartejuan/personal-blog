---
author: Juan Beresiarte
pubDatetime: 2024-08-15T20:01:13Z
title: "setInterval vs setTimeout: ¿Cúal usar?"
slug: setinterval-vs-settimeout
featured: true
draft: false
tags:
  - javascript
description: Aprende las diferencias basicas entre setTimeout y setInterval.
---

Si has trabajado con JavaScript, seguro que en algún momento te has topado con `setInterval` y `setTimeout`. Estos dos métodos son como las herramientas mágicas para decirle a tu código cuándo hacer algo después de un tiempo o cada cierto intervalo. Pero, ¿cuándo deberías usar uno y no el otro? 🤔

## ¿Qué son `setTimeout` y `setInterval`?

Antes de decidir cuál usar, vale la pena recordar qué hace cada uno.

Imagina a **`setTimeout`** como una alarma que suena después de un tiempo. Le dices cuánto tiempo esperar y luego, boom, ejecuta la función. Pero solo lo hace una vez.

```javascript
setTimeout(() => {
  console.log("¡Hola después de 2 segundos!");
}, 2000);
```

Aquí, ese "¡Hola!" aparece después de 2 segundos y luego se acabó, la función no se repite.

En el caso de **`setInterval`** es como una alarma que sigue sonando cada ciertos minutos hasta que la apagas. Le dices cuánto tiempo esperar entre repeticiones y sigue ejecutando la función hasta que tú le digas que pare.

```javascript
setInterval(() => {
  console.log("¡Hola cada 2 segundos!");
}, 2000);
```

En este caso, el mensaje aparecerá cada 2 segundos, sin parar, hasta que detengas el intervalo con la función `clearInterval`.

### ¿Cuándo deberías usar `setTimeout`?

`setTimeout` es tu mejor amigo cuando quieres que algo pase solamente una vez, pero no inmediatamente. Aquí van algunas situaciones donde es súper útil:

- **Pequeñas pausas**: Tal vez necesitas esperar unos segundos antes de ejecutar una animación, o tal vez quieres dar tiempo a que algo cargue antes de mostrarlo.

- **Procesos asíncronos**: A veces necesitas esperar un poco antes de seguir con el siguiente paso en una operación compleja.

Así que, si solo necesitas un pequeño retraso antes de ejecutar algo una vez, `setTimeout` es tu opción.

### ¿Y qué pasa con `setInterval`?

`setInterval` es lo que quieres si necesitas que algo ocurra repetidamente, como un reloj que nunca deja de marcar. Aquí tienes algunos ejemplos donde `setInterval` brilla:

- **Relojes y temporizadores**: Imagina un reloj que actualiza la hora cada segundo o un temporizador de cuenta regresiva.

- **Chequeos constantes**: Verificar cada cierto tiempo si hay nuevos mensajes, actualizaciones, o si algo ha cambiado en tu aplicación.

- **Actualizaciones en tiempo real**: Refrescar el contenido de una página con datos nuevos cada pocos segundos.

Si lo que necesitas es que algo siga ocurriendo a intervalos regulares, entonces `setInterval` es el indicado.

## Un par de cosas sobre el rendimiento

Es importante mencionar que tanto `setTimeout` como `setInterval` no son infalibles. Si tu aplicación está muy ocupada, los temporizadores pueden retrasarse, especialmente si estás ejecutando muchas cosas al mismo tiempo. Y cuidado con `setInterval`, porque si lo que estás haciendo dentro de él tarda más que el intervalo que has fijado, las funciones se pueden empezar a acumular, y ahí es cuando empiezan los problemas.

Para evitar esto, algunos prefieren usar `setTimeout` de manera recursiva en lugar de `setInterval`, ya que así tienes más control sobre cuándo se ejecuta la siguiente función:

```javascript
function ejecutarCada2Segundos() {
  console.log("¡Hola cada 2 segundos!");
  setTimeout(ejecutarCada2Segundos, 2000);
}

ejecutarCada2Segundos();
```

Pero si decides usar `setInterval` es fundamental saber cómo detener el intervalo para evitar que siga corriendo indefinidamente. Aquí es donde entra `clearInterval`. Este método te permite detener un intervalo activo. Aquí tienes un ejemplo sencillo:

```javascript
const intervalo = setInterval(() => {
  console.log("¡Hola cada 2 segundos!");
}, 2000);

// Detener el intervalo después de 10 segundos
setTimeout(() => {
  clearInterval(intervalo);
  console.log("Intervalo detenido");
}, 10000);
```

En este ejemplo, el mensaje "¡Hola cada 2 segundos!" se repetirá durante 10 segundos. Después de ese tiempo, `clearInterval` se encarga de detener el intervalo, y el mensaje "Intervalo detenido" se muestra en la consola.

## Entonces, ¿cuál uso?

En resumen, si necesitas que algo pase solo una vez después de un tiempo, `setTimeout` es el camino a seguir. Pero si quieres que algo se repita continuamente, opta por `setInterval`.

Ambos son herramientas poderosas en JavaScript, y saber cuándo usar cada una puede hacer que tu código sea más eficiente y fácil de manejar.
