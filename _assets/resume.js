"use strict";
jQuery(function($) {
	var Paint,
		Stage = $("#Stage"),
		Window = $(window),
		BeforeFold = $("#BeforeFold"),
		Lines = $("#Lines"),
		Noise = $("#Noise"),
		Vignette = $("#Vignette"),
		LinesAnim = $("#LinesAnim > div"),
		Body = $("body");
		
	
	var Input = "mouse";
	
	ConfigF();
	PreloadF();
	LinesF();
	PaintF();
	
	function ConfigF() {
		if (!SiteConfig.Noise) { Noise.remove(); }
		if (!SiteConfig.Vignette) { Vignette.remove(); }
		Body.append('<style type="text/css">body{background:' + SiteConfig.Background + ';color:' + SiteConfig.ContentColor + ';}h1,h2,h3,a{color:' + SiteConfig.ContentColor + ';}.Lines > div,.LinesAnim > div,.BFHeader::before,.BFScrollMeDown::before,.BFSocials::before,.BFContact::before,.Section::before,.Element-Skills li::after {background:' + SiteConfig.ContentColor + '!important;}</style>');
		
	}
	
	function RevealF() {
		function Reveal() {
			var elements = document.querySelectorAll(".Section");
			var length = elements.length;
            
			for(var count = 0; count < length; count++) {
				var offsetParentTop = 0;
				var temp = elements[count];
				do {
					if(!isNaN(temp.offsetTop)) {
						offsetParentTop += temp.offsetTop;
					}
				} while(temp = temp.offsetParent)
				var pageYOffset = window.pageYOffset;
				var viewportHeight = window.innerHeight;       
				if(offsetParentTop > pageYOffset && offsetParentTop < pageYOffset + viewportHeight) {
					$(elements[count]).addClass("Active");
				}
            }
        }
        
        window.addEventListener("resize", Reveal, false);
        window.addEventListener("scroll", Reveal, false);
		
		setTimeout(Reveal, 2200);
	}
	
	function PreloadF() {
		$(window).load(function() {
			Lines.addClass("Active");
			setTimeout(function() { 
				BeforeFold.addClass("Loaded"); 
				Body.scrollTop(0);
				RevealF();
			}, 1600);
		});
	}
	
	function LinesF() {
		var LastColumn = 0;
		
		$(window).on("mousemove", function(e) {
			if (Input == "mouse") {
				var MoveColumn = Math.floor(e.pageX / Body.width() * 10);
				var MoveLine = 0;
				if (LastColumn != MoveColumn) { 
					if (MoveColumn > LastColumn) { MoveLine = MoveColumn - 1; }
					if (MoveColumn < LastColumn) { MoveLine = MoveColumn; }
					LinesAnim.eq(MoveLine).toggleClass("Anim");
					LastColumn = MoveColumn;
				}
			}
		});
		
		$(window).on("touchstart", function(e) {
			if (Input == "touch") {
				var MoveColumn = Math.floor(e.originalEvent.changedTouches[0].screenX / Body.width() * 5);
				LinesAnim.eq(MoveColumn * 2).toggleClass("Anim");
			}
		});
	}
	
	
	function PaintF() {
		if (!SiteConfig.Colors) { return false; }
		Stage.prepend('<canvas class="Paint" id="Paint"></canvas>');
		Paint = $("#Paint");
		
		var Canvas = Paint[0];
		var Ctx = Canvas.getContext('2d');
		if (Input == "mouse") {
			var Width = Canvas.width = Stage.width()
			var Height = Canvas.height = Stage.height();
		} else {
			var Width = Canvas.width = Window.width()
			var Height = Canvas.height = Window.height();			
		}
		var CurrentColor = 0;
		var MouseMoving = false;
		var ChangeTimeout;
				
		Body.addClass("mouse");
		
		Body.on('touchstart', detectTouch);
		
		function detectTouch() {
			Body.removeClass("mouse");
			Body.addClass("touch");
			Input = "touch";
			Body.off('touchstart', detectTouch);
			
			
			Width = Canvas.width = Window.width();
			Height = Canvas.height = Window.height();
			Ctx.beginPath();
			Ctx.rect(0, 0, Width, Height);
			Ctx.fillStyle = SiteConfig.Background;
			Ctx.fill();
		}
		
		Ctx.beginPath();
		Ctx.rect(0, 0, Width, Height);
		Ctx.fillStyle = SiteConfig.Background;
		Ctx.fill();
		
		$(window).on("mousemove", function(e) {		
			if (Input == "mouse") {
				Ctx.beginPath();
				Ctx.arc(e.pageX,e.pageY, Width / 5, 0, 2 * Math.PI, false);
				Ctx.fillStyle = SiteConfig.Colors[CurrentColor];
				Ctx.fill();
				if (!MouseMoving) {
					CurrentColor++;
					if (CurrentColor >= SiteConfig.Colors.length) { CurrentColor = 0; }
				}
					
				MouseMoving = true;
				clearTimeout(ChangeTimeout);
				ChangeTimeout = setTimeout(function() {
					MouseMoving = false;
				}, 200);
			}
		});
		
		$(window).on("touchmove", function(e) {	
			if (Input == "touch") { 
				Ctx.beginPath();
				if (Body.width() > 640) {
					Ctx.arc(e.originalEvent.changedTouches[0].pageX,e.originalEvent.touches[0].screenY, Width / 5, 0, 2 * Math.PI, false);
				} else {
					Ctx.arc(e.originalEvent.changedTouches[0].pageX,e.originalEvent.touches[0].screenY, Width / 2, 0, 2 * Math.PI, false);
				}
				Ctx.fillStyle = SiteConfig.Colors[CurrentColor];
				Ctx.fill();
				if (!MouseMoving) {
					CurrentColor++;
					if (CurrentColor >= SiteConfig.Colors.length) { CurrentColor = 0; }
				}
					
				MouseMoving = true;
				clearTimeout(ChangeTimeout);
				ChangeTimeout = setTimeout(function() {
					MouseMoving = false;
				}, 300);
			}	
		});
		
		
		$(window).on('resize', function() {
			if (Input == "mouse") {
				Width = Canvas.width = Stage.width();
				Height = Canvas.height = Stage.height();
			} else {
				Width = Canvas.width = Window.width();
				Height = Canvas.height = Window.height();
			}
			Ctx.beginPath();
			Ctx.rect(0, 0, Width, Height);
			Ctx.fillStyle = SiteConfig.Background;
			Ctx.fill();
		});
	}

});