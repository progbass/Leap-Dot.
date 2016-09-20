define(['Phaser'], function(Phaser){
	
	
	///////////////////////////////////////////////
	////////////////  CONSTRUCTOR   ///////////////
	///////////////////////////////////////////////
	var Coin = function (game, x, y) {
		this.game = game;
		
		//Super
	    Phaser.Sprite.call(this, game, x || 120, y || game.world.height / 2, 'coin');
	
		//Properties
		this.name = 'coin';
		this.anchor.setTo(0.5, 0.5);
		this.angle = game.rnd.between(0, 180);
		this.angle_speed = game.rnd.between(1, 4);
		this.animations.add('rotate');
		this.sound_fx = game.add.audio('coinFX');
		
		//Enable Physics
	    //game.physics.enable(this, Phaser.Physics.ARCADE);
	    //this.body.immovable = true;

	    game.physics.p2.enable(this);
	    this.body.collideWorldBounds = false;
	    //this.body.static = true;
	    this.body.setZeroVelocity();
		this.body.setZeroForce();
		this.body.fixedRotation = true;
	    this.body.velocity.x = this.vel_x;
	};
	
	
	
	
	///////////////////////////////////////////////
	//////////////  OBJECT PROTOYPE  //////////////
	///////////////////////////////////////////////
	Coin.prototype = Object.create(Phaser.Sprite.prototype);
	Coin.prototype.constructor = Coin;
	
	
	
	
	///////////////////////////////////////////////
	////////////////  PROPERTIES  /////////////////
	///////////////////////////////////////////////
	Coin.prototype.vel_x = -320;
	Coin.prototype.angle_speed = 1;
	Coin.prototype.sound_fx = null;

	
	
	
	///////////////////////////////////////////////
	//////////////////  METHODS ///////////////////
	///////////////////////////////////////////////
	Coin.prototype.update = function() {
		this.angle += this.angle_speed;
	    this.body.velocity.x = this.vel_x;

		if(this.x < -this.width){
			this.destroy();
		}
	};
	
	
	Coin.prototype.playFX = function() {
		this.sound_fx.play();
	};


	Coin.prototype.shutdown = function() {
		this.playFX();
	};
	
	
	Coin.prototype.beginAnimation = function(_context) {
		var game = _context || this.game;
		game.time.events.loop(Phaser.Timer.SECOND, this.animate, this);
	};
	Coin.prototype.animate = function() {
		this.animations.play('rotate', 30, false);
	};
	
	
	
	///////////
	return Coin;
});






