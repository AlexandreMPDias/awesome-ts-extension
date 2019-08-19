
var child = require('child_process');
const { execSync } = child;
const env = require('dotenv').config().parsed;

const outputFile = `./scripts/generated/env.auto.bat`;
execSync(`echo @echo off > ${outputFile}`);
Object.keys(env).forEach(async key => {
	const line = (`SET ${key}=${env[key]}`);
	execSync(`echo ${line} >> ${outputFile}`);
})