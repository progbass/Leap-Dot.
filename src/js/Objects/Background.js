define(['Phaser', 'THREEJS'], function(Phaser, THREE){
	
	
	///////////////////////////////////////////////
	////////////////  CONSTRUCTOR   ///////////////
	///////////////////////////////////////////////
	// var Background = {};
	var Background = function (game) {
	
	
		//SCENE
		this.scene = new THREE.Scene();
		
		
		//CAMERA
/*
		this.camera = new THREE.PerspectiveCamera(45, game.width / game.height, 1, 1000);
		var dist = game.height / 2 / Math.tan(Math.PI * 45 / 360);
		this.camera.position.z = 50//dist;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);
*/
/*
		this.camera = new THREE.PerspectiveCamera(45, game.width / game.height, 1, 1000);
		this.camera.position.z = 600//game.height / 2 / Math.tan(Math.PI * 45 / 360);
*/
		this.camera = new THREE.PerspectiveCamera(45, game.width / game.height, 0.1, 1000);
		this.camera.up = new THREE.Vector3(0, 1, 0);  
		this.camera.position.z = 200; //game.height / 2 / Math.tan(Math.PI * 45 / 360);
		this.scene.add(this.camera);
		
	
		// start the renderer
		this.renderer = new THREE.WebGLRenderer({antialiasing: true, alpha: true});
		this.renderer.setSize(game.width, game.height);
		this.scene.fog = new THREE.FogExp2(0x222228, 0.003);  
	
	
	
		//GEOMETRY
		var geometry = new THREE.PlaneGeometry(game.width * 2, game.height, 40, 20);
		var X_OFFSET_DAMPEN = 0.5;
		var Y_OFFSET_DAMPEN = 0.1;
		var Z_OFFSET_DAMPEN = 0.1;
		var randSign = function() { return (Math.random() > 0.5) ? 1 : -1; };
		
		for ( var i = 0; i < geometry.vertices.length; i++ ) {
			geometry.vertices[i].x += Math.random() / X_OFFSET_DAMPEN * randSign();
			geometry.vertices[i].y += Math.random() / Y_OFFSET_DAMPEN * randSign();
			geometry.vertices[i].z += Math.random() / Z_OFFSET_DAMPEN * randSign();
    
			var zPos = Math.random() * this.max_offset;
			this.tagetPositions.push(zPos);
		}
		
		geometry.dynamic = true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		geometry.normalsNeedUpdate = true;
		
		
		//material
		var material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading});
		material.fog = true;
		
		this.plane = new THREE.Mesh(geometry, material);
		this.plane.castShadow = true;
		this.plane.receiveShadow = true;
		this.plane.material.side = THREE.DoubleSide;
		this.plane.geometry.dynamic = true;
		this.scene.add(this.plane);
		
	
	
		//LIGHTS
		var ambientLight = new THREE.AmbientLight(0x1a1a1a);
		this.scene.add(ambientLight);
	
		var dirLight = new THREE.DirectionalLight(0xdfe8ef, 0.1);
		dirLight.position.set(5, 2, 1);
		this.scene.add(dirLight);
		
		
		//Super
		this.canvas = this.renderer.domElement; //Phaser.Canvas.create(game.width, game.height, '', true);
		this.baseTexture = new PIXI.BaseTexture(this.canvas);
		this.texture = new PIXI.Texture(this.baseTexture);
		this.texture.requiresUpdate = true;
	    Phaser.Sprite.call(this, game, 0, 0);
		
	};
	
	
	
	
	///////////////////////////////////////////////
	//////////////  OBJECT PROTOYPE  //////////////
	///////////////////////////////////////////////
	Background.prototype = Object.create(Phaser.Sprite.prototype);
	Background.prototype.constructor = Background;
	
	
	
	
	///////////////////////////////////////////////
	////////////////  PROPERTIES  /////////////////
	///////////////////////////////////////////////
	Background.prototype.scene = null;
	Background.prototype.camera = null;
	Background.prototype.renderer = null;
	Background.prototype.plane = null;
	Background.prototype.max_offset = 50;
	Background.prototype.tagetPositions = [];
	Background.prototype.canvas = null;
	Background.prototype.texture = null;
	Background.prototype.baseTexture = null;
	
	
	
	///////////////////////////////////////////////
	//////////////////  METHODS ///////////////////
	///////////////////////////////////////////////
	Background.prototype.updateTexture = function(_context){
		var scope = _context || this;
		
		console.log(scope.texture);
		/////
		
		//scope.baseTexture.update();

		scope.texture.destroy();
		scope.setTexture(this.baseTexture, PIXI.scaleModes.DEFAULT);
		scope.texture.requiresUpdate = true;
	};
	
	
	
	Background.prototype.update = function( _context ) {
		var scope = _context || this;

		
		for ( var i = 0; i < scope.plane.geometry.vertices.length; i++ ) {
			if( (scope.tagetPositions[i] - scope.plane.geometry.vertices[i].z) < 0.005){
				scope.tagetPositions[i] = Math.random() * scope.max_offset;
			}
			
			
			var pos = (scope.tagetPositions[i] - scope.plane.geometry.vertices[i].z) * 0.06;
			scope.plane.geometry.vertices[i].z += pos;
			
		}
		scope.plane.geometry.verticesNeedUpdate = true;
		scope.plane.geometry.__dirtyVertices = true;
		scope.plane.position.x -= 0.2;
			
		scope.renderer.render( scope.scene, scope.camera );
		
		//
		scope.setTexture( new PIXI.Texture( new PIXI.BaseTexture(scope.canvas) ) );
		
	};
			
	
	
	///////////
	return Background;
});






