// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

import vsOutline from 'shaders/outline.vert';
import fsOutline from 'shaders/outline.frag';

class ViewObjModel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderOutline = new alfrid.GLShader(vsOutline, fsOutline);
		this.time = 0;
	}


	_init() {
		this.mesh = Assets.get('kuafu');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];
		
		gui.add(this, 'roughness', 0, 1);
		gui.add(this, 'specular', 0, 1);
		gui.add(this, 'metallic', 0, 1);
	}


	render(textureRad, textureIrr, textureAO) {
		this.shader.bind();

		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform('uRadianceMap', 'uniform1i', 1);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		textureAO.bind(0);
		textureRad.bind(1);
		textureIrr.bind(2);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);

		this.time += 0.01;

		const shader = this.shaderOutline;
		shader.bind();
		shader.uniform("uTime", "float", this.time);
		shader.uniform("uOutlineWidth", "float", params.outlineWidth);
		shader.uniform("uOutlineNoise", "float", params.outlineNoise);
		shader.uniform("uOutlineNoiseStrength", "float", params.outlineNoiseStrength);

		GL.gl.cullFace(GL.gl.FRONT);
		GL.draw(this.mesh);
		GL.gl.cullFace(GL.gl.BACK);
	}


}

export default ViewObjModel;