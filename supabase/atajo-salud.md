# Atajo «Pulso Salud» (Apple Salud → Pulso)

El atajo se genera desde la Mac, no se arma a mano:

```
python3 atajo/generar.py "/tmp/Pulso Salud.shortcut"
shortcuts sign --mode anyone --input "/tmp/Pulso Salud.shortcut" --output atajo/Pulso-Salud.shortcut
```

`atajo/generar.py` escribe el plist con estas acciones:

1. Si recibe un texto (el código que le pasa Pulso al tocar «Conectar», con `shortcuts://run-shortcut?name=Pulso%20Salud&input=text&text=CODIGO`), lo guarda en `Atajos/pulso-codigo.txt`.
2. Lee ese archivo (así la automatización diaria, que no recibe nada, también tiene el código).
3. Busca en Salud los **pasos** y los **minutos de ejercicio** de hoy y los suma, y el inicio del último registro de **flujo menstrual**.
4. Los manda a `rpc/salud_importar` con la clave publicable (`p_codigo`, `p_fecha`, `p_pasos`, `p_minutos`, `p_periodo`) y muestra la respuesta (`true` si se guardó).

El formato de las acciones de Salud sigue la referencia de exportaciones reales de iOS del proyecto `viticci/shortcuts-playground-plugin` (licencia MIT).

## Publicación

- `CONFIG.ATAJO_SALUD` apunta al archivo firmado (`atajo/Pulso-Salud.shortcut` en GitHub Pages). Para que instalarlo sea un solo toque, conviene reemplazarlo por un enlace de iCloud: en el iPhone, Atajos › mantener apretado «Pulso Salud» › Compartir › Copiar enlace de iCloud.
- El nombre del atajo tiene que seguir siendo **Pulso Salud**: «Conectar» lo abre por nombre.

## Lo que hace cada persona (lo explica Perfil › Apple Salud)

1. «Instalar el atajo» › «Agregar atajo».
2. «Conectar» › permitir que lea Salud › volver a Pulso.
3. En Atajos › Automatización › «+» › «Hora del día» › 23:00, «Diariamente», «Ejecutar inmediatamente» › «Pulso Salud».
