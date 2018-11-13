var spawnerRCL1 = require('spawner.rcl1');
var spawnerRCL2 = require('spawner.rcl2');
var spawnerRCL4 = require('spawner.rcl4');
var creepMiner = require('creep.miner');
var creepUpgrader = require('creep.upgrader');
var creepHarvester = require('creep.harvester');
var creepBuilder = require('creep.builder');
var roomBase = require('role.room');
var roleTower = require('role.tower')
var test = require('test');

module.exports.loop = function () {
    
    console.log('GitHub!!!');
    //var t = new test();
    
    var roomModels = [];
    for (var name in Game.rooms){
        roomModels[name] = new roomBase(Game.rooms[name]);
        var towers = roomModels[name].room.memory.towers;
        for (var tower in towers){
             roleTower.run(towers[tower])
        }
    }

    if (Game.time%10 == 0 ){
        for (var name in Game.spawns){
            var spawn = Game.spawns[name];
            var gcl = spawn.room.controller.level;
            var sp = '';
            if (gcl == 1) sp = new spawnerRCL1(spawn);
            if (gcl == 2) sp = new spawnerRCL2(spawn);
            if (gcl >= 4) sp = new spawnerRCL4(spawn);
            sp.run();
        }
    }
    
    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            var creepType = new creepMiner(creep);
            creepType.run();
        };
        if(creep.memory.role == 'upgrader') {
            var creepType = new creepUpgrader(creep);
            creepType.run();
        };
        if(creep.memory.role == 'harvester') {
            var creepType = new creepHarvester(creep);
            creepType.run();
        }
        if(creep.memory.role == 'builder') {
            var creepType = new creepBuilder(creep);
            creepType.run();
        }
    };
};
    
    
    /*    
    //console.log(Game.JSON.stringify(Game.rooms));
    if (Game.rooms['W27N23'].controller.level>=5)
        spawnerRCL5.run(Game.rooms['W27N23']);
    else spawner.run(Game.rooms['W27N23']);
    
    
    if (Game.rooms['W26N23'].controller.level>=5)
        spawnerRCL5.run(Game.rooms['W26N23']);
    else spawner.run(Game.rooms['W26N23'],Game.spawns['Spawn2']);
    
    var towers = Game.rooms['W27N23'].find(FIND_STRUCTURES, {
                    filter: (structure) => {return structure.structureType == STRUCTURE_TOWER}
            });
    for (var name in towers)
        roleTower.run(towers[name]);
    
    roleLink.transfer();
    
    //if (!Game.rooms['W27N23'].controller.safeMode) {
    //    Game.notify('SaveMode was activated');
    //    Game.rooms['W27N23'].controller.activateSafeMode();
    //};

    //if (Game.rooms['W27N23'].storage.store.energy>0)console.log('I got energy,master!')
    
    */
    
    /*for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'upgraderex') {
            roleUpgraderEx.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'builderexp') {
            roleBuilderExpan.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'scavenger') {
            roleScavenger.run(creep);
        }
        if(creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
    }
    */
    
