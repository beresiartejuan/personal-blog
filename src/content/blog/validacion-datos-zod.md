---
author: Juan Beresiarte
pubDatetime: 2026-07-05T19:00:00Z
title: "Zod: Validación de datos sin dolor"
slug: validacion-datos-zod
featured: false
draft: false
tags:
  - javascript
  - librerias
  - tipos
description: Descubre cómo Zod elimina la complejidad de validar formularios y datos en JavaScript. Aprende a crear schemas tipados y manejar errores personalizados.
---

## El problema de la validación manual

Si alguna vez has creado un formulario o has consumido una API, sabrás que validar datos es una tarea tediosa. Normalmente terminamos escribiendo decenas de condicionales como:

```javascript
if (!user.email || !user.email.includes('@')) {
  return "Email inválido";
}
if (user.password.length < 8) {
  return "Contraseña demasiado corta";
}
```

Este enfoque es propenso a errores, difícil de mantener y, sinceramente, muy aburrido de escribir. Aquí es donde entra **Zod**.

## ¿Qué es Zod?

Zod es una librería de **validación de esquemas**. En lugar de escribir validaciones manuales campo por campo, Zod te permite definir un "contrato" (llamado **Schema**) que describe exactamente cómo deben lucir tus datos. 

Si los datos cumplen el contrato, Zod los deja pasar; si no, te dice exactamente qué falló y por qué.

Lo más potente de Zod es que es "TypeScript-first". Esto significa que no solo valida los datos mientras tu aplicación corre (runtime), sino que también puede generar automáticamente los tipos de TypeScript para que tengas autocompletado en todo tu proyecto sin tener que escribir la interfaz dos veces.

## Tu primer Schema: El "Contrato" de datos

Crear un schema con Zod es casi como describir el objeto que esperas recibir. Vamos a ver un ejemplo sencillo para validar un usuario:

```javascript
import { z } from "zod";

// Definimos el "contrato"
const userSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  email: z.string().email("Email no válido"),
  age: z.number().min(18, "Debes ser mayor de edad"),
});

// Datos a validar
const userData = {
  name: "Ju", 
  email: "juan@example", // Error: email inválido
  age: 15,              // Error: menor de edad
};

// Validamos usando safeParse (evita que la app lance una excepción)
const result = userSchema.safeParse(userData);

if (!result.success) {
  // result.error contiene todos los fallos detallados
  console.log(result.error.flatten().fieldErrors);
}
```

### ¿Por qué `safeParse` en lugar de `parse`?
Zod ofrece dos formas de validar:
1. `.parse()`: Si los datos fallan, lanza un error que detiene la ejecución (necesitarías un `try/catch`).
2. `.safeParse()`: Devuelve un objeto con `success: true/false`. Es la opción recomendada para formularios y APIs ya que es más controlada y limpia.

## Superpoderes de Zod: Transformaciones y Tipado

Zod no solo dice "sí" o "no"; también puede limpiar tus datos y ayudarte a programar más rápido.

### 1. Transformaciones (Limpieza automática)
A veces los datos llegan "sucios" (con espacios extra o en mayúsculas). Zod puede normalizarlos durante la validación:

```javascript
const loginSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase().trim()),
});

const result = loginSchema.parse("  JUAN@Example.Com  ");
console.log(result.email); // "juan@example.com"
```

### 2. Inferencia de Tipos (Adiós a la duplicación)
Si usas TypeScript, no necesitas crear una `interface User` y luego un `userSchema`. Puedes extraer el tipo directamente del schema:

```typescript
type User = z.infer<typeof userSchema>;

// Ahora 'User' es automáticamente: { name: string; email: string; age: number; }
```

## Consejos para mantener tus validaciones limpias

A medida que tu aplicación crezca, es fácil que los schemas se vuelvan gigantes. Aquí tienes algunas buenas prácticas:

- **Centraliza tus schemas**: No definas el schema dentro del componente. Crea una carpeta `src/schemas/` y expórtalos desde allí. Así podrás usar el mismo schema en el frontend (para validar el formulario) y en el backend (para validar la petición).
- **Crea piezas reutilizables**: Si tienes campos que se repiten (como la contraseña), crea un schema base y reutilízalo:
  ```javascript
  const passwordSchema = z.string().min(8).regex(/[0-9]/);
  const registerSchema = z.object({ password: passwordSchema, confirm: passwordSchema });
  ```
- **Usa `.refine()` para lógicas complejas**: Cuando una validación dependa de otro campo (como verificar que "Contraseña" y "Confirmar Contraseña" sean iguales), usa `.refine()`. Es el lugar ideal para validaciones personalizadas que no existen de forma nativa en Zod.

## Conclusión

Zod transforma la validación de una tarea repetitiva a un proceso declarativo y seguro. Te permite fallar rápido y de manera controlada, asegurando que los datos que fluyen por tu aplicación sean exactamente los que esperas.

Si estás empezando, mi consejo es simple: **deja de usar `if` para validar objetos y empieza a usar schemas**. Tu "yo" del futuro, cuando tenga que hacer mantenimiento al código, te lo agradecerá.

Puedes explorar todas las validaciones disponibles en la [documentación oficial de Zod](https://zod.dev/).
