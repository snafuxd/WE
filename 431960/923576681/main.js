var canvas;
var ctx;

var posX = 0;
var gap = 0;
var userGap = 0;
var posY = 0;
var posY1 = 0;
var iniPosY = 0;
var iniPosY1 = 0;
var userPosY = 0;
var userPosY1 = 0;
var userPosX = 0; 
var userPosX1 = 0;

// var sum = 0;

var reverseLeft = false;
var reverseRight = false;

var line = true;
var reflect = true;
var bar = false;
var reflectBar = false;

var wave = false;

var mono = false;
var pinkNoiseAdd = true;

var audioSample = [];
var audioSampleA = [];
var smooth = [];
var smoothSample = [];
var smoothSampleA = [];
var smoothA = [];
var smoothB = [];
var smoothC = [];

var customBounceColor;
var topBounceColor = "rgba(250, 0, 0, 1)";
var bottomBounceColor = "rgba(250, 0, 0, 1)";
var topBounceOpacity;
var bottomBounceOpacity;

var normalise = true;
var normaliseReposiveness = 25;

var topLineColor = "rgba(250, 250, 250, 1)";

var topLineOpacity = 1;
var customTopLineColor = null;
var bottomLineColor = "rgba(250, 250, 250, 0.4)";
var bottomLineOpacity = 0.4;
var customBottomLineColor = null;
var linesWidth = 5;
var bounceSpeed = 5.00;
var topBounce = 0;
var topBounceY = [];
var bottomBounceY = [];
var bounceBars = true;
var bottomBounce = 0;
var barWidth = 5;
var indiBarGap = 4;
var indiBarHeight = 4;
var topBounceHeight = 1;

var waveStroke

var maxLineOneHeight = 300;
var maxLineTwoHeight = 300;
var avg;

var audioSize = 128;

var backgroundColor = "rgba(0, 0, 0, 1)";
var htmlColor = "rgb(0, 0, 0, 0)";
var backgroundColorOpacity = 1;
var customBgColor = "0,0,0";
var imageSize = "cover";

var greyScaleOption = 0;
var hueRotate = 0;
var blurOption = 0;
var invertColors = 0;

var autoHueRotate = false
var hueRotationTimer = 0.1;
var videoSource = "1.webm";
var backgroundVideo = false;


(audioSample = []).length = 1024; audioSample.fill(0);
(audioSampleA = []).length = 1024; audioSampleA.fill(0);
(smooth = []).length = 1024; smooth.fill(0);
(smoothSample = []).length = 1024; smoothSample.fill(0);
(smoothSampleA = []).length = 1024; smoothSampleA.fill(0);
(smoothA = []).length = 1024; smoothA.fill(0);
(smoothB = []).length = 1024; smoothB.fill(0);
(smoothC = []).length = 1024; smoothC.fill(0);
(topBounceY = []).length = 1024; topBounceY.fill(0);
(bottomBounceY = []).length = 1024; bottomBounceY.fill(0);



function reset(){
	(topBounceY = []).length = 1024; topBounceY.fill(canvas.width);
	(bottomBounceY = []).length = 1024; bottomBounceY.fill(0);
}


