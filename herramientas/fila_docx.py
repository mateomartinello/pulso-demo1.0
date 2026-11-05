# Agrega una fila al final de la tabla de «Desarrollo de la app.docx» copiando el formato de la última.
# Uso: python3 herramientas/fila_docx.py "DD/MM/AAAA" "Cambios en la app (versión X): …"
# No reescribe filas anteriores. Deja una copia del docx anterior en /tmp/desarrollo-anterior.docx.
import re, shutil, sys, zipfile
from xml.sax.saxutils import escape

DOCX = "Desarrollo de la app.docx"
if len(sys.argv) != 3 or not re.fullmatch(r"\d\d/\d\d/\d{4}", sys.argv[1]):
    sys.exit('Uso: python3 herramientas/fila_docx.py "DD/MM/AAAA" "texto"')
fecha, texto = sys.argv[1], sys.argv[2]

z = zipfile.ZipFile(DOCX)
xml = z.read("word/document.xml").decode("utf-8")
filas = re.findall(r"<w:tr[ >].*?</w:tr>", xml, re.S)
if not filas: sys.exit("No encontré la tabla.")
ultima = filas[-1]
celdas = re.findall(r"<w:tc>.*?</w:tc>|<w:tc .*?</w:tc>", ultima, re.S)
if len(celdas) < 2: sys.exit("La última fila no tiene dos celdas.")

def poner(celda, valor):   # primer texto de la celda = valor; el resto de los textos, vacíos
    n = [0]
    def r(m):
        n[0] += 1
        return m.group(1) + (escape(valor) if n[0] == 1 else "") + m.group(3)
    return re.sub(r"(<w:t(?: [^>]*)?>)(.*?)(</w:t>)", r, celda, flags=re.S)

nueva = ultima.replace(celdas[0], poner(celdas[0], fecha), 1).replace(celdas[1], poner(celdas[1], texto), 1)
xml = xml.replace(ultima, ultima + nueva, 1)

shutil.copy(DOCX, "/tmp/desarrollo-anterior.docx")
tmp = DOCX + ".tmp"
with zipfile.ZipFile(DOCX) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for it in zin.infolist():
        zout.writestr(it, xml.encode("utf-8") if it.filename == "word/document.xml" else zin.read(it.filename))
zipfile.ZipFile(tmp).testzip()
shutil.move(tmp, DOCX)
print(f"Fila agregada ({len(filas)+1} filas): {fecha} · {texto[:80]}…")
