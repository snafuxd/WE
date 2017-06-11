
function colorGradient( ignoreFix )
{
	this.ignoreFix = ignoreFix || false;
	this.useColors = 1;
	this.colors = [
		[0, 1, 0.5, 1],
		[0.33, 1, 0.5, 1],
		[0.66, 1, 0.5, 1],
		[0.33, 1, 0.5, 1],
		[0, 1, 0.5, 1],
	];
	
	this.gradient = [];
	
	this.setColorCount = function(i) { 
		this.useColors = i;
		this.updateGradient();
	}
	
	this.setColor = function(i, hsl) { 
		this.colors[ i ][0] = hsl[0];
		this.colors[ i ][1] = hsl[1];
		this.colors[ i ][2] = hsl[2];
		if( hsl.length > 3 ) {
			this.colors[ i ][3] = hsl[3];
		}
		this.updateGradient();
	}
	this.setAlpha = function(i, a) { 
		this.colors[ i ][3] = a;
		this.updateGradient();
	}
	
	this.getColorForPerc = function(p)
	{
		var p = Math.min( 1000, Math.max( 0, Math.round( p * 1000 ) ) );
		return this.gradient[ p ].slice(0);
	}
	
	this.getPreviousHue = function( before )
	{
		for( var i = before-1; i >= 0; i-- ) {
			if( this.colors[i][ 1 ] != 0 && this.colors[i][2] != 0 && this.colors[i][2] != 1 ) 
			{
				return [this.colors[i][0],i];
			}
		}
		return [-1,0];
	}
	
	this.getNextHue = function( after )
	{
		for( var i = after+1; i < 5 && i < this.useColors ; i++ ) {
			if( this.colors[i][ 1 ] != 0 && this.colors[i][2] != 0 && this.colors[i][2] != 1 ) 
			{
				return [this.colors[i][0],i];
			}
		}
		return [-1,4];
	}
	
	this.fixColorless = function()
	{
		for( var i = 0; i < 5; i++ )
		{
			if( this.colors[i][ 1 ] == 0 || this.colors[i][2] == 0 || this.colors[i][2] == 1 ) 
			{
				var h1 = this.getPreviousHue( i );
				var h2 = this.getNextHue( i );
				if( h1[0] == -1 ) h1[0] = h2[0];
				if( h2[0] == -1 ) h2[0] = h1[0];
				if( h1[0] != -1 && h2[0] != -1 )
				{
					var h = h1[0] + ( h2[0] - h1[0] ) * ( i - h1[1] ) / (h2[1]-h1[1]);
					this.colors[i][0] = h;
				}
			}
		}
	}
	
	this.updateGradient = function()
	{
		this.fixColorless();
		this.gradient = [];
		for( var i = 0; i <= 1000; i++ )
		{
			var p = i / 1000;
			if( this.useColors  == 1 ) {
				this.gradient[ i ] = [this.colors[0][0]*360,this.colors[0][1]*100,this.colors[0][2]*100];
			}
			else {
				var i1 = Math.floor( p * (this.useColors-1));
				var i2 = Math.floor( p * (this.useColors-1)) + 1;
				var p1 = i1 / (this.useColors-1);
				var p2 = i2 / (this.useColors-1);
				if( i1 == this.useColors -1 )
				{
					i1--; i2--;
					p1 -= 1 / (this.useColors-1);
					p2 -= 1 / (this.useColors-1);
				}
				
				//console.log( i + ' ' + this.useColors + ' ' + p + ' ' + p1 + ' ' + p2 + ' '+ i1 + ' ' + i2 );
				
				var c1 = this.colors[ i1 ];
				var c2 = this.colors[ i2 ];
				var h1 = c1[0];
				var h2 = c2[0];
				if( !this.ignoreFix ) {
					h1 = c1[0]%1;
					h2 = c2[0]%1;
					if( h1 <= h2 - 0.4999999 ) h1 += 1;
					if( h2 < h1 - 0.4999999 ) h2 += 1;
				}
				var hsl = [ 
					(h1 + ( h2 - h1 ) * (p-p1)/(p2-p1))*360,
					(c1[ 1 ] + ( c2[ 1 ] - c1[ 1 ] ) * (p-p1)/(p2-p1))*100,
					(c1[ 2 ] + ( c2[ 2 ] - c1[ 2 ] ) * (p-p1)/(p2-p1))*100,		
					(c1[ 3 ] + ( c2[ 3 ] - c1[ 3 ] ) * (p-p1)/(p2-p1)),						
				];
				if( i > 0 ) {
					var hsl2 = this.gradient[i-1];
					while( hsl[0] <= hsl2[0]-179.99999 ) hsl[0]+=360;
					while( hsl2[0] < hsl[0]-180.00 ) hsl[0]-=360;
				}
				

				this.gradient[ i ] = hsl;
			}
		}
			//console.error( '0:' +this.gradient[ 0 ].join(', ') );
			//console.error( '1:' +this.gradient[ 1 ].join(', ') );
			//console.error( '2:' +this.gradient[ 2 ].join(', ') );
	}
	
	this.updateGradient();
}
 
 	
function circleSlice( sa, ea, sr, er, m, hsl )
{
	var sc = 2 * Math.PI * sr;
	var ec = 2 * Math.PI * er;
	
	this.sa = sa ;
	this.ea = ea ;
	this.ssa = sa + (m) * 2 * Math.PI / sc;
	this.sea = ea - (m) * 2 * Math.PI / sc;
	this.esa = sa + (m) * 2 * Math.PI / ec;
	this.eea = ea - (m) * 2 * Math.PI / ec;
	this.sr = sr;
	this.er = er;
	this.sc = sc;
	this.ec = ec;
	this.pts = [];
	this.pts2 = [];
	this.generate();
	
	this.hsl = hsl;
	this.opacity = hsl[3];
	this.val = 1;
	this.changedTrigger = true;
	this.changedFade = false;
	this.changedColor = false;
}

