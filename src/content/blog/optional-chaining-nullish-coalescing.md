---
author: Juan Beresiarte
pubDatetime: 2026-10-02T15:00:00Z
title: "Optional chaining y nullish coalescing: menos if, menos errores"
slug: optional-chaining-nullish-coalescing
featured: false
draft: false
tags:
  - javascript
  - tips
description: Aprende a usar ?. y ?? en JavaScript para leer propiedades profundas y definir valores por defecto sin cadenas de if ni falsy inesperados.
---

## El dolor de navegar objetos inseguros

Cuando consumís una API o leés un objeto anidado, es fácil terminar con código así:

```javascript
const ciudad =
  usuario &&
  usuario.direccion &&
  usuario.direccion.ciudad
    ? usuario.direccion.ciudad
    : "Sin ciudad";
```

Funciona, pero es ruidoso, difícil de leer y fácil de romper si cambia la forma del objeto. JavaScript moderno trae dos operadores pensados exactamente para esto: **optional chaining** (`?.`) y **nullish coalescing** (`??`).

## Optional chaining (`?.`): “si existe, seguí”

El operador `?.` te deja acceder a una propiedad (o llamar un método) **solo si el valor de la izquierda no es `null` ni `undefined`**. Si lo es, la expresión entera se corta y devuelve `undefined` en lugar de lanzar un error.

```javascript
const usuario = {
  nombre: "Ana",
  direccion: {
    ciudad: "Mendoza",
  },
};

console.log(usuario.direccion?.ciudad); // "Mendoza"
console.log(usuario.contacto?.email);   // undefined (sin explotar)
```

También sirve para arrays y llamadas:

```javascript
const primerTag = post.tags?.[0];
const titulo = api.getTitulo?.(); // solo llama si getTitulo existe
```

Es ideal cuando los datos pueden venir incompletos: respuestas parciales de una API, props opcionales o configuración que a veces no está.

## Nullish coalescing (`??`): default solo cuando “no hay valor”

`??` te da un valor de respaldo **únicamente** si el de la izquierda es `null` o `undefined`. A diferencia de `||`, **no** trata como “vacío” a `0`, `""` o `false`.

```javascript
const pagina = filtros.page ?? 1;
const busqueda = filtros.q ?? "";
const activo = filtros.activo ?? true;

console.log(0 ?? 10);   // 0  (con || sería 10)
console.log("" ?? "x"); // "" (con || sería "x")
console.log(null ?? 10); // 10
```

Si estás modelando páginas, contadores o flags, esto evita un clásico bug: pisar un `0` o un `false` válidos con el default.

## Juntos rinden mucho más

La combinación más útil es leer con `?.` y completar con `??`:

```javascript
function nombreVisible(usuario) {
  return usuario?.perfil?.nombre ?? "Usuario anónimo";
}

function precioFinal(producto) {
  return producto?.precio?.descuento ?? producto?.precio?.lista ?? 0;
}
```

Leés en profundidad sin miedo a un `TypeError`, y solo caés al default cuando realmente no hay valor.

### Un patrón limpio para configs

```javascript
const config = {
  timeout: opciones?.timeout ?? 3000,
  retries: opciones?.retries ?? 2,
  debug: opciones?.debug ?? false,
};
```

Queda declarativo, corto y predecible.

## Errores comunes (y cómo evitarlos)

1. **Usar `||` cuando querías `??`**  
   Si `0` o `""` son valores válidos, preferí `??`. Reservá `||` para cuando *cualquier* falsy deba disparar el default.

2. **Encadenar de más sin pensarlo**  
   `a?.b?.c?.d?.e` puede esconder un problema de diseño: si siempre necesitás `e`, tal vez convenga validar el objeto (por ejemplo con un schema) en lugar de silenciar todo.

3. **Asignar con optional chaining**  
   `usuario?.nombre = "Ana"` **no es válido**. `?.` es para leer o llamar, no para asignar. Para escribir, primero asegurate de que el objeto exista.

4. **Confundir “no existe” con “existe y es falsy”**  
   `usuario?.activo ?? true` deja `false` si `activo` es `false`. Eso es correcto con `??`. Si querías “cualquier cosa falsy → true”, ahí sí usarías `||` (y estarías eligiendo otro comportamiento a propósito).

## Cuándo sí y cuándo no

**Sí usalos cuando:**
- Los datos vienen de afuera (API, `localStorage`, query params).
- Una propiedad es opcional por diseño.
- Querés defaults claros sin anidar `if`.

**Pensalo dos veces cuando:**
- Un `undefined` silencioso te oculta un bug (mejor fallar temprano).
- Estás validando entrada crítica: ahí un schema (Zod, por ejemplo) suele ser más seguro que una cadena de `?.`.

## Conclusión

`?.` y `??` no son azúcar sintáctico de moda: son herramientas chicas que bajan el ruido del código y evitan errores tontos al leer datos incompletos. El primero corta el acceso con seguridad; el segundo pone defaults sin pisar ceros ni strings vacíos.

Si estás empezando, mi consejo es simple: **usá `?.` para navegar y `??` para defaults; dejá `||` solo cuando realmente quieras tratar todo falsy como vacío**. Vas a escribir menos defensivo y vas a entender mejor qué valores son válidos en tu app.

Podés revisar el comportamiento exacto en la documentación de MDN: [optional chaining](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining) y [nullish coalescing](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing).
