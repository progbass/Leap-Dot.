define(['Phaser'], function(Phaser){
	//
	var PauseState = function(game){};
	PauseState.prototype = {
		init: function(){},
		create: function(){
			//console.log('Pause');
			this.game.input.onDown.add(this.initGame, this);
		},
		
		initGame: function(){
			this.game.state.start('LevelMaster');
		}
	};
	
	return PauseState;
});