circleSlice.prototype = {
	generate: function()
	{
		var steps =  Math.ceil(( this.ea - this.sa ) / (Math.PI/36) );
		this.pts = [];
		for( var i = this.ssa; i < this.sea; i += ( this.sea-this.ssa)/steps )
		{
			this.pts.push( [ Math.sin( i ) * this.sr, Math.cos( i ) * this.sr ] );
		}
		this.pts.push( [ Math.sin( this.sea ) * this.sr, Math.cos( this.sea ) * this.sr ] );
		for( var i = this.eea; i > this.esa; i -= ( this.eea-this.esa)/steps )
		{
			this.pts.push( [ Math.sin( i ) * this.er, Math.cos( i ) * this.er ] );
		}
		this.pts.push( [ Math.sin( this.esa ) * this.er, Math.cos( this.esa ) * this.er ] );
		
		var d = Math.sign( this.er - this.sr );
		
		this.pts2 = [];
		for( var i = this.sa; i < this.ea; i += ( this.ea-this.sa)/steps )
		{
			this.pts2.push( [ Math.sin( i ) * (this.sr-d), Math.cos( i ) * (this.sr-d) ] );
		}
		this.pts2.push( [ Math.sin( this.ea ) * (this.sr-d), Math.cos( this.ea ) *(this.sr-d) ] );
		for( var i = this.ea; i > this.sa; i -= ( this.ea-this.sa)/steps )
		{
			this.pts2.push( [ Math.sin( i ) * (this.er+d), Math.cos( i ) * (this.er+d) ] );
		}
		this.pts2.push( [ Math.sin( this.sa ) * (this.er+d), Math.cos( this.sa ) * (this.er+d) ] );
		
		//for( var i in this.pts ) {
		//	this.pts[i][0] = Math.round( this.pts[i][0] );
		//	this.pts[i][1] = Math.round( this.pts[i][1] );
		//}
	},
	setHsl: function(hsl)
	{
		this.hsl = hsl;
		this.opacity = hsl[3];
		this.changedColor = true;
		if( this.val > 0 ) {
			this.changedTrigger = true;
		}
		else {
			this.changedFade = true;
		}
		
	},
	trigger: function()
	{
		if( this.val < 1 ) {
			this.val = 1;
			this.changedTrigger = true;
		}
	},
	fade: function()
	{
		if( this.val > 0 ) {
			//this.val = 0;
			this.val -= 1;
			if( this.val < 0 ) this.val = 0;
			this.changedFade = true;
		}
	},
	render: function(ctx,x,y)
	{
		if( this.changedFade || this.changedColor ) {
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineWidth = 1;
			var v = Math.pow( 1 - this.val, 2 );
			if( this.changedColor ) v = 1;
			ctx.strokeStyle = 'rgba(0,0,0,' + v +')';
			ctx.fillStyle = 'rgba(0,0,0,' + v +')';
		    //context.shadowColor = 'rgba(0,0,0,' + (1-this.val) +')';
		    //context.shadowBlur = this.m;
			ctx.beginPath();
			var l = this.pts2.length;
			ctx.moveTo( x+this.pts2[l-1][0], y+this.pts2[l-1][1]);
			for( var i = 0; i < l; i++ ) {
				ctx.lineTo( x+this.pts2[i][0], y+this.pts2[i][1]);
			}
			ctx.closePath();
			ctx.fill();
			
			this.changedFade = false;
			//context.stroke();
			if( !this.changedColor  ) return true;
		}
		if( this.changedTrigger || this.changedColor  ) {
			//context.lineWidth = 1;
			//context.strokeStyle = 'white';
			ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = 'hsla('+this.hsl[0]+','+this.hsl[1]+'%,'+this.hsl[2]+'%,'+(this.opacity * this.val ) +')';
			ctx.beginPath();
			var l = this.pts.length;
			ctx.moveTo( x+this.pts[l-1][0], y+this.pts[l-1][1]);
			for( var i = 0; i < l; i++ ) {
				ctx.lineTo( x+this.pts[i][0], y+this.pts[i][1]);
			}
			ctx.closePath();
			ctx.fill();
			
			this.changedTrigger = false;
			this.changedColor = false;
			//context.stroke();
			return true;
		}
		return false;
	}
}


