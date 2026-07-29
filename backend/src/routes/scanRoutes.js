const express = require('express')
const router = express.Router()
const {
  analyse,
  save,
  list,
  getById,
  remove,
  migrate,
  checkHash,
  updateProductName,
} = require('../controllers/scanController')
const { requireAuth } = require('../middleware/requireAuth')
const { analyseLimiter } = require('../middleware/rateLimiter')
const { validateAnalyseBody } = require('../middleware/validateBody')

/**
 * @swagger
 * /api/scans/analyse:
 *   post:
 *     summary: Analyse an ingredient list using the configured AI provider
 *     description: >
 *       Accepts a plain-text ingredient list and returns a structured safety verdict.
 *       No authentication required. Rate limited to 10 requests per minute per IP address.
 *       The active AI provider is Groq (llama-3.1-8b-instant). Returns UNRECOGNISED
 *       if the input does not appear to be a valid food ingredient list.
 *     tags:
 *       - Scans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredients
 *             properties:
 *               ingredients:
 *                 type: string
 *                 minLength: 3
 *                 description: Plain-text food ingredient list extracted from a product label
 *                 example: Sugar, Palm Oil, Cocoa, Skimmed Milk Powder, Soy Lecithin, Vanilla Flavouring
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AnalysisResult'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingField:
 *                 value:
 *                   success: false
 *                   error: ingredients must be a non-empty string
 *               tooShort:
 *                 value:
 *                   success: false
 *                   error: ingredients text is too short
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: Too many requests, please try again in a minute
 *       503:
 *         description: AI provider temporarily unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: The AI analysis service is temporarily busy. Please try again in a moment.
 */
router.post('/analyse', analyseLimiter, validateAnalyseBody, analyse)

/**
 * @swagger
 * /api/scans:
 *   post:
 *     summary: Save a completed scan to the authenticated user's history
 *     description: Persists a scan record to the Supabase database under the authenticated user's ID.
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - raw_ingredients
 *               - ingredient_hash
 *               - verdict
 *               - summary
 *               - analysis_json
 *             properties:
 *               product_name:
 *                 type: string
 *                 description: User-entered product name. Defaults to Unnamed Product if omitted.
 *                 example: Pringles Original
 *               raw_ingredients:
 *                 type: string
 *                 description: Full ingredient text string as extracted by OCR or entered manually
 *               ingredient_hash:
 *                 type: string
 *                 description: SHA-256 hash of the normalised ingredient string for repeat scan detection
 *               verdict:
 *                 type: string
 *                 enum: [SAFE, UNSAFE, CAUTION, UNRECOGNISED]
 *               summary:
 *                 type: string
 *               analysis_json:
 *                 $ref: '#/components/schemas/AnalysisResult'
 *               scanned_at:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the scan. Defaults to current time if omitted.
 *     responses:
 *       201:
 *         description: Scan saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Scan'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to save scan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', requireAuth, save)

/**
 * @swagger
 * /api/scans:
 *   get:
 *     summary: Get the authenticated user's paginated scan history
 *     description: >
 *       Returns scan records for the authenticated user, sorted by most recent first.
 *       Supports filtering by verdict and searching by product name or ingredient keyword.
 *       Results are paginated at 20 records per page.
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: verdict
 *         schema:
 *           type: string
 *           enum: [SAFE, UNSAFE, CAUTION, UNRECOGNISED]
 *         description: Filter results by verdict
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term matched against product name and raw ingredient text
 *     responses:
 *       200:
 *         description: Scan history returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     scans:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Scan'
 *                     total:
 *                       type: integer
 *                       description: Total number of matching records across all pages
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                       example: 20
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', requireAuth, list)

/**
 * @swagger
 * /api/scans/check/{hash}:
 *   get:
 *     summary: Check whether an ingredient hash exists in the user's history
 *     description: >
 *       Used for repeat scan detection. Returns the existing scan if the normalised
 *       ingredient hash matches a record owned by the authenticated user.
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: SHA-256 hash of the normalised ingredient string
 *     responses:
 *       200:
 *         description: Hash check completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *                     scan:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/Scan'
 *                         - type: 'null'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/check/:hash', requireAuth, checkHash)

/**
 * @swagger
 * /api/scans/{id}/name:
 *   patch:
 *     summary: Update the product name of a scan
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *             properties:
 *               product_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product name updated successfully
 *       400:
 *         description: Invalid product name
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Update failed
 */
router.patch('/:id/name', requireAuth, updateProductName)
router.get('/:id', requireAuth, getById)

/**
 * @swagger
 * /api/scans/{id}:
 *   delete:
 *     summary: Delete a single scan record
 *     description: Permanently removes the scan record with the given ID, provided it belongs to the authenticated user.
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the scan record to delete
 *     responses:
 *       200:
 *         description: Scan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Scan deleted
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to delete scan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', requireAuth, remove)

/**
 * @swagger
 * /api/scans/migrate:
 *   post:
 *     summary: Migrate guest scans from localStorage into the authenticated user's history
 *     description: >
 *       Accepts an array of scan objects previously saved to browser localStorage
 *       and inserts them into the authenticated user's database history.
 *       Uses upsert with a composite unique constraint on (ingredient_hash, user_id)
 *       to prevent duplicate entries. Called automatically on sign-in if guest scans exist.
 *     tags:
 *       - Scans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scans
 *             properties:
 *               scans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_name:
 *                       type: string
 *                     raw_ingredients:
 *                       type: string
 *                     ingredient_hash:
 *                       type: string
 *                     verdict:
 *                       type: string
 *                       enum: [SAFE, UNSAFE, CAUTION, UNRECOGNISED]
 *                     summary:
 *                       type: string
 *                     analysis_json:
 *                       $ref: '#/components/schemas/AnalysisResult'
 *                     scanned_at:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Migration completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     migrated:
 *                       type: integer
 *                       description: Number of scans successfully inserted or updated
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Migration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/migrate', requireAuth, migrate)

module.exports = router
