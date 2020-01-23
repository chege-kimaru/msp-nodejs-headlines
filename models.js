const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize(process.env.db, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Model = Sequelize.Model;

class Headline extends Model {
}

Headline.init({
    // attributes
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    about: {
        type: Sequelize.STRING,
        allowNull: false
        // allowNull defaults to true
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'headline'
    // options
});
Headline.sync();

module.exports = {Headline};