function circleSliceStack( sa, ea, sr, er, m, layers, hsl1, hsl2 )
{
	this.sa = sa;
	this.ea = ea;
	this.sr = sr;
	this.er = er;
	this.m = m;
	this.l = layers;
	this.s = [];
	this.val = 0;
	this.hsl1 = hsl1;
	this.hsl2 = hsl2;
	//console.log( hsl1 );
	//console.log( hsl2 );
	this.g = new colorGradient(true);
	this.g.setColorCount(2);
	this.g.setColor(0,hsl1);
	this.g.setColor(1,hsl2);
	this.lastColorChange = -10000;
	var d = Math.sign( this.er - this.sr );
	for( var i = 0; i < layers; i++ ) 
	{
		var p1 = i / ( layers );
		var p2 = (i+1) / ( layers );
		var hsl = this.g.getColorForPerc( i / (layers-1) );
		this.s.push( new circleSlice( sa, ea, 
										sr + p1 * ( er+m*d-sr) + m*1*d, 
										sr + p2 * ( er+m*d-sr ) - m*1*d, 
										m, hsl ) );
	}
	
}

circleSliceStack.prototype = {
	setValue: function(val)
	{
		var now = performance.now();
		if( now < this.lastColorChange + 3000 ) 
		{
			for( var i = 0; i < this.l; i++ )
			{
				this.s[i].trigger();
			}
		}
		else {
			for( var i = 0; i < this.l; i++ )
			{
				if( (i+0.5) / (this.l-1) <= val  ) {
					this.s[i].trigger();
				}
				else {
					this.s[i].fade();
				}
			}
		}
	},
	setColors: function( hsl1, hsl2 )
	{
		this.g.setColor(0,hsl1);
		this.g.setColor(1,hsl2);
		var l = this.s.length;
		for( var i = 0; i < l; i++ ) {
			var hsl = this.g.getColorForPerc( i / (l-1) );
			this.s[ i ].setHsl( hsl );
		}
		this.lastColorChange = performance.now();
	},
	render : function(timeDiff,ctx,x,y)
	{
		var cnt = 0;
		for( var i in this.s ) {
			cnt += this.s[ i ].render( ctx,x,y ) ? 1 : 0;
		}
		return cnt;
	}
}

