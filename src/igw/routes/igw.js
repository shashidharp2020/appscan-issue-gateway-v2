const express = require('express');
const router = express.Router();
const igwController = require('../controllers/igwController');
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");

/**
 * @swagger
 * /igw/login:
 *   post:
 *     summary: Issue Gateway Admin Login. 
 *     description: Issue Gateway Admin Login. 
 *     tags: 
 *       - igw
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminEmail:
 *                 type: string
 *               adminPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.post('/login', schemas.igwLogin, validationMsgs.validateRequestSchema, igwController.igwLogin);

/**
 * @swagger
 * /igw/providers:
 *   get:
 *     summary: List the supported providers. 
 *     description: List the supported providers. 
 *     tags: 
 *       - igw
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/providers', igwController.getProviders);

/**
 * @swagger
 * /igw/{providerid}/config:
 *   post:
 *     summary: Create or update provider config details.
 *     description: |  
 *       <b>Create or update provider config details.</b></BR>  
 *       <b>maxissues</b> - Maximum number of issues from application/job to be pushed to Issue Management System.</BR>
 *       <b>issuestates</b> - States of issues in AppScan to be considered. Issues of specified state are pushed to Issue Management System. </BR>
 *       <b>issueseverities</b> - Severities of issues in AppScan to be considered. Issues of specified severity are pushed to Issue Management System.</BR>
 *       <b>imurl</b> – URL of Issue Management System.</BR>
 *       <b>imUserName</b> – IM user name having enough rights to create and modify tickets in the Issue Management System.</BR>
 *       <b>imPassword</b> – IM user password (encrypted) having enough rights to create and modify tickets in the Issue Management System. Run the command "node .\cryptoService.js --encrypt <password>" from the home directory to encrypt the password</BR>
 *       <b>improjectkey</b> – Project name or project key in the Issue Management System to which issues are copied</BR>
 *       <b>imissuetype</b> – The type of the issue/ticket to be created in the Issue Management System.</BR>
 *       <b>imsummary</b> – The format of the summary of the tickets in the Issue Management System.</BR>
 *       <b>severitymap</b> – Severity mapping of AppScan Issues and tickets in Issue Management System.</BR>
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: providerid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imurl
 *               - improjectkey
 *             properties:
 *               maxissues:
 *                 type: integer
 *                 default: 100
 *               issuestates:
 *                 type: array
 *                 default: New,Open
 *               issueseverities:
 *                 type: array
 *                 default: High,Medium
 *               imurl:
 *                 type: string
 *               imUserName:
 *                 type: string
 *               imPassword:
 *                 type: string
 *               improjectkey:
 *                 type: string
 *               imissuetype:
 *                 type: string
 *                 default: Bug
 *               imsummary:
 *                 type: string
 *                 default: "Security issue: %IssueType% found by %Scanner%"
 *               severitymap:
 *                 type: object
 *                 properties:
 *                   High:
 *                     type: string
 *                     default: High
 *                   Medium:
 *                     type: string
 *                     default: Medium
 *                   Low:
 *                     type: string
 *                     default: Low
 *                   Informational:
 *                     type: string
 *                     default: Low
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.post('/:providerid/config', tokenValidation.validateToken, schemas.imConfig, validationMsgs.validateRequestSchema, igwController.createConfig);

/**
 * @swagger
 * /igw/{providerid}/config:
 *   get:
 *     summary: Get the provider config data. 
 *     description: Get the provider config data. 
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: providerid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/:providerid/config', tokenValidation.validateToken, schemas.providerid, validationMsgs.validateRequestSchema, igwController.getConfig);

/**
 * @swagger
 * /igw/sync/start/{syncinterval}:
 *   get:
 *     summary: Start the sync thread to push data from AppScan to Issue Management System. 
 *     description: Start the sync thread to push data from AppScan to Issue Management System.
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: syncinterval
 *         required: true
 *         description: Provide the interval in days. Ex. 1 means synchronizer runs everyday to push issues identified in the previous day. 2 means synchronizer runs once in 2 days to push issues identified in last 2 days.
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/sync/start/:syncinterval', tokenValidation.validateToken, schemas.syncinterval, validationMsgs.validateRequestSchema, igwController.startSynchronizer);


/**
 * @swagger
 * /igw/sync/stop:
 *   get:
 *     summary: Stop the sync thread used to push data from AppScan to Issue Management System. 
 *     description: Start the sync thread used to push data from AppScan to Issue Management System.
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/sync/stop', tokenValidation.validateToken, igwController.stopSync);

/**
 * @swagger
 * /igw/sync/results:
 *   get:
 *     summary: Fetch the results for the specified provider Id. 
 *     description: Fetch the results for the specified provider Id. 
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/sync/results', tokenValidation.validateToken, igwController.getResults);


/**
 * @swagger
 * /igw/sync/app/{appid}:
 *   get:
 *     summary: Push the issues of application to the issue management system. 
 *     description: Push the issues of application to the issue management system.
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: appid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/sync/app/:appid', tokenValidation.validateToken, schemas.appId, validationMsgs.validateRequestSchema, igwController.pushJobForApplication);


/**
 * @swagger
 * /igw/sync/job/{jobid}:
 *   get:
 *     summary: Push the issues of specified scan job to the issue management system. 
 *     description: Push the issues of specified scan job to the issue management system. 
 *     tags: 
 *       - igw
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: jobid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get('/sync/job/:jobid', tokenValidation.validateToken, schemas.jobId, validationMsgs.validateRequestSchema, igwController.pushJobForScan);

module.exports = router;