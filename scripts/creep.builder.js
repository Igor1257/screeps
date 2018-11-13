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
            var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var target = this.creep.pos.findClosestByRange(targets)
                if(this.creep.build(target) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else{
            this.getEnergy();
        } 
    }
}

creepUpgrader.prototype = new creepBase(this.creep);
module.exports = creepUpgrader;
