const path = require('path');
const fs = require('fs');

if (fs.existsSync(path.normalize(path.join(__dirname, 'dist')))) {
    console.log('Loaded dist');
    require('./dist');
}

else if (fs.existsSync(path.normalize(path.join(__dirname, 'source')))) {
    console.log('Loaded source');
    require('./source');
}

else {
    console.log('Application not found');
}