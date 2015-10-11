
var Input = {
    keys: [],
    
    rotateTimer: 0,
    moveRTimer: 0,
    moveLTimer: 0,
    moveYTimer: 0,
    
    space: false,
    shift: false,
    p: false,
    
    press: function(e){
	var key = e.which || e.keyCode;
	if(key){
	    Input.keys[key] = 1;
	}
    },
    
    release: function(e){
	var key = e.which || e.keyCode;
	if(key){
	    Input.keys[key] = 0;
	}
    },
    
    update: function(){
	// space
	if(Input.keys[32] == 1){
	    if(!this.space){
		this.space = true;
		if(menu){
		    menu = false;
		}
		else
		    while(Player.moveDown()){}
	    }
	} else {
	    this.space = false;
	}
	
	// pause
	if(Input.keys[80] == 1){
	    if(!this.p){
		pause();
		this.p = true;
	    }
	} else {
	    this.p = false;
	}
	if(paused)
	    return;
	
	this.rotateTimer--;
	this.moveRTimer--;
	this.moveLTimer--;
	this.moveYTimer--;
		
	// left/right controls
	if(Input.keys[39] == 1 && Input.keys[37] !== 1){
	    if(this.moveRTimer < 0){
		if(Player.moveRight())
		    this.moveRTimer = moveTime;
	    }
	} else if (Input.keys[37] == 1 && Input.keys[39] !== 1){
	    if(this.moveLTimer < 0){
		if(Player.moveLeft())
		    this.moveLTimer = moveTime;
	    }
	} else {
	    this.moveLTimer = 0;
	    this.moveRTimer = 0;
	}
	
	// down
	if(Input.keys[40] == 1){
	    if(this.moveYTimer < 0){
		Player.moveDown();
		this.moveYTimer = moveTime;
	    }
	} else {
	    this.moveYTimer = 0;
	}
	
	// rotate
	if(Input.keys[38] == 1){
	    if(this.rotateTimer < 0){
		Player.rotate();
		this.rotateTimer = rotateTime;
	    }
	} else {
	    this.rotateTimer = 0;
	}
	
	
	// shift
	if(Input.keys[16] == 1){
	    if(!this.shift){
		Player.swapHold();
		this.shift = true;
	    }
	} else {
	    this.shift = false;
	}
	
	
    }
}