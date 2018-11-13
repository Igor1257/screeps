var roleTower = {
    
    run: function(tower){
        var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS)
        if (hostileCreeps.length > 0){
            console.log('hostileCreeps ' + hostileCreeps)
            var result = tower.attack(tower.pos.findClosestByRange(hostileCreeps));
            console.log('tower, attack result: ' + result);
        }
        
        if ((tower.energy/tower.energyCapacity) > 0.8) {
            var hitsBase = 220000;
            var targets = tower.room.find(FIND_MY_STRUCTURES, {filter: (s) => ((s.hits < s.hitsMax) && (s.hits < hitsBase))});
            if (targets.length == 0)
                targets = tower.room.find(FIND_STRUCTURES, {filter: (s) => ((s.hits < s.hitsMax) && (s.structureType == STRUCTURE_ROAD))});
            if (targets.length == 0)
                targets = tower.room.find(FIND_STRUCTURES, {filter: (s) => ((s.structureType == STRUCTURE_WALL) && (s.hits < hitsBase))});
            if(targets.length > 0) {
                console.log('tower repair targets: ' + targets);
                var target = targets[0];
                var result = tower.repair(target);
                console.log('tower repair result: ' + result)
            }
        }
        if ((tower.energy/tower.energyCapacity) > 0.8) {
            var hitsBase = 200000;
            var targets = tower.room.find(FIND_STRUCTURES, {filter: (s) => ((s.structureType == STRUCTURE_WALL) && (s.hits < hitsBase))});
            if(targets.length > 0) {
                console.log('tower repair targets (walls): ' + targets);
                var target = targets[0];
                var result = tower.repair(target);
                console.log('tower repair result: ' + result)
            }
        }
    }
}

module.exports = roleTower;