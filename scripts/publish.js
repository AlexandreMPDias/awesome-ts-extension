const env = require('dotenv').config().parsed;
var child = require('child_process');
const { execSync } = child;

const outputFile = `.\\scripts\\generated\\publish.auto.bat`;
// execSync(`echo @echo off > ${outputFile}`);
execSync(`echo @echo off > ${outputFile}`);
execSync(`echo @set TOKEN=${env.TOKEN} >> ${outputFile}`);
execSync(`echo echo Publishing...`)
execSync(`echo vsce publish -p ^%TOKEN^% >> ${outputFile}`);