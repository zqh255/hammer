var handelThat = null

 var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function Shirt(){
	var that = this
	that.dom = null
	that.mc = null
	that.startX = 0
	that.startY = 0
	that.transform = {
		translate: {
			x: 0,
			y: 0
		},
		scale: 1,
		angle: 0
	}
	that.initScale = 1
	that.initRotate = 0
	handelThat = this
	that.isClick = false
}

Shirt.prototype = {
	init(){
		let that = this
		if(!that.dom){
			that.dom = document.getElementById('dom')
			that.startX = that.dom.clientLeft
			that.startY = that.dom.clientTop
		}

		if(!that.mc){
			that.mc = new Hammer.Manager(that.dom)

			that.mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}))

			that.mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(that.mc.get('pan'))

			that.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([that.mc.get('pan'), that.mc.get('rotate')])

			that.mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

			that.mc.add(new Hammer.Tap({event: 'doubletap', taps: 2}))

			
			that.mc.on('panstart', that.panstart)
			that.mc.on("panmove", that.handlePan)
			that.mc.on("panend", that.panend)

			that.mc.on("rotatestart rotatemove", that.handelRotate)

			that.mc.on("pinchmove pinchstart pinchin pinchout", that.handelPinch)

			that.mc.on("doubletap", that.doubletap);
			// that.mc.on("quadrupletap", that.handleTaps)
		}
	},
	requestElementUpdate(){
		requestAnimationFrame(this.updateElementTransform)
	},
	updateElementTransform(){
		var that = handelThat
		var transform = that.transform
		var value = [
			`translate(${transform.translate.x}px,${transform.translate.y}px)`,
			`scale(${transform.scale},${transform.scale})`,
			`rotate(${transform.angle}deg)`
		]
		value = value.join(' ')
		that.dom.textContent = value
		that.dom.style.transform = value
		// that.isClick = false
	},
	panstart(ev){
		var that = handelThat
		that.isClick = true
		// that.startX = ev
	},
	panend(ev){
		var that = handelThat
		that.startX = that.transform.translate.x
		that.startY = that.transform.translate.y

		that.isClick = false
	},
	handlePan(ev){
		var that = handelThat
		if(that.isClick){
			that.transform.translate.x = that.startX + ev.deltaX
			that.transform.translate.y = that.startY + ev.deltaY
			
			that.requestElementUpdate()
		}
		
	},
	handelPinch(ev){
		var that = handelThat
		
		/*
		* 进行下一次缩放的时候,pinch 会将scale从1开始，所以做以下处理
		*/
		if(ev.type === 'pinchstart'){
			that.initScale = that.transform.scale || 1
		}

		that.transform.scale = that.initScale * ev.scale
		
		that.requestElementUpdate()

	},
	doubletap(ev){
		var that = handelThat
		// debug.log(ev)
		that.transform.scale = 1
		that.transform.angle = 0
		that.requestElementUpdate()
		// console.log('taps', ev)
		// alert('123')
	},
	handelRotate(ev){
		var that = handelThat
		if(ev.type === 'rotatestart'){
			that.initRotate = that.transform.angle || 0
		}
		that.transform.angle = that.initRotate + ev.rotation
		// debug.log(that.transform.angle)
		that.requestElementUpdate()
	}
}

Shirt.prototype.constructor = Shirt