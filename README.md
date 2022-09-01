# KANBAN

This application inspired by Kanban method allows to organize and track tasks.
It's based on:
- REST API using NodeJS, Express, Sequelize and PostgreSQL
- basic front in html, css (using Bulma CSS Framework) and JavaScrip. All files are grouped in the `assets` folder.

## [See app website](https://k-anban.herokuapp.com/)

## App launch

1- After cloning the project and from the project directory, run: `npm install`

2- Create a Postgresql database

3- Install **[Sqitch](https://sqitch.org/)**

*For Debian: `sudo apt-get install sqitch libdbd-pg-perl postgresql-client libdbd-sqlite3-perl sqlite3`*

4- Create files:

- `.env`
- `sqitch.conf`  for the sqitch migrations

5- Run `sqitch deploy`, then `sqitch verify`.

6- Run sql seeding data file : `psql -U userName -d DatabaseName -f data/import-data.sql`

7- Run the following script to launch app: `npm start`

## Endpoints

### WEBSITE

- `GET /` home page

### API REST

**Lists**:

- `GET /lists` retrieves all lists from database
- `GET /lists/:id` retrieves one list from database by _id_
- `POST /lists` create a new list
- `PATCH /lists/:id` update an existing list
- `DELETE /lists/:id` remove a list

**Cards**:

- `GET /cards` retrieves all cards from database
- `GET /cards/:id` retrieves one card from database by _id_
- `GET /lists/:id/cards` retrieves all cards of a list by _id_
- `POST /cards` create a new card
- `PATCH /cards/:id` update an existing card
- `DELETE /cards/:id` remove a card

**Labels**:

- `GET /labels` retrieves all labels from database
- `GET /labels/:id` retrieves one label from database by _id_
- `POST /labels` create a new label
- `POST /cards/:id/labels` add a label to a card
- `PATCH /labels/:id` update an existing label
- `DELETE /labels/:id` remove a label
- `DELETE /cards/:card_id/labels/:label_id` remove a label from a card

## Focus on REST API

### Technical stack

- Node JS
- EXPRESS
- [Sequelize ORM](https://sequelize.org/)
- PostgreSQL

### Architecture

- Router
- Controllers organized by entity
- Models (by entity) using Sequelize ORM (Object-Relational Mapping) to query database
- Error handling using custom errors and modul
- Debug and error logs with Bunyan
- Eslint

### Conception

API CDM, LDM and PDM is availble in the `conception` folder.

### DataBase Management System (DBMS)

This API uses PostgreSQL DBMS.
The DDL is implemented with sqitch migrations. All migrations are available in the `migrations` folder.

### Seeding

Data seeding is avaible in `import-data.sql` file in `data` folder.

## Focus on Front side

All files are grouped in the `assets` folder.

### Technical stack

- HTML
- [Bulma CSS Framework](https://bulma.io/)
- JavaScript
- [SortableJS](https://sortablejs.github.io/Sortable/) for drag and drop
- [Browserify](https://browserify.org/)

### Architecture

- Webpage structure with html
- Webpage style using [Bulma CSS Framework](https://bulma.io/)
- Webpage interaction with Javascript (all source files are grouped in the `assets/src` folder )
- Bundling js files using [browserify](https://browserify.org/)