import re,sys,os
B=os.path.dirname(os.path.abspath(__file__)); S=B+"/src/"
# Arma index.html (la app publicada) a partir de src/. Uso: python3 build.py
r=lambda f: open(S+f,encoding="utf-8").read()
shell=r("shell.html")
css_extra=re.search(r"<!--CSS_EXTRA-->(.*)<!--/CSS_EXTRA-->",shell,re.S).group(1)
body=re.search(r"<!--BODY-->(.*)<!--/BODY-->",shell,re.S).group(1)
css=r("css_base.css")
js="\n".join([r("config.js"),r("data.js"),r("estimador.js"),r("app.js")])
fonts='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap">'
# standalone (GitHub Pages): full document
full=f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F5F0E8">
<title>Pulso</title>
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
print("ok", len(full))
