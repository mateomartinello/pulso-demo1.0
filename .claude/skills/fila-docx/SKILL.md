---
name: fila-docx
description: Agrega la fila del cambio al final de la tabla de «Desarrollo de la app.docx» (fecha y descripción), sin reescribir filas anteriores. Usar al terminar cada cambio de la app de Pulso.
---

# Fila en «Desarrollo de la app.docx»

1. Redactá una sola oración larga en español rioplatense: `Cambios en la app (versión X.Y.Z): …` con lo que cambió para el usuario (no detalles de código).
2. Corré desde la raíz del proyecto, con la fecha de hoy:
   ```bash
   python3 herramientas/fila_docx.py "DD/MM/AAAA" "Cambios en la app (versión X.Y.Z): …"
   ```
3. Si la versión estaba en prueba y después se publica, no edites la fila: agregá la que corresponda solo si hubo cambios nuevos.

El docx no está en git (tiene datos personales). El script guarda una copia del anterior en `/tmp/desarrollo-anterior.docx`.
