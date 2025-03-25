<img  align="left" width="150" style="float: left;" src="https://www.upm.es/sfs/Rectorado/Gabinete%20del%20Rector/Logos/UPM/CEI/LOGOTIPO%20leyenda%20color%20JPG%20p.png">
<img  align="right" width="60" style="float: right;" src="https://www.dit.upm.es/images/dit08.gif">

<br/><br/><br/>


# Práctica 7: Posts

Versión: 25 de Marzo de 2025

## Objetivos
* Afianzar los conocimientos obtenidos sobre el uso de Express para desarrollar servidores web.
* Aprender a desarrollar APIs REST para gestionar recursos web.

## Descripción de la práctica

Desarrollar un servidor web que implemente un **Blog** usando node y express. 
Este blog debe mostrar las publicaciones que se hayan realizado, debe permitir crear nuevas publicaciones, y 
editar o borrar las ya existentes. En este enunciado usaremos el término **post** para referirnos a una publicación.

Esta práctica se desarrollará como continuación de la **Práctica 6 Express CV**, añadiendo todos los elementos 
necesarios para convertirla en un blog.

El desarrollo a realizar en esta práctica es muy parecido al realizado en el mini proyecto **Quiz** visto en las clases
teóricas de la asignatura. Deben realizarse tareas muy similares. En el mini proyecto **Quiz** se desarrollaron quizzes
que contenían una pregunta y una respuesta, y aquí se van a desarrollar posts que contienen un título y un cuerpo. En
ambos casos, quizzes y posts pueden tener una imagen adjunta. Los modelos a desarrollar, las primitivas, los 
controladores, las vistas, etc. serán muy parecidos a los del mini proyecto **Quiz**. La principal diferencia radica 
en que en el mini proyecto **Quiz** se puede jugar a adivinar los quizzes, y esa funcionalidad no existe en el blog.

En la práctica 7 deben añadirse las siguiente primitivas al interfaz REST:

* `GET /posts`
    * Muestra un listado con todos los posts existentes en la BBDD.
* `GET /posts/:postId(\\d+)`
    * Muestra el post de la BBDD cuyo **id** es igual al valor pasado en el parámetro de ruta **:postId**.
* `GET /posts/new`
    * Muestra una página con un formulario para crear un nuevo post.
* `POST /posts`
    * Invocado por el formulario anterior para crear el post con los datos introducidos.
* `GET /posts/:postId(\\d+)/edit`
    * Muestra una página con un formulario para editar el post cuyo **id** es igual al valor pasado en el parámetro de ruta **:postId**.
* `PUT /posts/:postId(\\d+)`
    * Invocado por el formulario anterior para actualizar el post con **id** igual a **:postId**.
* `DELETE /posts/:postId(\\d+)`
    * Borrar de la BBDD el post cuyo **id** es igual a **postId**.
* `GET /posts/:postId(\\d+)/attachment`
    * Devuelve la imagen adjunta del post cuyo **id** es igual a **postId**, y si no existe, devuelve una imagen por defecto situada en **public/images/none.png**.

  
Se seguirá el patrón MVC, creando los modelos, controladores, rutas y vistas que se necesiten para gestionar los posts.

Para el modelo se creará una base de datos **SQLite** a la que se accederá usando el ORM **Sequelize**. 
La base de datos tendrá dos tablas: la tabla **Posts** para almacenar los posts, y la tabla **Attachments** para
guardar la imagen adjunta de cada post.

Los ficheros con las definiciones de los modelos, las migraciones, los seeders, las rutas, los controladores 
y vistas se crearán siguiendo la misma filosofía que en el mini proyecto **Quiz**. 
Los modelos se definirán en los ficheros **models/index.js**, **models/post.js** y **models/attachment.js**.
Las migraciones y seeders se crearán en los directorios **migrations** y **seeders**.
Las rutas se definirán en los ficheros **routes/index.js** y **routes/posts.js**.
Los middlewares de los posts se crearán en el fichero controlador **controllers/post.js**.
Las vistas de los posts se crearán en el directorio **views/posts**, y se llamarán 
**_form.ejs**, **edit.ejs**, **index.ejs**, **new.ejs** y **show.ejs**.
La vista que pinta los adjuntos se creará en **views/attachments/_attachment.ejs**.



## Descargar el código del proyecto

