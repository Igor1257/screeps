var spawner = require('spawner');
var spawnerRCL1 = function(spawn){
    this.spawn = spawn;
};
spawnerRCL1.prototype = new spawner(spawnerRCL1.spawn);

module.exports = spawnerRCL1;
