define([
	'Phaser',
	'LeapJs',
	'Objects/Pipe',
	'Objects/Hero', 
	'Objects/Coin',
	'Objects/Background'

], function(
	Phaser,
	Leap,
	Pipe,
	Hero,
	Coin,
	Background
){

	//
	var LevelMaster = function(game){};
	LevelMaster.prototype = {

		//level container
		level_container: null,

		//hero
	    hero: null,
	    heroCollisionGroup: null,
	    
	    
	    //pipes
	    pipes_interval: 600,
		pipeGroup: null,
		pipesCollisionGroup: null,
		
		
		//hands
		hasHand: false,
		hand_position: null,
		
		//score
		score: 0,
		score_display: null,
		
		
		//coins
		coinsCollisionGroup: null,
		coins_interval: 400,
		total_coins: 0,
		
		
		
	    preload:function(){
			this.game.load.image("hero", "img/hero.png"); 
			
			//pipes
			this.game.load.spritesheet("pipeTop", "img/pipe_top.png", 51, 437);
			this.game.load.spritesheet("pipeBottom", "img/pipe_bottom.png", 51, 437);
			this.game.load.physics('pipes_bodies_top', 'bodies/pipes_top.json');
			this.game.load.physics('pipes_bodies_bottom', 'bodies/pipes_bottom.json');
/*
			this.game.load.physics('pipe_physics1_top', 'bodies/pipe1_top.json');
			this.game.load.physics('pipe_physics2_top', 'bodies/pipe2_top.json');
			this.game.load.physics('pipe_physics3_top', 'bodies/pipe3_top.json');
			this.game.load.physics('pipe_physics4_top', 'bodies/pipe4_top.json');
			
			this.game.load.physics('pipe_physics1_bottom', 'bodies/pipe1_bottom.json');
			this.game.load.physics('pipe_physics2_bottom', 'bodies/pipe2_bottom.json');
			this.game.load.physics('pipe_physics3_bottom', 'bodies/pipe3_bottom.json');
			this.game.load.physics('pipe_physics4_bottom', 'bodies/pipe4_bottom.json');
*/
			
			
			//sound fx
			this.game.load.audio("hero_appear", "fx/appear.mp3");	
			this.game.load.audio("hero_die", "fx/die.mp3");
			
			
			//background assets
			this.game.load.image("background", "img/background.jpg");
			this.game.load.spritesheet("background_arrows", "img/background_arrows.png", 754, 530);
			
			
			//coins assets
			this.game.load.spritesheet("coin", "img/coin.png", 20, 17);	
			this.game.load.audio("coinFX", "fx/coin.mp3");	
		},
		
		
		
		
		
		
		create:function(){
			var scope = this;
			
			// Start the Arcade physics system
			this.game.physics.startSystem(Phaser.Physics.P2JS);
    		this.game.physics.p2.setImpactEvents(true);
    		this.game.physics.p2.restitution = 0.8;
    		this.game.physics.p2.updateBoundsCollisionGroup();
			//this.game.physics.p2.gravity.y = 480;



			
			//Leap Motion Config.
			var leap_options = {};
			Leap.loop(leap_options, function(frame){
				var hands = frame.hands[0];
				
				if(hands){
					scope.hasHand = true;
					scope.hand_position = hands.palmPosition;
					//console.log(hands.grabStrength);
					
				//
				} else {
					scope.hasHand = false;
				}
			});
			
			
			
			// BACKGROUND
			var bgn = new Background(this.game);
			this.game.add.existing(bgn);
			this.game.stage.backgroundColor = "#262626";
			//this.game.stage.disableVisibilityChange = true;
				
			



			// Collision Groups
			this.coinsCollisionGroup = this.game.physics.p2.createCollisionGroup();
			this.pipesCollisionGroup = this.game.physics.p2.createCollisionGroup();
			this.heroCollisionGroup = this.game.physics.p2.createCollisionGroup();



			// Pipes Group
			this.pipeGroup = this.game.add.group();//new Phaser.Group(this.game);
			this.pipeGroup.enableBody = true;
			this.pipeGroup.physicsBodyType = Phaser.Physics.P2JS;
			//this.game.add.existing(this.pipeGroup);
			//this.game.time.events.loop(this.pipes_interval, this.addPipe, this);
			for(var i = 0; i<50; i++){
				// add Pipe
				this.addPipe( { x: this.game.world.width+(i * 450) } );
			}



			// Coin Group
			this.total_coins = 0;
			this.coinGroup = this.game.add.group();//new Phaser.Group(this.game);
			this.coinGroup.enableBody = true;
			this.coinGroup.physicsBodyType = Phaser.Physics.P2JS;
			//this.game.add.existing(this.coinGroup);
			//this.game.time.events.loop(this.coins_interval, this.addCoin, this);
			for(var j = 0; j<120; j++){
				// add Pipe
				this.addCoin( { x: this.game.world.width+(j * 100) } );
			}



			// Hero
			this.hero = new Hero(this.game);
			this.hero.events.onDie.add(this.die, this);
			this.hero.body.setCollisionGroup(this.heroCollisionGroup);
			this.hero.body.collides(this.pipesCollisionGroup, this.die, this);
			this.hero.body.collides(this.coinsCollisionGroup, this.gotCoin, this);
			this.game.add.existing(this.hero);

			


			
			//Score
			this.score = 0;
			this.score_display = this.game.add.text(this.game.width - 40,10,"-",{
				font:	"6.25em Tulpen One",
				fill:	"#59C6D0"
			});
			this.score_display.anchor.setTo(1, 0);
			this.updateScore();
		},
		
		
		update:function(){
			//leap motion position
			if(this.hasHand){
				var targetY = (this.hand_position[1] - this.hero.y) * 0.09;
				this.hero.body.y += targetY;
			}
			
			//detect pipes position
			this.pipeGroup.forEach(function( item ){
				if(item.x < this.hero.x && !item.scored){
					item.scored = true;
					this.score += 10;
					this.updateScore();
				}
			}, this);

			//this.score += 10;
			//this.updateScore();
		},




		gotCoin: function( _body1, _body2 ){
			this.score += 10;
			this.updateScore();
				
			_body2.sprite.playFX();
			_body2.sprite.destroy();

		},


		
		addPipe: function( _position ){
			var hole_minOffset = 150;
			var hole_size = 70;
			var holePosition = this.game.rnd.between(hole_minOffset, this.game.height-hole_minOffset);
			var pipeFrame = this.game.rnd.between(1, 4);
			
			//create pipes
			var topPipe = new Pipe(this.game, 'top', pipeFrame);
			var bottomPipe = new Pipe(this.game, 'bottom', pipeFrame);
			
			//pipes physics
			topPipe.body.setCollisionGroup(this.pipesCollisionGroup);
			topPipe.body.collides(this.heroCollisionGroup);
			bottomPipe.body.setCollisionGroup(this.pipesCollisionGroup);
			bottomPipe.body.collides(this.heroCollisionGroup);

			topPipe.body.x = _position.x;
			bottomPipe.body.x = _position.x;
			topPipe.body.y = (holePosition - hole_size) - topPipe.height / 2;
			bottomPipe.body.y = (holePosition + hole_size) + bottomPipe.height / 2;
			
			
			//draw pipes
			this.pipeGroup.add(topPipe);
			this.pipeGroup.add(bottomPipe);
		},
		
		
		
		addCoin: function( _position ){
			var scope = this;
			
			//create pipes
			var coin = new Coin(this.game, this.game.width, this.game.rnd.between(150, this.game.world.height - 150));
			coin.body.setCollisionGroup(this.coinsCollisionGroup);
			coin.body.collides(this.heroCollisionGroup);
			coin.body.x = _position.x;
			setTimeout(function(){
				coin.beginAnimation(scope.game);
			}, this.total_coins*40);
			
			//draw pipes
			this.coinGroup.add(coin);
			
			//update coins count
			this.total_coins++;
		},

		
		updateScore: function(){
			this.score_display.text = "Score: "+this.score+"";	
		},
		
		die: function(){	
			this.game.state.start("Home");	
		},
		
		
		
		shutdown: function() {  
			//this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
			this.hero.explode();
			this.pipeGroup.destroy();
		}

		
	};
	
	return LevelMaster;
});