window.wallpaperPropertyListener = {
	applyUserProperties: function (properties) {
		if(properties.normalize){
			normalise = properties.normalize.value;
		}
		if(properties.normalizeresponce){
			normaliseReposiveness = properties.normalizeresponce.value / 100;
		}
		if(properties.reverseright){
			reverseRight = properties.reverseright.value;
		}
		if(properties.reverseleft){
			reverseLeft = properties.reverseleft.value;
		}
		if(properties.leftaudio){
			mono = properties.leftaudio.value;
		}
		if(properties.pinknoise){
			pinkNoiseAdd = properties.pinknoise.value;
		}
		if (properties.canvasoptions) {
			if (properties.canvasoptions.value) {
				switch (properties.canvasoptions.value) {
					case 1:
					line = true;
					bar = false;
					wave = false;
					break;
					case 2:
					bar = true;
					line = false;
					wave = false;
					reset();
					break;
					case 3:
					bar = false;
					line = false;
					wave = true;
					break;
				}
			}
		}
		if (properties.selectaudio) {
			if (properties.selectaudio.value) {
				switch (properties.selectaudio.value) {
					case 1:
					audioSize = 1024;
					if(bar){
						reset();
					}
					break;
					case 2:
					audioSize = 512;
					if(bar){
						reset();
					}
					break;
					case 3:
					audioSize = 256;
					if(bar){
						reset();
					}
					break;
					case 4:
					audioSize = 128;
					if(bar){
						reset();
					}
					break;
					case 5:
					audioSize = 64;
					if(bar){
						reset();
					}
					break;
					case 6:
					audioSize = 32;
					if(bar){
						reset();
					}
					break;
				}
			}
		}
		if(properties.backgroundimageb){
			if (properties.backgroundimageb.value) {
				var imagePath = "file:///" + properties.backgroundimageb.value;
				document.querySelector("#bottom").style.backgroundImage = "url('" + imagePath + "')";
				document.querySelector("#bottom").style.backgroundSize = imageSize;
				document.querySelector("#bottom").style.backgroundRepeat = "no-repeat";
				document.querySelector("#bottom").style.backgroundPosition = "center";
				hueRotate = 0;
				document.querySelector("#bottom").style.filter = "grayscale("+greyScaleOption+"%) hue-rotate("+hueRotate+"deg) blur("+blurOption+"px) invert("+invertColors+"%)";
			} else {
				document.querySelector("#bottom").style.backgroundImage = null;
			}
		}
		if(properties.greyscaleoption){
			greyScaleOption = properties.greyscaleoption.value;
			// if (properties.backgroundimageb.value) {
				document.querySelector("#bottom").style.filter = "grayscale("+greyScaleOption+"%) hue-rotate("+hueRotate+"deg) blur("+blurOption+"px) invert("+invertColors+"%)";
			// }
		}
		if(properties.huerotate){
			hueRotate = properties.huerotate.value;
			// if (properties.backgroundimageb.value) {
				document.querySelector("#bottom").style.filter = "grayscale("+greyScaleOption+"%) hue-rotate("+hueRotate+"deg) blur("+blurOption+"px) invert("+invertColors+"%)";
			// }
		}
		if(properties.bluroption){
			blurOption = properties.bluroption.value;
			// if (properties.backgroundimageb.value) {
				document.querySelector("#bottom").style.filter = "grayscale("+greyScaleOption+"%) hue-rotate("+hueRotate+"deg) blur("+blurOption+"px) invert("+invertColors+"%)";
			// }
		}
		if(properties.invertoption){
			invertColors = properties.invertoption.value;
			// if (properties.backgroundimageb.value) {
				document.querySelector("#bottom").style.filter = "grayscale("+greyScaleOption+"%) hue-rotate("+hueRotate+"deg) blur("+blurOption+"px) invert("+invertColors+"%)";
			// }
		}
		if(properties.backgroundimagef){
			if (properties.backgroundimagef.value) {
				var imagePath1 = "file:///" + properties.backgroundimagef.value;
				document.querySelector("#overlay").style.backgroundImage = "url('" + imagePath1 + "')";
				document.querySelector("#overlay").style.backgroundSize = imageSize;
				document.querySelector("#overlay").style.backgroundRepeat = "no-repeat";
				document.querySelector("#overlay").style.backgroundPosition = "center";
			} else {
				document.querySelector("#overlay").style.backgroundImage = null;
			}
		}
		if(properties.imageoptions){
			if(properties.imageoptions.value) {
				switch (properties.imageoptions.value){
					case 1:
					imageSize = "initial";
					break;
					case 2:
					imageSize = "cover";
					break;
					case 3:
					imageSize = "contain";
					break;
				}
			}
			document.querySelector("#bottom").style.backgroundSize = imageSize;
			document.querySelector("#overlay").style.backgroundSize = imageSize;
		}

		if(properties.backgroundcolor){
			customBgColor = properties.backgroundcolor.value.split(' ');
			customBgColor = customBgColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			backgroundColor ="rgba(" + customBgColor + "," + backgroundColorOpacity + ")";
		}
		if(properties.backgroundcoloropacity){
			backgroundColorOpacity = properties.backgroundcoloropacity.value /100;
			backgroundColor ="rgba(" + customBgColor + "," + backgroundColorOpacity + ")";
		}
		if(properties.htmlcolor){
			var colour = properties.htmlcolor.value.split(' ');
			colour = colour.map(function(c) {
				return Math.ceil(c * 255);
			});
			htmlColor ="rgb(" + colour + ")";
			document.querySelector("html").style.backgroundColor = htmlColor;
		}
		if(properties.reflection){
			reflect = properties.reflection.value;
		}
		if(properties.usermainvertpostion){
			userPosY = properties.usermainvertpostion.value;
		}
		if(properties.userreflectvertpostion){
			userPosY1 = properties.userreflectvertpostion.value;	
		}
		if(properties.usermainhorzpostion){
			userPosX = properties.usermainhorzpostion.value;
		}
		if(properties.userreflecthorzpostion){
			userPosX1 = properties.userreflecthorzpostion.value;	
		}
		if(properties.toplinecolor){
			customTopLineColor = properties.toplinecolor.value.split(' ');
			customTopLineColor = customTopLineColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			topLineColor ="rgba(" + customTopLineColor + "," + topLineOpacity + ")";
		}
		if(properties.toplineopacity){
			topLineOpacity = properties.toplineopacity.value /100;
			topLineColor ="rgba(" + customTopLineColor + "," + topLineOpacity + ")";
		}
		if(properties.bottomlinecolor){
			customBottomLineColor = properties.bottomlinecolor.value.split(' ');
			customBottomLineColor = customBottomLineColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			bottomLineColor ="rgba(" + customBottomLineColor + "," + bottomLineOpacity + ")";
		}
		if(properties.bottomlineopacity){
			bottomLineOpacity = properties.bottomlineopacity.value /100;
			bottomLineColor ="rgba(" + customBottomLineColor + "," + bottomLineOpacity + ")";
		}
		if(properties.maxheighttop){
			maxLineOneHeight = properties.maxheighttop.value;
		}
		if(properties.maxheightbot){
			maxLineTwoHeight = properties.maxheightbot.value;
		}
		if(properties.linewidth){
			linesWidth = properties.linewidth.value;
		}
		if(properties.barwidth){
			barWidth = properties.barwidth.value;
		}
		if(properties.indibarheight){
			indiBarHeight = properties.indibarheight.value;
		}
		if(properties.indibargap){
			indiBarGap = properties.indibargap.value;
		}
		if(properties.usergap){
			userGap = properties.usergap.value;
		}
		if(properties.bouncebars){
			bounceBars = properties.bouncebars.value;
		}
		if(properties.topbounceheight){
			topBounceHeight = properties.topbounceheight.value;
		}
		if(properties.bouncespeed){
			bounceSpeed = properties.bouncespeed.value/100;
		}
		if(properties.topbouncecolor){
			customBounceColor = properties.topbouncecolor.value.split(' ');
			customBounceColor = customBounceColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			topBounceColor ="rgba(" + customBounceColor + "," + topBounceOpacity + ")";
			bottomBounceColor ="rgba(" + customBounceColor + "," + bottomBounceOpacity + ")";
		}
		if(properties.topbounceopacity){
			topBounceOpacity = properties.topbounceopacity.value /100;
			topBounceColor ="rgba(" + customBounceColor + "," + topBounceOpacity + ")";
		}
		if(properties.bottombounceopacity){
			bottomBounceOpacity = properties.bottombounceopacity.value /100;
			bottomBounceColor ="rgba(" + customBounceColor + "," + bottomBounceOpacity + ")";
		}
		if(properties.backgroundvideo){
			backgroundVideo = properties.backgroundvideo.value;
			if(backgroundVideo){
				document.querySelector("#bgvid").setAttribute('src', videoSource);
				document.querySelector("#bgvid").play();
			}else{
				document.querySelector("#bgvid").setAttribute('src', "");
				document.querySelector("#bgvid").play();
			}
		}
		if(properties.backgroundvideonumber){
			if(properties.backgroundvideonumber.value) {
				switch (properties.backgroundvideonumber.value){
					case 1:
					videoSource = "1.webm";
					break;
					case 2:
					videoSource = "2.webm";
					break;
					case 3:
					videoSource = "3.webm";
					break;
					case 4:
					videoSource = "4.webm";
					break;
					case 5:
					videoSource = "5.webm";
					break;
				}
				if(backgroundVideo){
					document.querySelector("#bgvid").setAttribute('src', videoSource);
					document.querySelector("#bgvid").play();	
				}
			}
		}
	}
}


