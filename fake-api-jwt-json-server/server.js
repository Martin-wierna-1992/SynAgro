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

function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

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

    var data = JSON.parse(data.toString());

    var last_item_id = data.users[data.users.length-1].id;

    data.users.push({id: last_item_id + 1, email: email, password: password}); 
    var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  /
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
});

  const access_token = createToken({email, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

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

  const userId = userdb.users[userIndex].id;
  const access_token = createToken({ id: userId, email });
  console.log('Access Token:' + access_token);
  res.status(200).json({ access_token });
});

server.use((req, res, next) => {
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

  server.post('/publicacion/:id/comentarios', (req, res) => {
    const postId = parseInt(req.params.id);
    const comment = req.body;

    const post = router.db.get('publicacion').getById(postId).value();

    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    comment.id = generateCommentId(); 
    post.comentarios.push(comment);

    router.db.get('publicacion').updateById(postId, post).write();

    res.status(201).json(comment);
  });

  function generateCommentId() {
    const comments = router.db.get('publicacion').map('comentarios').value();
    const allComments = [].concat(...comments);
    return allComments.length + 1;
  }


server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})