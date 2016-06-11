myapp.search_window=Ti.UI.createWindow({
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});

myapp.container=Ti.UI.createView({
	layout:"vertical"
});

myapp.single_header_view=common.createHeaderView(true);


myapp.search_title=Ti.UI.createLabel({
	text:"البحث",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});

myapp.no_result=Ti.UI.createLabel({
	text:"لا توجد نتائج بحث",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"red",
	height:0
});

myapp.search_body_view=Ti.UI.createScrollView({
	backgroundColor:"#e6e6ff",
	layout:"vertical",
});
myapp.searchBar=Ti.UI.createTextField({
	width:Ti.UI.FILL,
	backgroundColor:"#FFF",
	hintText:"أدخل أسم الكتاب او الوصف",
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#000",
	hintTextColor:"#ccc",
	textAlign:"right",
  	keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
  	returnKeyType: Titanium.UI.RETURNKEY_SEARCH
});
myapp.searchIndicator = common.loading_indicator();

var books,rows,row,vertical_view,book_image,book_title,book_desc; 
function get_single_book(e){
				myapp.single_title=e.source.name;	
				if(Ti.App.Properties.getInt("user_id",0)){
					var userStatusRequest=Ti.Network.createHTTPClient({
						onload:function(){
							var user=JSON.parse(this.responseText);
							if(user[0].IsActive){
								var bookDetailsRequest=Ti.Network.createHTTPClient({
									onload:function(){
										myapp.info={desc:e.source.desc,image_url:e.source.image_url};
										myapp.data=JSON.parse(this.responseText);
										Ti.include('single.js');
									}
								});
								bookDetailsRequest.open("GET","http:\/\/maktbti.com/api/books/GetBooksURL/"+e.source.id);
								bookDetailsRequest.send();
							}else{
								
								myapp.data=[{Name:"نبذه عن الكتاب",URL:e.source.shortLink,desc:e.source.desc,image_url:e.source.image_url}];
								Ti.include('single.js');
							}
						}
					});
					userStatusRequest.open("GET","http:\/\/maktbti.com/api/Users/GetUser/"+Ti.App.Properties.getInt("user_id",0));
					userStatusRequest.send();
				}else{
						
						myapp.data=[{Name:"نبذه عن الكتاب",URL:e.source.shortLink,desc:e.source.desc,image_url:e.source.image_url}];
						Ti.include('single.js');
				}
}
myapp.searchBar.addEventListener('return',function(){
	var result=common.checkNetwork();
	if(result.enable==true){
		rows=[];
		myapp.no_result.height=0;
		myapp.searchIndicator.height=Ti.UI.SIZE;
		myapp.searchIndicator.top="25%";
		myapp.searchIndicator.show();
		myapp.search_table.data=rows;
		var xhr=Ti.Network.createHTTPClient({
			onload:function(){
				myapp.searchIndicator.hide();
				myapp.searchIndicator.top=0;
				myapp.searchIndicator.height=0;
				var books=JSON.parse(this.responseText);
				for (var i=0; i < books.length; i++) {
					row=Ti.UI.createTableViewRow({
						layout:"horizonatl",
						top:10,
						
					});
					vertical_view=Ti.UI.createView({
						layout:"vertical",
						width:"65%",
						right:10,
						left:10,
						bottom:10
					});
					
					book_image=Ti.UI.createImageView({
						image:"http:\/\/"+books[i].PIC,
						width:"30%",
						right:10,
						borderRadius:10,
						height:150,
						top:10,
						bottom:10,
						id:books[i].ID,
						name:books[i].Name,
						shortLink:books[i].ShortURL,
						image_url:books[i].PIC,
						desc:books[i].Description
					});
					
					
					book_title=Ti.UI.createLabel({
						text:books[i].Name,
						font:{fontSize:16,fontFamily:"NeoSans-regular"},
						color:"#CC0",
						textAlign:"right",
						right:10,
						id:books[i].ID,
						name:books[i].Name,
						shortLink:books[i].ShortURL,
						image_url:books[i].PIC,
						desc:books[i].Description
					});
					
					book_desc=Ti.UI.createLabel({
						text:books[i].Description.substring(0,160),
						font:{fontSize:14,fontFamily:"NeoSans-regular"},
						color:"#000",
						textAlign:"right",
						right:10,
						top:5
					});
					
					book_title.addEventListener('click',get_single_book);
					book_image.addEventListener('click',get_single_book);
					vertical_view.add(book_title);
					vertical_view.add(book_desc);
					row.add(vertical_view);
					row.add(book_image);
				  	rows.push(row);
				};
				myapp.search_table.data=rows;
			},onerror:function(){
				myapp.searchIndicator.top=0;
				myapp.searchIndicator.height=0;
				myapp.searchIndicator.hide();
				myapp.no_result.height=Ti.UI.SIZE;
			},timeout:30000
		});
		xhr.open("GET","http:\/\/maktbti.com/api/books/Search/"+myapp.searchBar.value);
		xhr.send();
		
	}else{
		alertDialog.show();
	}
	myapp.searchBar.blur();
});

myapp.search_table=Ti.UI.createTableView({
	top:10,
	separatorColor: "#ccc",
});

myapp.search_body_view.add(myapp.searchIndicator);
myapp.search_body_view.add(myapp.search_table);
myapp.single_header_view.add(myapp.search_title);
myapp.container.add(myapp.single_header_view);
myapp.container.add(myapp.searchBar);
myapp.container.add(myapp.no_result);
myapp.container.add(myapp.search_body_view);
myapp.search_window.add(myapp.container);
myapp.search_window.open();
myapp.openWindows.push(myapp.search_window);
var alertDialog=Ti.UI.createAlertDialog({
	title:"تنبيه",
	message:"تأكد من وجود إنترنت",
	buttonNames:["موافق"]
});

common.createDrawer(myapp.search_window,myapp.drawerIcon,"search");