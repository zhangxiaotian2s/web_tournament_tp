function teamDetail() {
	this.teamDetailurl = 'http://api.development.mastergolf.cn/v10/tournament/teams/detail?uuid=';
	this.selectluci = document.getElementById('selectul');
	this.selectbtn = document.getElementById('selectbtn');
	this.teamimg = document.getElementById('teamimg');
	this.teamtitle = document.getElementById('teamtitle');
	this.curr_total = document.getElementById('curr_total');
	this.team_total = document.getElementById('team_total');
	this.team_score = document.getElementById('team_score');
	this.teamDetailtable = document.getElementById('teamdetailtable');
	this.loading = document.getElementById('loading');
};
teamDetail.prototype.ajaxGetTeamDetails = function() {
	var self = this;
	var _uuid = getUrlParam('teamdetail_uuid');
	$.ajax({
		type: "get",
		url: self.teamDetailurl + _uuid,
		dataType: 'json',
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertSelectLi(data.data);
				self.insertDataValue(data.data, 0);
				self.setLoading();
			} else {
				self.setLoading('获取数据失败','back');
			}
		},
		error: function() {
			self.setLoading('获取数据失败','back');
		}
	});
};
//插入选项的dom数据
teamDetail.prototype.insertSelectLi = function(data) {
	var self = this;
	var _html = '';
	for (var i = 0; i < data.length; i++) {
		_html += '<li data-index=' + i + '>' + data[i].round_name + '</li>';
	}
	self.selectbtn.innerText = data[0].round_name;
	self.selectluci.innerHTML = _html;
	self.selectTapFn(data);
};
//下拉选项的点击方法
teamDetail.prototype.selectTapFn = function(data) {
	var self = this;
	self.selectbtn.addEventListener('tap', function() {
		if (self.selectluci.style.display == '' || self.selectluci.style.display == 'none') {
			self.selectluci.style.display = 'block';
		} else {
			self.selectluci.style.display = 'none';
		}
	}, false);
	var _sectulli = self.selectluci.querySelectorAll('li');
	for (var i = 0; i < _sectulli.length; i++) {
		_sectulli[i].addEventListener('tap', function() {
			self.selectbtn.innerText = this.innerText;
			self.selectluci.style.display = 'none';
			self.insertDataValue(data, this.getAttribute('data-index'))
		}, false)
	}
};
//插入数据内容
teamDetail.prototype.insertDataValue = function(data, index) {
//	console.log(data)
	var self = this;
	self.teamimg.src = data[index].image;
	self.teamtitle.innerText = data[index].team_name;
	self.curr_total.innerText = data[index].curr_total;
	self.team_total.innerText = data[index].team_total;
	self.team_score.innerText = data[index].team_score;
	var _datalist = data[index].player_scores;
	var _html =''
	      _html += '<thead><th width="20%">球员</th><th width="20%">前9</th><th width="20%">后9</th><th width="20%">总杆</th><th width="20%">成绩</th></thead>';
	for (var i = 0; i < _datalist.length; i++) {
		_html += '<tr data-tee-uuid="' + _datalist[i].tee_uuid + '"   data-team-uuid="'+data[index].team_uuid+'">';
		_html += '<td><p>' + _datalist[i].name.replace(/,|，/, "</p><p>") + '</p></td>';
		_html += '<td>' + _datalist[i].pl_out + '</td>';
		_html += '<td>' + _datalist[i].pl_in + '</td>';
		_html += '<td>' + _datalist[i].total + '</td>';
		_html += '<td>' + _datalist[i].score + '</td>';
		_html += '</tr>';
	}
	self.teamDetailtable.innerHTML =_html
	self.tableTrTapFn();
};
//跳转到计分卡页面
teamDetail.prototype.tableTrTapFn = function() {
	var self = this;
	var _tr = self.teamDetailtable.querySelectorAll('tr');
	for (var i = 0; i < _tr.length; i++) {
		_tr[i].addEventListener('tap', function() {
			window.location.href='scorecard.html?team_uuid='+this.getAttribute('data-team-uuid')+'&tee_uuid='+this.getAttribute('data-tee-uuid')+''
		}, false);
	}
};

//loading 处理方法
teamDetail.prototype.setLoading = function(text,back) {
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




var teamdetail = new teamDetail();
teamdetail.ajaxGetTeamDetails();