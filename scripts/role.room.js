var roomBase = function(room){
    this.room = room;
    this.room.memory = '';
    this.room.memory.extentions = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION)
            }
        });
    this.room.memory.sources = this.room.find(FIND_SOURCES); 
    this.room.memory.structures = this.room.find(FIND_MY_STRUCTURES);
    this.room.memory.spawns =  _.filter(this.room.memory.structures,function (o) {return o.structureType == 'spawn'})
    this.room.memory.dropped_resources =  this.room.find(FIND_DROPPED_RESOURCES);
    this.room.memory.towers = this.room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_TOWER}});
    this.room.memory.containers = this.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}});
    //this.room.memory.spawns =  _.filter(this.room.memory.structures,function (o) {return o.structureType == 'spawn'})
}

module.exports = roomBase;