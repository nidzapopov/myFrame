var validation = function(tip){
	this.tip = tip;
};

validation.prototype={
	validationStart:function(){
		var allInputs = $('input['+this.tip+']');
		var allSelect = $('select['+this.tip+']');
		var allTextarea = $('textarea['+this.tip+']');
		var flag = true;
		
		if(allInputs.length != 0){
			for(var i=0;i<allInputs.length;i++){
				if(allInputs[i].type == 'checkbox' || allInputs[i].type == 'radio'){
					var name = allInputs[i].name;
					var req = allInputs[i].getAttribute('req');
					if(req !== null){
						if($('[name='+name+']:checked').length == 0){
							this.validationNotification(allInputs[i],'checkbox');
							flag = false;
						}
					}
				}else if(allInputs[i].type == 'text'){
					var val = this.validationCheck(allInputs[i]);
					if(val != 'ok'){
						this.validationNotification(allInputs[i],val);
						flag = false;
					}
				}
			}
		}
		if(allSelect.length != 0){
			for(var i=0;i<allSelect.length;i++){
				var val = this.validationCheck(allSelect[i]);
				if(val != 'ok'){
					this.validationNotification(allSelect[i],val);
					flag = false;
				}
			}
		}
		if(allTextarea.length != 0){
			for(var i=0;i<allTextarea.length;i++){
				var val = this.validationCheck(allTextarea[i]);
				if(val != 'ok'){
					this.validationNotification(allTextarea[i],val);
					flag = false;
				}
			}
		}
		return flag;
	},
	validationCheck:function(ele){
		var req = ele.getAttribute('req');
		var num = ele.getAttribute('num');
		var email = ele.getAttribute('email');
		var length = ele.getAttribute('length');
		
		if(req !== null){
			if(ele.value == ''){
				return 'req';
			}
		}
		if(num !== null){
			if(isNaN(ele.value)){
				return 'num';
			}
		}
		if(email !== null){
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		var some = re.test(String(ele.value).toLowerCase());
    		if(!some){
    			return 'email';
    		}
		}
		if(length !== null){
			if(ele.value.length > length){
				return 'length';
			}
		}
		return 'ok';
	},
	validationNotification:function(ele,val){
		//console.log(ele,val)
	},
};
