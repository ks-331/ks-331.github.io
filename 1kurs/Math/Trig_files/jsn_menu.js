/**
* @author    JoomlaShine.com http://www.joomlashine.com
* @copyright Copyright (C) 2008 - 2009 JoomlaShine.com. All rights reserved.
* @license   Copyrighted Commercial Software
* This file may not be redistributed in whole or significant part.
*/

if(typeof(MooTools) != 'undefined')
{
	var subnav = new Array();
	Element.extend(
	{
		jsnHide: function(delay)
		{
			this.status = 'jsnHide';
			clearTimeout(this.timeout);
			if (delay != undefined && delay > 0 && !this.animating) {
				this.timeout = setTimeout(this.jsnAnim.bind(this), delay);
			} else {
				this.jsnAnim();
			}
		},

		jsnShow: function(delay)
		{
			this.status = 'jsnShow';
			clearTimeout (this.timeout);
			if (delay != undefined && delay > 0 && !this.animating) {
				this.timeout = setTimeout(this.jsnAnim.bind(this), delay);
			} else {
				this.jsnAnim();
			}
		},

		jsnSetActive: function () {
			this.className+=' sfhover';
		},

		jsnSetDeactive: function () {
			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");
		},

		jsnAnim: function() {
			if ((this.status == 'jsnHide' && this.style.left != 'auto') || (this.status == 'jsnShow' && this.style.left == 'auto' && !this.hidding)) return;
			this.setStyle('overflow', 'hidden');
			this.animating = true;

			if (this.status == 'jsnShow') {
				this.hidding = 0;
				this.jsnHideAll();

				this.setStyle('left', 'auto');
				this.fxObject.stop();
				if (this.parent._id || this.orientation == 'v') {
					this.fxObject.start(0,this.mw);
				} else {
					this.fxObject.start(0,this.mh);
				}
			} else {
				this.hidding = 1;
				this.fxObject.stop();
				if (this.parent._id || this.orientation == 'v') {
					this.fxObject.start(this.offsetWidth, 0);
				} else {
					this.fxObject.start(this.offsetHeight, 0);
				}
			}
		},

		jsnInit: function(options) {
			duration = (options["duration"] == undefined)?250:options["duration"];
			this.orientation = (options["orientation"] == undefined)?'h':options["orientation"];

			this.mw = this.clientWidth;
			this.mh = this.clientHeight;
			if (this.parent._id || this.orientation == 'v') {
				this.fxObject = new Fx.Style(this, 'width', {duration: duration});
			} else {
				this.fxObject = new Fx.Style(this, 'height', {duration: duration});
			}
			this.fxObject.set(0);
			this.setStyle('left', '-999em');
			animComp = function(){
				if (this.status == 'jsnHide')
				{
					this.setStyle('left', '-999em');
					this.hidding = 0;
				}
				this.animating = false;
				this.setStyle('overflow', '');
			}
			this.fxObject.addEvent ('onComplete', animComp.bind(this));
		},

		jsnHideAll: function() {
			for (var i=0;i<subnav.length; i++) {
				if (!this.jsnIsChild(subnav[i])) {
					subnav[i].jsnHide(0);
				}
			}
		},

		jsnIsChild: function(_obj) {
			obj = this;
			while (obj.parent) {
				if (obj._id == _obj._id) {
					return true;
				}
				obj = obj.parent;
			}
			return false;
		}
	});

	var MooMenu = new Class({
		initialize: function(element, options)
		{
			element.delay = (options["delay"] == undefined)?1000:options["delay"];

			$A($(element).childNodes).each(function(el)
			{
				if (el.nodeName.toLowerCase() == 'li') {
					$A($(el).childNodes).each(function(el2)
					{
						if(el2.nodeName.toLowerCase() == 'ul')
						{
							$(el2)._id = subnav.length+1;
							$(el2).parent = $(element);
							subnav.push ($(el2));
							el2.jsnInit(options);
							el.addEvent('mouseenter', function()
							{
								el.jsnSetActive();
								el2.jsnShow(0);
								return false;
							});

							el.addEvent('mouseleave', function()
							{
								el.jsnSetDeactive();
								el2.jsnHide(element.delay);
							});
							new MooMenu(el2, options);
							el.hasSub = 1;
						}
					});
					if (!el.hasSub) {
						el.addEvent('mouseenter', function()
						{
							el.jsnSetActive();
							return false;
						});

						el.addEvent('mouseleave', function()
						{
							el.jsnSetDeactive();
						});
					}
				}
			});
			return this;
		}
	});
}