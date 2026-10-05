---
author: Juan Beresiarte
pubDatetime: 2026-10-05T15:15:00Z
title: "Desestructuración, spread y rest: los tres puntos que más vas a usar"
slug: desestructuracion-spread-rest-javascript
featured: false
draft: false
tags:
  - javascript
  - tips
description: Entendé la desestructuración de objetos y arrays, y la diferencia entre spread y rest en JavaScript, con ejemplos simples y los errores más comunes.
---

## Sacar datos sin repetir tanto

Leer varias propiedades de un objeto suele terminar en algo así:

```javascript
const nombre = usuario.nombre;
const email = usuario.email;
const rol = usuario.rol;
```

No está mal, pero repetís `usuario.` en cada línea y, si el objeto crece, el bloque crece con él. JavaScript tiene una sintaxis pensada justo para esto: la **desestructuración**. Y muy de la mano vienen los famosos tres puntos (`...`), que según dónde los pongas se llaman **spread** o **rest**.

## Desestructurar objetos

La desestructuración te deja "abrir" un objeto y guardar sus propiedades en variables con el mismo nombre:

```javascript
const usuario = { nombre: "Ana", email: "ana@mail.com", rol: "admin" };

const { nombre, email, rol } = usuario;

console.log(nombre); // "Ana"
console.log(rol);    // "admin"
```

### Renombrar y poner valores por defecto

Si el nombre de la propiedad no te sirve como variable, lo podés renombrar con `:`. Y si la propiedad puede no estar, le das un default con `=`:

```javascript
const { nombre: nombreCompleto, pais = "Argentina" } = usuario;

console.log(nombreCompleto); // "Ana"
console.log(pais);           // "Argentina" (no existía en el objeto)
```

Ojo: el default se aplica solo cuando el valor es `undefined`. Si la propiedad vale `null`, te queda `null`.

### Objetos anidados

También podés entrar en niveles más profundos:

```javascript
const pedido = {
  id: 42,
  cliente: { nombre: "Ana", direccion: { ciudad: "Mendoza" } },
};

const {
  cliente: {
    direccion: { ciudad },
  },
} = pedido;

console.log(ciudad); // "Mendoza"
```

Funciona, pero si anidás demasiado se vuelve difícil de leer. Para dos niveles está bien; más que eso, suele ser más claro hacerlo en pasos.

## Desestructurar arrays

Con arrays la idea es la misma, pero lo que importa es la **posición**, no el nombre:

```javascript
const colores = ["rojo", "verde", "azul"];

const [primero, segundo] = colores;

console.log(primero); // "rojo"
console.log(segundo); // "verde"
```

Podés saltear posiciones dejando el lugar vacío:

```javascript
const [, , tercero] = colores; // "azul"
```

Y hay un truco clásico para intercambiar dos variables sin una auxiliar:

```javascript
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a, b); // 2 1
```

Si usás React, esto ya lo viste sin darte cuenta: `const [contador, setContador] = useState(0)` es desestructuración de un array.

## En los parámetros de una función

Uno de los usos más prácticos es desestructurar directamente en la firma de la función:

```javascript
function crearUsuario({ nombre, rol = "lector", activo = true }) {
  return { nombre, rol, activo };
}

crearUsuario({ nombre: "Ana" });
// { nombre: "Ana", rol: "lector", activo: true }
```

Así la función deja claro qué espera recibir, el orden de los argumentos deja de importar y los defaults quedan a la vista.

Si el objeto entero es opcional, agregale un default vacío para que no explote al llamarla sin argumentos:

```javascript
function conectar({ host = "localhost", puerto = 3000 } = {}) {
  return `${host}:${puerto}`;
}

conectar(); // "localhost:3000"
```

## Spread: expandir

Los tres puntos en una posición donde se **arma** algo (un array, un objeto o los argumentos de una llamada) se llaman **spread**: toman los elementos y los "desparraman".

```javascript
const base = [1, 2, 3];
const extendido = [...base, 4, 5]; // [1, 2, 3, 4, 5]

const config = { tema: "oscuro", idioma: "es" };
const nuevaConfig = { ...config, idioma: "en" };
// { tema: "oscuro", idioma: "en" }

Math.max(...base); // 3
```

En objetos, el orden importa: lo que va después pisa a lo de antes. Por eso `{ ...config, idioma: "en" }` es la forma típica de "copiar y cambiar una cosa", algo que vas a usar todo el tiempo para no mutar el estado original.

## Rest: juntar

Los mismos tres puntos en una posición donde se **recibe** algo (parámetros o desestructuración) se llaman **rest**: juntan "todo lo que sobra".

```javascript
function sumar(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}

sumar(1, 2, 3); // 6

const [cabeza, ...cola] = [10, 20, 30];
// cabeza = 10, cola = [20, 30]

const { password, ...usuarioPublico } = {
  nombre: "Ana",
  email: "ana@mail.com",
  password: "secreto",
};
// usuarioPublico = { nombre: "Ana", email: "ana@mail.com" }
```

Ese último patrón es muy útil para sacar una propiedad de un objeto sin tocar el original.

Una forma fácil de acordarte: **spread expande, rest junta**. Si los puntos están del lado que construye, es spread; si están del lado que recibe, es rest.

## Errores comunes

1. **Creer que spread hace una copia profunda**  
   `{ ...obj }` y `[...arr]` copian solo el primer nivel. Si adentro hay objetos, siguen siendo la misma referencia:

   ```javascript
   const original = { datos: { visitas: 1 } };
   const copia = { ...original };

   copia.datos.visitas = 99;
   console.log(original.datos.visitas); // 99
   ```

   Si necesitás una copia completa, existe `structuredClone(original)`.

2. **Desestructurar `undefined` o `null`**  
   `const { nombre } = undefined` lanza un `TypeError`. Si el valor puede faltar, usá un default (`= {}`) o validá antes.

3. **Poner el rest en el medio**  
   `const [...resto, ultimo] = lista` no es válido. El rest siempre va al final.

4. **Desestructurar objetos sin declarar la variable**  
   Si asignás a variables que ya existen, tenés que envolver todo en paréntesis, porque si no JavaScript interpreta las llaves como un bloque:

   ```javascript
   let nombre;
   ({ nombre } = usuario);
   ```

## Conclusión

La desestructuración y los tres puntos no agregan nada que no pudieras hacer antes con más líneas, pero cambian bastante cómo se lee el código: dejan claro qué datos usás, qué parámetros espera una función y qué parte de un objeto estás copiando o descartando. Por eso aparecen en casi cualquier base de código moderna, desde un helper chico hasta los hooks de React.

Mi consejo es usarlos donde realmente aclaran: desestructurar parámetros, copiar con spread para no mutar y separar propiedades con rest. Donde empiezan a anidarse tres o cuatro niveles, preferí ir de a pasos; que algo se pueda escribir en una sola línea no significa que convenga.

Si querés ver todos los casos, la documentación de MDN está muy completa: [desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) y [sintaxis spread](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax).
