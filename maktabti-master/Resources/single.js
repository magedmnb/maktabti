myapp.single_window=Ti.UI.createWindow({
	theme:"Theme.AppCompat.Light.NoActionBar",
	orientationModes: [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	],
	
});

myapp.container=Ti.UI.createView({
	layout:"vertical",
	backgroundColor:"#FFF"
});

myapp.single_header_view=common.createHeaderView(false);


myapp.title=Ti.UI.createLabel({
	text:myapp.single_title,
	font:{fontSize:20,fontFamily:"NeoSans-regular"},
	color:"#FFF"
});
myapp.single_body_view=Ti.UI.createScrollView({
	//backgroundColor:"#e6e6ff",
	backgroundColor:"#FFF",
	layout:"vertical"
});

var audio_files=[];
var progress_labels=[];
var current_video=0;
var progressBar=[];
var touchend=false;


myapp.book_image=Ti.UI.createImageView({
	top:10,
	bottom:10,
	width:150,
	height:180,
	borderRadius:5,
	image:"http:\/\/"+(myapp.data[0].image_url==undefined?myapp.info.image_url:myapp.data[0].image_url)
});

myapp.desc=Ti.UI.createLabel({
	text:myapp.single_title,
	font:{fontSize:14,fontFamily:"NeoSans-regular"},
	color:"#2ba8db",
	text:myapp.data[0].desc==undefined?myapp.info.desc:myapp.data[0].desc,
	textAlign:"center",
	backgroundColor:"#FFF",
	//right:5
});
myapp.single_body_view.add(myapp.book_image);
myapp.single_body_view.add(myapp.desc);



for(var i=0;i<myapp.data.length;i++){
	audio_files[i]=Ti.Media.createAudioPlayer({
		url:"http:\/\/"+myapp.data[i].URL,
		preload: true,
		bufferSize:Number(1024)
	});
	
	
	myapp.row_view=Ti.UI.createView({
		height:130,
		layout:"vertical",
	});
	
	myapp.row__horizonatl_view=Ti.UI.createView({
		width:"50%",
		layout:"horizontal",
		height:60
	});
	
	myapp.play_btn=Ti.UI.createImageView({
		image:"images/play.png",
		width:60,
		height:60,
		number:i
	});
	
	
	myapp.play_btn.addEventListener('click',function(e){
		if(!audio_files[e.source.number].playing){
			audio_files[current_video].pause();
			current_video=e.source.number;
			audio_files[e.source.number].play();
		}else{
			audio_files[e.source.number].setTime(Number(audio_files[e.source.number].getTime())+10000);
		}
	});
	myapp.pause_btn=Ti.UI.createImageView({
		image:"images/pause.png",
		width:60,
		height:60,
		number:i
	});
	
	
	myapp.pause_btn.addEventListener('click',function(e){
		if(audio_files[e.source.number].playing && !audio_files[e.source.number].paused){
			audio_files[e.source.number].pause();
		}
	});
	
	myapp.stop_btn=Ti.UI.createImageView({
		image:"images/stop.png",
		width:60,
		height:60,
		number:i
	});
	
	myapp.stop_btn.addEventListener('click',function(e){
		if(audio_files[e.source.number].playing){
			current_video=0;
			audio_files[e.source.number].stop();
		}
	});
	
	myapp.part_title=Ti.UI.createLabel({
		text:myapp.data[i].Name,
		font:{fontSize:20,fontFamily:"NeoSans-regular"},
		color:"#000",
	});
	
	progress_labels[i]=Ti.UI.createLabel({
		font:{fontSize:14,fontFamily:"NeoSans-regular"},
		color:"#000",
		textAlign:"right",
	});
	
	progressBar[i]=common.generateProgressBar();
	//progressBar[i].id=myapp.data[i].URL;
	audio_files[i].addEventListener('progress',function(e) {
	    	progress_labels[current_video].text="مسموع "+common.time(Math.floor(e.progress/1000),common.time(audio_files[current_video].duration/(1000)))+" من "+common.time(audio_files[current_video].duration/(1000))+" دقيقه";
			progressBar[current_video].max=Math.floor(audio_files[current_video].duration/(1000));
			progressBar[current_video].value=Math.floor(e.progress/1000);
		
	});
	
	
	progressBar[i].addEventListener('touchend',function(e){
			touchend=true;
	});
	
	progressBar[i].addEventListener('change',function(e){
			if(touchend){
				audio_files[current_video].setTime(Math.floor(Number(e.value)*1000));
				touchend=false;
			}
	});
	

	if(Ti.App.Properties.getInt("user_id",0)==0){
		if(myapp.data[0].URL==null){
			myapp.part_title.text="لا توجد نبذه عن الكتاب";
			myapp.part_title.color="red";
		}
	}
	myapp.row_view.add(myapp.part_title);
	myapp.row__horizonatl_view.add(myapp.play_btn);
	myapp.row__horizonatl_view.add(myapp.pause_btn);
	myapp.row__horizonatl_view.add(myapp.stop_btn);
	myapp.row_view.add(myapp.row__horizonatl_view);
	myapp.row_view.add(progress_labels[i]);
	myapp.row_view.add(progressBar[i]);
	myapp.single_body_view.add(myapp.row_view);
}

myapp.single_header_view.add(myapp.title);
myapp.container.add(myapp.single_header_view);

myapp.container.add(myapp.single_body_view);
myapp.single_window.add(myapp.container);
myapp.single_window.open();
myapp.openWindows.push(myapp.single_window);

myapp.single_window.addEventListener('close',function() {
    audio_files[current_video].stop();
    if (Ti.Platform.osname === 'android')
    { 
        audio_files[current_video].release();
    }
});
common.createDrawer(myapp.single_window,myapp.drawerIcon,"");


