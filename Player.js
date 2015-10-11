
var Player = {
    
    xc: 6,
    yc: 10,
    px: 0,
    py: 0,
    
    block:{
	id: "S",
	color: 0,
	blocks: Blocks.S
    },
    
    next: {
	id: "S",
	color: 0,
	blocks: Blocks.S
    },
    
    hold: {
	id: "S",
	color: 0,
	blocks: Blocks.S
    },
    
    canvas: null,
    g: null,
    
    combo: 0,

    dead: false,
    
    init: function(){	
	this.dead = false;

	this.nextBlock();
	this.nextBlock();
	this.swapHold();
	this.nextBlock();
    },
    
    update: function(){
	if(this.dead){
	    this.die();
	    return;
	}
	this.updateCoords();
		
    },
    
    updateCoords: function(){
	//update pixel coords
	var p = Board.pixCoords(this.xc, this.yc);
	this.px = p.x;
	this.py = p.y;
    },
    
    
    nextBlock: function(){
	this.yc = Board.rows-1;
	
	this.block.id = this.next.id;
	this.block.color = this.next.color;
	this.block.blocks = this.next.blocks;
	
	var s = Blocks.randomShape();
	this.next.id = s.id;
	this.next.color = s.color;
	this.next.blocks = s.shape;
	
	this.updateCoords();
	
	if(this.checkForCollision(this.xc, this.yc))
	    this.die();
	
	this.redraw();
	
	this.swapped = false;
    },
    
    swapped: false,
    swapHold: function(){
	if(this.swapped)
	    return;
	var t = this.block;
	this.block = this.hold;
	
	this.hold = t;
	this.hold.id = this.hold.id.substring(0,1);
	this.hold.blocks = Blocks[this.hold.id];
	
	this.yc = Board.rows-1;
	
	this.redraw();
	this.swapped = true;
    },
    
    checkForCollision: function(x , y){
	
	if(y < 0)
	    return true;
	
	for(var i = 0; i < this.block.blocks.length; i++){
	    if(Board.check(Board.rangeX(x + this.block.blocks[i][0]), y + this.block.blocks[i][1]) == false){
		return true;
	    }
	}
	return false;
    },
    
    moveDown: function(){
	dropTimer = 0;        
	
	if(this.checkForCollision(this.xc, this.yc-1)){
	    //add peice
	    for(var i = 0; i < this.block.blocks.length; i++){
		Board.addBlock(Board.rangeX(this.xc+this.block.blocks[i][0]), this.yc+this.block.blocks[i][1], this.block.color);
	    }
	    //if a line is cleared, add 1 to the combo
	    if(Board.checkAllRows())
		this.combo++;
	    else
		this.combo = 0;
	    this.nextBlock();
	    return false;
	}
	
	this.yc--;
	
	return true;
    },
    
    moveUp: function(){ //for debug only
	this.yc++;
	this.shadow.py -= Blocks.size/2;
	return true;
    },
    
    moveLeft: function(){
	
	if(this.checkForCollision(Board.rangeX(this.xc-1), this.yc)){
	    return false;
	}
	
	this.xc = Board.rangeX(this.xc-1);
	return true;
    },
    
    moveRight: function(){
	
	if(this.checkForCollision(Board.rangeX(this.xc+1), this.yc)){
	    return false;
	}
	
	this.xc = Board.rangeX(this.xc+1);
	return true;
    },
    
    rotate: function(){
	var oldBlocks = this.block.blocks;
	var oldId = this.block.id;
	
	var s = Blocks.getRotatedShape(this.block.id);
	this.block.id = s.id;
	this.block.blocks = s.shape;
	
	if(this.checkForCollision(this.xc, this.yc)){
	    this.block.blocks = oldBlocks;
	    this.block.id = oldId;
	}
	this.redraw();
    },
    
    die: function(){
	Board.saveHS();
	Board.init();
	Player.init();
	Menu.init();
	menu = true;
    },
    
    redraw: function(){
	var x;
	var y;
	this.g.clearRect(0,0,this.canvas.width, this.canvas.height);
	for(var i = 0; i < this.block.blocks.length; i++){
	    x = (this.block.blocks[i][0]+1)*Blocks.size;
	    y = this.canvas.height-(this.block.blocks[i][1]+2)*Blocks.size;
	    Blocks.drawBlock(x, y, this.block.color, this.g);
	}
    },
    
    draw: function(){
	
	//draw block
	var x = (this.xc-1)*Blocks.size+Board.x;
	x -= Board.width;
	var y = Board.bottom-(this.yc+3)*Blocks.size;
	
	while(x < canvas.width){
	    g.drawImage(this.canvas, x, y);
	    x += Board.width;
	}
	
	//draw preview
	g.globalAlpha = .35;
		
	var yc = this.yc;	
	for(; !(this.checkForCollision(this.xc, yc-1)); yc--){}

	x = (this.xc-1)*Blocks.size+Board.x;
	x -= Board.width;
	y = Board.bottom-(yc+3)*Blocks.size;
	
	while(x < canvas.width){
	    g.drawImage(this.canvas, x, y);
	    x += Board.width;
	}
	
	g.globalAlpha = 1;
    }
}