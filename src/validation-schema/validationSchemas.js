const { param, body } = require("express-validator");
const constants = require("../utils/constants");

var schemas = {};

schemas.adminEmail = body('adminEmail').isEmail().withMessage(constants.INVALID_ADMIN_EMAIL);
schemas.adminPassword = body('adminPassword').isLength({min:8, max:100}).withMessage(constants.INVALID_ADMIN_PASSWORD);
schemas.igwLogin = [schemas.adminEmail, schemas.adminPassword];
schemas.providerid = param("providerid").isIn(constants.PROVIDERS).withMessage(constants.INVALID_PROVIDER_ID);;
schemas.syncinterval = param("syncinterval").isInt().isLength({ min: 1, max: 3 }).withMessage(constants.INVALID_SYNC_INTERVAL);
schemas.appId = param("appid").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_APP_ID);
schemas.jobId = param("jobid").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_JOB_ID);

schemas.maxissues = body('maxissues').isInt().isLength({min:1, max:5}).withMessage(constants.INVALID_MAX_ISSUES_VALUE);
schemas.issuestates = body('issuestates').isString().isLength({min:2, max:200}).withMessage(constants.INVALID_ISSUE_STATES);
schemas.issueseverities = body('issueseverities').isString().isLength({min:2, max:200}).withMessage(constants.INVALID_ISSUE_SEVERITIES);
schemas.imurl = body('imurl').isString().isLength({min:2, max:200}).withMessage(constants.INVALID_IM_URL);
schemas.imUserName = body('imUserName').isString().isLength({min:2, max:50}).withMessage(constants.INVALID_IM_USERNAME);
schemas.imPassword = body('imPassword').isString().isLength({min:2, max:100}).withMessage(constants.INVALID_IM_PASSWORD);
schemas.improjectkey = body('improjectkey').isString().isLength({min:2, max:30}).withMessage(constants.INVALID_PROJECT_KEY);
schemas.imissuetype = body('imissuetype').isString().isLength({min:2, max:20}).withMessage(constants.INVALID_IM_ISSUE_TYPE);
schemas.imsummary = body('imsummary').isString().isLength({min:2, max:500}).withMessage(constants.INVALID_IM_SUMMARY);


schemas.imConfig = [schemas.providerid, schemas.maxissues, schemas.issuestates, schemas.issueseverities, 
    schemas.imurl, schemas.imUserName, schemas.imPassword, schemas.improjectkey, schemas.imissuetype, schemas.imsummary];
module.exports = schemas;
