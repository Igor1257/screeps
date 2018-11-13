var role = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var roleCommonWorker = require('role.common.worker');
        var roleRoom = require('role.room');
   
        if (creep.room.name != 'W26N23') {
            var target = new RoomPosition(5,5,'W26N23')
            creep.moveTo(target);
            console.log('soldier: going to W26N23 ' )
            return;
        }
        
        var targets = creep.room.find(FIND_HOSTILE_CREEPS)
        var target = creep.pos.findClosestByRange(targets)
        if (target){
            if (creep.attack(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
        }
	}
};

module.exports = role;
