window.onload = init;
window.onresize = needsResize;

var canvas = document.getElementById("myCanvas");
var g = canvas.getContext("2d");

function init() {
    if(!localStorage.getItem("TetrisHS1")){
	resetScores();
    }
    
    Board.canvas = document.createElement("canvas");
    Board.g = Board.canvas.getContext("2d");
    Board.init();    
    
    Player.canvas = document.createElement("canvas");
    Player.g = Player.canvas.getContext("2d");
    Player.init();
    
    Vignette.canvas = document.createElement("canvas");
    Vignette.g = Vignette.canvas.getContext("2d");
    
    Overlay.canvas = document.createElement("canvas");
    Overlay.g = Overlay.canvas.getContext("2d");

    Overlay.blocksCanvas = document.createElement("canvas");
    Overlay.blocksG = Overlay.blocksCanvas.getContext("2d");
    
    ClearLine.init();
    
    resize();
    
    Menu.init();

    
    setInterval(update, 1000/(15*fMul));
}

function resetScores() {
    localStorage.setItem("TetrisHS1", 30000);
    localStorage.setItem("TetrisHS2", 20000);
    localStorage.setItem("TetrisHS3", 10000);
}

var fMul = 2; // 1 for 15 FPS, 2 for 30 FPS, etc.

var dropTime = 0;
var rotateTime = 7*fMul;
var moveTime = 3.5*fMul | 0;

var dropTimer = 0;
var speed = 0;

var menu = true;

function update(){
    
    Input.update();
    
    if(menu){
	
	Menu.update();
	
    } else if(!paused){
    
	dropTimer++;
	dropTime = fMul * (Math.pow((Board.linesCleared - 180)/42, 2) | 0) + 2;
	
	moveSpeed = (Board.width / 120) * fMul | 0;
	
	Board.update();
	
	Player.update();
	
	ClearLine.update();
	
	//lower the player
	if(dropTimer == dropTime){
	    Player.moveDown();
	    dropTimer = 0;
	}
    }
    
    if(needToResize)
	resize();
	
    //draw
    draw();

    
    //DEBUG//
    //if(Input.keys[85] == 1){ 
    //    Player.moveUp();
    //}
    //if(Input.keys[8] == 1){
    //    Board.reset();
    //}
    //if(Input.keys[82] == 1){
    //    Board.fillRandomly();
    //}
}

var paused = false;
function pause(){
    paused = !paused;
}

document.onkeydown = Input.press;
document.onkeyup = Input.release;

function draw(){
    if(menu){
	Menu.draw();
	return;
    }
    
    // clear canvas
    g.fillStyle = "110044"
    g.fillRect(0, 0, canvas.width, canvas.height);
    
    Board.draw();

    //line
    var R = 255;
    var G = 255;
    var B = 255;
    for(var i = 0; i < Player.combo; i++){
	G -= 40;
	G = Math.max(G, 0);
	B -= 100;
	B = Math.max(B, 0);
    }
    g.strokeStyle = "rgb(" + R + ", " + G + ", " + B +")";
    g.strokeRect(0, Board.bottom-2, canvas.width, 2);

    Player.draw();
    
    ClearLine.draw();

    // draw reflection    
    // clip the canvas
    // flip the current canvas and draw it below at .3 alpha
    g.save();
    g.beginPath();
    g.moveTo(0,Board.bottom+1);
    g.lineTo(canvas.width, Board.bottom+1);
    g.lineTo(canvas.width, canvas.height);
    g.lineTo(0, canvas.height);
    g.lineTo(0, Board.bottom+1);
    g.clip();
    g.transform(1, 0, 0, -1, 0, (canvas.height-(Blocks.size*3))+Board.bottom);
    g.globalAlpha = .3;
    g.drawImage(canvas, 0, 0);
    g.restore();

    // draw vignette edges
    g.drawImage(Vignette.canvas, 0, 0);
    
    // draw overlay
    Overlay.draw();
    
    // draw score
    g.font = "16pt Courier";
    g.fillStyle = "#ffffff";
    g.fillText("SCORE: " + Board.score, canvas.width/2-100, Board.bottom+50);
    g.fillText("HIGH SCORE: " + Board.highScore, canvas.width/2-150, Board.bottom + 95);
    g.fillText("HOLD", Overlay.left - 60, Overlay.base + Overlay.boxHeight/2 + 10 | 0);
    g.fillText("NEXT", Overlay.right + Overlay.boxWidth + 10, Overlay.base + Overlay.boxHeight/2 + 10 | 0);
    
    // draw pause screen
    if(paused){
	g.save();
	g.globalAlpha = .5;
	g.fillStyle = "black";
	g.fillRect(0,0,canvas.width,canvas.height);
	g.globalAlpha = .8;
	g.fillStyle = "white";
	g.font = "36pt Courier";
	g.fillText("PAUSED", canvas.width/2 - 90, canvas.height/2);
	g.restore();
    }
}


var needToResize = false;
function needsResize(){
    needToResize = true;
}

function resize(){
    //resize window
    var w = window.innerWidth-20;
    var h = window.innerHeight-30;
    
    canvas.height = h > 600 ? h : 600;
    
    //resize blocks
    Blocks.size = (canvas.height/17) | 0;
    Blocks.spacing = (Blocks.size/16) | 0;
    
    //resize board
    Board.bottom = canvas.height - Blocks.size*3;
    Board.width = Blocks.size * Board.columns;
    Board.height = Blocks.size * Board.rows;
    Board.canvas.width = Board.width;
    Board.canvas.height = Board.height;
    
    //set the width so that it won't be so wide that large portions of it are blacked out
    canvas.width = w < Board.bottom*2 ? (w > 1000 ? w : 1000) : Board.bottom*2;
    
    //resize player canvas
    Player.canvas.height = 4 * Blocks.size;
    Player.canvas.width = 4 * Blocks.size;
    
    Board.redraw();
    Player.redraw();
    
    //resize vignette
    Vignette.canvas.width = canvas.width;
    Vignette.canvas.height = canvas.height;
    Vignette.draw();
    
    //resize overlay
    Overlay.canvas.width = canvas.width;
    Overlay.canvas.height = canvas.height;
    Overlay.blocksCanvas.height = (canvas.height - Board.bottom) * 3 / 4 | 0;
    Overlay.blocksCanvas.width = canvas.width;
    Overlay.redraw();

    draw();
    
    Menu.init();
    
    needToResize = false;
}

var Vignette = {
    canvas: null,
    g: null,
    
    draw: function(){
	var grad = g.createRadialGradient(canvas.width/2, Board.bottom/2,
					  Board.bottom/2, canvas.width/2, Board.bottom/2, Board.bottom);
	grad.addColorStop(0, "rgba(0,0,0,0)");
	grad.addColorStop(1, "rgba(0,0,0,1)");
	Vignette.g.fillStyle = grad;
	Vignette.g.fillRect(0,0,canvas.width,canvas.height);
    }
};