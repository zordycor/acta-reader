# acta-reader
Lee un acta de la FBCV y muestra sus datos para una mejor lectura.
Utiliza la API de PDF.co (https://apidocs.pdf.co/) para:
- Subir el archivo PDF a un bucket temporal de AWS
- Convertir el PDF a TXT

El archivo obtenido, una vez descargado, se filtra y formatea para mostrar únicamente los datos más importantes.
Entre otros, **suma todos los puntos anotados por jugador**, una tarea que se debe realizar a mano puesto que el acta no lo refleja en estas categorías.
