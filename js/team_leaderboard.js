function tournamentTp() {
	this.asideurl = 'http://api.development.mastergolf.cn/v10/tournament/tournaments/sidebar?uuid='; //侧栏api
	this.rankingurl = 'http://api.development.mastergolf.cn/v10/tournament/teams?group_uuid=';
	this.asidelistul = document.getElementById('asidelistul');
	this.ranklistuuid = '';
	this.ranklisttalbe = document.getElementById('ranklisttalbe');
	this.noticebox=document.getElementById('noticebox');
	this.notice=document.getElementById('notice');
	this.loading = document.getElementById('loading');
	
	this.tournament_uuid=getUrlParam('tournament_uuid');
    this.tournament_uuid = 'c533f3d3-9ff0-452a-8816-8c937081d939'//2个
   //this.tournament_uuid = '2f7166a5-013c-4a50-b43c-48e566dd3b47'//4个
	this.asideindex =sessionStorage.getItem('asideindex') ||  getUrlParam('asideindex') || 0;
};
//ajax获取侧边栏数据的方法
tournamentTp.prototype.ajaxGetAsideList = function() {
	var self = this;
	//	var _uuid = '2f7166a5-013c-4a50-b43c-48e566dd3b47'
//	var _uuid = 'c533f3d3-9ff0-452a-8816-8c937081d939';
	$.ajax({
		type: "get",
		url: self.asideurl + self.tournament_uuid,
		cache: false,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertAsideList(data.data)
			} 
		},
		error: function() {
		}
	});
};
//插入侧边栏数据的方法
tournamentTp.prototype.insertAsideList = function(data) {
	var self = this;
	var _html = "";
	self.ranklistuuid = data[self.asideindex].uuid;
	var _currentClass;
	for (var i = 0; i < data.length; i++) {
		_currentClass = ''
		if (self.asideindex == i) {
			_currentClass = 'current';
		}
		if (data[i].element == "group") {
			_html += '<li  data-type="group"  class="' + _currentClass + '"   data-uuid="' + data[i].uuid + '"  data-index="'+i+'" ><a href="javascript:void(0)" > <span class="iconfont   icon-paihang"></span>' + data[i].name + '</a></li>';
		} else if (data[i].element == "tees") {
			_html += '<li  data-type="tees"    class="' + _currentClass + '"    data-uuid="' + data[i].uuid + '"  data-index="'+i+'" ><a href="javascript:void(0)" > <span class="iconfont   icon-time"></span>' + data[i].name + '</a></li>';
		}
	}
	self.asidelistul.innerHTML += _html;
	self.ajaxRankListData(self.ranklistuuid);
	self.asideListTapFn();
};
//侧边栏点击列表处理的方法
tournamentTp.prototype.asideListTapFn = function() {
	var self = this;
	var _li = self.asidelistul.querySelectorAll('li');
	for (var i = 0; i < _li.length; i++) {
		_li[i].addEventListener('tap', function() {
			for (var j = 0; j < _li.length; j++) {
				_li[j].setAttribute('class', '');
			}
			this.setAttribute('class', 'current');
			asideMove(0);
			if (this.getAttribute('data-type') == 'group') {
				if (this.getAttribute('data-uuid') != self.ranklistuuid) {
					self.ranklistuuid = this.getAttribute('data-uuid');
					self.ajaxRankListData(self.ranklistuuid);
				}
			}else{
				window.location.href='tee_time.html?tee_uuid=' + this.getAttribute('data-uuid') + '&tournament_uuid=' + self.tournament_uuid + '&asideindex=' +this.getAttribute('data-index')  + '' 
			}
			sessionStorage.setItem('asideindex',this.getAttribute('data-index'))
		}, false);
	}
};
//ajax获取排行榜数据的方法
tournamentTp.prototype.ajaxRankListData = function(uuid) {
	var self = this;
	$.ajax({
		type: "get",
		url: self.rankingurl + uuid,
		dataType:'json',
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertRankList(data.data.teams);
			    self.insertNotice(data.data);
				self.setLoading();
			} else {
				self.setLoading('获取数据失败');
			}
		},
		error: function() {
			self.setLoading('获取数据失败');
		}
	});
};
//插入排行榜数据dom 的方法
tournamentTp.prototype.insertRankList = function(data) {
	var self = this;
	var _html = '<thead><th width="12%">排名</th><th width="12%">队徽</th><th width="52%">队名</th><th width="12%">成绩</th><th width="12%">总计</th></thead>'
	for (var i = 0; i < data.length; i++) {
		_html += '	<tr><td>' + data[i].position + '</td><td><img src="' + data[i].image + '" class="img-responsive"></td><td><a href="team_detail.html?teamdetail_uuid=' + data[i].uuid + '">' + data[i].name + '</a></td><td>' + data[i].score + '</td><td>' + data[i].total + '</td></tr>'
	}
	self.ranklisttalbe.innerHTML = _html;
};
tournamentTp.prototype.insertNotice=function(data){
//	console.log(data)
	var self=this;
   if(data.notification!=""){
   	self.notice.innerText=data.notification;
   	self.noticebox.style.display='block';
   }
}


//loading 处理方法
tournamentTp.prototype.setLoading = function(text,back) {
	var self = this;
	if (!text&&document.getElementById('loading')) {
		setTimeout(function() {
			document.body.removeChild(self.loading);
		}, 500)
	} else {
		var _html='<p>' + text + '</p>';
		 if(back){
		 	_html+='<a href="javascript:history.go(-1)" >返回</a>'
		 }
		self.loading.innerHTML =_html;
	}
};

var tournamentTp = new tournamentTp();
//从获取侧边数据开始
tournamentTp.ajaxGetAsideList();

