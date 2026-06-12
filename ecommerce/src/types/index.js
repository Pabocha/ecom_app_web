/**
 * Types et interfaces de l'application
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} [qty]
 * @property {string} [cartKey]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

/**
 * @typedef {Object} CartItem
 * @property {number|string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} qty
 * @property {string} [cartKey]
 */

/**
 * @typedef {Object} Route
 * @property {string} path
 * @property {React.Component} element
 * @property {Route[]} [children]
 */

export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  COMING_SOON: 'coming_soon',
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
};
