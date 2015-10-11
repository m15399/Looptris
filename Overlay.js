
var Overlay = {
    
    canvas: null,
    g: null,
    
    blocksCanvas: null,
    blocksG: null,
    
    
    draw: function(){
	g.drawImage(this.canvas, 0, 0);
	
	this.drawNextShape();
	this.drawHoldShape();
		
	g.drawImage(this.blocksCanvas, 0, this.base);
    },
    
    boxWidth: 0,
    boxHeight: 0,
    base: 0,
    left: 0,
    right: 0,
    
    s: .45,
    
    drawNextShape: function(){
	this.drawSmallShape(this.right, Player.next.blocks, Player.next.color);
    },
    
    drawHoldShape: function(){
	this.drawSmallShape(this.left, Player.hold.blocks, Player.hold.color);
    },
    
    drawSmallShape: function(xp, shape, color){
	this.blocksG.save();
	this.blocksG.translate(xp,0);
	this.blocksG.scale(this.s,this.s);
	this.blocksG.clearRect(0,0,Blocks.size*7, Blocks.size*6);
	var x;
	var y;
	for(var i = 0; i < shape.length; i++){
	    x = (shape[i][0]+1)*Blocks.size;
	    y = this.blocksCanvas.height-(shape[i][1])*Blocks.size;
	    Blocks.drawBlock((x+Blocks.size*1.6)|0, (y+Blocks.size/15)|0, color, this.blocksG);
	}
	this.blocksG.restore();
    },
    
    redraw: function(){
	this.boxHeight = (canvas.height - Board.bottom) * 2 / 3 | 0;
	this.boxWidth = this.boxHeight * 3 / 2 | 0;
	this.base = (-(canvas.height - Board.bottom)/2 + canvas.height - this.boxHeight/2) | 0;
	this.right = canvas.width - this.boxWidth * 2 | 0;
	this.left = this.boxWidth | 0;

	this.roundBox(this.left, this.base, this.boxWidth, this.boxHeight);
	this.roundBox(this.right, this.base, this.boxWidth, this.boxHeight);
	
    },
    
    roundBox: function(x, y, sx, sy){
	var r = (sx<sy?sx:sy)/6;
	
	this.g.save();
	this.g.translate(x,y);
	this.g.globalAlpha = .5;
	var grad = this.g.createLinearGradient(0,0,0,sy);
	grad.addColorStop(0, "rgba(255,200,255, .35)");
	grad.addColorStop(1, "rgba(200,150,200, 1)");
	this.g.fillStyle = grad;
	
	this.g.beginPath();
	this.g.moveTo(r,0);
	this.g.lineTo(sx-r,0);
	this.g.quadraticCurveTo(sx,0,sx,r);
	this.g.lineTo(sx,sy-r);
	this.g.quadraticCurveTo(sx,sy,sx-r,sy);
	this.g.lineTo(r,sy);
	this.g.quadraticCurveTo(0,sy,0,sy-r);
	this.g.lineTo(0,r);
	this.g.quadraticCurveTo(0,0,r,0);
	
	this.g.fill();
	this.g.restore();
    }
}

var ClearLine = {
    middle: 0,
    width: 0,
    
    points: 0,
    multiplier: 0,
    
    lineTime: 0,
    timer: this.lineTime,
    
    
    init: function(){
	this.lineTime = Board.fallTime*1.5|0;
    },
    
    update: function(){
	this.timer--;
	
    },
    
    draw: function(){	
	if(this.timer < 0)
	    return;
	
	g.save();
	g.fillStyle = "white";
	var w = this.width * this.timer/this.lineTime | 0;
	g.globalAlpha = .8;
	g.fillRect(0,this.middle-w/2|0, canvas.width, w);
	
	var s = Blocks.size*3/4|0;
	var h = this.middle-this.lineTime+this.timer;
	g.font = s + "pt Impact";
	
	
	g.fillText(this.points/this.multiplier+" x "+this.multiplier, canvas.width/2|0, h);
	g.restore();
	
    },
    
    spawn: function(top, bottom, points, multiplier){
	this.middle = (bottom+top)/2 |0;
	this.width = bottom - top;
	
	this.points = points;
	this.multiplier = multiplier;
	
	this.timer = this.lineTime;
    }
    
}

