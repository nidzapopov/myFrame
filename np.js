var np = function(tip){
	this.tip = tip;
};

np.prototype={
	save:function(url,cb){
		var vali = new validation(this.tip);
		var validacija = vali.validationStart();
		if(validacija){
			var obj = np.createObject();
			np.ajax(obj,false,'POST',url,function(data){
				cb(data);
			});
		}else{
			cb(false);
		}
	},
	update:function(url,cb){
		var vali = new validation(this.tip);
		var validacija = vali.validationStart();
		if(validacija){
			var obj = np.createObject();
			np.ajax(obj,false,'POST',url,function(data){
				cb(data);
			});
		}else{
			cb(false);
		}
	},
	remove:function(id,url,cb){
		np.ajax({id:id},false,'POST',url,function(data){
			cb(data);
		});
	},
	getData:function(url,cb){
		np.ajax({},false,'POST',url,function(data){
			cb(data);
		});
	},
	createObject:function(){
		var allElements = $('['+this.tip+']');
		var obj = {};
		for(var i=0;i<allElements.length;i++){
			var attr = allElements[i].getAttribute(this.tip);
			if(allElements[i].type == 'checkbox' || allElements[i].type == 'radio'){
				if(allElements[i].type == 'checkbox'){
					if(allElements[i].checked){
						var stariO = obj[attr];
						if(stariO == undefined){
							obj[attr]=allElements[i].value;
						}else{
							obj[attr] = stariO+','+allElements[i].value+',';
						}
					}
				}else{
					if(allElements[i].checked){
						obj[attr]=allElements[i].value;
					}
				}
			}else{
				obj[attr]=allElements[i].value;
			}
		}
		return obj;
	},
	ajax:function(obj,async,type,url,cb){
		$.ajax({
			type: type,
			url: url,
			dataType: 'json',
			data: obj,
			async:async,
			success: function(resultData){
				cb(resultData);
			},
			error:function(error) { 
				cb(error.responseText);
			}
		});
	},
};


var np = new np('data-tip');


function init(){
	np.save('/project/save',function(data){
		console.log(data);
	});
}

















