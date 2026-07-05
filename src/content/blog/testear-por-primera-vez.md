---
author: Juan Beresiarte
pubDatetime: 2026-02-28T19:34:20Z
title: Hacer testing por primera vez sin morir en el intento
slug: testing-sin-morir-en-el-intento
featured: false
draft: false
tags:
  - javascript
  - librerias
  - testing
description: Una guía práctica para escribir tu primer test en JavaScript con Vitest, sin experiencia previa en testing.
---

## Por qué deberías leer esto

Cuando empecé a programar, había una palabra que aparecía en todas las ofertas de trabajo, en todos los tutoriales avanzados y en todas las conversaciones de developers más experimentados: **testing**.

Y cada vez que la escuchaba, hacía lo mismo: la ignoraba.

No porque no quisiera aprender, sino porque sonaba complicado, aburrido y, sobre todo, _opcional_. Yo quería construir cosas, ver resultados, hacer que los botones funcionaran. ¿Escribir código para probar mi código? Me parecía una pérdida de tiempo.

Hasta que un día tuve que modificar una función que "funcionaba perfectamente" y sin querer rompí otras tres partes de la aplicación. Ahí entendí para qué sirve el testing. Y cuando finalmente me senté a aprenderlo, descubrí algo que nadie me había dicho: no es tan difícil como parece.

Este artículo es lo que me hubiera gustado leer ese día. Y no importa si estás construyendo un proyecto grande o un script personal: escribir tests te va a ahorrar bugs tontos y dolores de cabeza.

---

## ¿Qué es un test?

Un test es, en su forma más simple, una **pregunta con una respuesta esperada**.

Cuando terminamos de cocinar, probamos la comida antes de servirla. Un test en programación hace exactamente eso: verifica que, dado cierto input, el código devuelva el output correcto.

La diferencia con probarlo a mano en el navegador es que el test se puede correr **cientos de veces, en segundos, de forma automática**. Pensalo como un checklist automático que revisa todo por vos cada vez que cambiás algo. Si rompiste algo sin darte cuenta, el test te avisa.

---

## Tipos de testing: los dos que importan al principio

### Unit Testing — Una pieza a la vez

Probamos **una sola unidad de código** de forma aislada: una función, un componente, una operación concreta. "Aislada" significa que la probamos sin depender de otras partes del sistema — no necesitamos una base de datos, una API ni otros módulos para que el test funcione. Es el tipo de test más común para empezar y el más accesible de escribir.

### Integration Testing — Todo junto

Verificamos que **varias piezas funcionen bien en conjunto**. Es un poco más complejo porque involucra más partes del sistema, pero no hace falta preocuparse por esto todavía.

> 💡 Si una función hace una cosa concreta y devuelve un resultado, es candidata a una unit test. Cuando dos o más partes del sistema colaboran, pensemos en una integration test.

---

## Manos al código: tu primer test

Suficiente teoría. Vamos a escribir un test real, paso a paso.

### 1. La función que vamos a testear

```javascript
// math.js
function sumar(a, b) {
  return a + b;
}

export { sumar };
```

### 2. Instalar Vitest

Usaremos **Vitest**, un framework de testing moderno y muy popular en proyectos con Vite. Existen alternativas como **Jest** o **Mocha**, pero Vitest tiene una configuración mínima y una API muy parecida a Jest, así que lo aprendido acá es transferible.

```bash
npm install -D vitest
```

En el `package.json`, agregamos el script:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### 3. Escribir el test

Por convención, el archivo de test lleva el mismo nombre que el archivo que prueba, con `.test.` en el medio:

```javascript
// math.test.js
import { describe, it, expect } from "vitest";
import { sumar } from "./math.js";

describe("sumar", () => {
  it("debería devolver 5 cuando sumamos 2 y 3", () => {
    const resultado = sumar(2, 3);
    expect(resultado).toBe(5);
  });

  it("debería devolver 0 cuando sumamos números negativos y positivos iguales", () => {
    const resultado = sumar(-5, 5);
    expect(resultado).toBe(0);
  });

  it("debería sumar correctamente dos números negativos", () => {
    const resultado = sumar(-2, -3);
    expect(resultado).toBe(-5);
  });
});
```

### 4. Entender cada parte

