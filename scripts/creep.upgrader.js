var creepBase = require('creep.base');
var creepUpgrader = function(creep){
    this.creep = creep;
    this.run = function(){
        this.isIll();
        if(this.creep.memory.ill) {
            this.moveToClosestSpawn() 
            return;
        }
        this.isHarvest();
        if(!this.creep.memory.harvest) {
            if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else{
            this.getEnergy();
        } 
    }
}

creepUpgrader.prototype = new creepBase(this.creep);
module.exports = creepUpgrader;
