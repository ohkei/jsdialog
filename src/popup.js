﻿/*
 *popup
 * */

    //弹出框对象
    var Popup = new Class();
    Popup.prototype =
    { 
        iframeIdName: 'ifr_popup', 
    
        initialize: function(config) {
        
        //设置option
        this.config = Object.extend({
            contentType: 1,
            isHaveTitle: true,
            scrollType: 'no',
            isBackgroundCanClick: false,
            isSupportDraging: true,
            isShowShadow: true,
            isReloadOnClose: true,
            width: 400, 
		    height: 300
		}, config || {});
        
        this.info = {
		shadowWidth: 4, 
		title: "", 
		contentUrl: "", 
		contentHtml: "", 
		callBack: null, 
		parameter: null, 
		confirmCon: "", 
		alertCon: "", 
		someHiddenTag: "select,object,embed", 
		someDisabledBtn: "", 
		someHiddenEle: "", 
		overlay: 0, 
		coverOpacity: 40
	};
		
		//设置对话框样式
        this.color = {
		cColor: "#EEEEEE", 
		bColor: "#FFFFFF", 
		tColor: "#709CD2", 
		wColor: "#FFFFFF"
	};
		
        this.dropClass = null;
        this.someToHidden = [];
        this.someToDisabled = [];
        if (!this.config.isHaveTitle) this.config.isSupportDraging = false;
        this.iniBuild()
	}, 
	
	setContent: function(arrt, val) {
	    if (val != '') {
	        switch (arrt) {
	            case 'width': this.config.width = val;
	                break;
	            case 'height': this.config.height = val;
	                break;
	            case 'title': this.info.title = val;
	                break;
	            case 'contentUrl': this.info.contentUrl = val;
	                break;
	            case 'contentHtml': this.info.contentHtml = val;
	                break;
	            case 'callBack': this.info.callBack = val;
	                break;
	            case 'parameter': this.info.parameter = val;
	                break;
	            case 'confirmCon': this.info.confirmCon = val;
	                break;
	            case 'alertCon': this.info.alertCon = val;
	                break;
	            case 'someHiddenTag': this.info.someHiddenTag = val;
	                break;
	            case 'someHiddenEle': this.info.someHiddenEle = val;
	                break;
	            case 'someDisabledBtn': this.info.someDisabledBtn = val;
	                break;
	            case 'overlay': this.info.overlay = val
	        }
	    }
	}, 
	
	iniBuild: function() {
	    G('dialogCase') ? G('dialogCase').parentNode.removeChild(G('dialogCase')) : function() {
	    };
	    var oDiv = doc.createElement('span');
	    oDiv.id = 'dialogCase';
	    doc.body.appendChild(oDiv)
	}, 
	
	build: function() {
	    var baseZIndex = 10001 + this.info.overlay * 10;
	    var showZIndex = baseZIndex + 2;
	    this.iframeIdName = 'ifr_popup' + this.info.overlay;
	    var path = "http://public.txooo.com/txjs/ui/";
	    var close = '<input type="image" id="dialogBoxClose" src="' + path + 'dialogclose.gif" border="0" width="16" height="16" align="absmiddle" title="关闭"/>';
	    var cB = 'filter: alpha(opacity=' + this.info.coverOpacity + ');opacity:' + this.info.coverOpacity / 100 + ';';
	    var cover = '<div id="dialogBoxBG" style="position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:' + baseZIndex + ';' + cB + 'background-color:' + this.color.cColor + ';display:none;"></div>';
	    var mainBox = '<div id="dialogBox" style="border:1px solid ' + this.color.tColor + ';display:none;z-index:' + showZIndex + ';position:relative;width:' + this.config.width + 'px;"><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + this.color.bColor + '">';
	    if (this.config.isHaveTitle) {
	        mainBox += '<tr height="24" bgcolor="' + this.color.tColor + '"><td><table style="-moz-user-select:none;height:24px;" width="100%" border="0" cellpadding="0" cellspacing="0" ><tr>' + '<td width="6" height="24"></td><td id="dialogBoxTitle" style="color:' + this.color.wColor + ';font-size:14px;font-weight:bold;">' + this.info.title + '&nbsp;</td>' + '<td id="dialogClose" width="20" align="right" valign="middle">' + close + '</td><td width="6"></td></tr></table></td></tr>'
	    }
	    else {
	        mainBox += '<tr height="10"><td align="right">' + close + '</td></tr>'
	    };
	    mainBox += '<tr style="height:' + this.config.height + 'px" valign="top"><td id="dialogBody" style="position:relative;"></td></tr></table></div>' + '<div id="dialogBoxShadow" style="display:none;z-index:' + baseZIndex + ';"></div>';
	    
	    if (!this.config.isBackgroundCanClick) {
	        //设置遮盖背景
	        G('dialogCase').innerHTML = cover + mainBox;

	        var Lay = G('dialogBoxBG');

	        if (isIE6) {
	            var _size = function() {
	                Lay.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
	                Lay.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
	            };

		    _size();
		    
		    //ie6下调整遮盖层
	            window.attachEvent("onresize", _size); 
	        }
	        else {
	            Lay.style.position = "fixed";
	            Lay.style.width = Lay.style.height = "100%";
	        }
	    }
	    else G('dialogCase').innerHTML = mainBox;
	    
	    Event.observe(G('dialogBoxClose'), "click", this.reset.bindAsEventListener(this), false);
	    
	    if (this.config.isSupportDraging) {
	        dropClass = new Dragdrop(this.config.width, this.config.height, this.info.shadowWidth, this.config.isSupportDraging, this.config.contentType);
	        G("dialogBoxTitle").style.cursor = "move"
	    };
	    
	    this.lastBuild()
	}, 
	
	lastBuild: function() {
	    var confirm = '<div style="width:100%;height:100%;text-align:center;"><div style="margin:20px 20px 0 20px;font-size:14px;line-height:16px;color:#000000;">' + this.info.confirmCon + '</div><div style="margin:20px;"><input id="dialogOk" type="button" value=" 确定 "/>&nbsp;<input id="dialogCancel" type="button" value=" 取消 "/></div></div>';
	    var alert = '<div style="width:100%;height:100%;text-align:center;"><div style="margin:20px 20px 0 20px;font-size:14px;line-height:16px;color:#000000;">' + this.info.alertCon + '</div><div style="margin:20px;"><input id="dialogYES" type="button" value=" 确定 "/></div></div>';
	    var baseZIndex = 10001 + this.info.overlay * 10;
	    var coverIfZIndex = baseZIndex + 4;
	    
	    
	    if (this.config.contentType == 1) {

	        var openIframe = "<iframe width='100%' style='height:" + this.config.height + "px' name='" + this.iframeIdName + "' id='" + this.iframeIdName + "' src='" + this.info.contentUrl + "' frameborder='0' scrolling='" + this.config.scrollType + "'></iframe>";
	        var coverIframe = "<div id='iframeBG' style='position:absolute;top:0px;left:0px;width:1px;height:1px;z-index:" + coverIfZIndex + ";filter: alpha(opacity=00);opacity:0.00;background-color:#ffffff;'><div>";
	        G("dialogBody").innerHTML = openIframe + coverIframe;

	        //Date:2009/1/17 Des:ie6调用外部文件需要刷新的问题
	        if (isIE6) {
	            document.getElementById(this.iframeIdName).src = this.info.contentUrl;
	        }
	    }
	    else if (this.config.contentType == 2) {
	        //Des:修正内容将对话框撑开的问题 Date:2008/11/28 By:Kim Wang
	        //G("dialogBody").innerHTML = this.info.contentHtml;
	        G("dialogBody").innerHTML = "<div style=\"overflow:auto;width:" + this.config.width + "px;height:" + this.config.height + "px\">" + this.info.contentHtml + "</div>";
	    }
	    else if (this.config.contentType == 3) {
	        G("dialogBody").innerHTML = confirm;
	        Event.observe(G('dialogOk'), "click", this.forCallback.bindAsEventListener(this), false);
	        Event.observe(G('dialogCancel'), "click", this.close.bindAsEventListener(this), false)
	    }
	    else if (this.config.contentType == 4) {
	        G("dialogBody").innerHTML = alert;
	        //Event.observe(G('dialogYES'), "click", this.close.bindAsEventListener(this), false)
	        //为alert增加回调功能
	        Event.observe(G('dialogYES'), "click", this.forCallback.bindAsEventListener(this), false);
	    }
	}, 
	
	reBuild: function() {
	    G('dialogBody').height = G('dialogBody').clientHeight;
	    this.lastBuild()
	}, 
	
	show: function() {
	    this.hiddenSome();
	    this.middle();
	    if (this.config.isShowShadow) this.shadow()
	}, 
	
	forCallback: function() {
	/*
	    return this.info.callBack(this.info.parameter);
	    
	    Des:修正alert模式，没有传入回调报错问题
	    
	    Date:2009/1/19 By:Kim Wang
	*/
	    if (this.info.callBack)
	        return this.info.callBack(this.info.parameter);
	    else
	        this.close();

	}, 
	
	//设置阴影效果
	shadow: function() {
	    var oShadow = G('dialogBoxShadow');
	    var oDialog = G('dialogBox');
	    oShadow['style']['position'] = "absolute";
	    oShadow['style']['background'] = "#000";
	    oShadow['style']['display'] = "";
	    oShadow['style']['opacity'] = "0.2";
	    oShadow['style']['filter'] = "alpha(opacity=20)";
	    oShadow['style']['top'] = oDialog.offsetTop + this.info.shadowWidth + "px";
	    oShadow['style']['left'] = oDialog.offsetLeft + this.info.shadowWidth + "px";
	    oShadow['style']['width'] = oDialog.offsetWidth + "px";
	    oShadow['style']['height'] = oDialog.offsetHeight + "px"
	},
	
	//获取页面滚动高度 add by: wx date:2008/10/22
    getScroll: function() {
	var w3c = (document.getElementById) ? true : false;
        var agt = navigator.userAgent.toLowerCase();
        var ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1) && (agt.indexOf("omniweb") == -1));
        var IeTrueBody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
        return { top: ie ? IeTrueBody.scrollTop : window.pageYOffset,
            left: ie ? IeTrueBody.scrollLeft : window.pageXOffset
        };
    },
    
    //获取页面尺寸
    getPageSize: function() {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.documentElement.scrollWidth; //(ff覆盖宽度问题)document.body.offsetWidth; by wx
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.documentElement.scrollWidth; //(sf覆盖宽度问题)document.body.offsetWidth; by wx
            yScroll = document.body.offsetHeight;
        }

        var windowWidth, windowHeight;
        if (self.innerHeight) { // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }

        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        } else {
            pageWidth = xScroll;
        }

        return { pWidth: pageWidth, pHeight: pageHeight, wWidth: windowWidth, wHeight: windowHeight };

    },
    
    middle: function() {
        //对话框居中
        if (!this.config.isBackgroundCanClick) G('dialogBoxBG').style.display = '';
        var oDialog = G('dialogBox');
        oDialog['style']['position'] = "absolute";
        oDialog['style']['display'] = '';
        var top = (this.getPageSize().wHeight - oDialog.clientHeight) / 2;
        var left = (this.getPageSize().wWidth - oDialog.clientWidth) / 2;
        oDialog['style']['left'] = left + this.getScroll().left + "px";
        oDialog['style']['top'] = top + this.getScroll().top + "px";
    }, 
    
    reset: function() {
	    //重新加载页面
	    if (this.config.isReloadOnClose) {
	        top.location.reload()
	    };
	    this.close()
    }, 
    
    close: function() {
	    G('dialogBox').style.display = 'none';
	    if (!this.config.isBackgroundCanClick) G('dialogBoxBG').style.display = 'none';
	    if (this.config.isShowShadow) G('dialogBoxShadow').style.display = 'none';
	    G('dialogBody').innerHTML = '';
	    this.showSome();

	    //重新加载页面
	    if (this.config.isReloadOnClose) {
	        top.location.reload()
	    }
    }, 
    
    hiddenSome: function() {
	    var tag = this.info.someHiddenTag.split(",");
	    if (tag.length == 1 && tag[0] == "") tag.length = 0;
	    for (var i = 0; i < tag.length; i++) {
	        this.hiddenTag(tag[i])
	    };
	    var ids = this.info.someHiddenEle.split(",");
	    if (ids.length == 1 && ids[0] == "") ids.length = 0;
	    for (var i = 0; i < ids.length; i++) {
	        this.hiddenEle(ids[i])
	    };
	    var ids = this.info.someDisabledBtn.split(",");
	    if (ids.length == 1 && ids[0] == "") ids.length = 0;
	    for (var i = 0; i < ids.length; i++) {
	        this.disabledBtn(ids[i]);
	    }
	    space("begin");
    }, 
    
    disabledBtn: function(id) {
	    var ele = doc.getElementById(id);
	    if (typeof (ele) != "undefined" && ele != null && ele.disabled == false) {
	        ele.disabled = true;
	        this.someToDisabled.push(ele)
	    }
    }, 
    
    hiddenTag: function(tagName) {
	    var ele = doc.getElementsByTagName(tagName);
	    if (ele != null) {
	        for (var i = 0; i < ele.length; i++) {
	            if (ele[i].style.display != "none" && ele[i].style.visibility != 'hidden') {
	                ele[i].style.visibility = 'hidden';
	                this.someToHidden.push(ele[i])
	            }
	        }
	    }
    }, 
    
    hiddenEle: function(id) {
	    var ele = doc.getElementById(id);
	    if (typeof (ele) != "undefined" && ele != null) {
	        ele.style.visibility = 'hidden';
	        this.someToHidden.push(ele)
	    }
    }, 
    
    showSome: function() {
	    for (var i = 0; i < this.someToHidden.length; i++) {
	        this.someToHidden[i].style.visibility = 'visible'
	    };
	    for (var i = 0; i < this.someToDisabled.length; i++) {
	        this.someToDisabled[i].disabled = false
	    };
	    space("end")
    }
};