function wallpaperAudioListener(audioArray) {
	var i, j , k, avg;
	var dummy = audioArray.length;
	var pinkNoise = [1.0548608488838,0.76054078751554,0.61124787706261,0.52188737442096,0.47582581340335,0.442985940855,0.39506604448116,0.38179901474466,0.3791498265819,0.35862620105656,0.34117808276167,0.31407858754586,0.32956896818321,0.32649587026332,0.32553041354753,0.33023063745582,0.33723850113961,0.32845876137105,0.32345077632073,0.33371703524763,0.33559351013352,0.32755038614695,0.33723270172874,0.33152196761531,0.34253960054833,0.33996676648346,0.35007384375669,0.34140414964718,0.35276302794926,0.45428847576802,0.57092841582994,0.56249676873287,0.64297260455787,0.64261475342015,0.72339198663831,0.73733259583513,0.83130048006773,0.86110594108701,0.93924222866694,0.97183918188016,1.0510377466679,1.1248085597157,1.1805661781629,1.2060520313183,1.2870901748538,1.3467060487469,1.419748566548,1.4930113442739,1.5233661865195,1.6291546697418,1.6687760437528,1.7517802578211,1.7828743148843,1.8640559593836,1.9024009352922,1.9445452898741,2.0042892436186,2.0429756359259,2.0702872782946,2.0901099761327,2.0997672257821,2.1029779444138,2.0654643664757,2.0357843961318];
	for(i = 0; i < 64; i++){
		if(pinkNoiseAdd){
			smoothSample[i] = audioArray[i] / pinkNoise[i];	
		}else{
			smoothSample[i] = audioArray[i] / 1;
		}
		if(smoothSample[i] >1){
			smoothSample[i] = 1;
		}
		smoothSample[i+64] = smoothSample[i];
	}


	if(audioSize > 128){
		for(dummy = audioArray.length/2; dummy <audioSize/2; dummy = dummy * 2){
			k = 0;
			for(i=0; i< dummy * 2; i++){
				if(i%2 == 0){
					if(i>0){
						if(normalise){
							smoothSampleA[i] =  ((smoothSample[k] + smoothSample[k+1]) / 2 )* Math.random();
						}else{
							smoothSampleA[i] =  ((smoothSample[k] + smoothSample[k+1]) / 2 ) * Math.random();
						}
						k++;
					}else{
						if(normalise){
							smoothSampleA[i] = (smoothSample[k] / 2)* Math.random();
							// smoothSampleA[i] = 0;
						}else{
							smoothSampleA[i] = (smoothSample[k] / 2) * Math.random();
							// smoothSampleA[i] = 0;
						}
					}
				}else{
					smoothSampleA[i] =  smoothSample[k];
				}
			}
			for(i=0; i< dummy * 2; i++){
				smoothSample[i] = smoothSampleA[i];
			}
		}
		if(normalise){
			for(i = 0; i < audioSize /2; i++){
				if(i == 0){
					smoothA[i] = 0;
				}else{
					smoothA[i] = smoothSample[i-1];
				}
				if( i == audioSize/2-1){
					smoothC[i] = 0;
				}else{
					smoothC[i] = smoothSample[i+1];
				}
				smoothB[i] = smoothSample[i];
				smooth[i] = (smoothA[i] + 2 * smoothB[i] + smoothC[i]) /4;
			}	
		}else{
			for(i = 0; i < audioSize /2; i++){
				smooth[i] = smoothSample[i];
			}
		}
	}else if(audioSize ===128){
		if(normalise){
			for(i = 0; i < 64; i++){
				if(i == 0){
					smoothA[i] = 0;
				}else{
					smoothA[i] = smoothSample[i-1];
				}
				if(i == 63){
					smoothC[i] = 0;
				}else{
					smoothC[i] = smoothSample[i+1];
				}
				smoothB[i] = smoothSample[i];
				smooth[i] = (smoothA[i] + 2 * smoothB[i] + smoothC[i]) /4;
			}	
		}else{
			for(i = 0; i < 64; i++){
				smooth[i] = smoothSample[i];
			}
		}
	}else{
		for(dummy = audioArray.length / 2; dummy > audioSize/2; dummy = dummy/2){
			for(i = 0; i <dummy/2; i++){
				smooth[i] = (smooth[i] + smooth[2*dummy-i-1]) / 2;
			}
			if(normalise){
				for(i = 0; i < audioSize/2; i++){
					if(i == 0){
						smoothA[i] = 0;
					}else{
						smoothA[i] = smoothSample[i-1];
					}
					if( i == audioSize/2 -1){
						smoothC[i] = 0;
					}else{
						smoothC[i] = smoothSample[i+1];
					}
					smoothB[i] = smoothSample[i];
					smooth[i] = (smoothA[i] + 2 * smoothB[i] + smoothC[i]) /4;
				}	
			}else{
				for(i = 0; i < audioSize/2; i++){
					smooth[i] = smoothSample[i];
				}
			}
		}
	}
	for(i = 0; i < audioSize/2; i++){
		audioSampleA[i] = smooth[i] * (normaliseReposiveness) + audioSampleA[i] * (1 - normaliseReposiveness);
		// audioSampleA[audioSize-i-1] = audioSampleA[i];
		if(reverseLeft){
			audioSample[audioSize/2 -i -1] = audioSampleA[i];
		}else{
			audioSample[i] = audioSampleA[i];
		}
		if(reverseRight){
			audioSample[audioSize/2+i] = audioSampleA[i];
		}else{
			audioSample[audioSize-i-1] = audioSampleA[i];
		}
	}
}

