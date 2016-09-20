requirejs.config({
	base: "js/",
	
    
	paths: {
		LeapJs:		'/bower_components/leapjs/leap-0.6.4.min',
		THREEJS:	'/bower_components/threejs/build/three.min',
		Phaser:		'/bower_components/phaser/build/phaser.min',
		LeapRay:	'LeapRay'
	},

	shim : {
        LeapJs: { exports: 'Leap'},
        THREEJS: { exports: 'THREE' }
    },
});



// Start the main app logic.
requirejs(['LeapRay'], function(LeapRay) {
		var Game = new LeapRay();
		Game.start();
});






