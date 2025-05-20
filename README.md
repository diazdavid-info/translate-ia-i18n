# Traductor de ficheros JSON i18n por IA

Traduce a cualquier idioma de una forma automática los ficheros JSON i18n de un proyecto.

## Requisitos

Necesitas tener una environment en tu computadora con una api key de OpenAI. La environment se
tiene que llamar `OPENAI_API_KEY` que es la oficial de OpenAI.

Para añadir la enviroment puedes añadirla en el fichero .bashrc o ejecutar el siguiente comando
y solo la tendrás para la sesión actual:
```bash
export OPENAI_API_KEY=YOUR_API_KEY
```

## Uso

Ejecutar:
```bash
npx translate-ia-i18n@latest
```

La primera pregunta será por el path absoluto donde se encuentra el fichero JSON i18n.
```
✔ Dime el path absoluto del fichero que quieres traducir
```

Después te dará un listado de idiomas disponibles para traducir el fichero JSON i18n y deberás
selecionar uno de ellos.
```
? Selecione el lenguage de traduccion › - Use arrow-keys. Return to submit.
❯   Inglés
    Español
    Fances
    Italiano
    Portugués
    Ruso
    Chino
    Japonés
    Coreano
  ↓ Turco
```

Y por último, te dará la opción de si quieres una preview de la traducción antes de generar 
el nuevo fichero.
```
✔ Quieres ver un preview antes de guardar el fichero?
```

Después de las preguntas la IA empezará a generar el fichero traducido.