function gradient(a, b) {
	return (b.y-a.y)/(b.x-a.x);
}

function bzCurve(points, f, t) {
	//f = 0, will be straight line
	//t suppose to be 1, but changing the value can control the smoothness too
	if (typeof(f) == 'undefined') f = 0.3;
	if (typeof(t) == 'undefined') t = 0.6;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);

	var m = 0;
	var dx1 = 0;
	var dy1 = 0;

	var preP = points[0];
	for (var i = 1; i < points.length; i++) {
		var curP = points[i];
		nexP = points[i + 1];
		if (nexP) {
			m = gradient(preP, nexP);
			dx2 = (nexP.x - curP.x) * -f;
			dy2 = dx2 * m * t;
		} else {
			dx2 = 0;
			dy2 = 0;
		}
		ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
		dx1 = dx2;
		dy1 = dy2;
		preP = curP;
	}
	// ctx.stroke();
	// ctx.fillStyle = topLineColor;
	ctx.fill();
	ctx.closePath();
}

function run(){

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// ctx.shadowBlur=10;
	if(line){
		gap = Math.floor(canvas.width/audioSize)- userGap;
		if(gap < 0){
			gap = 0;
		}
		posX = userPosX + (canvas.width - gap * (audioSize-1)) / 2.0;
		posX1 = userPosX1 + (canvas.width - gap * (audioSize-1)) / 2.0;

		iniPosY1 = canvas.height/2 + userPosY1;
		iniPosY = canvas.height/2 + userPosY;
		for(var i = 0; i< audioSize; i++){
			ctx.beginPath();
			ctx.strokeStyle = topLineColor;
			ctx.lineWidth = linesWidth;
			ctx.moveTo(posX, iniPosY);
			if(i < audioSize/2){
				posY = iniPosY - audioSample[i] * maxLineOneHeight;
				ctx.lineTo(posX, posY);
				ctx.stroke();
			}else{
				if(!(mono)){
					posY = iniPosY - audioSample[i] * maxLineOneHeight;
					ctx.lineTo(posX, posY);
					ctx.stroke();
				}
			}
			
			if(reflect){
				ctx.beginPath();
				ctx.strokeStyle = bottomLineColor;
				ctx.lineWidth = linesWidth;
				ctx.moveTo(posX1, iniPosY1);
				if(i < audioSize/2){
					posY1 = iniPosY1 + audioSample[i] * maxLineTwoHeight;
					ctx.lineTo(posX1, posY1);
					ctx.stroke();
				}else{
					if(!(mono)){
						posY1 = iniPosY1 + audioSample[i] * maxLineTwoHeight;
						ctx.lineTo(posX1, posY1);
						ctx.stroke();
					}
				}
			}
			posX += gap;
			posX1 += gap;
		}
	}
	if(bar){
		gap = Math.floor(canvas.width/audioSize)- userGap;
		if(gap < 0){
			gap = 0;
		}
		posX = userPosX + (canvas.width - gap * (audioSize-1)) / 2.0;
		posX1 = userPosX1 + (canvas.width - gap * (audioSize-1)) / 2.0;

		iniPosY1 = canvas.height/2 + userPosY1 + 1;
		iniPosY = canvas.height/2 + userPosY;
		for(var i = 0; i< audioSize; i++){
			posY = iniPosY - audioSample[i] * maxLineOneHeight;
			posY1 = iniPosY1 + audioSample[i] * maxLineTwoHeight;
			for(var j = iniPosY; j > posY; j = j- indiBarHeight - indiBarGap){
				if(i < audioSize/2){
					if(j- indiBarHeight - indiBarGap < posY){
						if(bounceBars){
							topBounce = j;
							ctx.beginPath();
							ctx.fillStyle = topBounceColor;
							topBounceY[i] += bounceSpeed;
							if(topBounceY[i]>topBounce){
								topBounceY[i] = topBounce;
							}
							ctx.rect(posX, topBounceY[i], barWidth, -topBounceHeight);
							ctx.fill();
						}else{
							ctx.beginPath();
							ctx.fillStyle = topLineColor;
							ctx.rect(posX, j, barWidth, -indiBarHeight);
							ctx.fill();
							topBounce = j;
						}
					}else{
						ctx.beginPath();
						ctx.fillStyle = topLineColor;
						ctx.rect(posX, j, barWidth, -indiBarHeight);
						ctx.fill();
						topBounce = j;
					}
				}else{
					if(!(mono)){
						if(j- indiBarHeight - indiBarGap < posY){
							if(bounceBars){
								topBounce = j;
								ctx.beginPath();
								ctx.fillStyle = topBounceColor;
								topBounceY[i] += bounceSpeed;
								if(topBounceY[i]>topBounce){
									topBounceY[i] = topBounce;
								}
								ctx.rect(posX, topBounceY[i], barWidth, -topBounceHeight);
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.fillStyle = topLineColor;
								ctx.rect(posX, j, barWidth, -indiBarHeight);
								ctx.fill();
								topBounce = j;
							}
						}else{
							ctx.beginPath();
							ctx.fillStyle = topLineColor;
							ctx.rect(posX, j, barWidth, -indiBarHeight);
							ctx.fill();
							topBounce = j;
						}
					}
				}
			}
			if(reflect){
				for(var j = iniPosY1; j < posY1; j = j+ indiBarHeight + indiBarGap){
					if(i < audioSize/2){
						if(j+ indiBarHeight + indiBarGap > posY1){
							if(bounceBars){
								bottomBounce = j;
								ctx.beginPath();
								ctx.fillStyle = bottomBounceColor;
								bottomBounceY[i] -= bounceSpeed;
								if(bottomBounceY[i]<bottomBounce){
									bottomBounceY[i] = bottomBounce;
								}
								ctx.rect(posX1, bottomBounceY[i], barWidth, topBounceHeight);
								ctx.fill();
							}else{
								ctx.beginPath();
								ctx.fillStyle = bottomLineColor;
								ctx.rect(posX1, j, barWidth, indiBarHeight);
								ctx.fill();
								bottomBounce = j;
							}
						}else{
							ctx.beginPath();
							ctx.fillStyle = bottomLineColor;
							ctx.rect(posX1, j, barWidth, indiBarHeight);
							ctx.fill();
							bottomBounce = j;
						}
					}else{
						if(!(mono)){
							if(j+ indiBarHeight + indiBarGap > posY1){
								if(bounceBars){
									bottomBounce = j;
									ctx.beginPath();
									ctx.fillStyle = bottomBounceColor;
									bottomBounceY[i] -= bounceSpeed;
									if(bottomBounceY[i]<bottomBounce){
										bottomBounceY[i] = bottomBounce;
									}
									ctx.rect(posX1, bottomBounceY[i], barWidth, topBounceHeight);
									ctx.fill();
								}else{
									ctx.beginPath();
									ctx.fillStyle = bottomLineColor;
									ctx.rect(posX1, j, barWidth, indiBarHeight);
									ctx.fill();
									bottomBounce = j;
								}
							}else{
								ctx.beginPath();
								ctx.fillStyle = bottomLineColor;
								ctx.rect(posX1, j, barWidth, indiBarHeight);
								ctx.fill();
								bottomBounce = j;
							}
						}
					}		
				}
			}
			
			posX += gap;
			posX1 += gap;
		}
	}
	if(wave){

		iniPosY = canvas.height/2 + userPosY;
		iniPosY1 = canvas.height/2 + userPosY1;
		// Generate random data
		var lines = [];
		var t = Math.floor(canvas.width/audioSize)- userGap; //to control width of X
		if(t< 0){
			t =0;
		}
		var X = userPosX + (canvas.width - t * (audioSize + 1)) / 2.0;
		var X1 = userPosX1 + (canvas.width - t * (audioSize + 1)) / 2.0;
		Y = iniPosY;
		Y1 = iniPosY1;
		for (var i = 0; i < audioSize + 2; i++ ){
			if(i == audioSize + 1){
				iniPosY = canvas.height/2 + userPosY;
				Y = iniPosY;
				p = { x: X, y: Y };
				lines.push(p);
			}else{
				p = { x: X, y: Y };
				lines.push(p);
				Y = iniPosY - audioSample[i] * maxLineOneHeight;
				X = X + t;
			}
		}
		//draw smooth line
		ctx.lineWidth = 2;
		ctx.fillStyle = topLineColor;
		ctx.strokeStyle = topLineColor;
		bzCurve(lines, 0.3, 1);
		ctx.closePath();
		lines = [];
		if(reflect){
			for (var i = 0; i < audioSize + 2; i++ ){
				if(i == audioSize + 1){
					iniPosY1 = canvas.height/2 + userPosY1;
					Y1 = iniPosY1;
					p = { x: X1, y: Y1 };
					lines.push(p);
				}else{
					p = { x: X1, y: Y1 };
					lines.push(p);
					Y1 = iniPosY1 + audioSample[i] * maxLineTwoHeight;
					X1 = X1 + t;
				}
			}
			ctx.lineWidth = 2;
			ctx.fillStyle = bottomLineColor;
			ctx.strokeStyle = bottomLineColor;
			bzCurve(lines, 0.3, 1);
			ctx.closePath();
		}
	}
	window.requestAnimationFrame(run);
}

window.onload = function(){
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;

	window.wallpaperRegisterAudioListener(wallpaperAudioListener);
	window.requestAnimationFrame(run);
}

window.onresize = function(){
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
}

