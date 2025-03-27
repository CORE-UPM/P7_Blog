/* eslint-disable no-invalid-this*/
/* eslint-disable no-undef*/
const path = require("path");
const {
  checkFileExists,
  create_browser,
  from_env,
  ROOT,
  path_assignment,
  warn_errors,
  scored
} = require("../utils/testutils");
const fs = require("fs");
const net = require('net');
const spawn = require("child_process").spawn;
const util = require('util');
const exec = util.promisify(require("child_process").exec);

const PATH_ASSIGNMENT = path_assignment("blog");
const TIMEOUT = parseInt(from_env("TIMEOUT", 6000));
const TEST_PORT = parseInt(from_env("TEST_PORT", "3001"));

let browser = create_browser();

describe("Tests Práctica 7", function () {
  after(function () {
    warn_errors();
  });

  describe("Prechecks", function () {
    scored(`Comprobando que existe la carpeta de la entrega: ${PATH_ASSIGNMENT}`,
      -1,
      async function () {
        this.msg_err = `No se encontró la carpeta '${PATH_ASSIGNMENT}'`;
        (await checkFileExists(PATH_ASSIGNMENT)).should.be.equal(true);
      });

    scored(`Comprobar que se han añadido plantillas express-partials`, -1, async function () {
      this.msg_ok = 'Se incluye layout.ejs';
      this.msg_err = 'No se ha encontrado views/layout.ejs';
      fs.existsSync(path.join(PATH_ASSIGNMENT, "views", "layout.ejs")).should.be.equal(true);
    });

    scored(`Comprobar que existen las migraciones y el seeder`, -1, async function () {
      this.msg_ok = 'Se incluyen las migraciones y el seeder';

      this.msg_err = `No se ha encontrado la migración que crea la tabla Posts`;
      let mig = fs.readdirSync(path.join(PATH_ASSIGNMENT, "migrations")).filter(fn => fn.endsWith('-CreatePostsTable.js'));
      (mig.length).should.be.equal(1);

      this.msg_err = `No se ha encontrado la migración que crea la tabla Attachments`;
      mig = fs.readdirSync(path.join(PATH_ASSIGNMENT, "migrations")).filter(fn => fn.endsWith('-CreateAttachmentsTable.js'));
      (mig.length).should.be.equal(1);

      this.msg_err = 'No se ha encontrado el seeder';
      let seed = fs.readdirSync(path.join(PATH_ASSIGNMENT, "seeders")).filter(fn => fn.endsWith('-FillPostsTable.js'));
      (seed.length).should.be.equal(1);
    });

    scored(`Comprobar que existen los módulos con las rutas`, -1, async function () {
      this.msg_ok = 'Si existe el módulo routes/index.js con las rutas raíz';
      this.msg_err = "No existe el módulo routes/index.js con las rutas raíz";
      require(path.resolve(path.join(PATH_ASSIGNMENT, 'routes', 'index'))).all.should.not.be.undefined;

      this.msg_ok = 'Si existe el módulo routes/posts.js con las rutas de los posts';
      this.msg_err = "No existe el módulo routes/posts.js con las rutas de los posts";
      require(path.resolve(path.join(PATH_ASSIGNMENT, 'routes', 'posts'))).all.should.not.be.undefined;
    });

    scored(`Comprobar que los controladores existen`, -1, async function () {
      this.msg_ok = 'Se incluye el controlador de post y sus middlewares';

      this.msg_err = "No se incluye el controlador de post";
      await checkFileExists(path.resolve(path.join(PATH_ASSIGNMENT, 'controllers', 'post')));

      let postCtrl = require(path.resolve(path.join(PATH_ASSIGNMENT, 'controllers', 'post')));
      for (let mw of ["load", "index", "show", "new", "create", "edit", "update", "destroy", "attachment" ]) {
        this.msg_err = `Falta el middleware ${mw} en el controlador de los posts`;
        postCtrl[mw].should.not.be.undefined;
      }
    });

    scored(`Comprobar que se ha añadido el código para incluir los comandos adecuados`, -1, async function () {
      let rawdata = fs.readFileSync(path.join(PATH_ASSIGNMENT, 'package.json'));
      let pack = JSON.parse(rawdata);
      this.msg_ok = 'Se incluyen todos los scripts/comandos';
      this.msg_err = 'No se han encontrado todos los scripts';
      scripts = {
        "super": "supervisor ./bin/www",
        "migrate": "sequelize db:migrate --url sqlite://$(pwd)/blog.sqlite",
        "seed": "sequelize db:seed:all --url sqlite://$(pwd)/blog.sqlite",
        "migrate_win": "sequelize db:migrate --url sqlite://%cd%/blog.sqlite",
        "seed_win": "sequelize db:seed:all --url sqlite://%cd%/blog.sqlite",
      }
      for (script in scripts) {
        this.msg_err = `Falta el comando para ${script}`;
        pack.scripts[script].should.be.equal(scripts[script]);
      }
    })

    scored(`Comprobar que las plantillas express-partials tienen los componentes adecuados`, -1, async function () {
      this.msg_ok = 'Se incluyen todos los elementos necesarios en la plantilla';
      this.msg_err = 'No se ha encontrado todos los elementos necesarios';
      let checks = {
        "layout.ejs": {
          true: [/<%- body %>/g, /<header/, /<\/header>/, /<nav/, /<\/nav/, /<main/, /<\/main/, /<footer/, /<\/footer>/]
        },
        "index.ejs": {
          true: [/<h1/, /<\/h1>/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("posts", "index.ejs")]: {
          true: [/<section/, /<\/section>/, /<article/, /<\/article>/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("posts", "show.ejs")]: {
          true: [/<article/, /<\/article>/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("posts", "new.ejs")]: {
          true: [/<form/, /<\/form>/, /include/, /_form\.ejs/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("posts", "edit.ejs")]: {
          true: [/<form/, /<\/form>/, /include/, /_form\.ejs/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("posts", "_form.ejs")]: {
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        },
        [path.join("attachments", "_attachment.ejs")]: {
          true: [/<img/, /\/images\/none.png/],
          false: [/<body/, /<\/body>/, /<html/, /<\/html>/, /<nav/, /<\/nav>/]
        }
      }

      for (fpath in checks) {
        this.msg_err = `No se encuentra el fichero ${fpath}`;
        let templ = fs.readFileSync(path.join(PATH_ASSIGNMENT, "views", fpath), "utf8");
        for (status in checks[fpath]) {
          elements = checks[fpath][status];
          for (var elem in elements) {
            const shouldbe = (status == 'true');
            let e = elements[elem];
            if (shouldbe) {
              this.msg_err = `${fpath} no incluye ${e}`;
            } else {
              this.msg_err = `${fpath} incluye ${e}, pero debería haberse borrado`;
            }
            e.test(templ).should.be.equal(shouldbe);
          }
        }
      }
    });

  });

  describe("Tests funcionales", function () {
    var server;
    const db_filename = 'post.sqlite';
    const db_file = path.resolve(path.join(ROOT, db_filename));

    before(async function () {
      // Crear base de datos nueva y poblarla antes de los tests funcionales. por defecto, el servidor coge post.sqlite del CWD
      try {
        fs.unlinkSync(db_file);
        console.log('Previous test db removed. A new one is going to be created.')
      } catch {
        console.log('Previous test db does not exist. A new one is going to be created.')
      }
      fs.closeSync(fs.openSync(db_file, 'w'));

      let sequelize_cmd = path.join(PATH_ASSIGNMENT, "node_modules", ".bin", "sequelize")
      let db_url = `sqlite://${db_file}`;
      let db_relative_url = `sqlite://${db_filename}`;
      await exec(`${sequelize_cmd} db:migrate --url "${db_url}" --migrations-path ${path.join(PATH_ASSIGNMENT, "migrations")}`)
      debug('Lanzada la migración');
      await exec(`${sequelize_cmd} db:seed:all --url "${db_url}" --seeders-path ${path.join(PATH_ASSIGNMENT, "seeders")}`)
      debug('Lanzado el seeder');


      let bin_path = path.join(PATH_ASSIGNMENT, "bin", "www");
      server = spawn('node', [bin_path], {
        env: {
          PORT: TEST_PORT,
          DATABASE_URL: db_relative_url,
          PATH: process.env.PATH
        }
      });
      server.stdout.setEncoding('utf-8');
      server.stdout.on('data', function (data) {
        debug('Salida del servidor: ', data);
      })
      server.stderr.on('data', function (data) {
        debug('EL SERVIDOR HA DADO UN ERROR. SALIDA stderr: ' + data);
      });
      console.log(`Lanzado el servidor en el puerto ${TEST_PORT}`);
      await new Promise(resolve => setTimeout(resolve, TIMEOUT));
      browser.site = `http://127.0.0.1:${TEST_PORT}/`;
      try {
        await browser.visit("/");
        browser.assert.status(200);
      } catch (e) {
        console.log("No se ha podido contactar con el servidor.");
        throw (e);
      }
    });

    after(async function () {
      // Borrar base de datos
      await server.kill();

      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

      //wait for 1 second for the server to release the sqlite file
      await sleep(1000);

      try {
        fs.unlinkSync(db_file);
      } catch (e) {
        console.log("Test db not removed.");
        console.log(e);
        throw (e);
      }
    })

    scored(`Comprobar que se muestra la página de bienvenida`, 0.5, async function () {

      this.msg_err = 'No se muestra la página de bienvenida al visitar /';
      await browser.visit("/");
      browser.assert.status(200)

      // Secciones del layout
      this.msg_err = 'No se muestra la etiqueta header al visitar /';
      browser.assert.elements('header');
      this.msg_err = 'No se muestra la etiqueta nav al visitar /';
      browser.assert.elements('nav');
      this.msg_err = 'No se muestra la etiqueta main al visitar /';
      browser.assert.elements('main');
      this.msg_err = 'No se muestra la etiqueta footer al visitar /';
      browser.assert.elements('footer');

      // Botones de la barra de navegacion
      this.msg_err = 'No se muestra correctamente el botón para ver los Posts al visitar /';
      browser.assert.element('nav a[href="/posts"]');
      browser.html('nav a[href="/posts"]').includes("Posts").should.be.equal(true);

      this.msg_err = 'No se muestra el botón para ver al autor  al visitar /';
      browser.assert.element('nav a[href="/author"]');
    })


    scored(`Comprobar que se muestran el cv del alumno al visitar /author`, 0.5, async function () {
      this.msg_err = 'No se muestra el cv del alumno al visitar /author';

      await browser.visit("/author");
      browser.assert.status(200)
      browser.assert.elements('header');

      // Secciones del layout
      this.msg_err = 'No se muestra la etiqueta header al visitar /author';
      browser.assert.elements('header');
      this.msg_err = 'No se muestra la etiqueta nav al visitar /author';
      browser.assert.elements('nav');
      this.msg_err = 'No se muestra la etiqueta main al visitar /author';
      browser.assert.elements('main');
      this.msg_err = 'No se muestra la etiqueta footer al visitar /author';
      browser.assert.elements('footer');

      // Botones de la barra de navegacion
      this.msg_err = 'No se muestra correctamente el botón para ver los Posts al visitar /author';
      browser.assert.element('nav a[href="/posts"]');
      browser.html('nav a[href="/posts"]').includes("Posts").should.be.equal(true);

      this.msg_err = 'No se muestra el botón para ver al autor  al visitar /author';
      browser.assert.element('nav a[href="/author"]');
    });


    scored(`Comprobar el funcionamiento de la página que muestra el listado de todos los posts`, 1.5, async function () {
      let posts = [
        {id: 1, title: "Primer Post", body: "Esta práctica implementa un Blog."},
        {id: 2, title: 'Segundo Post', body: 'Todo el mundo puede crear posts.'},
        {id: 3, title: 'Tercer Post', body: 'Cada post puede tener una imagen adjunta.'}
      ];
      this.msg_ok = 'La página con el listado de todos los posts se muestra correctamente';

      this.msg_err = 'No se muestra la página con los posts';
      await browser.visit("/posts");
      browser.assert.status(200)

      this.msg_err = 'No se encuentran las etiquetas article de la clase postIndex dentro de una etiqueta section al visitar /posts';
      browser.assert.elements('section article.postIndex', {atLeast: 3});

      let res = browser.html();

      for (let post of posts) {
        this.msg_err = `No se encuentra el post titulado "${post.title}" al visitar /posts`;
        res.includes(post.title).should.be.equal(true);

        this.msg_err = `No se encuentra el botón Show para mostrar el post con id igual a ${post.id} al visitar /posts`;
        browser.assert.element(`section article.postIndex a[href="/posts/${post.id}"]`);
        browser.assert.text(`section article.postIndex a[href="/posts/${post.id}"]`, "Show");

        this.msg_err = `No se encuentra el botón Edit para editar el post con id igual a ${post.id} al visitar /posts`;
        browser.assert.element(`section article.postIndex a[href="/posts/${post.id}/edit"]`);
        browser.assert.text(`section article.postIndex a[href="/posts/${post.id}/edit"]`, "Edit");

        this.msg_err = `No se encuentra el botón Delete para borrar el post con id igual a ${post.id} al visitar /posts`;
        browser.assert.element(`section article.postIndex a[href="/posts/${post.id}?_method=DELETE"]`);
        browser.assert.text(`section article.postIndex a[href="/posts/${post.id}?_method=DELETE"]`, "Delete");
      }

      this.msg_err = `No se encuentra el botón de crear un nuevo post al visitar /posts`;
      browser.assert.element('a[href="/posts/new"]');
      browser.html('a[href="/posts/new"]').includes("Create New Post").should.be.equal(true);
    })


    scored(`Comprobar que se muestra la página individual de cada posts`, 1.5, async function () {
      let posts = [
        {id: 1, title: "Primer Post", body: "Esta práctica implementa un Blog."},
        {id: 2, title: 'Segundo Post', body: 'Todo el mundo puede crear posts.'},
        {id: 3, title: 'Tercer Post', body: 'Cada post puede tener una imagen adjunta.'}
      ];

      for (let post of posts) {
        this.msg_ok = `La página que muestra el post con id igual a ${post.id} funciona correctamente`;

        this.msg_err = `No se muestra la página del post "${post.id}", es decir, /posts/${post.id}`;
        await browser.visit("/posts/" + post.id);
        browser.assert.status(200)

        this.msg_err = `No se encuentra la etiqueta article de la clase postShow al visitar /posts/${post.id}`;
        browser.assert.elements('article.postShow', 1);

        this.msg_err = `La página del post "${post.id}" (/posts/${post.id}) no incluye el título correctamente`;
        browser.html().includes(post.title).should.be.equal(true);

        this.msg_err = `La página del post "${post.id}" (/posts/${post.id}) no incluye el cuerpo correctamente`;
        browser.html().includes(post.body).should.be.equal(true);

        this.msg_err = `La página del post "${post.id}" (/posts/${post.id}) no incluye la imagen adjunta correctamente`;
        browser.assert.elements('article.postShow img', {atLeast: 1});

        this.msg_err = `No se encuentra el botón Edit para editar el post con id igual a ${post.id} al visitar /posts/${post.id}`;
        browser.assert.element(`article.postShow a[href="/posts/${post.id}/edit"]`);
        browser.assert.text(`article.postShow a[href="/posts/${post.id}/edit"]`, "Edit");

      }
    })

    scored(`Comprobar que se devuelve la imagen de un post al hacer un GET a /posts/:postId/attachment`, 0.5, async function () {

      this.msg_err = 'No se devuelve la imagen de un post al hacer un GET a /posts/:postId/attachment';
      await browser.visit("/posts/1/attachment");
      browser.assert.status(200);
    })

    scored(`Comprobar la creación de un post`, 1.5, async function () {

      this.msg_err = 'No se muestra la página de creación de un post al visitar /posts/new';
      await browser.visit("/posts/new");
      browser.assert.status(200);

      this.msg_err = `La página /posts/new no implementa correctamente la etiqueta "form" para crear un nuevo post`;
      browser.assert.element('form[method="post"][action="/posts"][enctype="multipart/form-data"]');

      this.msg_err = `La página /posts/new no muestra correctamente el campo para añadir el título del post en el formulario`;
      browser.assert.element('form input[name="title"]');

      this.msg_err = `La página /posts/new no muestra correctamente el campo para añadir el cuerpo del post en el formulario`;
      browser.assert.element('form textarea[name="body"]');

      this.msg_err = `La página /posts/new no muestra correctamente el campo para añadir la imagen del post en el formulario`;
      browser.assert.element('form input[name="image"]');

      this.msg_err = `La página /posts/new no muestra correctamente el botón de submit en el formulario`;
      browser.assert.element('form input[type="submit"]');

      this.msg_err = `No se puede rellenar la página /posts/new`;
      const title2save = 'XXXXX Mi titulo XXXXX';
      const body2save = 'XXXXX Mi cuerpo XXXXX';
      await browser.fill('#title', title2save);
      await browser.fill('#body', body2save);

      this.msg_err = `No se puede enviar la página /posts/new`;
      await browser.pressButton('form input[type="submit"]');
      browser.assert.status(200);

      this.msg_err = `No se muestra el post creado después de enviar el formulario de la página /posts/new`;
      debug("POST CREADO. URL devuelta: " + browser.location.href);
      browser.location.href.includes('/posts/4').should.be.equal(true);

      this.msg_err = `No se guarda correctamente el titulo al crear un nuevo post`;
      browser.html().includes(title2save).should.be.equal(true);

      this.msg_err = `No se guarda correctamente el cuerpo al crear un nuevo post`;
      browser.html().includes(body2save).should.be.equal(true);
    })

    scored(`Comprobar que no se crea un nuevo post al mandar el formulario /posts/new con los campos vacíos`, 1, async function () {

      this.msg_err = 'No se muestra la página de creación de un post al visitar /posts/new';
      await browser.visit("/posts/new");
      browser.assert.status(200);

      // Los campos del formulario estan vacios y no los relleno

      this.msg_err = `El envio de un formulario para crear un post con los campos vacíos debe funcionar`;
      await browser.pressButton('form input[type="submit"]');
      browser.assert.status(200);

      this.msg_err = `El intento de crear de un post vacío no redirecciona a la página de crear de un post nuevo`;
      debug("POST CREADO. URL devuelta: " + browser.location.href);
      browser.location.href.should.be.equal(`http://127.0.0.1:${TEST_PORT}/posts`);

      //check that the return page contains the form
      this.msg_err = `No se muestra el campo para añadir el título del post en el formulario`;
      browser.assert.element('form input[name="title"]');

      this.msg_err = `No se muestra el campo para añadir el cuerpo del post en el formulario`;
      browser.assert.element('form textarea[name="body"]');

      this.msg_err = `No se muestra el campo para añadir la imagen del post en el formulario`;
      browser.assert.element('form input[name="image"]');

      this.msg_err = `No se muestra el botón de submit en el formulario`;
      browser.assert.element('form input[type="submit"]');

      this.msg_err = `Los campos del formulario deben continuar vacíos`;
      browser.text('form textarea[name="body"]').should.be.equal("");
      browser.assert.attribute('form input[name="title"]', "value", "");
    })


    scored(`Comprobar la edición de los posts`, 2, async function () {

      // Posts existentes actualmente en la BBDD
      let posts = [
        {id: 1, title: "Primer Post", body: "Esta práctica implementa un Blog."},
        {id: 2, title: 'Segundo Post', body: 'Todo el mundo puede crear posts.'},
        {id: 3, title: 'Tercer Post', body: 'Cada post puede tener una imagen adjunta.'}
      ];

      // Probar la edicion con el segundo post
      let post = posts[1];

      this.msg_err = `No se muestra la página de edición del post con id igual a ${post.id}`;
      await browser.visit(`/posts/${post.id}/edit`);
      browser.assert.status(200);

      this.msg_err = `La página /posts/${post.id}/edit no implementa correctamente la etiqueta "form" para editar el post`;
      browser.assert.element(`form[method="post"][action="/posts/${post.id}?_method=PUT"][enctype="multipart/form-data"]`);

      this.msg_err = `La página /posts/${post.id}/edit no muestra correctamente el campo para editar el título del post`;
      browser.assert.element('form input[name="title"]');

      this.msg_err = `La página /posts/${post.id}/edit no muestra correctamente el campo para editar el cuerpo del post`;
      browser.assert.element('form textarea[name="body"]');

      this.msg_err = `La página /posts/${post.id}/edit no muestra correctamente el campo para editar la imagen del post`;
      browser.assert.element('form input[name="image"]');

      this.msg_err = `La página /posts/${post.id}/edit no muestra correctamente el botón de submit en el formulario`;
      browser.assert.element('form input[type="submit"]');

      this.msg_err = `La página de editar un post no incluye el titulo del post`;
      browser.html('form input[name="title"]').includes(post.title).should.be.equal(true);

      this.msg_err = `La página de editar un post no incluye el cuerpo del post`;
      browser.html('form textarea[name="body"]').includes(post.body).should.be.equal(true);

      const title2save = 'Mi nuevo titulo';
      const body2save = 'Un cuerpo nuevo';

      this.msg_err = `No se puede rellenar la página /posts/${post.id}/edit`;
      await browser.fill('#title', title2save);
      await browser.fill('#body', body2save);

      this.msg_err = `No se puede enviar la página /posts/${post.id}/edit`;
      await browser.pressButton('form input[type="submit"]');
      browser.assert.status(200);

      this.msg_err = `No se muestra el post editado después de enviar el formulario de la página /posts/new`;
      debug("POST EDITADO. URL devuelta: " + browser.location.href);
      //browser.location.href.includes(`/posts/${post.id}`).should.be.equal(true);
      browser.location.href.should.be.equal(`http://127.0.0.1:${TEST_PORT}/posts/${post.id}`);

      this.msg_err = `No se guarda correctamente el titulo al editar un post`;
      browser.html().includes(title2save).should.be.equal(true);

      this.msg_err = `No se guarda correctamente el cuerpo al editar un post`;
      browser.html().includes(body2save).should.be.equal(true);

      const title2saveV2 = 'Mi nuevo titulo version 2';
      const body2saveV2 = 'Un cuerpo nuevo version 2';

      this.msg_err = `La edicion de un post dejando el titulo vacío debe fallar, pero no debe perderse el valor del cuerpo`;
      await browser.visit(`/posts/${post.id}/edit`);
      browser.assert.status(200);
      await browser.fill('#title', '');
      await browser.fill('#body', body2saveV2);
      await browser.pressButton('form input[type="submit"]');
      browser.assert.status(200);
      browser.location.href.should.be.equal(`http://127.0.0.1:${TEST_PORT}/posts/${post.id}?_method=PUT`);
      browser.text('form textarea[name="body"]').should.be.equal(body2saveV2);

      this.msg_err = `La edicion de un post dejando el cuerpo vacío debe fallar, pero no debe perderse el valor del titulo`;
      await browser.visit(`/posts/${post.id}/edit`);
      browser.assert.status(200);
      await browser.fill('#title', title2saveV2);
      await browser.fill('#body', '');
      await browser.pressButton('form input[type="submit"]');
      browser.assert.status(200);
      browser.location.href.should.be.equal(`http://127.0.0.1:${TEST_PORT}/posts/${post.id}?_method=PUT`);
      browser.html('form input[name="title"]').includes(title2saveV2).should.be.equal(true);
      browser.assert.attribute('form input[name="title"]', "value", title2saveV2);
    })


    scored(`Comprobar el borrado de los posts`, 1, async function () {

      const POST_ID = 2;

      this.msg_err = `La página para mostrar el post con id igual a "${POST_ID}" (/posts/${POST_ID}) debería existir`;
      await browser.visit(`/posts/${POST_ID}`);
      browser.assert.status(200);

      this.msg_err = `La página para borrar el post con id igual a "${POST_ID}" no funciona correctamente`;
      await browser.visit(`/posts/${POST_ID}?_method=DELETE`);
      browser.assert.status(200);

      this.msg_err = `La página para mostrar un post inexistente "${POST_ID}" (/posts/${POST_ID}) debería fallar`;
      try {
        await browser.visit(`/posts/${POST_ID}`);
      } catch (e) {
      }
      browser.assert.status(404);


      this.msg_err = `La página para borrar un post inexistente (/posts/${POST_ID}) debería fallar`;
      try {
        await browser.visit(`/posts/${POST_ID}?_method=DELETE`);
      } catch (err) {
      }
      browser.assert.status(404);
    })

  });
})
