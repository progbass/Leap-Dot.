define([
	'Phaser',
	'States/Boot',
	'States/Home',
	'States/LevelMaster',
	'States/Pause'
],

function(
	Phaser,
	BootState,
	HomeState,
	LevelMaster,
	PauseState)
{
	
	var LeapRay = function(game){};
	
	LeapRay.prototype = {
		game: null,
		
		start: function(){
			this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'game_holder', {create: this.create});
			this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			//this.game.renderer.renderSession.roundPixels = true;
			
			this.game.state.add('Boot', BootState);
			this.game.state.add('Pause', PauseState);
			//game.state.add('preload', PreloadState);
			//game.state.add('main-intro', MainIntroState);
			this.game.state.add('Home', HomeState);
			this.game.state.add('LevelMaster', LevelMaster);
			//game.state.add('level-intro', MainIntroState);
			//game.state.add('level-round', LevelRoundState);
			
			this.game.state.start('Boot');
		},
		
		create: function(){

		}
	};
	
		
	return LeapRay;
});