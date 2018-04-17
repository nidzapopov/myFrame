
var npTable = function(podaci,th,elements){
	this.podaci = podaci;
	this.th = th;
	this.elements = elements;
	this.createTable(th);
	this.addTr(th);
};

npTable.prototype={
	setPodaci:function(obj,niz){
		this.podaci.push(obj);
		var tr = this.createTr(obj,niz);
		this.tr.push(tr);
		this.tbody.appendChild(tr);
	},
	getPodaci:function(){
		return this.podaci;
	},
	getTr:function(){
		return this.tr;
	},
	addTr:function(th){
		var tr = [];
		var podaci = this.podaci;
		for(var i=0;i<podaci.length;i++){
			var newTr = this.createTr(podaci[i],th);
			tr.push(newTr);
			this.tbody.appendChild(newTr);
		}
		this.tr = tr;
		return tr;
	},
	createTr:function(obj,niz){
		var tr = document.createElement('tr');
		for(var key in obj){
			if(key == 'id'){
				tr.setAttribute('data-id',obj[key]);
			}
			if(niz != undefined){
				if(niz.indexOf(key) != -1){
					var td = document.createElement('td');
					td.innerHTML=obj[key];
					tr.appendChild(td);
				}
			}else{
				var th = this.th;
				if(th.indexOf(key) != -1){
					var td = document.createElement('td');
					td.innerHTML=obj[key];
					tr.appendChild(td);
				}
			}
		}
		return tr;
	},
	createTable:function(niz){
		var table = document.createElement('table');
		var thead = document.createElement('thead');
		var tr = document.createElement('tr');
		var tbody = document.createElement('tbody');
		
		for(var i=0;i<niz.length;i++){
			var th = document.createElement('th');
			th.innerHTML=niz[i];
			tr.appendChild(th);
		}
		
		table.appendChild(thead);
			thead.appendChild(tr);
		table.appendChild(tbody);
		this.table = table;
		this.tbody = tbody;
		return this.table;
	}
};













