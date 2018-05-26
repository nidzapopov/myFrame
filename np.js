var np = function(tip,table,url){
	this.tip = tip;
	this.elements = $('['+this.tip+']');
	this.table = table;
	this.url = url;
	this.get_data();
};

np.prototype={
	/*
	 * 
	 * VALIDATION DATA
	 * SAVE DATA
	 * REFRESH DATA
	 * 
	 * np.save(function(id){
	 * 		// return id of new save data
	 * });
	 * 
	 */
	save:function(cb){
		var validation = this.validation(); // pozivanje validacije
		if(validation){ // ako je validacija dobra
			var data_all = this.data;  // svi podaci
			var obj = this.create_object(); // kreiranje objekta
			var flag = false; 
			obj['action']='save'; // dodavanje uslova za php fajl
			obj['table']=this.table; // dodavanje naziva tabele
			this.ajax(obj,false,'POST',function(data){ // ajax
				if(data[0] == 'error'){
					cb('error');
				}else{
					obj.id = data[0];
					flag = true;
				}
			});
			if(flag){
				this.refresh_data(obj,'save'); // resetovanje podataka
				cb(obj);
			}
		}else{
			cb(false);
		}
	},
	/*
	 * 
	 * VALIDATION DATA
	 * UPDATE DATA
	 * REFRESH DATA
	 * 
	 * np.update(id,function(obj){
	 * 		// return obj of update data
	 * });
	 * 
	 */
	update:function(id,cb){
		var validation = this.validation(); // pozivanje validacije
		if(validation){ // ako je validacija dobra
			var data_all = this.data; // svi podaci
			var obj = this.create_object(); // kreiranje objekta
			var flag = false;
			obj['action']='update'; // dodavanje uslova za php fajl
			obj['table']=this.table; // dodavanje naziva tabele
			obj['id']=id; // dodavanje id
			this.ajax(obj,false,'POST',function(data){ // ajax
				if(data[0] == 'ok'){
					flag = true;
				}
			});
			if(flag){
				this.refresh_data(obj,'update');  // resetovanje podataka
				cb('ok');
			}else{
				cb('error');
			}
		}else{
			cb(false);
		}
	},
	/*
	 * 
	 * 
	 * REMOVE DATA
	 * REFRESH DATA
	 * 
	 * np.remove(id,function(obj){
	 * 		// return if everything ok
	 * });
	 * 
	 */
	remove:function(id,cb){
		var data_all = this.data; // svi podaci
		var flag = false;
		var obj = {
			'id':id,
			'action':'delete'
		};
		obj['table']=this.table; // dodavanje tabele
		this.ajax(obj,false,'POST',function(data){ // ajax
			if(data[0]=='ok'){
				flag = true;
			}else{
				cb('error');
			}
		});
		if(flag){
			this.refresh_data(obj,'remove'); // reseotvanje podataka
			cb('ok');
		}else{
			cb('error');
		}
	},
	/*
	 * 
	 * CALL ALL DATA
	 * 
	 * np.get_data(function(data){
	 * 		// return all data
	 * });
	 * 
	 */
	get_data:function(){
		var obj = {
			'action':'getAll',
			'table':this.table
		};
		var datae ;
		this.ajax(obj,false,'POST',function(data){
			datae = data;
		});
		this.data = datae;
	},
	/*
	 * 
	 * CREATE OBJECT 
	 * 
	 * np.create_object(function(data){
	 * 		// return obj
	 * });
	 * 
	 */
	create_object:function(){
		var allElements = this.elements;
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
	/*
	 * 
	 * CREATE UL LI 
	 * x,y parameter to set innerHTML
	 * wrap parameter to append
	 */
	create_li:function(x,y,wrap){
		var data = this.data;
		var array_li = [];
		document.getElementById(wrap).innerHTML='';
		for(var i=0;i<data.length;i++){
			var li = document.createElement('li');
			li.setAttribute('data-id',data[i].id);
			if(arguments.length == 2){
				li.innerHTML = data[i][x];
			}else{
				li.innerHTML = data[i][x] +' '+ data[i][y];
			}
			document.getElementById(wrap).appendChild(li);
			array_li.push(li);
		}
		var li_para = [];
		if(arguments.length == 2){
			li_para.push(x,y);
		}else{
			li_para.push(x,y,wrap);
		}
		this.li_para = li_para;
		this.li = array_li;
	},
	refresh_data:function(obj,check){
		var data_all = this.data;
		if(check == 'save'){
			delete obj.action;
			delete obj.table;
			data_all.push(obj);
			if(this.li != undefined){
				var li = document.createElement('li');
				li.setAttribute('data-id',obj.id);
				if(this.li_para.length == 2){
					li.innerHTML = obj[this.li_para[0]];
					document.getElementById(this.li_para[1]).appendChild(li);
				}else{
					li.innerHTML = obj[this.li_para[0]] +' '+ obj[this.li_para[1]];
					document.getElementById(this.li_para[2]).appendChild(li);
				}
				this.li.push(li);
			}
		}else if(check == 'update'){
			delete obj.action;
			delete obj.table;
			for(var i=0;i<data_all.length;i++){
				if(data_all[i].id == obj.id){
					data_all.splice(i,1);
				}
			}
			data_all.push(obj);
			if(this.li != undefined){
				var li_arr = this.li;
				for(var i=0;i<li_arr.length;i++){
					var id = li_arr[i].getAttribute('data-id');
					if(id == obj.id){
						if(this.li_para.length == 2){
							li_arr[i].innerHTML = obj[this.li_para[0]];
						}else{
							li_arr[i].innerHTML = obj[this.li_para[0]] +' '+ obj[this.li_para[1]];
						}
					}
				}
			}
		}else if(check == 'remove'){
			for(var i=0;i<data_all.length;i++){
				if(data_all[i].id == obj.id){
					data_all.splice(i,1);
				}
			}
			if(this.li != undefined){
				var li_arr = this.li;
				for(var i=0;i<li_arr.length;i++){
					var id = li_arr[i].getAttribute('data-id');
					if(id == obj.id){
						li_arr[i].remove();
						li_arr.splice(i,1);
					}
				}
			}
		}
	},
	ajax:function(obj,async,type,cb){
		$.ajax({
			type: type,
			url: this.url,
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
	validation:function(){
		var allElements = this.elements;
		var flag = true;
		
		for(var i=0;i<allElements.length;i++){
			if(allElements[i].type == 'checkbox' || allElements[i].type == 'radio'){
				var name = allElements[i].name;
				var req = allElements[i].getAttribute('req');
				if(req !== null){
					if($('[name='+name+']:checked').length == 0){
						this.validationNotification(allElements[i],'checkbox');
						flag = false;
					}
				}
			}else{
				var val = this.validationCheck(allElements[i]);
				if(val != 'ok'){
					this.validationNotification(allElements[i],val);
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



















