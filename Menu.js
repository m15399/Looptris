
var Menu = {
    
    numParticles: 100,
    
    xc: [],
    yc: [],
    zc: [],
    xp: [],
    yp: [],

    btime: 0,
    bcounter: 0,
    blink: true,
    
    score1: 0,
    score2: 0,
    score3: 0,
    newScore: -1,
    
    init: function(){
	this.btime = 15*fMul;
	
	this.score1 = localStorage.getItem("TetrisHS1");
	this.score2 = localStorage.getItem("TetrisHS2");
	this.score3 = localStorage.getItem("TetrisHS3");
	
	for(var i = 0; i < this.numParticles; i++){
	    this.zc[i] = Math.random() * 7 + .5;
	    this.xc[i] = Math.random() * (canvas.width-1/this.zc[i]);
	    this.yc[i] = Math.random() * canvas.height;
	}
	
    },
    
    
    
    update: function(){
	this.bcounter++;
	if(this.bcounter>this.btime){
	    this.bcounter = 0;
	    this.blink = !this.blink;
	}
	
	for(var i = 0; i < this.numParticles; i++){
	    this.yc[i] += 1/this.zc[i];
	    
	    this.xp[i] = this.xc[i] | 0;
	    this.yp[i] = this.yc[i] | 0;
	    
	    if(this.yp[i] > canvas.height){
		//this.zc[i] = Math.random() * 7 + .5;
		var s = Blocks.size/this.zc[i] | 0;
		this.yc[i] = -s -Math.random()*canvas.height/4;
		this.xc[i] = Math.random() * (canvas.width-s);
	    }
	}
    },
    
    draw: function(){
	
	var s = Blocks.size;
	var sp = s/8 | 0;

	g.save();
	g.fillStyle = "#110044";
	g.fillRect(0,0,canvas.width,canvas.height);
	
	//background stuff
	g.globalAlpha = .5;
	for(var i = 0; i < this.numParticles; i++){
	    g.save();
	    g.translate(this.xp[i], this.yp[i]);
	    g.scale(1/this.zc[i], 1/this.zc[i]);
	    Blocks.drawBlock(0,0,5,g);
	    g.restore();
	}
	g.globalAlpha = 1;
	
	g.drawImage(Vignette.canvas, 0,0);	
	
	
	g.fillStyle = "white";
	g.font = s*2 + "pt Impact";
	g.fillText("TETRIS", canvas.width/2-s*3.8 | 0, canvas.height/3 | 0);
	
	g.font = sp*2 + "pt Courier";
	g.fillText("Mark Gardner, 2012", canvas.width-sp*32, canvas.height - sp);
	
	if(this.blink){
	    g.font = (s/2|0) + "pt Courier";
	    g.fillText("press SPACE to start", canvas.width/2-s*4.15 | 0, canvas.height/2 | 0);
	}
	
	//high scores
	g.save();
	g.translate(canvas.width-s*6.85 | 0,canvas.height-s*5);
	g.font = (s/2|0) + "pt Courier";
	g.fillText("High Scores:", 0,0);
	g.translate(0,s);
	if(this.newScore == 1) g.fillStyle = "yellow";
	g.fillText("1. " + this.score1,0,0);
	g.fillStyle = "white";
	g.translate(0,s);
	if(this.newScore == 2) g.fillStyle = "yellow";
	g.fillText("2. " + this.score2,0,0);
	g.fillStyle = "white";
	g.translate(0,s);
	if(this.newScore == 3) g.fillStyle = "yellow";
	g.fillText("3. " + this.score3,0,0);
	g.fillStyle = "white";
	
	
	g.restore();//hs
	
	//controls
	g.save();
	g.translate(s*2,canvas.height-s*5);
	g.strokeStyle = "white";
	g.font = sp*4 + "pt Courier";
	g.fillText("Controls:",sp*2,sp*2);
	g.lineWidth = sp/3 | 0;
	g.lineJoin = "round";
	
	//arrow keys
	g.save();
	g.translate(s*3.5|0,0);
	g.strokeRect(0,s,s-sp,s-sp);
	g.strokeRect(s,0,s-sp,s-sp);
	g.strokeRect(s,s,s-sp,s-sp);
	g.strokeRect(s*2,s,s-sp,s-sp);

	
	var r = (s-sp)/2 | 0;
	var l = sp;
	var t = sp;
	var b = s-sp*2;
	var m = (t+b) / 2 | 0;
	
	g.translate(0,s);
	
	g.beginPath();
	g.moveTo(r+sp,t);
	g.lineTo(l,m);
	g.lineTo(r+sp,b);
	g.lineTo(r+sp,t);
	g.lineTo(l,m);
	g.fill();
	
	g.translate(s,0);
	g.beginPath();
	g.moveTo(t,r-sp);
	g.lineTo(m,s-l-sp);
	g.lineTo(b,r-sp);
	g.lineTo(t,r-sp);
	g.lineTo(m,s-l-sp);
	g.fill();
	
	g.translate(s,0);
	
	g.beginPath();
	g.moveTo(r-sp,t);
	g.lineTo(s-l-sp,m);
	g.lineTo(r-sp,b);
	g.lineTo(r-sp,t);
	g.lineTo(s-l-sp,m);
	g.fill();
	
	g.lineWidth = sp*4/5 | 0;
	g.translate(-s-sp/2|0,-s);
	g.beginPath();
	g.moveTo(r+sp,b);
	g.quadraticCurveTo(0,m,r+sp,t+sp);
	g.stroke();
	
	g.translate(r+sp,t+sp);
	g.beginPath(0,0);
	g.lineTo(sp/2|0,sp*2);
	g.lineTo(sp*2.5|0,0);
	g.lineTo(-sp/2|0,-sp*1.5|0);
	g.lineTo(0,0);
	g.fill();
	

	g.restore(); // arrow keys
	g.translate(0,s);
	g.strokeRect(0,0,s*2.5-sp|0,s-sp);
	g.font = (sp*1.8|0) + "pt Courier";
	g.fillText("shift",sp, s-sp*2.3|0);
	g.font = sp*4 + "pt Courier";
	g.fillText("HOLD", sp*4, sp*4);
	
	g.translate(s/2 | 0,s+sp);
	g.strokeRect(0,0,s*5-sp,s-sp);
	g.fillText("DROP", s*1.5, sp*5);
	
	g.restore(); // controls
	
	g.restore();
    }
    
    
    
}