Instrucciones [aquí](https://github.com/CORE-UPM/Instrucciones_Practicas/blob/main/README.md#descargar-el-c%C3%B3digo-del-proyecto).

## Tareas

### Tarea 1 - Copiar el trabajo ya realizado en la Entrega 6 ExpressCV

En esta práctica hay que continuar y ampliar el desarrollo realizado en la práctica 6.

El alumno debe copiar el directorio **blog** de la **P6_ExpressCV** en el directorio **P7_Blog/blog** de 
esta práctica 7. Las tareas a realizar en esta práctica 7 de desarrollarán dentro del directorio **P7_Blog/blog**.

Para copiar/duplicar el directorio **P6_ExpressCV/blog** en el directorio **P7_Blog/blog**, puede usar un
explorador de archivos. Asegúrese de copiar el directorio y no de moverlo de sitio, para no perder el trabajo original.
También puede ejecutar el siguiente comando en un terminal para copiar el directorio y todo su contenido:

    $ cp -r PATH_DE_PRACTICA_6/P6_ExpressCV/blog PATH_DE_PRACTICA_7/P7_Blog/.

### Tarea 2 - Desarrollar el modelo

La práctica usa una base de datos **SQLite** a la que se accede usando **Sequelize**, y que se crea y rellena usando 
migraciones y seeders. Por tanto, el alumno debe instalar los paquetes **sqlite3**, **sequelize** y **sequelize-cli**:

    $ npm install sqlite3 sequelize sequelize-cli

El alumno debe crear el fichero **models/index.js**.
El contenido del fichero **models/index.js** es muy parecido al realizado en el mini proyecto **Quiz**. 
Se requerirá el paquete **sequelize**, se creará una instancia de **Sequelize** que maneje la base de datos **SQLite** 
alojada en el fichero **blog.sqlite**, se definirá el modelo **Post** con los campos **title** y **body**, se definirá 
el modelo **Attachment** con los campos **mime** e **image**, se definira la relación 1-a-1 entre **Post** y **Attachment**
y se exportará la instancia **sequelize** creada.

El tipo del campo **title** del modelo **Post** debe ser **STRING**.

El tipo del campo **body** del modelo **Post** debe ser **TEXT**.

El tipo del campo **mime** del modelo **Attachment** debe ser **STRING**.

El tipo del campo **image** del modelo **Attachment** debe ser **BLOB('long')**, y su contenido serán los bytes de la
imagen.

La relación 1-a-1 entre **Post** y **Attachment** debe definirse de forma que la clave externa **postId** se 
cree en la tabla **Attachments**. 

El alumno también debe crear dos migraciones para crear las tablas **Posts** y **Attachments** en la base de datos. 

Los ficheros de migración deben llamarse **migrations/YYYYMMDDhhmmss-CreateAttachmentsTable.js** y
**migrations/YYYYMMDDhhmmss-CreatePostsTable.js**, donde YYYYMMDDhhmmss es la fecha en la que se creó cada fichero. 
Para crear estos ficheros puede usar los comandos:

    npx sequelize migration:create --name  CreatePostsTable
    npx sequelize migration:create --name  CreateAttachmentsTable

Nota: en el mini proyecto **Quiz** se usaba una migración separada para añadir el campo **quizId** a la tabla
**Attachments**.
En esta práctica se propone crear ese campo directamente en la migración CreateAttachmentsTable, es decir, que esa migración 
cree todos los campos de la tabla **Attachments**: **id**, **mime**, **image**, **postId**, **createdAt** y **updatedAt**.

El alumno también debe crear un fichero seeder que añada a la tabla **Posts** tres posts sin imagen adjunta y con el siguiente contenido:

    title: 'Primer Post' + body: 'Esta práctica implementa un Blog.'
    title: 'Segundo Post' + body: 'Todo el mundo puede crear posts.'
    title: 'Tercer Post' + body: 'Cada post puede tener una imagen adjunta.'


Este fichero seeder es muy parecido al desarrollado en el mini proyecto **Quiz**.

El fichero seeder debe llamarse **seeders/YYYYMMDDhhmmss-FillPostsTable.js**, 
donde YYYYMMDDhhmmss es la fecha en la que se creo el fichero. 
Para crear este fichero puede usar el comando:

    npx sequelize seed:generate --name FillPostsTable

El alumno debe crear en **package.json** (dentro del directorio `blog`) los siguientes 
scripts para aplicar la migración y el seeder (hay versiones para unix y para windows):

    "migrate": "sequelize db:migrate --url sqlite://$(pwd)/blog.sqlite",  
    "seed": "sequelize db:seed:all --url sqlite://$(pwd)/blog.sqlite",  
    "migrate_win": "sequelize db:migrate --url sqlite://%cd%/blog.sqlite",  
    "seed_win": "sequelize db:seed:all --url sqlite://%cd%/blog.sqlite"  

Así, para ejecutar las migraciones y el seeder puede invocar los comandos:

    $ npm run migrate  
    $ npm run seed

o su versión con **_win** para máquinas Windows.

Nota: El comando sequelize tiene un fallo y no permite que existan espacios en blanco en la URL que apunta al fichero
**blog.sqlite**. Desarrolle esta práctica en un directorio cuya ruta absoluta no contenga espacios en blanco.

### Tarea 3 - Actualizar el marco de aplicación

Modifique el fichero **views/layout.ejs** añadir un nuevo botón con el texto **Posts**.

Al pulsarlo, se enviará una petición **GET /posts** al servidor para que devuelva
una  página que muestre un listado con todos los posts existentes en la base de datos.

Este botón se debe implementar como una etiqueta de tipo **a** 
que contenga una propiedad **href** con el valor **/posts**, 
y debe situarse dentro de la etiqueta **nav** que implementa la barra de navegación.

### Tarea 4 - Desarrollar el autoload del parámetro de ruta :postId

Algunas de las definiciones de rutas usan un parámetro de ruta llamado **:postId**.

En esta tarea se desarrollará el método **load** del controlador de los posts. Este método
saca de la BBDD el post cuyo **id** es igual al valor pasado en el parámetro de ruta **:postId**.
El objeto post sacado se guardará en el atributo **load** del objeto **req**, llamándolo **post**, 
es decir, el objeto post recuperado de la BBDD se fguardará y estará
disponible en **req.load.post**.

El objeto **req.load** se usa en esta práctica, y en todas las prácticas que haremos 
en los próximos días, para almacenar los objetos precargados de la BBDD con los métodos **load** que 
iremos desarrollando. 
Los objetos precargados se guardarán en **req.load** creando propiedades.
El objeto post precargado en esta práctica se guarda en **req.load.post**.

Este post precargado lo usarán los metodos **show**, **edit**, **update**, **delete** y **attachment** 
del controlador post.

El middleware **load** debe buscar el post en la BBDD usando el método **findByPk**, guardarlo en
**req.load.post**, y llamar a **next** para continuar la ejecución de los siguientes middlewares.

En la llamada a **findByPk** debe cargarse también la imagen adjunta usando la opción **include**.

En el caso de que no exista el post buscado, debe llamarse a next con un mensaje de error informativo para que la ejecución 
continue en el siguiente middleware de atención de errores.


### Tarea 5 - Desarrollar la primitiva GET /posts/:postId/attachment

La imagen adjunta de un post se almacena en el campo **image** de la tabla **Attachments**. 

Para mostrar esta imagen en un fichero HTML, se debe usar una etiqueta **img** y 
asignar al atributo **src** el valor **/posts/POST_ID/attachment**, donde **POST_ID** 
se debe sustituir por el valor del parámetro de ruta **:postId**.

    <img src="/posts/POST_ID/attachment"/>

Se pide definir la ruta **GET /posts/:postId/attachment** para acceder a la imagen adjunta de post indicado por el parámetro de ruta **postId**.

Esta ruta debe definirse en el fichero **routes/posts.js**.
Este fichero es un módulo que debe exportar un objeto Router de Express.
Las rutas para manejar los posts y los adjuntos se definiran en este objeto Router.
El fichero **routes/posts.js** debe importarse en **app.js** y registrarlo como un middleware.

El método middleware que atiende esta petición debe desarrollarse en el fichero 
controlador **controllers/post.js**, y debe llamarse **attachment**. 
Este middleware debe devolver la imagen, y si no existe, devolver una imagen por defecto 
situada en **public/images/none.png**.

El fichero **routes/posts.js** debe requerir/importar el fichero **controllers/post.js** para 
poder acceder al método **attachment** exportado.


### Tarea 6 - Desarrollar la primitiva GET /posts

El servidor debe devolver una página mostrando todos los posts almacenados en la BBDD cuando reciba la 
petición HTTP **GET /posts**.

Esta ruta debe definirse en el fichero **routes/posts.js**.

El método middleware que atiende estas peticiónes debe desarrollarse en el fichero controlador **controllers/post.js**,
y debe llamarse **index**.

El fichero **routes/posts.js** debe requerir/importar el fichero **controllers/post.js**
para poder acceder al método **index** exportado.

El middleware **index** debe recuperar de la base de datos todos los posts existentes usando el método **findAll** del 
modelo **Post**. A continuación debe enviar una respuesta HTTP renderizando 
la vista **views/posts/index.ejs**, a la que pasará como argumento el array con los posts sacados de la base de datos.

La llamada a **findAll** debe cargar también la imagen adjunta de cada post usando la opción **include**.

La vista **views/posts/index.ejs** toma como parámetro el array de posts que debe mostrar. 

La vista pintará la lista de posts dentro de un elemento HTML de tipo **\<section\>**.
Cada post debe presentarse con una etiqueta **\<article\>** que sea de la clase **postIndex**.
Para cada post se debe pintar el título del post, su imagen adjunta, y tres botones que permitan 
mostrar, editar o borrar el post.
Estos botones deben mostrar los siguientes títulos: **Show**, **Edit** y **Delete**.
No pinte el cuerpo del post.

Para pintar la imagen adjunta se usará la vista **views/attachments/_attachment.ejs**, que es exactamente 
igual a la desarrollada en el mini proyecto **Quiz**.

La vista **views/posts/index.ejs** debe tener un botón que permita crear nuevos posts.
Este botón debe tener el título **Create New Post**, e 
invocar la primitiva **GET /posts/new**.
Debe implementarse con una etiqueta **a** que tenga un atributo **href**.

#### Probar

Lanzar el servidor y usar un navegador para visitar la página **http://localhost:3000/posts**.
El servidor debe responder mostrando el listado de todos los posts.

### Tarea 7 - Desarrollar la primitiva GET /posts/:postId

El servidor debe devolver una página mostrando el post de la BBDD cuyo **id** es igual al valor pasado 
en el parámetro de ruta **:postId** cuando reciba la petición HTTP **GET /posts/:postId**.

Esta ruta debe definirse en el fichero **routes/posts.js**.

El método middleware que atiende esta peticiónes deben desarrollarse en el
fichero controlador **controllers/post.js**, y debe llamarse **show**.

El middleware **show** debe recuperar el post a mostrar de **req.load.post**, donde ya fue
precargado con el middleware **load**.
A continuación, enviará una respuesta HTTP renderizando
la vista **views/posts/show.ejs**, pasando como parámetro el objeto post.

La vista **views/posts/show.ejs** toma como parámetro el post a mostrar.

Esta vista mostrará el título, el cuerpo y la imagen adjunta del post.
También debe mostrar un botón titulado **Edit** que permita editar el post.

La vista pintará el post dentro de una etiqueta HTML de tipo **\<article\>** de la clase **postShow**.

Para pintar la imagen adjunta se usará la vista **views/attachments/_attachment.ejs**, 
que es exactamente igual a la desarrollada en el mini proyecto **Quiz**.

#### Probar

Ejecute el servidor, y use un navegador para visitar la URL **http://localhost:3000/posts/1**.
El servidor debe devolver una página que muestre el post con id igual a 1. 
Puede usar otros valores de id.

### Tarea 8 - Desarrollar la primitiva de creación y edición de posts

Las primitivas usadas para crear un post son:

* `GET /posts/new`
    * Muestra una página con un formulario para crear un nuevo post.
* `POST /posts`
    * Invocado por el formulario anterior para crear un post con los datos introducidos.

Las primitivas usadas para editar un post son:

* `GET /posts/:postId(\\d+)/edit`
    * Muestra una página con un formulario para editar el post cuyo **id** es igual al valor pasado en el parámetro de ruta **:postId**.
* `PUT /posts/:postId(\\d+)`
    * Invocado por el formulario anterior para actualizar el post con **id** igual a **:postId**.
  
La última primitiva usa el método **PUT**, que no está soportado por los formularios HTML. 
Es necesario instalar el paquete **method-override** para soportar el método
**PUT** que necesitamos, y el método **DELETE** que usaremos más adelante para borrar los posts.

El alumno debe ejecutar el siguiente comando para instalar el paquete **method-override**:

    $ npm install method-override

y añadir las siguientes sentencia en **app.js** para importarlo y configurarlo:

    . . .
    var methodOverride = require('method-override');
    . . .
    app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
    . . .

Los middlewares que atienden las primitivas anteriores deben desarrollarse en el fichero 
controlador **controllers/post.js**, y deben llamarse **new**, **create**, **edit** y **update**.

El middleware **new** enviará un formulario al navegador renderizando la vista **views/posts/new.ejs**. 
Esta vista debe incluir al menos:
* un campo **input** de **type** "_text_" con **id** "_title_" y **name** "_title_".
* un campo **textarea** con **id** "_body_" y **name** "_body_".
* un campo **input** de **type** "_file_" con **id** "_img_" y **name** "_image_".
* un campo **input** de **type** "_submit_".

El middleware **create** creará un nuevo post con los datos introducidos en el formulario **new**. 
En caso de que se produzcan errores de validación, debe presentarse el formulario otra vez para que el usuario corrija
los errores detectados.
Si en la petición HTTP se recibe un fichero de imagen adjunto, debe guardarse en la tabla de **Attachments** y asociarlo con el post creado.
Si la creación del post se realiza con éxito, este middleware responderá al navegador con una solicitud de redirección a la
ruta **/posts/:postId** para mostrar el post creado.

El middleware **edit** sacará de la BBDD el objeto **post** indicado por el parámetro de ruta **:postId**, y enviará un 
formulario al navegador renderizando la vista **views/posts/edit.ejs**. 
Esta vista toma como argumento el objeto **post** a editar. 
Esta vista debe incluir al menos:
* un campo **input** de **type** "_text_" con **id** "_title_" y **name** "_title_".
* un campo **textarea** con **id** "_body_" y **name** "_body_".
* un campo **input** de **type** "_file_" con **id** "_img_" y **name** "_image_".
* un campo **input** de **type** "_submit_".

El middleware **update** sacará de la BBDD el objeto **post** indicado por el parámetro de ruta **:postId**, actualizará sus
propiedades con los valores introducidos en el formulario **edit**, y actualizará los valores en la BBDD.
Si se producen errores de validación, se presentará el formulario otra vez para que el usuario los corrija.
Si en la petición HTTP se recibe un fichero de imagen adjunto, debe borrarse el adjunto antiguo de la tabla de **Attachments**,
guardar el nuevo adjunto, y actualizar la asociación.
Si la actualización del post se realiza con éxito, este middleware respondera al navegador con una solicitud de redirección a la
ruta **/posts/:postId** para mostrar el post editado.

La acción de los formularios **new** y **edit** debe invocar las primitivas que activan los middlewares **create** y **update**, usando 
los métodos **POST** y **PUT** y las rutas adecuadas. 
Ambos formularios usan una codificación multiparte para subir la imagen adjunta del post que muestran.
Los campos de los formularios **new** y **edit** son iguales, por lo que se escribirán en un fichero común (**views/posts/_form.ejs**) 
que importarán las vistas **views/posts/new.ejs** y **views/posts/edit.ejs**.
Los nombres que deben usar los formularios para enviar los valores al servidor son **title** para el título, **body** para el cuerpo,
y **image** para el fichero adjunto. Estos nombre son los valores del atributo **name** de las entradas del formulario.

Las imágenes adjuntas de los posts se suben al servidor cuando se ejecutan los middlewares
**create** y **update**. Las peticiones que reciben estos middlewares llevan
un cuerpo multiparte, donde una de las partes es el fichero que se está subiendo.
Para extraer el fichero subido debe usarse el paquete **multer**.
Las imágenes subidas por los formularios deben identificarse usando el atributo **name="image"**.

Para instalar el paquete multer debe ejecutar el comando:

    $ npm install multer

y debe importarlo, configurarlo y usarlo solo en las rutas de creación y actualización de **routes/posts.js**.

Configure **multer** para que las imágenes se reciban en memoria, y no se acepten
imágenes mayores de 20MB.
Esta configuración es idéntica a la usada en el mini proyecto **Quiz**.

Las vistas **views/posts/new.ejs** y **views/posts/edit.ejs** toman como parámetro un objeto 
post con los valores a editar.

#### Probar

Ahora el servidor debe responder a las peticiones **http://localhost:3000/posts/new** y **http://localhost:3000/posts/1/edit** 
para obtener los formulario de creación y de edición de post, 
y a las peticiones **POST http://localhost:3000/posts** y **PUT http://localhost:3000/posts/1** para crear o actualizar un post.

Ejecute el servidor y use un navegador para visitar las URLs
**http://localhost:3000/posts/new** y **http://localhost:3000/posts/1/edit**.

Puede usar otros valores de id.


### Tarea 9 - Desarrollar la primitiva DELETE /posts/:postId

El servidor debe borrar de la BBDD el post cuyo **id** es igual al valor pasado
en el parámetro de ruta **:postId** cuando reciba la
petición HTTP **DELETE /posts/:postId**.

Si el post a borrar tiene una imagen adjunta, entonces tambien debe borrarse de la tabla **Attachments**.

La ruta de esta petición debe definirse en el fichero **routes/posts.js**.

El método middleware que atiende esta petición debe desarrollarse en el
fichero controlador **controllers/post.js**, y debe llamarse **destroy**. 
Este middleware borrará el post y su imagen adjunta, y responderá al navegador con una solicitud de redirección a la
ruta **/posts** para mostrar la lista de posts existentes.


#### Probar

Ahora el servidor debe responder a la petición **DELETE http://localhost:3000/posts/1**.
Puede usar otros valores de id.


## Pruebas con el autocorector

Instrucciones [aquí](https://github.com/CORE-UPM/Instrucciones_Practicas/blob/main/README.md#pruebas-con-el-autocorector).

## Pruebas manuales y capturas de pantalla

Instrucciones [aquí](https://github.com/CORE-UPM/Instrucciones_Practicas/blob/main/README.md#pruebas-manuales-y-capturas-de-pantalla).

Capturas a entregar con esta práctica: 

- Captura 1: Captura de la pantalla que muestra el listado de todos los posts. 
  Deben verse varios posts con sus imágenes adjuntas.
<kbd>
<img src="https://user-images.githubusercontent.com/716928/218465006-f3cb3409-304f-4994-ac7e-d670c1ab8d91.png" alt="captura de pantalla" width="500"/>
</kbd>

- Captura 2: Captura de una pantalla que muestre un único post. 
  Debe mostrarse el contenido del post y su imagen adjunta.
<kbd>
<img src="https://user-images.githubusercontent.com/716928/218465046-f993e483-ef5a-4f9f-b2fa-f24797683508.png" alt="captura de pantalla" width="500"/>
</kbd>

- Captura 3: Captura de la pantalla que muestra el formulario de crear un nuevo post.
  Deben verse los campos del formulario.
<kbd>
<img src="https://user-images.githubusercontent.com/716928/218465070-6339706b-c069-430c-9bed-6a0c148d252c.png" alt="captura de pantalla" width="500"/>
</kbd>
 
- Captura 4: Captura de la pantalla que muestra el formulario de editar un post.  
  Deben verse los campos del formulario.
<kbd>
<img src="https://user-images.githubusercontent.com/716928/218465103-ac01bc5a-20ee-4043-91ea-daaaea62f3e9.png" alt="captura de pantalla" width="500"/>
</kbd>

## Instrucciones para la Entrega y Evaluación.

Instrucciones [aquí](https://github.com/CORE-UPM/Instrucciones_Practicas/blob/main/README.md#instrucciones-para-la-entrega-y-evaluaci%C3%B3n
).

## Rúbrica

Antes de evaluar la práctica se realizarán un serie de comprobaciones:
- Existe el directorio blog.
- Se ha usado correctamente el marco de aplicación.
- Existen los ficheros pedidos: controladores, migraciones, seeders, ...
- Se han creado los scripts pedidos en package.json.

Una vez superadas las comprobaciones anteriores,
se puntuará la práctica sumando el % indicado a la nota total si la parte indicada es correcta:
- **5%:** Se atiende la petición GET / y muestra la página de bienvenida
- **5%:** Se atiende la petición GET /author y muestra el cv del alumno
- **15%:** Se muestran el listado de todos los posts de forma correcta.
- **15%:** Se muestran los posts individuales de forma correcta.
- **5%:** Comprobar que la ruta /posts/:postId/attachment devuelve la imagen de un post.
- **15%:** La creación de un nuevo post funciona correctamente.
- **10%:** No puede crearse un post con campos vacios.
- **20%:** La edición de los posts funciona correctamente.
- **10%:** El borrado de los posts funciona correctamente.

Si pasa todos los tests se dará la máxima puntuación.

