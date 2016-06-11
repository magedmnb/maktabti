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

myapp.profile_header_view=common.createHeaderView(false);


myapp.profile_title=Ti.UI.createLabel({
	text:"بياناتى",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});


myapp.active_title=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	textAlign:"center"
});

myapp.eshtraq_title=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	textAlign:"center",
	text:"دفع اﻹشتراك أو التجديد",
	color:"#2ba8db"
});

myapp.eshtraq_title.addEventListener('click',function(){
	Ti.Platform.openURL("http:\/\/maktbti.com/UI/UserData.aspx");
});

myapp.profile_header_view.add(myapp.profile_title);

myapp.profile_body_view=Ti.UI.createScrollView({
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
myapp.phone_txt=Ti.UI.createTextField(props);
myapp.phone_txt.hintText="الهاتف";
myapp.phone_txt.keyboardType=Ti.UI.KEYBOARD_PHONE_PAD;
props.passwordMask=true;
myapp.password_txt=Ti.UI.createTextField(props);
myapp.password_txt.hintText="كملة المرور";
myapp.new_password_txt=Ti.UI.createTextField(props);
myapp.new_password_txt.hintText="كلمة المرور الجديده";

myapp.update_btn=Ti.UI.createButton({
	width:Ti.UI.FILL,
	height:60,
	title:"تحديث",
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
myapp.lbl_4.text="كلمة المرور الجديده";


myapp.profileIndicator = common.loading_indicator();
myapp.profileIndicator.top=0;
myapp.profileIndicator.height=0;
myapp.profileIndicator.message="";


myapp.profile_body_view.add(myapp.active_title);
myapp.profile_body_view.add(myapp.eshtraq_title);
myapp.profile_body_view.add(myapp.lbl_1);
myapp.profile_body_view.add(myapp.username_txt);
myapp.profile_body_view.add(myapp.lbl_2);
myapp.profile_body_view.add(myapp.phone_txt);
myapp.profile_body_view.add(myapp.lbl_3);
myapp.profile_body_view.add(myapp.password_txt);
myapp.profile_body_view.add(myapp.lbl_4);
myapp.profile_body_view.add(myapp.new_password_txt);
myapp.profile_body_view.add(myapp.profileIndicator);
myapp.profile_body_view.add(myapp.update_btn);
myapp.container.add(myapp.profile_header_view);
myapp.container.add(myapp.profile_body_view);
myapp.profile_window.add(myapp.container);
myapp.profile_window.open();
myapp.openWindows.push(myapp.profile_window);

var alertDialog=Ti.UI.createAlertDialog({
	title:"تنبيه",
	buttonNames:["موافق"]
});


common.createDrawer(myapp.profile_window,myapp.drawerIcon,"profile");
	var xhr=Ti.Network.createHTTPClient({
		onload:function(){
			var user=JSON.parse(this.responseText);
			myapp.username_txt.value=user[0].Name;
			myapp.phone_txt.value=user[0].Phone;
			myapp.password_txt.value=user[0].Password;
			myapp.new_password_txt.value=user[0].Password;
			if(user[0].IsActive==true){
				myapp.active_title.color="#387c2b";
				myapp.active_title.text="فعال إلى "+"\n"+user[0].ActiveTill;
			}else{
				myapp.active_title.color="red";
				myapp.active_title.text="غير مفعل";
			}
		}
	});
	xhr.open("GET","http:\/\/maktbti.com/api/Users/GetUser/"+Ti.App.Properties.getInt("user_id"));
	xhr.send();

myapp.update_btn.addEventListener('click',function(){
	if(myapp.phone_txt.value==""|| myapp.username_txt.value==""||myapp.password_txt.value==""){
		alertDialog.message="من فصلك أدخل كافة الحقول";
		alertDialog.show();
		return;
	}

	if(myapp.new_password_txt.value==""){
		myapp.new_password_txt.value=myapp.password_txt.value;
	}
	var result=common.checkNetwork();
	if(result.enable==true){
		myapp.profileIndicator.top=10;
		myapp.profileIndicator.height=Ti.UI.SIZE;
		myapp.profileIndicator.show();
		var xhr=Ti.Network.createHTTPClient({
			onload:function(){
				myapp.profileIndicator.top=0;
				myapp.profileIndicator.height=0;
				myapp.profileIndicator.hide();
				alert(JSON.parse(this.responseText));
			},onerror:function(){
				myapp.profileIndicator.top=0;
				myapp.profileIndicator.height=0;
				myapp.profileIndicator.hide();
			}
		});
		xhr.open("GET","http:\/\/maktbti.com/api/Users/UpdateUserData/"+Ti.App.Properties.getInt("user_id")+"/"+myapp.username_txt.value+"/"+myapp.phone_txt.value+"/"+myapp.new_password_txt.value+"/"+myapp.password_txt.value);
		xhr.send();
	}else{
		alertDialog.message="تأكد من أتصال الانترنت";
		alertDialog.show();
	}
});
