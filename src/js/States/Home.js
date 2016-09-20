define([
	'Phaser',
	'LeapJs'
],
function(
	Phaser,
	Leap
){
	//
	var HomeState = function(game){};
	HomeState.prototype = {

		button: null,
		circle: null,
		hasHand: null,
		hand_position: null,
		hover: false,
		hover_time: 2000,
		hover_timeFlag: 0,

		init: function(){},


		preload: function(){

		    this.game.load.image('button', 'img/button.jpg');

		},



		create: function(){
			console.log("Home");

			//
			var scope = this;

			//
			this.circle = new Phaser.Circle(this.game.world.centerX, 100,64);
			this.timer = new Phaser.Circle(this.game.world.centerX, 100,64);
			this.button = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'button');
			this.button.anchor.setTo(.5);
			//new Phaser.Circle(this.game.world.centerX, this.game.world.centerY, 120);


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


			this.button.inputEnabled = true;
			this.button.events.onInputDown.add(this.initGame, this);

			this.game.input.addMoveCallback( function(e, _x, _y) {
				//console.log(scope.circle.y)
                scope.circle.y = e.y;
                scope.circle.x =  e.x;
	        });
		},



		initGame: function(){
			this.game.state.start('LevelMaster');

		},


		render: function () {
			//leap motion position
			if(this.hasHand){
				var targetY = (this.hand_position[1] - this.circle.y) * 0.09;
				
				this.circle.y = this.game.world.height - (this.hand_position[1] * 1.2);
				this.circle.x = this.game.world.centerX + (this.hand_position[0] * 1.75);
				this.timer.y = this.circle.y;
				this.timer.x = this.circle.x;
				this.timer.diameter = 0;

				if(this.circle.x > (this.button.x - 60) && this.circle.x < (this.button.x + 60) && this.circle.y > (this.button.y - 60) && this.circle.y < (this.button.y + 60)) {
					console.log('hover');

					if(!this.hover){
						this.hover = true;

						this.hover_timeFlag = this.game.time.time;
						console.log(this.hover_elapsed);
					}

					var elapsed_time = this.game.time.time - this.hover_timeFlag;


					var diameter = 64 * (elapsed_time / this.hover_time);
					this.timer.diameter = diameter;


					if(elapsed_time > this.hover_time){
						this.hover = false;
		            	this.hover_timeFlag = 0;
		            	this.timer.diameter = 0;
		            	this.initGame();
					}


	            } else {
	            	this.hover = false;
	            	this.hover_timeFlag = 0;
	            	this.timer.diameter = 0;
	            }

			}

		    this.game.debug.geom(this.timer,'#af12ff');
		    this.game.debug.geom(this.button,'#ffffff');
		    this.game.debug.geom(this.circle,'#da2e8e');
		}
	};
	
	return HomeState;
});
