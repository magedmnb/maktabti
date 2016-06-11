myapp.profile_window=Ti.UI.createWindow({
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

myapp.signout_header_view=common.createHeaderView(false);


myapp.profile_title=Ti.UI.createLabel({
	text:"اﻹشتراك",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});



myapp.signout_header_view.add(myapp.profile_title);

myapp.signout_body_view=Ti.UI.createScrollView({
	backgroundColor:"#e6e6ff",
	layout:"vertical",
});

var props={
			backgroundColor:"#FFF",
			width:Ti.UI.FILL,
			height:50,
			left:10,
			hintTextColor:"#CCC",
			font:{fontSize:20,fontFamily:"NeoSans-regular"},
			color:"#000",
			textAlign:"right",
			right:10,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_BEZEL,
		};
	
myapp.username_txt=Ti.UI.createTextField(props);
myapp.username_txt.hintText="أسم المستخدم";
myapp.email_txt=Ti.UI.createTextField(props);
myapp.email_txt.hintText="البريد اﻹلكترونى";
myapp.email_txt.keyboardType=Ti.UI.KEYBOARD_EMAIL;
myapp.phone_txt=Ti.UI.createTextField(props);
myapp.phone_txt.keyboardType=Ti.UI.KEYBOARD_PHONE_PAD;
myapp.phone_txt.hintText="الهاتف";
props.passwordMask=true;
myapp.password_txt=Ti.UI.createTextField(props);
myapp.password_txt.hintText="كملة المرور";
myapp.new_password_txt=Ti.UI.createTextField(props);
myapp.new_password_txt.hintText="تكرار كلمة المرور";

myapp.save_btn=Ti.UI.createButton({
	width:Ti.UI.FILL,
	height:60,
	title:"إشتراك",
	backgroundColor:"#2ba8db",
	left:10,
	right:10,
	top:10,
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});

var lbl_props={
		top:10,
		right:10,
		font:{fontSize:16,fontFamily:"NeoSans-regular"},
		color:"#000"
};
myapp.lbl_1=Ti.UI.createLabel(lbl_props);
myapp.lbl_1.text="أسم المستخدم";
myapp.lbl_2=Ti.UI.createLabel(lbl_props);
myapp.lbl_2.text="الهاتف";
myapp.lbl_3=Ti.UI.createLabel(lbl_props);
myapp.lbl_3.text="كلمة المرور";
myapp.lbl_4=Ti.UI.createLabel(lbl_props);
myapp.lbl_4.text="تكرار كملة المرور";
myapp.lbl_5=Ti.UI.createLabel(lbl_props);
myapp.lbl_5.text="البريد اﻹلكترونى";


myapp.signoutIndicator = common.loading_indicator();
myapp.signoutIndicator.top=0;
myapp.signoutIndicator.height=0;
myapp.signoutIndicator.message="";



myapp.signout_body_view.add(myapp.lbl_1);
myapp.signout_body_view.add(myapp.username_txt);

myapp.signout_body_view.add(myapp.lbl_5);
myapp.signout_body_view.add(myapp.email_txt);

myapp.signout_body_view.add(myapp.lbl_2);
myapp.signout_body_view.add(myapp.phone_txt);
myapp.signout_body_view.add(myapp.lbl_3);
myapp.signout_body_view.add(myapp.password_txt);
myapp.signout_body_view.add(myapp.lbl_4);
myapp.signout_body_view.add(myapp.new_password_txt);
myapp.signout_body_view.add(myapp.signoutIndicator);


myapp.signout_body_view.add(myapp.save_btn);
myapp.container.add(myapp.signout_header_view);
myapp.container.add(myapp.signout_body_view);
myapp.profile_window.add(myapp.container);
myapp.profile_window.open();
myapp.openWindows.push(myapp.profile_window);

var alertDialog=Ti.UI.createAlertDialog({
	title:"تنبيه",
	buttonNames:["موافق"]
});


common.createDrawer(myapp.profile_window,myapp.drawerIcon,"profile");


myapp.save_btn.addEventListener('click',function(){
	if(myapp.email_txt.value==""||myapp.phone_txt.value==""|| myapp.new_password_txt.value=="" ||myapp.username_txt.value==""||myapp.password_txt.value==""){
		alertDialog.message="من فصلك أدخل كافة الحقول";
		alertDialog.show();
		return;
	}

	if(!common.checkEmail(myapp.email_txt.value)){
		alertDialog.message="أدخل البريد اﻹلكترونى بشكل صحيح";
		alertDialog.show();
		return;
	}
	
	if(myapp.new_password_txt.value!=myapp.password_txt.value){
		alertDialog.message="كلمة المرور غير متطابقة";
		alertDialog.show();
		return;
	}
	
	var result=common.checkNetwork();
	if(result.enable==true){
		myapp.signoutIndicator.top=10;
		myapp.signoutIndicator.height=Ti.UI.SIZE;
		myapp.signoutIndicator.show();
		
		var checkEmailUniqueRequest=Ti.Network.createHTTPClient({
			onload:function(){
				var signoutReguest=Ti.Network.createHTTPClient({
				onload:function(){
						myapp.signoutIndicator.top=0;
						myapp.signoutIndicator.height=0;
						myapp.signoutIndicator.hide();
						var result=JSON.parse(this.responseText);
						if(result==201){
							alertDialog.message="تم اﻹشتراك بنجاح";
							alertDialog.show();
							setTimeout(function(){
									for (var i=0; i < myapp.openWindows.length; i++) {
									  myapp.openWindows[i].close();
									};
							},2000);
						}
				},onerror:function(){
						myapp.signoutIndicator.top=0;
						myapp.signoutIndicator.height=0;
						myapp.signoutIndicator.hide();
						
					}
				});
				signoutReguest.open("GET","http:\/\/maktbti.com/api/Users/UserRegister/"+myapp.username_txt.value+"/"+myapp.email_txt.value+"/"+myapp.phone_txt.value+"/"+myapp.new_password_txt.value);
				signoutReguest.send();
			},onerror:function(){
				myapp.signoutIndicator.top=0;
				myapp.signoutIndicator.height=0;
				myapp.signoutIndicator.hide();
				alertDialog.message="هذا البريد مسجل من قبل";
				alertDialog.show();
			}
		});
		checkEmailUniqueRequest.open("GET","http:\/\/maktbti.com/api/Users/CheckEmail/"+myapp.email_txt.value);
		checkEmailUniqueRequest.send();
	}else{
		alertDialog.message="تأكد من أتصال الانترنت";
		alertDialog.show();
	}
});

