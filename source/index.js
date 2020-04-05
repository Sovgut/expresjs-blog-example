const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const {
    findAll,
    findOne,
    create,
    update,
    destroy
} = require('./controllers/posts');
const app = express();

const STATIC_FILES = path.normalize(path.join(__dirname, '..', 'public'));
const NORMALIZE_CSS = path.normalize(path.join(__dirname, '..', 'node_modules', 'normalize.css'));

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/api/posts', findAll);
app.get('/api/posts/:postId', findOne);
app.post('/api/posts', create);
app.patch('/api/posts/:postId', update);
app.delete('/api/posts/:postId', destroy);

app.use('/', express.static(STATIC_FILES));
app.use('/node_modules/normalize.css', express.static(NORMALIZE_CSS));

app.listen(process.env.PORT || 3000, () => console.log(`Server is started on ${process.env.PORT || 3000} port`));