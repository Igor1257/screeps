var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var roleCommonWorker = require('role.common.worker');
        var target = new RoomPosition(24,40,'W26N23')
        var controller = Game.getObjectById('5bbcab7b9099fc012e6339af');
        //var path = creep.room.findPath(Game.flags[0])
        //console.log('path:' + path)
        var result = creep.claimController(controller)
        //console.log('claim result: ' + result)
        if (result == ERR_NOT_IN_RANGE) creep.moveTo(controller)
        //console.log('moveto room W26N23 ' + creep.moveTo(target))
	}
};

module.exports = roleClaimer;