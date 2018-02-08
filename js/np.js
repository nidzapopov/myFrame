var objId; // id koji selektuje za prikaz, update ili delete

var np = function(){
	this.callData('users','sve',function(data){
		np.setOption('setListOp',data,['firstName']);
		np.setList('setListLi',data,['firstName','lastName']);
	});
};

np.prototype={
	setList:function(id,obj,arr){
		if(id != undefined && obj != undefined){
			if(arr.length != 0 && arr != undefined){
				var niz = [];
				for(var i=0;i<obj.length;i++){
					var li = np.createElement({ele:'li'});
					var str = '';
					for(var key in obj[i]){
						if(arr.indexOf(key) != -1){
							str += ' '+obj[i][key];
						}
					}
					li.innerHTML=str;
					var ele = np.id(id);
					ele.appendChild(li);
					niz.push(li);
				}
				return niz;
			}else{
				console.log('parametri nisu dobri');
				return false;
			}
		}else{
			console.log('parametri nisu dobri');
			return false;
		}
	},
	setOption:function(id,obj,arr){
		if(id != undefined && obj != undefined){
			if(arr.length != 0 && arr != undefined){
				var niz = [];
				for(var i=0;i<obj.length;i++){
					var option = np.createElement({ele:'option'});
					var str = '';
					for(var key in obj[i]){
						if(arr.indexOf(key) != -1){
							str += ' '+obj[i][key];
						}
					}
					option.innerHTML=str;
					var ele = np.id(id);
					ele.appendChild(option);
					niz.push(option);
				}
				return niz;
			}else{
				console.log('parametri nisu dobri');
			}
		}else{
			console.log('parametri nisu dobri');
		}
	},
	createTable:function(obj,niz,tbodyId,cb){
		var tbody = document.getElementById(tbodyId);
		if(typeof(obj) != 'object'){
			var new_tbody = np.createElement({ele:'tbody',attr:{'id':tbodyId}});
			tbody.parentNode.replaceChild(new_tbody, tbody);
			var objG = window[obj];
			window[obj+'trId'] = [];
			for(var i=0;i<objG.length;i++){
				var tr = np.createElement({ele:'tr',attr:{'data-table':objG[i].id}});
				for(var key in objG[i]){
					if(niz.indexOf(key) == -1){
						var td = np.createElement({ele:'td'});
						td.innerHTML=objG[i][key];
						tr.appendChild(td);
					}
				}
				new_tbody.appendChild(tr);
				window[obj+'trId'].push(tr);
			}
			cb(window[obj+'trId']);
		}else{
			var tr = np.createElement({ele:'tr',attr:{'data-table':obj.id}});
			for(var key in obj){
				if(niz.indexOf(key) == -1){
					var td = np.createElement({ele:'td'});
					td.innerHTML=obj[key];
					tr.appendChild(td);
				}
			}
			tbody.appendChild(tr);
			cb(tr);
		}
	},
	removeTableTr:function(tip){
		var glo = window[tip+'trId'];
		if(glo != undefined){
			for(var i=0;i<glo.length;i++){
				var attr = glo[i].getAttribute('data-table');
				if(attr == objId){
					var ele = glo[i];
					var parent = ele.parentNode;
					parent.removeChild(ele);
					glo.splice(i,1);
				}
			}
		}else{
			console.log('nema ni jedan tr');
		}
	},
	updateTableTr:function(tip,obj){
		var glo = window[tip+'trId'];
		if(glo != undefined){
			for(var i=0;i<glo.length;i++){
				var attr = glo[i].getAttribute('data-table');
				if(attr == objId){
					var deca = glo[i].children;
					
				}
			}
		}else{
			console.log('nema ni jedan tr');
		}
	},
	createObject:function(tip,cb){
		var array = [];
		var allElements = document.getElementsByTagName('*');
		var obj = {};
		for(var i=0;i<allElements.length;i++){
			if (allElements[i].getAttribute(tip) !== null){
				array.push(allElements[i]);
			}
		}
		for(var i=0;i<array.length;i++){
			if (array[i].tagName == 'INPUT'){
				if (array[i].type == 'text'){
					var attr = array[i].getAttribute(tip);
					obj[attr] = array[i].value;
				}else if(array[i].type == 'checkbox'){
					if(array[i].checked){
						var attr = array[i].getAttribute(tip);
						if(obj[attr] != undefined){
							obj[attr] += ','+array[i].value;
						}else{
							obj[attr] = array[i].value;
						}
					}
				}else if(array[i].type == 'radio'){
					if(array[i].checked){
						var attr = array[i].getAttribute(tip);
						obj[attr] = array[i].value;
					}else{
						var attr = array[i].getAttribute(tip);
						obj[attr] = '';
					}
				}
			}else if(array[i].tagName == 'SELECT'){
				var attr = array[i].getAttribute(tip);
				obj[attr] = array[i].value;
			}else if(array[i].tagName == 'TEXTAREA'){
				var attr = array[i].getAttribute(tip);
				obj[attr] = array[i].value;
			}
		}
		if(typeof(cb) == 'function'){
			cb(obj);
		}else{
			return obj;
		}
	},
	callData:function(table,all,cb){
		this.ajaxLoding('start'); 
		if(table != undefined && all != undefined){// proveravanje postojanje parametara
			if(table != '' && all != ''){// proveravanje parametara
				if(window[table] != undefined){// proveravanje global variable
					console.log('Global variable already exists');
					return false;
				}
				if(all != 'sve'){// ako trazimo posebne vrednosti iz tabele
					all.upit = 'upit';
					all.table = table;
					all.select = 'select';
					this.ajax(all,true,'POST',function(data){
						(data[0] != 'error') ? window[table] = data : window[table] = [];
						if(typeof(cb) === 'function'){
							cb(data);
						}
					});
				}else{
					var all = {'upit':'upit','table':table};// ako trazimo sve vrednosti iz tabele
					this.ajax(all,true,'POST',function(data){
						(data[0] != 'error') ? window[table] = data : window[table] = [];
						if(typeof(cb) === 'function'){
							cb(data);
						}
					});
				}
			}else{
				console.log('Call data parameter is empty');
				if(typeof(cb) === 'function'){
					cb('Call data parameter is empty');
				}
			}
		}else{
			console.log('Call data must have included all parameter');
			if(typeof(cb) === 'function'){
				cb('Call data must have included all parameter');
			}
		}
		this.ajaxLoding('stop');
	},
	ajaxLoding:function(metod){
		if(metod != undefined){
			if(metod == 'start'){
				var div = this.createElement({ele:'div',attr:{'class':'circleAjaxLoading'}});
				var div1 = this.createElement({ele:'div',attr:{'class':'circle1AjaxLoading1'}});
				var div2 = this.createElement({ele:'div',attr:{'class':'boxAjaxLoading1'}});
				var wrap = this.createElement({ele:'div',attr:{'class':'wrapAjaxLoading'}});
				div2.appendChild(div);
				div2.appendChild(div1);
				wrap.appendChild(div2);
				var body = document.getElementsByTagName('body');
				body[0].appendChild(wrap);
			}else{
				var div = document.getElementsByClassName('wrapAjaxLoading');
				div[0].parentNode.removeChild(div[0]);
			}
		}else{
			console.log('ajaxLoding must have included all parameter');
		}
	},
	ajax:function(obj,async,type,cb){
		$.ajax({
			type: type,
			url: 'server/server.php',
			dataType: 'json',
			data: obj,
			async:async,
			success: function(resultData){
				cb(resultData);
			},
			error:function(error) { 
				console.log(error.responseText);
				console.log("Something went wrong");
			}
		});
	},
	createElement:function(obj){
		for(var i in obj){
			switch(i){
				case "ele":
					var element = document.createElement(obj[i]);
					break;
				case "attr":
					this.attr(obj[i],element);
					break;
				case "html":
					element.innerHTML=obj[i];
					break;
			}
		}
		return element;
	},
	attr:function(p,x){
		for(var i in p){
            x.setAttribute(i,p[i]);
        }
	},
	validacija:function(tip,cb){
		var array = [];
		var allElements = document.getElementsByTagName('*');
		var flag = true;
		
		for(var i=0;i<allElements.length;i++){
			if (allElements[i].getAttribute(tip) !== null){
				array.push(allElements[i]);
			}
		}
		for(var i=0;i<array.length;i++){
			if (array[i].type == 'text' || array[i].tagName == 'TEXTAREA' || array[i].tagName == 'SELECT'){
				var flgaIn = true;
				var num = np.validacijaNum(array[i]);
				var emp = np.validacijaEmp(array[i]);
				var length = np.validacijaLen(array[i]);
				if(num == false || emp == false || length == false){
					flgaIn = false;
				} 
				if(flgaIn){
					$(array[i]).parent().find('.fieldAlert').remove();
				}else{
					if(!$(array[i]).parent().find('.fieldAlert').length){
						$("<span class='fieldAlert'>*</span>").insertAfter(array[i]);
					}
					flag = false;
				}
			}
		}
		if(flag){
			if(typeof(cb) === 'function'){
				cb(true);
			}else{
				return true;
			}
		}else{
			if(typeof(cb) === 'function'){
				cb(false);
			}else{
				return false;
			}
		}
	},
	validacijaNum:function(ele){
		var num = ele.getAttribute('num');
		if(num != null){
			var val = ele.value;
			if(isNaN(val)){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	},
	validacijaEmp:function(ele){
		var emp = ele.getAttribute('emp');
		if(emp != null){
			var val = ele.value;
			if(val == ''){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	},
	validacijaLen:function(ele){
		var length = ele.getAttribute('length');
		if(length != null){
			var val = array[i].value;
			if(val.length <= length){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	},
	saveData:function(table,obj,cb){
		if(table == undefined || table == ''){
			console.log('parameter is not good');
			if(typeof(cb) == 'function'){
				cb(false);
				return false;
			}else{
				return false;
			}
		}
		obj.upit = 'unos';
		obj.table = table;
		np.ajax(obj,true,'POST',function(data){
			if(window[table] != undefined){
				var global = obj.table;
				delete obj.upit;
				delete obj.table;
				obj.id = ''+data[0]+'';
				window[global].push(obj);
			}
			if(typeof(cb) == 'function'){
				cb(obj);
			}else{
				return obj;
			}
		});
	},
	updateData:function(table,obj,cb){
		if(objId == undefined || objId == ''){
			console.log('id is not good');
			if(typeof(cb) == 'function'){
				cb(false);
				return false;
			}else{
				return false;
			}
		}
		obj.id = objId;
		obj.upit = 'izmena';
		obj.table = table;
		np.ajax(obj,true,'POST',function(data){
			if(window[table] != undefined){
				var glob = window[table];
				delete obj.upit;
				delete obj.table;
				for(var i=0;i<glob.length;i++){
					if(glob[i].id == obj.id){
						glob.splice(i, 1);
					}
				}
				glob.push(obj);
				if(typeof(cb) == 'function'){
					cb(obj);
				}else{
					return obj;
				}
			}
		});
	},
	deleteData:function(table,cb){
		if(objId == undefined || objId == ''){
			console.log('id is not good');
			if(typeof(cb) == 'function'){
				cb(false);
				return false;
			}else{
				return false;
			}
		}
		var obj = {};
		obj.id = objId;
		obj.upit = 'brisanje';
		obj.table = table;
		np.ajax(obj,true,'POST',function(data){
			if(window[table] != undefined){
				var glob = window[table];
				for(var i=0;i<glob.length;i++){
					if(glob[i].id == obj.id){
						glob.splice(i, 1);
					}
				}
				objId = undefined;
				if(typeof(cb) == 'function'){
					cb(true);
				}else{
					return true;
				}
			}
		});
	},
	setData:function(arr,id,tip,cb){
		objId = id; // stavljamo id u globalnu kako bi znali koji objekat smo selektovali
		var array = [];
		var allElements = document.getElementsByTagName('*');
		
		for(var i=0;i<allElements.length;i++){
			if (allElements[i].getAttribute(tip) !== null){
				array.push(allElements[i]);
			}
		}
		var obj;
		for(var i=0;i<arr.length;i++){
			if(arr[i].id == id){
				obj = arr[i];
			}
		}
		for(var key in obj){
			for(var x=0;x<array.length;x++){
				if(key == array[x].getAttribute(tip)){
					if(array[x].tagName == 'INPUT'){
						if(array[x].type == 'checkbox'){
							var split = obj[key].split(',');
							for(var p=0;p<split.length;p++){
								if(split[p] == array[x].getAttribute('value')){
									array[x].checked = true;
								}
							}
						}else if(array[x].type == 'radio'){
							if(array[x].getAttribute('value') == obj[key]){
								array[x].checked = true;	
							}
						}else if(array[x].type == 'text'){
							array[x].value = obj[key];
						}
					}else{
						array[x].value = obj[key];
					}
				}
			}
		}	
		if(typeof(cb) == 'function'){
			cb(true);
		}else{
			return true;
		}
	},
	removeValue:function(tip,cb){
		var array = [];
		var allElements = document.getElementsByTagName('*');
		
		for(var i=0;i<allElements.length;i++){
			if (allElements[i].getAttribute(tip) !== null){
				array.push(allElements[i]);
			}
		}
		for(var i=0;i<array.length;i++){
			if(array[i].tagName == 'INPUT'){
				if(array[i].type == 'checkbox'){
					array[i].checked = false;
				}else if(array[i].type == 'text'){
					array[i].value = '';
				}else if(array[i].type == 'radio'){
					array[i].checked = false;
				}
			}else if(array[i].tagName == 'TEXTAREA'){
				array[i].value = '';
			}else if(array[i].tagName == 'SELECT'){
				array[i].value = '';
			}
		}
		objId = '';
		if(typeof(cb) == 'function'){
			cb(true);
		}else{
			return true;
		}
	},
	popUpMsg:function(tip,msg){
		var wrap = document.createElement('div');
			wrap.setAttribute('class','popUpMsg');
		var tipWrap = document.createElement('div');
		var p = document.createElement('p');
		switch(tip){
			case 'Info':
				wrap.setAttribute('class','popUpMsg popupInfo');
				tipWrap.innerHTML='<h2>Obaveštenje!</h2>';
			break;
			case 'Danger':
				wrap.setAttribute('class','popUpMsg popupDanger');
				tipWrap.innerHTML='<h2>Pažnja!</h2>';
			break;
			case 'Success':
				wrap.setAttribute('class','popUpMsg popupSuccess');
				tipWrap.innerHTML='<h2>Uspelo!</h2>';
			break;
		}
		p.innerHTML=msg;
		wrap.appendChild(tipWrap);
		wrap.appendChild(p);
		document.getElementById("popupId").appendChild(wrap);
		setTimeout(function(){
			var parent = wrap.parentNode;
			parent.removeChild(wrap);
		},2000);
	},
	getDate:function(clock){
		var date = new Date();
		var year = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		
		var h = date.getHours();
		var mi = date.getMinutes();
		var se = date.getSeconds();
		
		if(m <= 9){
			m = '0'+m;
		}
		
		if(clock != undefined){
			var all = year+'-'+m+'-'+d+' '+h+':'+mi+':'+se;
		}else{
			var all = year+'-'+m+'-'+d;
		}
		
		return all;
	},
	id:function(id){
		var id = document.getElementById(id);
		return id;
	},
	insertSingleImg:function(eleId,id,cb){
		var progresWrap = np.createElement({ele:'div',attr:{'class':'progressWrap'}});
		var progres = np.createElement({ele:'div',attr:{'class':'progressChild'}});
		progresWrap.appendChild(progres);
		var inp = np.id(eleId);
		inp.parentNode.insertBefore(progresWrap, inp.nextSibling);
		var inpWidth = inp.offsetWidth;
		progresWrap.style.width = inpWidth+'px';
		progres.innerHTML='20%';
		var file = $('#'+eleId+'').prop('files')[0];
		if(file != undefined){
			var flag = false;
			var name = file.name;
			var pos = name.split('.');
			var last = pos[pos.length - 1];
			var niz = ["jpg","jpeg","gif","png"];
			for(var i=0;i<niz.length;i++){
				if(niz[i] == last){
					flag = true;
				}
			}
			progres.innerHTML='40%';
			progres.style.width = '40%';
			if(flag){
				var form_data = new FormData();                  
				form_data.append('file', file);  
				form_data.append('upit', 'singleImg'); 
				form_data.append('name', file.name); 
				form_data.append('id', id); 
				$.ajax({
					url: 'server/server.php', 
					dataType: 'text',  
					cache: false,
					async:false,
					contentType: false,
					processData: false,
					data: form_data,                         
					type: 'post',
					success: function(response){
						progres.innerHTML='100%';
						progres.style.width = '100%';
						setTimeout(function(){
							inp.parentNode.removeChild(progresWrap);
						},2000);
						if(response[0] != 'error'){
							cb('ok');
						}else{
							cb('error');
						}
					}
				});
			}
		}
	}
};


var np = new np();




















