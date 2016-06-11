myapp.contact_window=Ti.UI.createWindow({
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});


myapp.container=Ti.UI.createView({
	layout:"vertical"
});

myapp.contact_header_view=common.createHeaderView(false);


myapp.contact_title=Ti.UI.createLabel({
	text:"إتصل بنا",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});




myapp.contact_header_view.add(myapp.contact_title);

myapp.contact_body_view=Ti.UI.createScrollView({
	backgroundColor:"#FFF",
	layout:"vertical",
});



myapp.address_lbl=Ti.UI.createLabel({
	text:"العنوان",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:10
});

myapp.address_txt=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	color:"#000"
});

myapp.phone_lbl=Ti.UI.createLabel({
	text:"العنوان",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:10
});

myapp.phone_txt=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	color:"#000"
});

myapp.phone_lbl=Ti.UI.createLabel({
	text:"الهاتف",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:10
});

myapp.social_lbl=Ti.UI.createLabel({
	text:"التواصل اﻹجتماعى",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:10
});

myapp.social_container=Ti.UI.createView({
	layout:"horizontal",
	top:10,
	height:80,
	width:Ti.UI.SIZE
});


myapp.facebook_icon=Ti.UI.createImageView({
	image:"images/facebook.png",
	width:50,
	height:50,
	left:10
});
facebook_url="";
twitter_url="";
youtube_url="";
insta_url="";
myapp.facebook_icon.addEventListener('click',function(){
	Ti.Platform.openURL(facebook_url);
});

myapp.twitter_icon=Ti.UI.createImageView({
	image:"images/twitter.png",
	width:50,
	height:50,
	left:10
});


myapp.twitter_icon.addEventListener('click',function(){
	Ti.Platform.openURL(twitter_url);
});

myapp.youtube_icon=Ti.UI.createImageView({
	image:"images/youtube.png",
	borderRadius:20,
	width:50,
	height:50,
	left:10
});


myapp.youtube_icon.addEventListener('click',function(){
	Ti.Platform.openURL(youtube_url);
});

myapp.insta_icon=Ti.UI.createImageView({
	image:"images/instgram.jpg",
	borderRadius:20,
	width:50,
	height:50,
	left:10
});


myapp.insta_icon.addEventListener('click',function(){
	Ti.Platform.openURL(insta_url);
});


myapp.social_container.add(myapp.facebook_icon);
myapp.social_container.add(myapp.twitter_icon);
myapp.social_container.add(myapp.youtube_icon);
myapp.social_container.add(myapp.insta_icon);


myapp.manager_lbl=Ti.UI.createLabel({
	text:"البريد اﻹلكترونى للمدير",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:10
});

myapp.manager_txt=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	color:"blue",
});


myapp.support_lbl=Ti.UI.createLabel({
	text:"البريد اﻹلكترونى للدعم",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	top:20
});

myapp.support_txt=Ti.UI.createLabel({
	font:{fontSize:16,fontFamily:"NeoSans-regular"},
	color:"blue",
});


myapp.manager_txt.addEventListener('click',function(){
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "مرحبا";
	emailDialog.toRecipients = [myapp.manager_txt.text];
	emailDialog.messageBody = '';
	emailDialog.open();
});

myapp.support_txt.addEventListener('click',function(){
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "مرحبا";
	emailDialog.toRecipients = [myapp.support_txt.text];
	emailDialog.messageBody = '';
	emailDialog.open();
});

function load(){
	var result=common.checkNetwork();
	if(result.enable==true){
		var xhr=Ti.Network.createHTTPClient({
		onload:function(){
				
				myapp.contact_body_view.add(myapp.address_lbl);
				myapp.contact_body_view.add(myapp.address_txt);
				myapp.contact_body_view.add(myapp.phone_lbl);
				myapp.contact_body_view.add(myapp.phone_txt);
				myapp.contact_body_view.add(myapp.social_lbl);
				myapp.contact_body_view.add(myapp.social_container);
				myapp.contact_body_view.add(myapp.manager_lbl);
				myapp.contact_body_view.add(myapp.manager_txt);
				myapp.contact_body_view.add(myapp.support_lbl);
				myapp.contact_body_view.add(myapp.support_txt);
				myapp.info=JSON.parse(this.responseText);
				myapp.address_txt.text=myapp.info.Adress;
				myapp.phone_txt.text=myapp.info.Phone;
				facebook_url=myapp.info.FaceBook;
				twitter_url=myapp.info.Twitter;
				youtube_url=myapp.info.YouTube;
				insta_url=myapp.info.Instagram;
				myapp.manager_txt.text=myapp.info.ManagerMail;
				myapp.support_txt.text=myapp.info.SupportMail;
			}
		});
		
		xhr.open("GET","http:\/\/maktbti.com/api/AboutUs/contactus");
		xhr.send();
	}else{
		myapp.contact_body_view.add(result.view);
		result.view.addEventListener('click',function(){
			result.view.top=0;
			result.view.height=0;
			load();
		});
	}
}
load();


myapp.container.add(myapp.contact_header_view);
myapp.container.add(myapp.contact_body_view);
myapp.contact_window.add(myapp.container);
myapp.contact_window.open();
myapp.openWindows.push(myapp.contact_window);
common.createDrawer(myapp.contact_window,myapp.drawerIcon,"contact");