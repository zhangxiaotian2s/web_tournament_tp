function teeTime() {
	this.asideurl = 'http://api.development.mastergolf.cn/v10/tournament/tournaments/sidebar?uuid='; //侧栏api
	this.teetimeurl = 'http://api.development.mastergolf.cn//v10/tournament/tee_times/tp_tees?group_uuid=';
	this.asidelistul = document.getElementById('asidelistul');
	this.teetimeuuid = '';
	this.courseimg = document.getElementById('courseimg');
	this.coursetitle = document.getElementById('coursetitle');
	this.selectbtn = document.getElementById('selectbtn');
	this.selectround = document.getElementById('selectround');
	this.teetimetable = document.getElementById('teetimetable');
	this.loading = document.getElementById('loading');
	this.tournament_uuid = getUrlParam('tournament_uuid');
    this.asideindex =sessionStorage.getItem('asideindex') ||  getUrlParam('asideindex') || 0;
};
//ajax获取侧边栏数据的方法
teeTime.prototype.ajaxGetAsideList = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.asideurl + self.tournament_uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertAsideList(data.data);
			} else {
				self.setLoading('获取数据失败','back');
			}
		},
		error: function() {
			self.setLoading('获取数据失败','back');
		}
	});
};
//插入侧边栏数据的方法
teeTime.prototype.insertAsideList = function(data) {
	var self = this;
	var _html = "";
	self.teetimeuuid = data[self.asideindex].uuid;
	var _currentClass;
	for (var i = 0; i < data.length; i++) {
		_currentClass = ''
		if (self.asideindex == i) {
			_currentClass = 'current';
		}
		if (data[i].element == "group") {
			_html += '<li data-type="group"  class="' + _currentClass + '"   data-uuid="' + data[i].uuid + '"  data-index="'+i+'"><a href="javascript:void(0)" > <span class="iconfont   icon-paihang"></span>' + data[i].name + '</a></li>';
		} else if (data[i].element == "tees") {
			_html += '<li  data-type="tees"   class="' + _currentClass + '"    data-uuid="' + data[i].uuid + '"  data-index="'+i+'"><a href="javascript:void(0)"  > <span class="iconfont   icon-time"></span>' + data[i].name + '</a></li>';
		}
	}
	self.asidelistul.innerHTML += _html;
	self.ajaxTeeTimeData(self.teetimeuuid);
	self.asideListTapFn();
};
//侧边栏点击列表处理的方法
teeTime.prototype.asideListTapFn = function() {
	var self = this;
	var _li = self.asidelistul.querySelectorAll('li');
	for (var i = 0; i < _li.length; i++) {
		_li[i].addEventListener('tap', function() {
			for (var j = 0; j < _li.length; j++) {
				_li[j].setAttribute('class', '');
			}
			this.setAttribute('class', 'current');
			asideMove(0);
			if (this.getAttribute('data-type') == 'tees') {
				if (this.getAttribute('data-uuid') != self.teetimeuuid) {
					self.teetimeuuid = this.getAttribute('data-uuid');
					self.ajaxTeeTimeData(self.teetimeuuid);
				}
			}else{
			window.location.href='team_leaderboard.html?tee_uuid='+this.getAttribute('data-uuid') + '&tournament_uuid=' + self.tournament_uuid + '&asideindex=' + this.getAttribute('data-index') + ''
			}
			sessionStorage.setItem('asideindex',this.getAttribute('data-index'));
		}, false);
	}
};
//ajax获取排行榜数据的方法
teeTime.prototype.ajaxTeeTimeData = function(uuid) {
	var self = this;
	$.ajax({
		type: "get",
		url: self.teetimeurl + uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertTeeTimeDate(data.data);
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
teeTime.prototype.insertTeeTimeDate = function(data) {
	var self = this;
	self.coursetitle.innerText = data.course_name;
	self.courseimg.src = data.image;
	var _html = '';
	for (var i = 0; i < data.tee_times.length; i++) {
		_html += '<li data-index='+i+'>' + data.tee_times[i].round_name + '</li>';
	}
	self.selectround.innerHTML = _html;
	self.selectbtn.innerText = data.tee_times[0].round_name;
	self.selectTapFn(data);
	self.insertTeeListFn(data.tee_times, 0);
};

//下拉选项的点击方法
teeTime.prototype.selectTapFn = function(data) {
	var self = this;
	self.selectbtn.addEventListener('tap', function() {
		if (self.selectround.style.display == '' || self.selectround.style.display == 'none') {
			self.selectround.style.display = 'block';
		} else {
			self.selectround.style.display = 'none';
		}
	}, false);
	var _sectulli = self.selectround.querySelectorAll('li');
	for (var i = 0; i < _sectulli.length; i++) {
		_sectulli[i].addEventListener('tap', function() {
			self.selectbtn.innerText = this.innerText;
			self.selectround.style.display = 'none';
			self.insertTeeListFn(data.tee_times, this.getAttribute('data-index'));
		}, false)
	}
};
//添加时间表列表
teeTime.prototype.insertTeeListFn = function(data, index) {
	var self = this;
	var _data = data[index].tee_times;
	var _html = '';
	for (var i = 0; i < _data.length; i++) {
		_html += '<tr>';
		_html += '<td width="20%">' + _data[i].started_hole + '</td><td width="25%">' + new Date(_data[i].started_at).Format('MM:dd') + '</td>';
		_html += '<td width="55%"><table class="nr_talbe">';
		for (var j = 0; j < _data[i].players.length; j++) {
			_html += '<tr>';
			_html +='<td width="30%"><img src='+_data[i].players[j].image+' class="img-responsive"></td>';
			_html += '<td width="70%" align="left">'+_data[i].players[j].name.replace(/,|\//, "<br/>")+'</td>';
			_html += '</tr>';
		}
		_html += '</table></td>';
		_html += '</tr>';
	}
	self.teetimetable.innerHTML = _html;
}
//loading 处理方法
teeTime.prototype.setLoading = function(text,back) {
	var self = this;
	if (!text&&document.getElementById('loading')) {
		setTimeout(function() {
			document.body.removeChild(self.loading);
		}, 500)
	} else {
		var _html='<p>' + text + '</p>';
		 if(back){
		 	_html+='<a href="javascript:history.go(-1)" >返回</a>';
		 }
		self.loading.innerHTML =_html;
	}
};
var teetime = new teeTime();
//从获取侧边数据开始
teetime.ajaxGetAsideList();