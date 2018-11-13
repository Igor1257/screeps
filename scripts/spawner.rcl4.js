var spawner = require('spawner');
var spawnerRCL4 = function(spawn){
    this.spawn = spawn;
    this.creepTypes = {
            harvester : {
                limit: 2,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'harvester',
                role: 'harvester'
            },
            upgrader : {
                limit: 2,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'upgrader',
                role: 'upgrader'
            },
            builder : {
                limit: 2,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'builder',
                role: 'builder'
            },
            healer : {
                limit: 1,
                exist: 0,
                body: [WORK,MOVE,MOVE,MOVE,CARRY],
                namePrevix: 'healer',
                role: 'healer'
            },
            scavenger: {
                limit: 0,
                exist: 0,
                body: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY],
                namePrevix: 'scavenger',
                role: 'scavenger'
            },
            miner: {
                limit: 1,
                exist: 0,
                body: [WORK,WORK,MOVE,MOVE],
                namePrevix: 'miner',
                role: 'miner'
            },
        };
    if (this.spawn.room.memory.extentions.length >= 5) this.creepTypes.miner.body = [WORK,WORK,WORK,WORK,MOVE,MOVE]
    if (this.spawn.room.memory.extentions.length >= 10){
        //800 energy >=
        this.creepTypes.builder.body = [WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
        this.creepTypes.miner.body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE]
        this.creepTypes.upgrader.body = [WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY]
        this.creepTypes.harvester.body = [WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
        
    }
   
};
spawnerRCL4.prototype = new spawner(spawnerRCL4.spawn);

module.exports = spawnerRCL4;
