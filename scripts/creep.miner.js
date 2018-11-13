var creepBase = require('creep.base');
var creepMiner = function(creep){
    this.creep = creep;
    this.run = function(){
        this.isIll();
        if(this.creep.memory.ill) {
            this.moveToClosestSpawn() 
            return;
        }
	    this.harvestTarget(Game.getObjectById(this.creep.memory.target.id));
    }
}

creepMiner.prototype = new creepBase(this.creep);
module.exports = creepMiner;
