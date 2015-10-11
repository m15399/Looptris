
var Blocks = {
    size: 0,
    spacing: 0,

    colors: ["#00ee11", "#bb22ff", "#ff2233", "#00ffff", "#ee8800", "#3377ff", "eedd00"],
    // S T Z I L J O
    
    S: [[0, 0], [0, 1], [1, 1], [-1, 0]],
    S2: [[0,0], [0,-1], [-1,0], [-1,1]],
    
    T: [[0,0], [-1,0], [1,0], [0,1]],
    T2: [[0,0], [0,1], [0,-1], [1,0]],
    T3: [[0,0], [0,-1], [-1,0], [1,0]],
    T4: [[0,0], [0,1], [0,-1], [-1,0]],
    
    L: [[0,0], [-1,0], [1,0], [1,1]],
    L2: [[0,0], [0,1], [0,-1], [1,-1]],
    L3: [[0,0], [-1,-1], [-1,0], [1,0]],
    L4: [[0,0], [0,1], [0,-1], [-1,1]],
    
    J: [[0,0], [-1,0], [1,0], [-1,1]],
    J2: [[0,0], [0,1], [0,-1], [1,1]],
    J3: [[0,0], [1,-1], [-1,0], [1,0]],
    J4: [[0,0], [0,1], [0,-1], [-1,-1]],
    
    I: [[0,-1], [0,0], [0,1], [0,2]],
    I2: [[-1,0], [0,0], [1,0], [2,0]],
    
    
    O: [[0,0], [-1,0], [0,1], [-1,1]],
    O2: [[0,0], [-1,0], [0,1], [-1,1]],
    
    Z: [[0,0], [1,0], [0,1], [-1,1]],
    Z2: [[0,0], [0,-1], [1,0], [1,1]],
    
   
    
    randomShape: function(){
	var id;
	var shape;
	var color = (Math.random() * 7 | 0);
	switch(color){
	    case 0:
		id = "S";
		break;
	    case 1:
		id = "T";
		break;
	    case 2:
		id = "Z";
		break;
	    case 3:
		id = "I";
		break;
	    case 4:
		id = "L";
		break;
	    case 5:
		id = "J";
		break;
	    default:
		id = "O";
		break;
	}
	
	return {id: id, shape: this[id], color: color};
    },
    
    getRotatedShape: function(id){
	if(id.length == 1){
	    id += "2";
	} else if(id.charAt(1) == "2"){
	    if(id == "T2" || id == "L2" || id == "J2")
		id = id.substring(0,1) + "3";
	    else
		id = id.substring(0,1);
	} else if(id.charAt(1) == "3"){
	    id = id.substring(0,1) + "4";
	} else {
	    id = id.substring(0,1);
	}
	return {id: id, shape: this[id]};
    },
    
    drawBlock: function(x, y, color, gg){
	var s = this.size - 2 * this.spacing;

	gg.strokeStyle = this.colors[color];
	gg.lineWidth = 2;
	gg.lineJoin = "round";
    
	gg.strokeRect(x+this.spacing, y+this.spacing, s, s);
	gg.fillStyle = this.colors[color];
	
	var innerSpacing = (this.size / 12) | 0;
	s -= 2 * innerSpacing;
	gg.fillRect(x + this.spacing + innerSpacing, y + this.spacing + innerSpacing, s, s);

    }
}