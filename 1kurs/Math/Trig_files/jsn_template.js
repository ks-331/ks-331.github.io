/**
* @author    JoomlaShine.com http://www.joomlashine.com
* @copyright Copyright (C) 2008 - 2009 JoomlaShine.com. All rights reserved.
* @license   Copyrighted Commercial Software
* This file may not be redistributed in whole or significant part.
*/

/* Menu */

function jsnSetMenuFX(menuId, menuFX, options)
{
	switch(menuFX)
	{
		case 0:
			JSNUtils.sfHover(menuId);
			break;

		case 1:
			if (typeof(MooTools) != 'undefined') {
				new MooMenu($(menuId), options)
			} else {
				jsnSetMenuFX(menuId, 0, options);
			}
			break;
	}
}

function jsnSetMainmenuFX(menuId, menuFX, options)
{
	if (typeof(MooTools) != 'undefined') {
		window.addEvent('domready',function() {
			jsnSetMenuFX(menuId, menuFX, options);
		});
	} else {
		JSNUtils.addEvent(window, 'load', function() {
			jsnSetMenuFX(menuId, menuFX, options);
		});
	}
}

function jsnInitSidemenu(menuClass, menuFX, options)
{
	var sidemenus, sidemenu, menuId;

	// Set ids for all side menus base on class
	sidemenus = JSNUtils.getElementsByClass(document, "UL", menuClass);
	if (sidemenus == undefined) return;

	for(var i=0;i<sidemenus.length;i++){
		menuId = "base-sidemenu-" + (i+1);
		sidemenu = sidemenus[i];
		sidemenu.id = menuId;

		// Set fx
		jsnSetMenuFX(menuId, menuFX, options);
	}
}

function jsnInitTreemenu(menuClass)
{
	var treemenus, treemenu, menuId;

	// Set ids for all side menus base on class
	treemenus = JSNUtils.getElementsByClass(document, "UL", menuClass);
	if (treemenus == undefined) return;

	for(var i=0;i<treemenus.length;i++){
		menuId = "base-treemenu-" + (i+1);
		treemenu = treemenus[i];
		treemenu.id = menuId;

		// Set fx
		jsnSetMenuFX(menuId, 0, {});
	}
}

function jsnSetSidemenuFX(menuClass, menuFX, options)
{
	if (typeof(MooTools) != 'undefined') {
		window.addEvent('domready',function() {
			jsnInitSidemenu(menuClass, menuFX, options);
		});
	} else {
		JSNUtils.addEvent(window, 'load', function() {
			jsnInitSidemenu(menuClass, menuFX, options);
		});
	}
}

function jsnSetSidemenuLayout(menuClass)
{
	var sidemenus, sidemenu, smChildren, smChild, smSubmenu;
	sidemenus = JSNUtils.getElementsByClass(document, "UL", menuClass);
	if (sidemenus != undefined) {
		for(var i=0;i<sidemenus.length;i++){
			sidemenu = sidemenus[i];
			smChildren = JSNUtils.getChildren(sidemenu, "LI");
			if (smChildren != undefined) {
				for(var j=0;j<smChildren.length;j++){
					smChild = smChildren[j];
					smSubmenu = JSNUtils.getFirstChild(smChild, "UL");
					if (smSubmenu != null) {
						if(enableRTL == true) { smSubmenu.style.marginRight = smChild.offsetWidth+"px"; }
						else { smSubmenu.style.marginLeft = smChild.offsetWidth+"px"; }
					}
				}
			}
		}
	}
}

function jsnSetSitetoolsLayout(sitetoolsId, neighbourId)
{
	var sitetoolsContainer, parentItem, sitetoolsPanel, neighbour;
	sitetoolsContainer = document.getElementById(sitetoolsId);
	if (sitetoolsContainer != undefined) {
		parentItem = JSNUtils.getFirstChild(sitetoolsContainer, "LI");
		sitetoolsPanel = JSNUtils.getFirstChild(parentItem, "UL");
		if (enableRTL == true) {
			sitetoolsPanel.style.marginRight = -1*(sitetoolsPanel.offsetWidth - parentItem.offsetWidth) + "px";
		} else {
			sitetoolsPanel.style.marginLeft = -1*(sitetoolsPanel.offsetWidth - parentItem.offsetWidth) + "px";
		}

		neighbour = document.getElementById(neighbourId);
		if(neighbour != undefined) {
			neighbour.style.right = (parentItem.offsetWidth + 10) + "px";
		}
	}
}

function jsnSetSmoothScroll()
{
	// Setup smooth go to top link
	if (typeof(MooTools) != 'undefined') {
		window.addEvent('domready',function() {
			new SmoothScroll({ duration:360 }, window);
		});
	}
}

function jsnInitTemplate()
{
	if (enableGotopLink) {
		JSNUtils.setLinkNavPrefix('jsn-gotoplink', '#top');
	}
	
	JSNUtils.createGridLayout("DIV", "grid-layout", "grid-col", "grid-lastcol");

	JSNUtils.setInnerLayout(["jsn-content_inner3", "jsn-leftsidecontent", "jsn-rightsidecontent", "jsn-pinnerleft", "jsn-pinnerright"]);
	
	JSNUtils.createExtList("list-number-", "strong", "bulletcount", true);
	JSNUtils.createExtList("list-icon", "span", "", false);
	
	jsnSetSidemenuLayout("menu-sidemenu");
	jsnSetSitetoolsLayout("jsn-sitetools-menu", "jsn-ptoolbar");
	jsnInitTreemenu("menu-treemenu");

	JSNUtils.setStickPosition("jsn-pstickleft", lspAlignment);
	JSNUtils.setStickPosition("jsn-pstickright", rspAlignment);
}

function jsnInitTemplateNow()
{
	// Setup main menu fx
	jsnSetMainmenuFX("base-mainmenu", (enableMMFX?1:0), { duration:250, delay:500, orientation: 'h' });
	jsnSetMainmenuFX("jsn-sitetools-menu", (enableMMFX?1:0), { duration:250, delay:500, orientation: 'h' });

	// Setup side menu fx
	jsnSetSidemenuFX("menu-sidemenu", (enableSMFX?1:0), { duration:250, delay:500, orientation: 'v' });

	if (enableGotopLink) {
		jsnSetSmoothScroll();
	}
}

// Call right away
jsnInitTemplateNow();

// Call on document load
JSNUtils.addEvent(window, 'load', jsnInitTemplate);