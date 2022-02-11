const properties = require('./json/properties.json');
const users = require('./json/users.json');
const db = require('../db')
// const { Pool } = require('pg')

// const pool = new Pool({
//   user: 'vagrant',
//   password: '123',
//   host: 'localhost',
//   database: 'lightbnb'
// })

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return db
    .query(`
      SELECT * FROM users
      WHERE email = $1`, [email]
      )
    .then(res => {
      if (!res.rows) {
        return null
      }        
        return res.rows[0]
    })
    .catch((err) => {
      return err.message
    })
  };

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return db
    .query(`
      SELECT * FROM users
      WHERE id = $1`, [id])
    .then( res => {
      if (!res.rows) {
        return null
      }        
        return res.rows[0]
    })
    .catch( err => {
      return err.message
    })
  };

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return db
    .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) 
      RETURNING *`, [user.name, user.password, user.email] )
    
    .then( res => {
      console.log(res.rows)
      return res.rows[0]
    })
    .catch( err => {
      return err.message
    })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return db
    .query(
      `SELECT * FROM reservations
      WHERE guest_id = $1
      LIMIT $2
      `, [guest_id, limit])
    .then( res => {
      return res.rows
    })
    .catch( err => {
      return err.message
    })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += queryParams.length > 1 && 'AND' || 'WHERE ';
    queryString += `city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    const convertToPennies = (pennys) => {
      return pennys * 100
    }
    queryParams.push(convertToPennies(options.minimum_price_per_night))
    queryString += queryParams.length > 1 && ' AND' || 'WHERE ';
    queryString += ` cost_per_night > $${queryParams.length}`
    queryParams.push(convertToPennies(options.maximum_price_per_night))
    queryString += ` AND cost_per_night < $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating))
    queryString += queryParams.length > 1 && 'AND' || 'WHERE ';
    queryString += ` rating >= $${queryParams.length}`
  }

  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += queryParams.length > 1 && 'AND' || 'WHERE ';
    queryString += ` user LIKE $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return db.query(queryString, queryParams)
    .then((res) => {
      return res.rows
    })
    .catch((err) => {
      return err.message
    })
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const SQLstatement =
    `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`
  
  const stringInterpolation = [
    property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms
  ]

  return db
    .query(SQLstatement, stringInterpolation)
    .then( res => {
      console.log('from then', res)
      return res
    })
    .catch( err => {
      return err.message
    })

}
exports.addProperty = addProperty;
