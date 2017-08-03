#!/bin/bash
echo 'Running Build Script'
# jsdoc www/js/atm.js www/js/branch.js beacon.js server_modules/AlterDatabase.js server_modules/Customer.js
/home/ubuntu/workspace/mongodb-linux-x86_64-ubuntu1404-3.4.0/bin/mongod --dbpath=/home/ubuntu/workspace/BeaconDataBase --port 27017
node beacon.js