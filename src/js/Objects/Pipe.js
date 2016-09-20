define(['Phaser'], function(Phaser){
	
	
	///////////////////////////////////////////////
	////////////////  CONSTRUCTOR   ///////////////
	///////////////////////////////////////////////
	var Pipe = function (game, _type, _frame) {
		
		//random frame
		var frame = _frame ? _frame : game.rnd.between(1, 4);
		var type = _type == 'bottom' ? 'pipeBottom' : 'pipeTop';
		
		//Super
	    Phaser.Sprite.call(
	    	this,
	    	game,
	    	game.world.width,
	    	0, 
	    	type,
	    	frame
	    );
	
		//Enable Physics
	    //game.physics.enable(this);
	    //this.body.allowGravity = false;
		//this.body.immovable = true;
	    game.physics.p2.enable(this);
	    this.body.clearShapes();
	    this.body.loadPolygon('pipes_bodies_'+_type, 'pipe'+frame);
	    this.body.collideWorldBounds = false;
	    ///this.body.dynamic = false;
		this.body.fixedRotation = true;
		this.body.velocity.x = this.speed;
	};
	
	
	
	
	///////////////////////////////////////////////
	//////////////  OBJECT PROTOYPE  //////////////
	///////////////////////////////////////////////
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	
	
	
	
	///////////////////////////////////////////////
	////////////////  PROPERTIES  /////////////////
	///////////////////////////////////////////////
	Pipe.prototype.speed = -380;
	Pipe.prototype.scored = false;
	
	
	
	
	///////////////////////////////////////////////
	//////////////////  METHODS ///////////////////
	///////////////////////////////////////////////
	Pipe.prototype.update = function() {
		this.body.velocity.x = this.speed;
		
		if(this.x < -this.width)
			this.destroy();
	};
	
	
	
	
	///////////
	return Pipe;
});






