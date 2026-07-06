---
author: Juan Beresiarte
pubDatetime: 2026-07-05T19:00:00Z
title: "Custom Hooks: Reutiliza lógica como un profesional"
slug: custom-hooks-react
featured: false
draft: false
tags:
  - javascript
  - react
  - hooks
description: Los hooks personalizados son el secreto para código React limpio y mantenible. Aprende a extraer lógica repetible y crear hooks reutilizables.
---

## ¿Qué son los Custom Hooks?

En React, un **custom hook** es una función de JavaScript cuyo nombre comienza obligatoriamente con la palabra `use`. Pero más allá de la convención del nombre, su propósito es la **encapsulación de lógica de estado**.

A diferencia de los componentes, que se encargan de *cómo se ve* la aplicación (la UI), los custom hooks se encargan de *cómo se comporta* la aplicación. Son la herramienta definitiva para extraer "lógica con estado" (stateful logic) de un componente. 

Lo que hace que un custom hook sea especial es que puede llamar a otros hooks de React (`useState`, `useEffect`, `useMemo`, etc.). Esto permite que cualquier pieza de funcionalidad que dependa del ciclo de vida de React sea extraída, empaquetada y transportada a cualquier otro componente sin necesidad de repetir el código.

La regla de oro es simple: **si tienes lógica que se repite en dos o más componentes, o si un componente se ha vuelto demasiado grande debido a la gestión de estados y efectos, es momento de crear un custom hook**.

## ¿Por qué utilizarlos?

Extraer la lógica a hooks personalizados aporta varias ventajas críticas al desarrollo:

- **Principio DRY (Don't Repeat Yourself)**: Evitas duplicar la misma gestión de estados o llamadas a API en múltiples archivos. Si necesitas cambiar la lógica de una petición, lo haces en el hook y se refleja en toda la app.
- **Separación de responsabilidades**: El componente se convierte en una "capa de presentación" pura. No necesita saber cómo se obtienen los datos o cómo se valida un formulario, solo necesita saber qué datos mostrar.
- **Facilidad de testeo**: Puedes escribir tests unitarios para el hook de forma aislada, sin tener que renderizar componentes complejos o lidiar con el DOM.
- **Código más legible**: Tus componentes pasan de tener decenas de líneas de efectos y estados a ser declaraciones limpias y semánticas.

## Cómo sacarles el máximo provecho

Para llevar tus custom hooks al siguiente nivel, no te limites a mover código. Piensa en ellos como una **API interna** para tu aplicación:

### 1. Componibilidad
Los hooks pueden llamar a otros hooks. Puedes crear hooks pequeños y especializados y luego combinarlos en un hook más complejo. Por ejemplo, un `useAuth` podría utilizar internamente un `useLocalStorage` para persistir el token de sesión.

### 2. Abstracción de complejidad
Usa los hooks para ocultar la complejidad de librerías externas. En lugar de llamar a una librería de geolocalización directamente en el componente, crea un `useLocation` que maneje los permisos y los errores, devolviendo al componente simplemente las coordenadas.

### 3. Parámetrozación
Haz que tus hooks sean flexibles. En lugar de hardcodear valores, permite que el componente le pase configuraciones al hook. Esto transforma un hook "específico" en una "herramienta genérica".

## Consejos de código limpio para Custom Hooks

Para evitar que tus hooks se conviertan en un caos, sigue estas buenas prácticas:

- **Mantén la Responsabilidad Única**: Un hook debe hacer una sola cosa y hacerla bien. Si tu `useFetch` también está validando el usuario y manejando el carrito de compras, divídelo en tres hooks diferentes.
- **Cuidado con las referencias estables**: Si tu hook devuelve una función, envuélvela en `useCallback`. De lo contrario, el componente que use el hook provocará re-renders innecesarios cada vez que la función se recree.
- **Devuelve objetos para extensibilidad**: Si tu hook devuelve muchos valores, prefiere devolver un objeto `{ data, loading, error }` en lugar de un array. Esto evita que el orden de los elementos sea un problema y permite añadir nuevas propiedades en el futuro sin romper el código existente.
- **Naming semántico**: El nombre debe describir la funcionalidad, no el mecanismo. `useUserAuthentication` es mejor que `useAuthState`.

## Ejemplo 1: useToggle (Sencillez pura)

El ejemplo más simple de un custom hook es uno que gestione un valor booleano. Imagina que necesitas abrir y cerrar modales, menús laterales o interruptores en toda tu web.

```javascript
import { useState } from "react";

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);

  return [value, toggle];
}

// Uso en un componente
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>
        {isOpen ? "Cerrar Modal" : "Abrir Modal"}
      </button>
      {isOpen && <div className="modal">¡Hola! Soy un modal.</div>}
    </div>
  );
}
```

## Ejemplo 2: useFetch (Utilidad práctica)

Uno de los casos más comunes es el fetching de datos. En lugar de escribir el mismo `useEffect` y manejar los estados de `loading` y `error` en cada página, podemos centralizarlo.

```javascript
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener datos");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Uso en un componente
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`https://api.example.com/users/${userId}`);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;

  return <h1>{user.name}</h1>;
}
```

## ¿Cuándo NO crear un Custom Hook?

No abuses de los hooks. Evita crearlos si:
- La lógica es extremadamente simple y solo se usa en un único componente. Extraerla puede añadir una capa de indirección innecesaria que dificulta la lectura.
- El hook se vuelve demasiado genérico y termina manejando demasiadas responsabilidades.

## Conclusión

Los custom hooks transforman la manera en que estructuramos aplicaciones en React, permitiéndonos pasar de componentes "monolíticos" a una arquitectura basada en piezas de lógica reutilizables, modulares y fáciles de testear.

Si quieres ver una biblioteca increíble con decenas de ejemplos de hooks listos para usar en proyectos reales, revisa este proyecto: [https://usehooks.com/](https://usehooks.com/).
