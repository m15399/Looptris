
var Board = {
    canvas: null,
    g: null,
    
    width: 0,
    height: 0,
    bottom: 0,
	
    board: [],
    
    rows: 14,
    columns: 10,
    
    x: 0,
    score: 0,
    highScore: 0,
    linesCleared: 0,
    lastClear: 0,
    
    init: function(){
	this.reset();
	this.highScore = localStorage.getItem("TetrisHS1");
	this.fallTime = fMul * 5;
    },
    
    update: function(){
	//update score
	var oldScore = this.score;
	this.linesCleared += this.lastClear;
	for(var i = 1; i <= this.lastClear; i++){
	    this.score += i * 100 * Player.combo;
	}
	if(this.score > this.highScore){
	    this.highScore = this.score;
	}
	
	var changeInScore = this.score - oldScore;
	if(changeInScore > 0){
	    var top = this.pixCoords(0,this.fallRows[this.fallRows.length-1]);
	    var bot = this.pixCoords(0,this.fallRows[0]-1);
	    //console.log(top.y + ", " + bot.y);
	    ClearLine.spawn(top.y, bot.y, changeInScore, Player.combo);
	}
	
	this.lastClear = 0;
	
	if(this.x > this.width)
	    this.x -= this.width;
	else if(this.x < 0)
	    this.x += this.width;
		    
	this.bounce();
	
	if(this.fallTimer == 0)
	    this.fall();
	if(this.fallTimer != -1)
	    this.fallTimer--;
    },
    
    saveHS: function(){
	if(this.score > localStorage.getItem("TetrisHS1")){
	    localStorage.setItem("TetrisHS3", localStorage.getItem("TetrisHS2"));
	    localStorage.setItem("TetrisHS2", localStorage.getItem("TetrisHS1"));
	    localStorage.setItem("TetrisHS1", this.score);
	    Menu.newScore = 1;
	} else if (this.score > localStorage.getItem("TetrisHS2")){
	    localStorage.setItem("TetrisHS3", localStorage.getItem("TetrisHS2"));
	    localStorage.setItem("TetrisHS2", this.score);
	    Menu.newScore = 2;
	} else if (this.score > localStorage.getItem("TetrisHS3")){
	    localStorage.setItem("TetrisHS3", this.score);
	    Menu.newScore = 3;
	} else {
	    Menu.newScore = -1;
	}
    },
    
    checkAllRows: function(){
	var clear = false;
	for(var i = 0; i < this.rows; i++){
	    if(this.checkRow(i)){
		clear = true;
	    }
	}
	if(clear)
	    return true;
	else
	    return false;
    },
    
    checkRow: function(r){
	for(var i = 0; i < this.columns; i++){
	    if(this.board[i][r].state == 0){
		return false;
	    }
	}
	this.clearRow(r);
	this.lastClear++;
	return true;
    },
    
    clearRow: function(r){
	for(var i = 0; i < this.columns; i++){
	    this.board[i][r].state = 0;
	}
	
	this.fallRows.push(r);
	this.fallTimer = this.fallTime;
	this.redraw();
    },
    
    fallRows: [],
    fallTimer: -1,
    fallTime: 0,
    fall: function(){
	for(var row = this.fallRows.length-1; row > -1; row--){
	    for(i = 0; i < this.columns; i++){
		for(var j = this.fallRows[row]; j < this.rows; j++){
		    if(this.board[i][j+1]){
			this.board[i][j].state = this.board[i][j+1].state;
			this.board[i][j].color = this.board[i][j+1].color;
		    } else {
			this.board[i][j] = {state: 0, color: 4};
		    }
		}
	    }
	}
	this.fallRows = [];
	this.fallTimer = -1;
	this.redraw();
    },
    
    
    bounce: function(){
	var bouncerate = Board.width/15/fMul | 0;
	
	var px = this.pixCoords(Player.xc, Player.yc).x + Blocks.size/2;
	var d = px - canvas.width/2;
	while(Math.abs(d) > Board.width/2){
	    px += Board.width;
	    d = px - canvas.width/2;
	}
	d = canvas.width/2 - px;

	if(d > bouncerate)
	    Board.x += bouncerate;
	else if(d < -bouncerate)
	    Board.x -= bouncerate;
	else
	    Board.x += d;
    },
    
    draw: function(){
	//start on the left side of the screen
	var x = this.x - this.width;
	var y = this.bottom - this.canvas.height;
	//repeat the board until it's off screen
	while(x < canvas.width-1){
	    g.drawImage(this.canvas, x, y);
	    x += this.width;
	}
	
	
	
    },
    
    redraw: function(){
	//console.log("drawing board");
	this.g.clearRect(0, 0, this.width, this.height);
	for(var i = 0; i < this.columns; i++){
	    for(var j = 0; j < this.rows; j++){
		var b = this.board[i][j];
		if(b.state != 0){
		    var x = i*Blocks.size;
		    var y = this.canvas.height-(j+1)*Blocks.size;
		    //console.log("size = " + s + " x = " + x + " y = " + y);
		    Blocks.drawBlock(x, y, b.color, this.g);
		}
	    }
	}
    },
    
    addBlock: function(xc, yc, color){
	if(yc >= this.rows){
	    Player.dead = true;
	    return;
	}
	
	Blocks.drawBlock(xc*Blocks.size, this.canvas.height - (yc+1)*Blocks.size, color, this.g);
	Board.board[xc][yc].state = 1;
	Board.board[xc][yc].color = color;
    },
    
    coordAt: function(px, py){
	var xc, yc;
	xc = px - this.x;
	while(xc > this.width){
	    xc -= this.width;
	}
	xc = Math.floor(xc/Blocks.size);
	
	yc = this.bottom - py;
	yc = Math.floor(yc/Blocks.size);
	
	return {x: xc, y: yc};
    },
    
    pixCoords: function(xc, yc){
	var px = xc * Blocks.size + this.x;
	
	var py = this.bottom - (yc+1) * Blocks.size;
	return {x: px, y: py}
    },
    
    check: function (xc, yc){
	
	if(yc == -1)
	    return false;
	
	if(yc < this.rows)
	    if(this.board[xc][yc].state == 1)
		return false;
	
	return true;
    },
    
    rangeX: function(x){
	while(x >= this.columns){
	    x -= this.columns;
	}
	while(x < 0){
	    x += this.columns;
	}
	return x;
    },
    
    rangeY: function(y){
	while(y >= this.rows){
	    y -= this.rows;
	}
	while(y < 0){
	    y += this.rows;
	}
	return y;
    }, 
    
    fillRandomly: function(){
	for(var i = 0; i < this.columns; i++){
	    for(var j = 0; j < this.rows; j++){
		this.board[i][j] = {state: (Math.random()*2) | 0,
		    color: (Math.random()*Blocks.colors.length) | 0};
	    }
	}
	this.redraw();
    },
    
    reset: function(){
	for(var i = 0; i < this.columns; i++){
	    this.board[i] = [];
	    for(var j = 0; j < this.rows; j++){
		this.board[i][j] = {state: 0, color: 0};
	    }
	}
	this.redraw();
	this.score = 0;
	this.linesCleared = 0;
	this.lastClear = 0;
	this.combo = 0;
    }
}

