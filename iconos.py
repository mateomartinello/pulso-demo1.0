import os,struct,zlib
# Genera los íconos de la app (iconos/*.png) sin librerías externas. Uso: python3 iconos.py
B=os.path.dirname(os.path.abspath(__file__)); OUT=B+"/iconos/"
FONDO=(0x4A,0x5C,0x42); LINEA=(0xF5,0xF0,0xE8)
# Línea de pulso, en coordenadas relativas (0–1). Queda dentro de la zona segura de los íconos «maskable».
PUNTOS=[(.20,.54),(.38,.54),(.45,.37),(.53,.69),(.60,.47),(.65,.54),(.80,.54)]
GROSOR=.06

def dist_seg(px,py,ax,ay,bx,by):
  dx,dy=bx-ax,by-ay; t=((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy); t=max(0,min(1,t))
  qx,qy=ax+t*dx-px,ay+t*dy-py; return (qx*qx+qy*qy)**.5

def png(n, ruta):
  segs=list(zip(PUNTOS,PUNTOS[1:])); filas=[]
  for y in range(n):
    fila=bytearray([0]); py=(y+.5)/n
    for x in range(n):
      px=(x+.5)/n; d=min(dist_seg(px,py,a[0],a[1],b[0],b[1]) for a,b in segs)
      a=max(0.0,min(1.0,(GROSOR/2-d)*n+.5))
      fila+=bytes(round(f+(l-f)*a) for f,l in zip(FONDO,LINEA))
    filas.append(bytes(fila))
  chunk=lambda t,d: struct.pack(">I",len(d))+t+d+struct.pack(">I",zlib.crc32(t+d)&0xffffffff)
  datos=b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",n,n,8,2,0,0,0))+chunk(b"IDAT",zlib.compress(b"".join(filas),9))+chunk(b"IEND",b"")
  open(ruta,"wb").write(datos)

os.makedirs(OUT,exist_ok=True)
for n,nombre in [(192,"icon-192.png"),(512,"icon-512.png"),(180,"apple-touch-icon.png")]:
  png(n,OUT+nombre); print("ok",nombre)
