# Backend Challene

API rest creada  con Koa.js y Typescript para hacer queries a bookings y exploraciones

## Instalación

una vez clonado el repo, se necesita instalar las dependencias con

```bash
npm install
```

Dentro del archivo config.ts, cambiar la conexion de la base de datos a una de postgres local con el nombre de la base de datos a usar

```bash
databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost/dbname'
```

NOTA: El usuario que se pone en la conexión debe tener todos los permisos en la base de datos y schema para que puedan crear las tablas

Para correr la API, se corre con:

```bash
npm run watch-server
```

La API va a correr en el puerto 3000. Una vez corrida la api, las tablas en la base de datos antes configurada se crearan automaticamente si el usuario tiene los permisos requeridos.

Posteriormente, se necesita llenar las tablas con los archivos csv correspondientes.

## Endpoint

El endpoint para hacer las queries es el siguiente:
```bash
localhost:3000/explorations
```

###### Query params:

**start**: Fecha de inicio de busqueda en formato YYY-MM-DD ej:(2019-11-10)

**end**: Fecha de termino de busqueda en formato YYY-MM-DD ej:(2019-11-10)

**clinicName**: Nombre de la clinica a buscar, puede ir en minúsculas o mayúsculas      ej:(SOLESTA)


###### Body:

**medicationsAll**: Arreglo con los nombres de los medicamentos que coincidan totalmente en la busqueda

**medicationsSome**: Arreglo con los nombres de los medicamentos que coincidan parcialmente en la busqueda

Ejemplo:
```bash
{
	"medicationsAll": ["HORMONE_THERAPY", "VITAMINS"]
}
```

```bash
{
	"medicationsSome": ["COAGULANTS"]
}
```

NOTA: para filtrar correctamente, solo se puede usar uno de los dos campos en el body


##### Respuesta:

La respuesta sera todas las coincidencias con la información de la exploración y el booking. 

Ejemplo llamada:

```bash
endpoint:
http://localhost:3000/explorations?end=2019-11-11&start=2019-11-10&clinicName=EXPLANADA

body:
{
	"medicationsAll": ["COAGULANTS","HORMONE_THERAPY"]
}
```

Ejemplo respuesta:

```bash
[
  {
    "bookingId": 42863,
    "consumedMedications": "[COAGULANTS,HORMONE_THERAPY]",
    "name": "Ina Gibbs",
    "email": "ina_gibbs@gmail.com",
    "datetime": "2019-11-10T18:42:15.862Z",
    "clinicName": "EXPLANADA"
  },
  {
    "bookingId": 45216,
    "consumedMedications": "[COAGULANTS,HORMONE_THERAPY]",
    "name": "Bill Simon",
    "email": "bill_simon@gmail.com",
    "datetime": "2019-11-11T00:18:42.640Z",
    "clinicName": "EXPLANADA"
  },
  {
    "bookingId": 49995,
    "consumedMedications": "[COAGULANTS,HORMONE_THERAPY]",
    "name": "Justin Mitchell",
    "email": "justin_mitchell@gmail.com",
    "datetime": "2019-11-11T01:48:48.569Z",
    "clinicName": "EXPLANADA"
  }
]
```













## Autenticación/Autorización

Para la autorización se usa un token de JWT que esta firmado por el secret: "evasecret123". Para poder acceder a la api, se necesita que este firmado por ese secret y tener en el payload un key de "team" que tenga el valor "data-science".

Un token de ejempo puede ser el siguiente:

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtIjoiZ
GF0YS1zY2llbmNlIn0.1Z7wXwxENnvfXiVUMBnY4_JoS5uyaNnVNbkDYjUgBBs

```

Para usarlo se necesita usar con autenticación Bearer dentro de la llamda que se haga
