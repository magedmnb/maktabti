myapp.login_window=Ti.UI.createWindow({
	//theme:"Theme.AppCompat.Translucent.NoTitleBar",
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});

myapp.container=Ti.UI.createView({
	layout:"vertical"
});

myapp.login_header_view=common.createHeaderView(false);


myapp.login_title=Ti.UI.createLabel({
	text:"تسجيل الدخول",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});

myapp.login_header_view.add(myapp.login_title);

myapp.login_body_view=Ti.UI.createScrollView({
	backgroundColor:"#e6e6ff",
	layout:"vertical",
});


myapp.logo=Ti.UI.createImageView({
	image:"images/login.png",
	top:40,
	
});

myapp.username_txt=Ti.UI.createTextField({
	backgroundColor:"#FFF",
	width:Ti.UI.FILL,
	height:50,
	hintText:"البريد اﻹلكترونى",
	hintTextColor:"#CCC",
	left:10,
	right:10,
	top:40,
	bottom:10,
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#000",
	textAlign:"right",
	keyboardType:Ti.UI.KEYBOARD_EMAIL
});


myapp.password_txt=Ti.UI.createTextField({
	backgroundColor:"#FFF",
	width:Ti.UI.FILL,
	height:50,
	hintText:"كلمة المرور",
	hintTextColor:"#CCC",
	left:10,
	right:10,
	top:10,
	bottom:10,
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#000",
	passwordMask:true,
	textAlign:"right"
});

myapp.login_btn=Ti.UI.createButton({
	width:Ti.UI.FILL,
	height:60,
	title:"دخول",
	backgroundColor:"#2ba8db",
	left:10,
	right:10,
	top:10,
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});

myapp.loginIndicator = common.loading_indicator();

myapp.loginIndicator.top=0;
myapp.loginIndicator.height=0;
myapp.loginIndicator.message="";
myapp.login_body_view.add(myapp.logo);
myapp.login_body_view.add(myapp.loginIndicator);
myapp.login_body_view.add(myapp.username_txt);
myapp.login_body_view.add(myapp.password_txt);
myapp.login_body_view.add(myapp.login_btn);
myapp.container.add(myapp.login_header_view);
myapp.container.add(myapp.login_body_view);
myapp.login_window.add(myapp.container);
myapp.login_window.open();
myapp.openWindows.push(myapp.login_window);
var alertDialog=Ti.UI.createAlertDialog({
	title:"تنبيه",
	buttonNames:["موافق"]
});


myapp.login_btn.addEventListener('click',function(){
	var result=common.checkNetwork();
	if(result.enable==true){
	
	if(myapp.username_txt.value=="" || myapp.password_txt.value==""){
		alertDialog.message="من فصلك أدخل كافة الحقول";
		alertDialog.show();
		return;
	}
	
	if(!common.checkEmail(myapp.username_txt.value)){
		alertDialog.message="أدخل البريد اﻹلكترونى بشكل صحيح";
		alertDialog.show();
		return;
	}
	myapp.loginIndicator.top=10;
	myapp.loginIndicator.height=Ti.UI.SIZE;
	myapp.loginIndicator.show();
	var xhr=Ti.Network.createHTTPClient({
		onload:function(){
				myapp.loginIndicator.top=0;
				myapp.loginIndicator.height=0;
				myapp.loginIndicator.hide();
				
				if(Number(this.responseText)>=1){
					for(var i=0;i<myapp.openWindows.length;i++){
						myapp.openWindows[i].close();
					}
					myapp.openWindows=[];
					Ti.App.Properties.setInt("user_id",Number(this.responseText));
					Ti.App.Properties.setBool("switch",true);
				}
		},
		onerror:function(error){
			myapp.loginIndicator.top=0;
			myapp.loginIndicator.height=0;
			myapp.loginIndicator.hide();
			alertDialog.message="بيانات الدخول خاطئة";
			alertDialog.show();
		}
	});
	xhr.open("GET","http:\/\/maktbti.com/api/Users/Login/"+myapp.username_txt.value+"/"+myapp.password_txt.value);
	xhr.send();
	}else{
		netDialog.show();
	}
});

var netDialog=Ti.UI.createAlertDialog({
	title:"تنبيه",
	message:"تأكد من وجود إنترنت",
	buttonNames:["موافق"]
});
common.createDrawer(myapp.login_window,myapp.drawerIcon,"login");

