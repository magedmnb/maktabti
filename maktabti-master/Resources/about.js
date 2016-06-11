myapp.about_window=Ti.UI.createWindow({
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});


myapp.container=Ti.UI.createView({
	layout:"vertical"
});

myapp.about_header_view=common.createHeaderView(false);


myapp.about_title=Ti.UI.createLabel({
	text:"عن التطبيق",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});

myapp.about_header_view.add(myapp.about_title);

myapp.about_body_view=Ti.UI.createScrollView({
	//backgroundColor:"#e6e6ff",
	backgroundColor:"#FFF",
	layout:"vertical",
});


myapp.about_content_label=Ti.UI.createLabel({
	font:{fontSize:18,fontFamily:"NeoSans-regular"},
	color:"#000",
	textAlign:"right",
	top:10,
	right:10,
	left:10
});


myapp.developers_label=Ti.UI.createLabel({
	font:{fontSize:18,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	textAlign:"center",
	top:10,
	text:"برمجة وتصميم  \n http:\/\/www.intro-dev.com "
});

myapp.developers_label.addEventListener('click',function(){
	Ti.Platform.openURL("http:\/\/www.intro-dev.com");
});


function loadAbout(){
	var result=common.checkNetwork();
	if(result.enable==true){
		var xhr=Ti.Network.createHTTPClient({
		onload:function(){
				myapp.about_content_label.text=this.responseText;
			}
		});
		
		xhr.open("GET","http:\/\/maktbti.com/api/AboutUs/AboutUs");
		xhr.send();
	}else{
		myapp.about_body_view.add(result.view);
		result.view.addEventListener('click',function(){
			result.view.top=0;
			result.view.height=0;
			loadAbout();
		});
	}
}
loadAbout();
myapp.about_body_view.add(myapp.about_content_label);
myapp.about_body_view.add(myapp.developers_label);
myapp.container.add(myapp.about_header_view);
myapp.container.add(myapp.about_body_view);
myapp.about_window.add(myapp.container);
myapp.about_window.open();
myapp.openWindows.push(myapp.about_window);


common.createDrawer(myapp.about_window,myapp.drawerIcon,"about");