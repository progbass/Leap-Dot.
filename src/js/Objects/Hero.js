define(['Phaser'], function(Phaser){
	
	
	///////////////////////////////////////////////
	////////////////  CONSTRUCTOR   ///////////////
	///////////////////////////////////////////////
	var Hero = function (game, x, y) {
		//Bitmap Texture
		var bmd = new Phaser.BitmapData(game, 'hero_bmd');
		bmd.circle(-20, -10, 20, '#ff00ff');
		
		//Super
	    Phaser.Sprite.call(this, game, x || 120, y || Math.round(game.world.height / 2), 'hero');
	
		//Properties
		this.name = 'hero';
		//this.scale.setTo(.5, .5);
		this.anchor.setTo(0.5, 0.5);
		this.fx_die = game.add.audio('hero_die');
		this.fx_appear = game.add.audio('hero_appear');
		this.fx_appear.play();
		
		
		//Enable Physics
	    //game.physics.enable(this, Phaser.Physics.ARCADE);
	    //this.body.static = true;
	    //this.body.immovable = true;
	    //this.body.fixedRotation = true;

	    game.physics.p2.enable(this);
	    this.body.setCircle(25);
	    this.body.static = true;
		//this.body.gravity.y = this.gravity;

		//Events
		this.events.onDie = new Phaser.Signal();
		game.input.onDown.add(this.flap, this);
	};
	
	
	
	
	///////////////////////////////////////////////
	//////////////  OBJECT PROTOYPE  //////////////
	///////////////////////////////////////////////
	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	Hero.prototype.constructor = Hero;
	
	
	
	
	///////////////////////////////////////////////
	////////////////  PROPERTIES  /////////////////
	///////////////////////////////////////////////
	Hero.prototype.gravity = 400;
	Hero.prototype.power = 200;
	Hero.prototype.sound_fx = null;
	
	
	
	
	///////////////////////////////////////////////
	//////////////////  METHODS ///////////////////
	///////////////////////////////////////////////
	Hero.prototype.update = function() {
		this.body.rotation += 0.08;
		if(this.y > this.game.height + this.height){
			this.events.onDie.dispatch(this);
			this.explode();
		}
	};


	Hero.prototype.flap = function() {
		this.body.velocity.y -= this.power;	
	};
	
	
	Hero.prototype.explode = function() {
		console.log('shutdown 2');
		var scope = this;
		
		
		this.fx_die.play();
		
		setTimeout(scope.destroy, 1000);
		//this.destroy();
		//this.body.velocity.y = -this.power;	
	};
	
	
			
	
	
	///////////
	return Hero;
});






