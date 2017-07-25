#!/bin/bash
echo 'Running Build Script'
jsdoc www/js/atm.js www/js/branch.js beacon.js server_modules/AlterDatabase.js server_modules/Customer.js
node beacon.js