require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {Headline} = require('./models');
const {Op} = require('sequelize');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app = express();

//setup public path
app.use(express.static(path.join(`${__dirname}/public`)));

//setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Setup template engine
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

// create csurf
const csrfProtection = csrf({cookie: true});

//setup cloudinary
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const storage = cloudinaryStorage({
    cloudinary,
    folder: 'headlines-msp',
});
const upload = multer({storage});

//routes
app.get('/', (req, res) => {
    Headline.findAll({
        limit: 3,
        order: [
            ['createdAt', 'DESC']
        ]
    })
        .then(data => {
            res.render('index', {headlines: data});
        }).catch(e => {
        console.error(e);
        res.render('index', {headlines: []});
    });
});

app.get('/add', csrfProtection, (req, res) => {
    res.render('create', {csrfToken: req.csrfToken()});
});


app.post('/headlines', upload.single('image'), csrfProtection, (req, res) => {
    const headline = {
        'title': req.body.title,
        'about': req.body.about,
        'author': req.body.author,
        'image': req.file && req.file.secure_url
    };
    Headline.create(headline)
        .then(data => {
            res.redirect('/headlines');
        }).catch(e => {
        res.redirect('create', {data: headline});
        console.error(e);
    });
});

app.get('/headlines', (req, res) => {
    let query = req.query.q !== undefined && String(req.query.q).length > 0 ? String(req.query.q) : '';
    Headline.findAll({
        where: {
            title: {
                [Op.like]: `%${query}%`
            }
        }
    })
        .then(data => {
            res.render('headlines', {headlines: data});
        }).catch(e => {
        console.error(e);
        res.render('headlines', {headlines: []});
    });

});

app.get('/headlines/:id', (req, res) => {
    Headline.findByPk(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
});

app.put('/headlines/:id', (req, res) => {
    Headline.findByPk(req.params.id)
        .then(headline => {
            headline.update(req.body)
                .then(data => {
                    res.status(200).json(data)
                })
                .catch(e => {
                    res.status(500).json({error: e.message})
                })
        })
        .catch(e => {
            res.status(500).json({error: e.message})
        })
});

app.delete('/headlines/:id', (req, res) => {
    Headline.findByPk(req.params.id)
        .then(headline => {
            headline.destroy()
                .then(data => {
                    res.status(200).json(data)
                })
                .catch(e => {
                    res.status(500).json({error: e.message})
                })
        })
        .catch(e => {
            res.status(500).json({error: e.message})
        })
});


//Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`)
});
