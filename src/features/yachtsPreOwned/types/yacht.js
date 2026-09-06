/**
 * @typedef {'draft'|'published'|'archived'} YachtStatus
 * @typedef {'pending'|'approved'|'rejected'} YachtSubmissionStatus
 * @typedef {'new'|'pre_owned'} YachtCondition
 * @typedef {'sale'|'charter'} YachtListingType
 *
 * @typedef {Object} YachtImage
 * @property {number} id
 * @property {number} yacht_id
 * @property {string} image_path
 * @property {string} [image_type]
 *
 * @typedef {Object} YachtSpecification
 * @property {number} [id]
 * @property {number} yacht_id
 * @property {string} name
 * @property {string|number} value
 *
 * @typedef {Object} Yacht
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} [cover_image]
 * @property {number|string} [price_sale]
 * @property {number|string} [size_meters]
 * @property {number} [year_built]
 * @property {number} [cabins]
 * @property {string} [condition_type]
 * @property {string} [listing_type]
 * @property {YachtStatus} [status]
 * @property {YachtSubmissionStatus} [submission_status]
 * @property {YachtImage[]} [images]
 * @property {YachtSpecification[]} [specifications]
 * @property {Array<Object>} [amenities]
 *
 * @typedef {Object} YachtFilters
 * @property {string} [condition]
 * @property {number|string} [brand_id]
 * @property {number|string} [category_id]
 * @property {string} [listing_type]
 * @property {number|string} [min_year]
 * @property {number|string} [max_year]
 * @property {number|string} [min_size]
 * @property {number|string} [max_size]
 * @property {number|string} [cabins]
 * @property {number|string} [limit]
 */

export {};
