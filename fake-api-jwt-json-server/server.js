const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;

  if(isAuthenticated({email, password}) === true) {
    const status = 401;
    const message = 'Email and Password already exist';
    res.status(status).json({status, message});
    return
  }

fs.readFile("./users.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    // Get current users data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var last_item_id = data.users[data.users.length-1].id;

    //Add new user
    data.users.push({id: last_item_id + 1, email: email, password: password}); //add some data
    var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
});

// Create token for new user
  const access_token = createToken({email, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log('login endpoint called; request body:');
  console.log(req.body);
  const { email, password } = req.body;
  
  const userIndex = userdb.users.findIndex((user) => user.email === email && user.password === password);

  if (userIndex === -1) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
    return;
  }

  const userId = userdb.users[userIndex].id; // Get the ID of the authenticated user

  const access_token = createToken({ id: userId, email });
  console.log('Access Token:' + access_token);
  res.status(200).json({ access_token }); // Include the ID in the response
});

server.use((req, res, next) => {
  // Si la ruta es /publicacion, se permite el acceso sin verificar el token
  if (req.path === '/publicacion') {
    next();
    return;
  }

  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'Error in authorization format';
    res.status(status).json({ status, message });
    return;
  }

  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = 'Access token not provided';
      res.status(status).json({ status, message });
      return;
    }
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error access_token is revoked';
    res.status(status).json({ status, message });
  }
});

server.get('/publicacion/:id/comentarios', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = router.db.get('publicacion').getById(postId).value();

  if (!post) {
    res.status(404).json({ message: 'Publicación no encontrada' });
    return;
  }

  res.status(200).json(post.comentarios);
});

  // Agregar un nuevo comentario a una publicación
  server.post('/publicacion/:id/comentarios', (req, res) => {
    const postId = parseInt(req.params.id);
    const comment = req.body;

    const post = router.db.get('publicacion').getById(postId).value();

    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    comment.id = generateCommentId(); // Genera un nuevo ID para el comentario
    post.comentarios.push(comment);

    // Actualiza la base de datos
    router.db.get('publicacion').updateById(postId, post).write();

    res.status(201).json(comment);
  });

  // Generar un nuevo ID para comentarios (por ejemplo, usando la longitud de los comentarios)
  function generateCommentId() {
    const comments = router.db.get('publicacion').map('comentarios').value();
    const allComments = [].concat(...comments);
    return allComments.length + 1;
  }


server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})