**`describe('sumar', () => { ... })`**
Agrupa todos los tests relacionados a una misma unidad. No es obligatorio, pero hace que el código sea más ordenado y fácil de navegar.

**`it('debería devolver 5...', () => { ... })`**
Define una prueba individual. El primer argumento es una descripción en lenguaje natural de qué debería ocurrir. Empezar con _"debería..."_ no es solo estilo: hace que cuando un test falle, el mensaje de error sea inmediatamente legible. _"sumar debería devolver 5 cuando sumamos 2 y 3"_ nos dice exactamente qué falló sin necesidad de leer el código.

> En otros frameworks como Jest, `it` y `test` son intercambiables. Si venís de ese mundo, es lo mismo.

**`expect(resultado).toBe(5)`**
El corazón del test. Si `resultado` es 5, el test pasa. Si es cualquier otra cosa, falla. `.toBe()` es uno de los muchos _matchers_ disponibles; con el tiempo vamos a conocer otros como `.toEqual()`, `.toBeTruthy()` o `.toContain()`.

### 5. Correr los tests

```bash
npm test
```

```
✓ sumar > debería devolver 5 cuando sumamos 2 y 3
✓ sumar > debería devolver 0 cuando sumamos números negativos y positivos iguales
✓ sumar > debería sumar correctamente dos números negativos

Test Files  1 passed (1)
Tests       3 passed (3)
```

Tres tests, tres resultados verdes. Ya estamos testeando.

---

## Cuando el test falla — y por qué eso es bueno

Un test que falla no es un error del sistema. Es el sistema funcionando exactamente como fue diseñado.

Supongamos que alguien modifica la función `sumar` y, sin querer, introduce un bug:

```javascript
// math.js — versión con un bug
function sumar(a, b) {
  return a * b; // ← Multiplicamos en lugar de sumar.
}
```

Al correr los tests:

```
✗ sumar > debería devolver 5 cuando sumamos 2 y 3

  AssertionError: expected 6 to be 5

    - Expected: 5
    + Received: 6

Test Files  1 failed (1)
Tests       1 failed | 2 passed (3)
```

Sabemos qué test falló, cuál era el resultado esperado y cuál fue el recibido. Sin revisar toda la aplicación, sin hacer clic en diez pantallas. El test nos lleva directo al problema.

Un test que falla es feedback positivo: te está ahorrando minutos (o horas) de debugging manual. Ese es el valor real del testing: **no nos avisa solo cuando las cosas funcionan, sino también cuando dejan de funcionar**.

---

## Errores comunes al empezar

**Querer testear todo de una sola vez.**
El primer impulso suele ser cubrir todo el proyecto de una vez. El resultado casi siempre es el mismo: bloqueo total y ningún test escrito. Vale más un test real que diez planificados.

**Escribir tests que siempre pasan.**
Un test demasiado permisivo no protege nada. Una buena práctica es verificar que el test también falla cuando el código está mal, no solo que pasa cuando está bien.

**Olvidar los imports.**
Uno de los errores más confusos al principio: el test falla con un error raro y resulta que nos olvidamos de importar la función o el módulo que queríamos probar. Siempre verificá que el `import` esté correcto antes de buscar el bug en otra parte.

**No ejecutar los tests después de cada cambio.**
Los tests son útiles solo si los corremos. Incorporar `npm test` como parte del flujo de trabajo es tan importante como escribirlos.

**Desanimarse cuando un test falla.**
Encontrar el error en la terminal, antes de que llegue a producción, es exactamente la noticia que queremos recibir.

---

## Conclusión

Hay un cambio que ocurre cuando empezamos a escribir tests y que no es fácil de anticipar: **dejamos de tenerle miedo a modificar nuestro propio código**.

Tocar una función que "ya funcionaba" generaba cierta ansiedad. ¿Y si rompemos algo? Con tests, hacemos el cambio, corremos la suite, y en segundos sabemos si todo sigue en orden.

Los developers que escriben tests no lo hacen porque sean más disciplinados. Lo hacen porque en algún momento sufrieron lo suficiente sin ellos.

Una función, un archivo de test, tres líneas. `expect`, `toBe`, un resultado esperado. Eso es suficiente para empezar. Y si Vitest no te convence, podés probar con **Jest** o **Mocha** — la idea es la misma.
