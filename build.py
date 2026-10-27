import re,sys,os,hashlib
B=os.path.dirname(os.path.abspath(__file__)); S=B+"/src/"
# Arma index.html (la app publicada) a partir de src/. Uso: python3 build.py
r=lambda f: open(S+f,encoding="utf-8").read()
shell=r("shell.html")
css_extra=re.search(r"<!--CSS_EXTRA-->(.*)<!--/CSS_EXTRA-->",shell,re.S).group(1)
body=re.search(r"<!--BODY-->(.*)<!--/BODY-->",shell,re.S).group(1)
css=r("css_base.css")
js="\n".join([r("config.js"),r("data.js"),r("estimador.js"),r("pwa.js"),r("app.js")])
fonts='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap">'
# standalone (GitHub Pages): full document
full=f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F5F0E8">
<title>Pulso</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="iconos/icon-192.png">
<link rel="apple-touch-icon" href="iconos/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Pulso">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
{fonts}
<style>
/* Layout: una columna (máx. 720px); cuestionario inicial de una pregunta por pantalla; luego pestañas Hoy / Movimiento / Semana / Historial / Recetario / Perfil. */
:root{{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
body{{margin:0}} img{{max-width:100%}} [hidden]{{display:none!important}}
{css}
{css_extra}
</style>
</head>
<body>
{body}
<script>
{js}
</script>
</body>
</html>
'''
open(B+"/index.html","w",encoding="utf-8").write(full)
# PWA: manifiesto y service worker (con versión nueva en cada armado). Los íconos los genera iconos.py.
open(B+"/manifest.webmanifest","w",encoding="utf-8").write(r("manifest.webmanifest"))
open(B+"/sw.js","w",encoding="utf-8").write(r("sw.js").replace("__VERSION__",hashlib.sha256(full.encode()).hexdigest()[:10]))
print("ok", len(full))
