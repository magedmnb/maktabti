var myapp={};
myapp.openWindows=[];
var common=require('common');
/* Home Window */
myapp.home_window=Ti.UI.createWindow({
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});


myapp.container=Ti.UI.createView({
	layout:"vertical"
});
myapp.home_window.add(myapp.container);

myapp.header_view=common.createHeaderView(false);

myapp.nav_bar=Ti.UI.createView({
	backgroundColor:"#00ace6",
	height:30
});


myapp.nav_bar_label_1=Ti.UI.createLabel({
	text:"جديد الكتب",
	color:"#FFF",
	font:{
			fontFamily:"NeoSans-regular"
	},
	right:5,
});
myapp.nav_bar_label_1.addEventListener('click',function(){
	myapp.body_view.removeAllChildren();
	myapp.home_label.text="جديد الكتب";
	myapp.body_view.add(myapp.home_label);
	myapp.body_view.add(myapp.activityIndicator);
	myapp.activityIndicator.show();
	load(true,undefined,"http://maktbti.com/api/books/SelectBooks/12");
});
myapp.nav_bar_label_2=Ti.UI.createLabel({
	text:"كل الكتب",
	color:"#FFF",
	font:{
			fontFamily:"NeoSans-regular"
	},
	right:85,
});
myapp.nav_bar_label_2.addEventListener('click',function(){
	myapp.body_view.removeAllChildren();
	myapp.home_label.text="كل الكتب";
	myapp.body_view.add(myapp.home_label);
	myapp.body_view.add(myapp.activityIndicator);
	myapp.activityIndicator.show();
	load(true,undefined,"http://maktbti.com/api/books/SelectAllBooks");
});
myapp.nav_bar.add(myapp.nav_bar_label_1);
myapp.nav_bar.add(myapp.nav_bar_label_2);

myapp.body_view=Ti.UI.createScrollView({
	backgroundColor:"#e6e6ff",
	layout:"vertical"
});



myapp.home_label=Ti.UI.createLabel({
	top:10,
	text:"الرئيسية",
	color:"#000",
	font:{
			fontFamily:"NeoSans-regular"
	},
	right:5
});

myapp.body_view.add(myapp.home_label);

myapp.logo_img=Ti.UI.createImageView({
	image:"images/logo.png",
	top:10
});


myapp.activityIndicator = common.loading_indicator();


myapp.container.add(myapp.header_view);
myapp.container.add(myapp.nav_bar);
myapp.header_view.add(myapp.logo_img);

function load(first,view,url){
// Check if network enable or not
var result=common.checkNetwork();
if(result.enable==true){
myapp.xhr=Ti.Network.createHTTPClient({
	onload:function(){
	myapp.activityIndicator.hide();
	myapp.body_view.remove(myapp.activityIndicator);
	var books =JSON.parse(this.responseText);
	for(var i=0;i<books.length;i++){
	Ti.API.info(books[i].PIC);
	if(i%2==0){
		myapp.row=Ti.UI.createView({
			height:200,
			layout:"horizontal",
			width:Ti.UI.FILL
		});
	}
	
	myapp.row.add(common.createBookItem(books[i].ID,books[i].Name,books[i].PIC,books[i].ShortURL,books[i].Description));
	myapp.body_view.add(myapp.row);

	}
	},
	onerror:function(){
		myapp.activityIndicator.hide();
	},
	//timeout:30000
});

myapp.xhr.open("GET",url);
myapp.xhr.send();
myapp.activityIndicator.show();
if(view!=undefined){
	view.top=0;
	view.height=0;
}
}else{
	if(first==true){
		myapp.body_view.add(result.view);
		myapp.activityIndicator.hide();
		myapp.body_view.remove(myapp.activityIndicator);
	}
}
	if(result.view!=undefined){
		result.view.addEventListener('click',function(){
				load(false,result.view,url);
		});
	}

};
load(true,undefined,"http://maktbti.com/api/books/SelectBooks/12");

myapp.body_view.add(myapp.activityIndicator);
myapp.container.add(myapp.body_view);
myapp.home_window.add(myapp.container);
myapp.home_window.open();




common.createDrawer(myapp.home_window,myapp.drawerIcon,"menu");
