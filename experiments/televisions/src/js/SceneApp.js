// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewTVSimple from './ViewTVSimple';
import ViewTelevisions from './ViewTelevisions';
import ViewFloor from './ViewFloor';
import Assets from './Assets';
import PassBloom from './PassBloom';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 10;

		this._modelMatrix = mat4.create();
		mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, -1, 0));
	}

	_initTextures() {
		console.log('init textures');

		const oRender = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR
		};

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSkybox();

		// this._vModel = new ViewObjModel();
		this._vTVSimple = new ViewTVSimple();
		this._vTV = new ViewTelevisions();
		this._vFloor = new ViewFloor();

		this._passBloom   = new PassBloom(4, .5);
		this._passBloom.strength = 2;
		this._passBloom.threshold = .5;

		gui.add(this._passBloom, 'strength', 0, 2);
		gui.add(this._passBloom, 'radius', 0, 1);
		gui.add(this._passBloom, 'threshold', 0, 1);
	}


	render() {

		this._fboRender.bind();
		GL.clear(0, 0, 0, 1);
		GL.rotate(this._modelMatrix);
		this._vTVSimple.render(Assets.get('studio_radiance'), Assets.get('irr'));
		this._vTV.render(Assets.get('studio_radiance'), Assets.get('irr'));
		this._vFloor.render();
		this._fboRender.unbind();

		this._passBloom.render(this._fboRender.getTexture());


		GL.clear(0, 0, 0, 0);
		GL.disable(GL.DEPTH_TEST);
		GL.enableAdditiveBlending();
		this._bCopy.draw(this._fboRender.getTexture());
		this._bCopy.draw(this._passBloom.getTexture());
		GL.enableAlphaBlending();
		GL.enable(GL.DEPTH_TEST);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);

		const oRender = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR
		};

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
		
	}
}


export default SceneApp;