function circle( sr, er, m, slices, layers )
{
	this.m = m;
	this.sr = sr;
	this.er = er;
	this.slices = slices;
	this.layers = layers;
	
	this.enabled = 235235;
	var l = Math.sqrt( window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight ) + 1;
	this.c = document.createElement('canvas');
	this.c.className ='circle-layer';
	this.ctx = this.c.getContext('2d');
	this.s = [];
	this.rot = 0;
	this.rotBase = 0;
	this.rotSpeed = 1;
	this.px = 0;
	this.py = 0;
	this.sg = new colorGradient();
	this.eg = new colorGradient();
	this.use2Gradients = true;
	
	this.frameData = new AudioFrame({
					normalize: true,
					normalizeFactor: 0.98,
					motionBlur: true,
					motionBlurFactor: 0.666,
					smooth: true,
					smoothFactor: 0.5,
					powerOf: 1,
					mono: false,
					correctPink: false
				});
	
	document.body.appendChild( this.c );
	this.recreateSlices();
	this.resize();
	this.updatesLastFrame = 0;
	
	this._recreateTimeout = null;
}

circle.prototype = {
	fixGradients: function()
	{
		for( var i = 0; i < 5; i++ )
		{
			var h1 = this.sg.colors[i][0];
			var h2 = this.eg.colors[i][0];
			//if( h1 + 0.5 <= h2 ) h1 += 1;
			while( h2 + 0.499999 < h1 ) h2 += 1;
			//if( h1 > 0.5 && h1 - 0.5 > h2 ) h1 -= 1;
			while( h2 > 0.5 && h2 - 0.499999 >= h1 ) h2 -= 1;
			this.sg.colors[i][0] = h1;
			this.eg.colors[i][0] = h2;
			//console.log( h1 + ', ' + h2 );
		}
		this.sg.updateGradient();
		this.eg.updateGradient();
	},
	setEnabled: function(e)
	{
		if( this.enabled != e )
		{
			this.enabled = e;
			if( this.enabled ) {this.c.style.visibility='visible';}
			else {this.c.style.visibility='hidden';}
		}
	},
	recreateSlices: function()
	{
		this.fixGradients();
		var a = Math.PI * 2 / this.slices;
		this.s = [];
		for( var i = 0; i < this.slices; i++ )
		{
			var hsl1 = this.sg.getColorForPerc( i / ( this.slices-1) );
			var hsl2 = this.use2Gradients ? this.eg.getColorForPerc( i / ( this.slices-1) ) : hsl1.slice(0);
			hsl1[0] /= 360;
			hsl1[1] /= 100;
			hsl1[2] /= 100;
			hsl2[0] /= 360;
			hsl2[1] /= 100;
			hsl2[2] /= 100;
			this.s.push( new circleSliceStack( i * a, ( i+1 ) * a, this.sr, this.er, this.m, this.layers, hsl1, hsl2 ) );//[(i*360/(this.slices)),100,50],[(i*360/(this.slices)+180),100,50] ) );
		}
	},
	startRecreateSlicesTimeout: function()
	{
		var self = this;
		if( this._recreateTimeout != null ) {
			clearTimeout( this._recreateTimeout );
			this._recreateTimeout = null;
		}
		this._recreateTimeout = setTimeout( function() {
			self.resize();
			self.recreateSlices();
		}, 200 );
	},
	updateColors: function()
	{
		this.fixGradients();
		var l = this.s.length;
		for( var i = 0; i < l; i++ ) {
			var hsl1 = this.sg.getColorForPerc( i / (l-1) );
			var hsl2 = this.use2Gradients ? this.eg.getColorForPerc( i / (l-1) ) : hsl1.slice(0);
			hsl1[0] /= 360;
			hsl1[1] /= 100;
			hsl1[2] /= 100;
			hsl2[0] /= 360;
			hsl2[1] /= 100;
			hsl2[2] /= 100;
			this.s[i].setColors( hsl1, hsl2 );
		}
	},
	applyUserSettings: function( prefix, p )
	{
		
		var colorChanged = null;
		if( p[prefix+'colCount'] ) {
			this.sg.setColorCount( p[prefix+'colCount'].value );
			colorChanged = true;
		}
		if( p[prefix+'col1'] ) {
			var col = getColorAsArray( p[prefix+'col1'].value ); 
			this.sg.setColor( 0, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'col2'] ) {
			var col = getColorAsArray( p[prefix+'col2'].value ); 
			this.sg.setColor( 1, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'col3'] ) {
			var col = getColorAsArray( p[prefix+'col3'].value ); 
			this.sg.setColor( 2, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'col4'] ) {
			var col = getColorAsArray( p[prefix+'col4'].value ); 
			this.sg.setColor( 3, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'col5'] ) {
			var col = getColorAsArray( p[prefix+'col5'].value ); 
			this.sg.setColor( 4, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'col1a'] ) {
			var col = getSlider( p[prefix+'col1a'].value, 0, 100 )/100; 
			this.sg.setAlpha( 0, col );
			colorChanged = true;
		}
		if( p[prefix+'col2a'] ) {
			var col = getSlider( p[prefix+'col2a'].value, 0, 100 )/100; 
			this.sg.setAlpha( 1, col );
			colorChanged = true;
		}
		if( p[prefix+'col3a'] ) {
			var col = getSlider( p[prefix+'col3a'].value, 0, 100 )/100; 
			this.sg.setAlpha( 2, col );
			colorChanged = true;
		}
		if( p[prefix+'col4a'] ) {
			var col = getSlider( p[prefix+'col4a'].value, 0, 100 )/100; 
			this.sg.setAlpha( 3, col );
			colorChanged = true;
		}
		if( p[prefix+'col5a'] ) {
			var col = getSlider( p[prefix+'col5a'].value, 0, 100 )/100; 
			this.sg.setAlpha( 4, col );
			colorChanged = true;
		}
		if( p[prefix+'ecolUse'] ) {
			this.use2Gradients = p[prefix+'ecolUse'].value; 
			colorChanged = true;
		}
		if( p[prefix+'ecolCount'] ) {
			this.eg.setColorCount( p[prefix+'ecolCount'].value );
			colorChanged = true;
		}
		if( p[prefix+'ecol1'] ) {
			var col = getColorAsArray( p[prefix+'ecol1'].value ); 
			this.eg.setColor( 0, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'ecol2'] ) {
			var col = getColorAsArray( p[prefix+'ecol2'].value ); 
			this.eg.setColor( 1, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'ecol3'] ) {
			var col = getColorAsArray( p[prefix+'ecol3'].value ); 
			this.eg.setColor( 2, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'ecol4'] ) {
			var col = getColorAsArray( p[prefix+'ecol4'].value ); 
			this.eg.setColor( 3, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'ecol5'] ) {
			var col = getColorAsArray( p[prefix+'ecol5'].value ); 
			this.eg.setColor( 4, rgbToHsl( col[0], col[1], col[2], 255 ) );
			colorChanged = true;
		}
		if( p[prefix+'ecol1a'] ) {
			var col = getSlider( p[prefix+'ecol1a'].value, 0, 100 )/100; 
			this.eg.setAlpha( 0, col );
			colorChanged = true;
		}
		if( p[prefix+'ecol2a'] ) {
			var col = getSlider( p[prefix+'ecol2a'].value, 0, 100 )/100; 
			this.eg.setAlpha( 1, col );
			colorChanged = true;
		}
		if( p[prefix+'ecol3a'] ) {
			var col = getSlider( p[prefix+'ecol3a'].value, 0, 100 )/100; 
			this.eg.setAlpha( 2, col );
			colorChanged = true;
		}
		if( p[prefix+'ecol4a'] ) {
			var col = getSlider( p[prefix+'ecol4a'].value, 0, 100 )/100; 
			this.eg.setAlpha( 3, col );
			colorChanged = true;
		}
		if( p[prefix+'ecol5a'] ) {
			var col = getSlider( p[prefix+'ecol5a'].value, 0, 100 )/100; 
			this.eg.setAlpha( 4, col );
			colorChanged = true;
		}
		if( colorChanged )
		{
			this.updateColors();			
		}
		
		var hasChanged = false;
		if( p[prefix+'sr'] ) {  this.sr = getSlider( p[prefix+'sr'].value, 10, 2000 ); hasChanged = true; }
		if( p[prefix+'er'] ) {  this.er = getSlider( p[prefix+'er'].value, 10, 2000 ); hasChanged = true; }
		if( p[prefix+'c'] ) {  this.slices = getSlider( p[prefix+'c'].value, 4, 128 ); hasChanged = true; }
		if( p[prefix+'r'] ) {  this.layers = getSlider( p[prefix+'r'].value, 2, 50 ); hasChanged = true; }
		if( p[prefix+'m'] ) {  this.m = getSlider( p[prefix+'m'].value, 1, 10 ); hasChanged = true; }
		
		if( hasChanged ) {
			this.startRecreateSlicesTimeout();
		}
		
		if( p[prefix+'rs'] ) {  this.rotSpeed = getSlider( p[prefix+'rs'].value, -100, 100 );  }
		if( p[prefix+'rb'] ) {  this.rotBase = getSlider( p[prefix+'rb'].value, -180, 180 );  }
		if( p[prefix+'px'] ) {  this.px = getSlider( p[prefix+'px'].value, -1000, 1000 );  }
		if( p[prefix+'py'] ) {  this.py = getSlider( p[prefix+'py'].value, -1000, 1000 );  }
		
		if( p[prefix+'opacity'] ) {
			this.c.style.opacity = getSlider(p[prefix+'opacity'].value, 0, 100)/100;
		}
		if( p[prefix+'blending'] ) {
			this.c.style.mixBlendMode = p[prefix+'blending'].value;
		}
		if( p[prefix+'blur'] ) {
			var blur = Math.max( 0, Math.min( 10, p[prefix+'blur'].value ) );
			this.c.style.filter = 'blur(' + blur + 'px)';
		}
		
	},
	resize: function()
	{
		var l = Math.sqrt( window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight ) + 1;
		this.c.width = l;
		this.c.height = l;
		this.c.className ='circle-layer';
		this.c.style.left = ((window.innerWidth-l)/2)+"px";
		this.c.style.top = ((window.innerHeight-l)/2)+"px";
		this.c.style.transformOrigin = (l/2)+"px " + (l/2)+"px";
		
		context.globalCompositeOperation = 'destination-out';
		context.fillStyle = 'rgba( 0, 0, 0, 1 )';
		context.fillRect( 0, 0, this.c.width, this.c.height );
	},
	setAudioData: function(ad)
	{
		if( !this.enabled  ) return;
		
		var dt = [];
		var dt2 = [];
		for( var i = 0; i < 64; i++) {
			dt[i] = ad.left.data[i];
		}
		for( var i = 0; i < 64; i++) {
			dt[i+64] = ad.right.data[i];
		}
		var samplesPerSlice = 128 / this.slices;
		for( var i = 0; i < 64; i+= samplesPerSlice )
		{
			var v = 0;
			for( j = 0; j < samplesPerSlice; j++ ) {
				v += dt[i+j];
			}
			v /= samplesPerSlice;
			dt2[Math.round(i/samplesPerSlice)] = v;
			
			var v = 0;
			for( j = 0; j < samplesPerSlice; j++ ) {
				v += dt[i+j + 64];
			}
			v /= samplesPerSlice;
			dt2[Math.round(i/samplesPerSlice)+ 64] = v;
		}
		this.frameData.update( dt2 );
		ad = this.frameData.audioDataResult;
		var dt = [];
		for( var i = 0; i < 64; i++) {
			dt[i] = ad.left.data[i];
		}
		for( var i = 0; i < 64; i++) {
			dt[i+64] = ad.left.data[i];
		}
		//console.log( dt );
		for( var i = 0; i < this.slices; i++ )
		{
			var j = i < this.slices/2 ? i : this.slices/2 + (this.slices-1) - i;
			var k = i < this.slices/2 ? i : i - this.slices/2 + 64;
			if( j < this.s.length ) 
				this.s[j].setValue( dt[k] );
		}
	},
	setRotationBase: function( deg )
	{
		this.rotBase = deg * Math.PI / 180;
	},
	setRotationSpeed: function( speed )
	{
		this.rotSpeed = speed;
	},
	setPosition: function( x,y )
	{
		this.px = x;
		this.py = y;
	},
	render: function( timestamp, timeDiff )
	{
		this.updatesLastFrame = 0;
		if( !this.enabled  ) return;
		var cnt = 0;
		//this.ctx.save();
		this.rot = this.rotBase + this.rotSpeed * ( (timestamp/1000) % 864000 );
		this.c.style.transform = 'translate( '+this.px+'px, '+this.py+'px ) rotateZ('+this.rot+'deg)';
		for( var i in this.s ) {
			cnt += this.s[i].render( timeDiff, this.ctx, this.c.width/2, this.c.height/2 );
		}
		this.updatesLastFrame = cnt;
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillStyle = 'rgba( 0, 255, 0, 1 )';
		this.ctx.fillRect( 0, 0, 1, 1 );
		this.ctx.fillRect( this.c.width-1, this.c.height-1, 1, 1 );
		//this.ctx.restore();
	}				
}
	