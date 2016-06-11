
exports.createDrawer=function(parent_element,source_fire,current){
		function minmize_menu(){
		   		var animation = Titanium.UI.createAnimation();
				animation.width = 0;
				animation.right=0;
				animation.duration = 200;
				animation.width.zIndex=100;
				drawerMenu.animate(animation);
	}
	var drawerMenu=Ti.UI.createView({
		backgroundColor:"#FFF",
		width:0,
		right:0,
	});
	
	parent_element.add(drawerMenu);

	
	parent_element.addEventListener('click',function(){
		minmize_menu();
	});
	parent_element.addEventListener('androidback' , function(e){
   		if(Number(drawerMenu.width)==0){
   			parent_element.close();
   		}else{
			minmize_menu();
   		}
	});
	
	parent_element.addEventListener('swipe',function(e){
		myapp.screenWidth=Number(Ti.Platform.displayCaps.platformWidth);
		if(e.direction=="left" && e.x < myapp.screenWidth-(myapp.screenWidth/2)){
			return;
		}
		if(e.direction=="left"){
			var animation = Titanium.UI.createAnimation();
			animation.width = "80%";
			animation.right=0;
			animation.duration = 200;
			animation.width.zIndex=100;
			drawerMenu.animate(animation);
		}else if(e.direction=="right"){
			minmize_menu();
		}
	});
	
	drawerMenu.addEventListener('click',function(e){
		 e.cancelBubble = true;
	});
	
	myapp.drawer_table=Ti.UI.createTableView({
		separatorColor: "#ccc",
	});
	myapp.drawer_table_rows=[];
	row_1=Ti.UI.createTableViewRow({
		backgroundColor:"#2ba8db",
		height:100
	});
	
	
	drawer_logo=Ti.UI.createImageView({
		image:"images/logo.png",
		right:20,
		top:20,
		
	});
	
	arrow_down=Ti.UI.createImageView({
		image:"images/arrowTop.png",
		left:10,
		top:80,
	});
	
	
	drawer_label=Ti.UI.createLabel({
		text:"مكتبتى",
		right:10,
		top:70,
		font:{fontSize:20,fontFamily:"NeoSans-regular"}
	});
	
	row_1.add(drawer_logo);
	row_1.add(arrow_down);
	row_1.add(drawer_label);
	myapp.drawer_table_rows.push(row_1);
	myapp.drawer_table_rows.push({top:10,rightImage:"images/home.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"الرئيسية",color:"#000",textAlign:"right"});
	myapp.drawer_table_rows.push({top:10,rightImage:"images/searc.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"البحث",color:"#000",textAlign:"right"});
	myapp.drawer_table_rows.push({top:10,rightImage:"images/info.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"عن التطبيق",color:"#000",textAlign:"right"});
	myapp.drawer_table_rows.push({top:10,rightImage:"images/contact.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"إتصل بنا",color:"#000",textAlign:"right"});
	if(Ti.App.Properties.getInt("user_id",0)>=1){
		myapp.drawer_table_rows.push({number:4,top:10,rightImage:"images/user.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"بياناتى",color:"#000",textAlign:"right"});
		myapp.drawer_table_rows.push({number:5,top:10,rightImage:"images/out.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"خروج",color:"#000",textAlign:"right"});
	}else{
		myapp.drawer_table_rows.push({number:6,top:10,rightImage:"images/user.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"التسجيل",color:"#000",textAlign:"right"});
		myapp.drawer_table_rows.push({number:5,top:10,rightImage:"images/icon.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"تسجيل الدخول",color:"#000",textAlign:"right"});
	}
	myapp.drawer_table.data=myapp.drawer_table_rows;
	
	myapp.drawer_table.addEventListener('click',function(e){
		if(e.index===1){
			if(current=="menu"){
				minmize_menu();
			}
			for(var i=0;i<myapp.openWindows.length;i++){
				myapp.openWindows[i].close();
			}
		}else if(Number(e.index)===2){
			if(current=="search"){
				minmize_menu();
			}else{
				Ti.include('search.js');
			}
		}else if(Number(e.index)===3){
			if(current=="about"){
				minmize_menu();
			}else{
				Ti.include('about.js');
			}
		}else if(Number(e.index)===4){
			if(current=="contact"){
				minmize_menu();
			}else{
				Ti.include('contact.js');
			}
		}else if(e.rowData.number===4){
			if(Ti.App.Properties.getInt("user_id",0)>=1){
				if(current!="profile"){
					Ti.include('profile.js');
				}
			}
			minmize_menu();
		}else if(e.rowData.number==5){
			if(Ti.App.Properties.getInt("user_id",0)>=1){
				for(var i=0;i<myapp.openWindows.length;i++){
					myapp.openWindows[i].close();
				}
				myapp.openWindows=[];
				Ti.App.Properties.removeProperty('user_id');	
				myapp.drawer_table.deleteRow(6);
				myapp.drawer_table.deleteRow(5);
				myapp.drawer_table.appendRow({number:6,top:10,rightImage:"images/user.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"التسجيل",color:"#000",textAlign:"right"});
				myapp.drawer_table.appendRow({number:5,top:10,rightImage:"images/icon.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"تسجيل دخول",color:"#000",textAlign:"right"});
				if(current=="login"){
					current="";
				}
			}
			if(current!="login"){
				minmize_menu();
				Ti.include('login.js');
			}
		}else if(e.rowData.number===6){
			//Ti.Platform.openURL("http://maktbti.com/UI/register.aspx");
			Ti.include('signout.js');
		}
		  minmize_menu();
	});
	
	source_fire.addEventListener('click',function(){
		var animation = Titanium.UI.createAnimation();
		animation.width = "80%";
		animation.right=0;
		animation.duration = 200;
		animation.width.zIndex=100;
		drawerMenu.animate(animation);
		if(Ti.App.Properties.getBool("switch",false)){
			myapp.drawer_table_rows.pop();
			myapp.drawer_table_rows.pop();
			myapp.drawer_table_rows.push({number:4,top:10,rightImage:"images/user.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"بياناتى",color:"#000",textAlign:"right"});
			myapp.drawer_table_rows.push({number:5,top:10,rightImage:"images/out.png",font:{fontSize:20,fontFamily:"NeoSans-regular"},title:"خروج",color:"#000",textAlign:"right"});
			drawerMenu.removeAllChildren();
			myapp.drawer_table.data=myapp.drawer_table_rows;
			drawerMenu.add(myapp.drawer_table);
			Ti.App.Properties.setBool("switch",false);
		}
	});
	drawerMenu.add(myapp.drawer_table);
};


exports.createHeaderView=function(search){
	var header_view= Ti.UI.createView({
		height:60,
		backgroundColor:"#2ba8db"
	});
	
	myapp.drawerIcon=Ti.UI.createImageView({
	image:"images/drawer.png",
	right:5,
	width:35,
	height:35
	});
	
	var search_img=Ti.UI.createImageView({
	image:"images/search.png",
	left:5,
	width:35,
	height:35
	});
	
	search_img.addEventListener('click',function(){
		if(!search){
			Ti.include('search.js');
		}
	});
	header_view.add(search_img);
	header_view.add(myapp.drawerIcon);
	return header_view;
};


exports.createBookItem=function(id,name,image_url,shortLink,description){
	myapp.box_view_1=Ti.UI.createView({
		width:"45%",
		left:"3%",
		right:"2%",
		top:"8%",
		backgroundColor:"#FFF"
		
	});
	
	
	myapp.box_1_img=Ti.UI.createImageView({
		image:"http://"+image_url,
		height:"170",
		width:"80%"
	});
	
	
	myapp.box_1_footer_view=Ti.UI.createView({
		height:40,
		bottom:0,
		backgroundColor:"#000",
		opacity:.7,
		id:id
	});
	
	myapp.box_1_label=Ti.UI.createLabel({
		text:name,
		color:"#FFF",
		right:4,
		font:{
			fontFamily:"NeoSans-regular"
		},
		id:id
	});
	
	
	myapp.box_1_heart=Ti.UI.createImageView({
		image:"images/heart.png",
		left:4,
		width:20,
		height:20,
		//backgroundColor:"#FFF"
	});
	
	
	myapp.box_view_1.add(myapp.box_1_img);
	myapp.box_1_footer_view.add(myapp.box_1_label);
	myapp.box_1_footer_view.add(myapp.box_1_heart);
	myapp.box_view_1.add(myapp.box_1_footer_view);
	
	myapp.box_view_1.addEventListener('click',function(e){
		var result=common.checkNetwork();
		if(!result.enable==true){
			var alertDialog=Ti.UI.createAlertDialog({
				title:"تنبيه",
				message:"تأكد من وجود إنترنت",
				buttonNames:["موافق"]
			});
			alertDialog.show();
			return;
		}
		myapp.single_title=name;
		if(Ti.App.Properties.getInt("user_id",0)){
			var userStatusRequest=Ti.Network.createHTTPClient({
				onload:function(){
					var user=JSON.parse(this.responseText);
					if(user[0].IsActive){
						var bookDetailsRequest=Ti.Network.createHTTPClient({
							onload:function(){
								myapp.info={image_url:image_url,desc:description};
								myapp.data=JSON.parse(this.responseText);
								Ti.include('single.js');
							}
						});
						bookDetailsRequest.open("GET","http://maktbti.com/api/books/GetBooksURL/"+id);
						bookDetailsRequest.send();
					}else{
						myapp.data=[{Name:"نبذه عن الكتاب",URL:shortLink,image_url:image_url,desc:description}];
						Ti.include('single.js');
					}
				}
			});
			userStatusRequest.open("GET","http:\/\/maktbti.com/api/Users/GetUser/"+Ti.App.Properties.getInt("user_id",0));
			userStatusRequest.send();
		}else{
				
				myapp.data=[{Name:"نبذه عن الكتاب",URL:shortLink,image_url:image_url,desc:description}];
				Ti.include('single.js');
		}
	});
	return myapp.box_view_1;
};

exports.generateProgressBar=function(){
	return Ti.UI.createSlider({
		value:0,
		min:0,
		max:500000,
		width:255,
		backgroundColor:"blue",
		thumbImage :'thumb-bar.gif',
	});
};

exports.loading_indicator=function(){
	return Ti.UI.createActivityIndicator({
	  color: '#2ba8db',
	  font: {fontFamily:'NeoSans-regular', fontSize:16},
	  message: 'تحميل ',
	  style: Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE,
	  top:"25%"
	});
};

exports.checkNetwork=function(){
	var result={};
	if(!Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
		result.enable=true;
	}else{
		result.view=Ti.UI.createView({
			layout:"vertical",
			height:"130",
			top:"25%"
		});
		result.view.add(Ti.UI.createImageView({
			image:"images/noNetwork.png",
			width:"80",
			height:"80"
		}));
		
		result.view.add(Ti.UI.createLabel({
			text: "تأكد من وجود إنترنت ثم أضغط مره أخرى",
			font:{fontSize:15,fontFamily:"NeoSans-regular"},
			color:"red",
			top:10
		}));
	}
	return result;
};
var time="";
exports.time=function(value,total){
	
	if(Number(value)>=Number(total) && total!=undefined){
		return time(total);
	}
	if(value<60){
		return "00:"+ (Number(value)<= 9 ? "0"+value:value);
	}else{
		time=Math.floor(Number(value)/60);
		time=(Number(time)<= 9?"0"+time:time)+":"+(Math.floor(Number(value)%60)<= 9?"0"+(Math.floor(Number(value)%60)):Math.floor(Number(value)%60));
		return time;
	}
};

exports.checkEmail=function(emailAddress) {
        var str = emailAddress;
        var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (filter.test(str)) {
            testresults = true;
        } else {
            testresults = false;
        }
        return (testresults);
};