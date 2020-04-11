function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();

	var sphereMaterial = getMaterial('', 'rgb(255, 255, 255)');
	var sphere = getSphere(sphereMaterial, 0.7, 24);
  sphere.name = 'sphere';

  var torus = getTorus();
  var cylinder = getCylinder();

	var planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	var plane = getPlane(planeMaterial, 30);

	var light = getSpotLight(1, 'rgb(255, 220, 180)');

  var light_control = gui.addFolder('Light');
  light_control.add(light,'intensity', 1, 5);
  light_control.add(light.position, 'x', 0, 10);
  light_control.add(light.position, 'y', 0, 5);
  light_control.add(light.position, 'z', 0, 10);

	var sphere_control = gui.addFolder('Sphere');
	sphere_control.add(sphere.position, 'y', 0, 5);
	sphere_control.add(sphere.scale, 'x', 0, 10);
	sphere_control.add(sphere.scale, 'y', 0, 10);
	sphere_control.add(sphere.position, 'z', -5, 3);

	var torus_control = gui.addFolder('Torus');
	torus_control.add(torus.material, 'roughness', 0, 1);
	torus_control.add(torus.material, 'metalness', 0, 1);

	var cylinder_control = gui.addFolder('Cylinder');
	cylinder_control.add(cylinder.material, 'wireframe', true, false);

  torus.position.x = -3.5;
  torus.position.y = 1;
  torus.position.z = -2;
  torus.name = 'torus';

  cylinder.position.x = 1.5;
  cylinder.position.y = 0.4;
  cylinder.position.z = 2;
  cylinder.name = 'cylinder';

	plane.rotation.x = -Math.PI/2.1;
  plane.position.z = -2;

  sphere.position.y = 0.3;

	light.position.x = -10;
	light.position.y = 50;
	light.position.z = 5;
  light.name = 'light';

	var loader = new THREE.TextureLoader();
	planeMaterial.map = loader.load('checkerboard.jpg');

	scene.add(sphere);
	scene.add(plane);
	scene.add(light);
  scene.add(torus);
  scene.add(cylinder);

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.z = 5;
	camera.position.x = 0;
	camera.position.y = 0;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(135, 216, 250)');
	renderer.shadowMap.enabled = true;
	document.getElementById('main').appendChild(renderer.domElement);

	update(renderer, scene, camera);
	return scene;
}
function getTorus(){
    var geometry = new THREE.TorusKnotGeometry(0.6,0.25,0.7,155);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});
    var torusKnot = new THREE.Mesh(geometry, material);
    return torusKnot;
}
function getCylinder(){
  var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.4, 0.5, 64 );
  var material = new THREE.MeshNormalMaterial( {color: 0xffffff} );
  var cylinder = new THREE.Mesh( geometry, material );
  return cylinder;
}
function getSphere() {
	var material = new THREE.PointsMaterial({color: 0xffffff})
	var geometry = new THREE.SphereGeometry(0.7, 24, 24);
	var obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;

	return obj;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
	light.shadow.bias = 0.001;

	return light;
}

function getPlane(material, size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function update(renderer, scene, camera) {
  var x = Math.random();
  var y = Math.random();
  var z = Math.random();
  var color = new THREE.Color(x,y,z);

  var light = scene.getObjectByName('light');
  light.color = color;
  var sphere = scene.getObjectByName('sphere');
  sphere.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
  var torus = scene.getObjectByName('torus');
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.05;

  var cylinder = scene.getObjectByName('cylinder');
  cylinder.rotation.x += 0.01;
  cylinder.rotation.y += 0.01;
  cylinder.rotation.z += 0.05;

	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera);
	});
}

var scene = init();
