define(['Phaser'], function(Phaser){
	var BootState = function(game){};
	
	BootState.prototype = {
		init: function(){},
		create: function(){
			//console.log('Boot');
			this.game.state.start('Home');
		}
	};
	
	return BootState;
});