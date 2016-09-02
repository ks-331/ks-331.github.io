/*---------------# plg_extravote - ExtraVote Plugin---------------------------------------------------*/
function JVXVote(id,i,total,total_count,xid,show_counter,show_rating,rating_mode){
	var currentURL = window.location;
	var live_site = currentURL.protocol+'//'+currentURL.host+ev_basefolder;
	var info = document.getElementById('extravote_'+id+'_'+xid);
	var text = info.innerHTML;
	if (info.className != 'extravote-info voted') {
		info.innerHTML='<img src="'+live_site+'/plugins/content/extravote/images/loading.gif" border="0" align="absmiddle" /> '+'<small>'+extravote_text[1]+'</small>';
		var ajax=new XMLHttpRequest();
		ajax.onreadystatechange=function() {
		var response;
			if(ajax.readyState==4){
				setTimeout(function(){  
					response = ajax.responseText;
					if(response=='thanks') info.innerHTML='<small>'+extravote_text[2]+'</small>';
					if(response=='login') info.innerHTML='<small>'+extravote_text[3]+'</small>';
					if(response=='voted') info.innerHTML='<small>'+extravote_text[4]+'</small>';
				},500);
				setTimeout(function(){
					if(response=='thanks'){
						text = '';
						var newtotal  = total_count+1;
						var newrating = ((total + i)/(newtotal)).toFixed(2);
						if(show_rating!=0){
							if(rating_mode==1) {
								text+=extravote_text[7].replace('%s', newrating );
							} else {
								text+=extravote_text[7].replace('%s', Math.round(newrating*20)+'%' );
							}
						}
						if(show_counter!=0){
							if(newtotal!=1)	
								text+=extravote_text[5].replace('%s', newtotal );
							else
								text+=extravote_text[6].replace('%s', newtotal );
						}
						document.getElementById('rating_'+id+'_'+xid).style.width=parseInt(newrating*20)+'%';
					}
					info.innerHTML=text;
				},2000);
			}
		}
		ajax.open("GET",live_site+"/plugins/content/extravote/assets/ajax.php?task=vote&user_rating="+i+"&cid="+id+"&xid="+xid,true);
		ajax.send(null);
	}
	info.className = 'extravote-info voted';
}