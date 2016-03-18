

function scoreCard() {
	this.scoreCardsurl = 'http://api.development.mastergolf.cn/v10/tournament/scorecards/tp_scorecards?'; //team_uuid=sssss&tee_uuid=sss
	this.loading = document.getElementById('loading');
	this.name = document.getElementById('name');
	this.curr_score = document.getElementById('curr_score');
	this.thru = document.getElementById('thru');
	this.curr_total = document.getElementById('curr_total');
	this.started_hole=document.getElementById('started_hole');
	this.started_at=document.getElementById('started_at');
	this.table1 = document.getElementById('table1');
	this.table2 = document.getElementById('table2');
	
};
scoreCard.prototype.ajaxGetScoredcard = function() {
	var self = this;
	var _tee_uuid = getUrlParam('tee_uuid'),
		_team_uuid = getUrlParam('team_uuid')
	$.ajax({
		type: "get",
		url: self.scoreCardsurl + "team_uuid=" + _team_uuid + "&tee_uuid=" + _tee_uuid,
		dataType: 'json',
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.insertValue(data.data);
				self.setLoading();
			}else{
				self.setLoading('获取数据失败','back');
			}
		},error:function(){
				self.setLoading('获取数据失败','back');
		}
	});
};
scoreCard.prototype.insertValue = function(data) {
//	console.log(data)
	var self = this;
	self.name.innerHTML = data.name.replace(/,|，/, "</p><p>");
	self.curr_score.innerText = data.curr_score;
	self.thru.innerText = data.thru;
	self.curr_total.innerText = data.curr_total;
	self.insertTableOne(data);
	self.insertTabletwo(data);
};
//table1 的数据插入
scoreCard.prototype.insertTableOne = function(data) {
	var self = this;
	var _html = '<tr><td colspan="2" width="6.66%">Hole</td><td width="3.33%"><span>1</span></td><td width="3.33%"><span>2</span></td><td width="3.33%"><span>3</span></td><td width="3.33%"><span>4</span></td><td width="3.33%"><span>5</span></td><td width="3.33%"><span>6</span></td><td width="3.33%"><span>7</span></td><td width="3.33%"><span>8</span></td><td width="3.33%"><span>9</span></td><td width="3.33%">OUT</td></tr>';
	//par 
	_html += '<tr><td colspan="2">Par</td>';
	for (var i = 0; i < 10; i++) {
		_html += '<td><span>' + data.par[i] + '</span></td>';
	}
	_html += '</tr>';
	var arrname = data.name.split(',');
	_html += self.backNameTr(data, arrname);
	self.table1.innerHTML = _html;
	self.started_at.innerText=new Date(data.started_at).Format('MM月dd日');
	self.started_hole.innerText=data.started_hole;
	
}
//插入table2
scoreCard.prototype.insertTabletwo = function(data) {
	var self = this;
	var _html = '<tr><td colspan="2" width="6.66%">Hole</td><td width="3.33%"><span>1</span></td><td width="3.33%"><span>2</span></td><td width="3.33%"><span>3</span></td><td width="3.33%"><span>4</span></td><td width="3.33%"><span>5</span></td><td width="3.33%"><span>6</span></td><td width="3.33%"><span>7</span></td><td width="3.33%"><span>8</span></td><td width="3.33%"><span>IN</span></td><td width="3.33%">OUT</td></tr>';
	//par 
	_html += '<tr><td colspan="2">Par</td>';
	for (var i = 10; i < 20; i++) {
		_html += '<td><span>' + data.par[i] + '</span></td>';
	}
	_html += '</tr>';
	var arrname = data.name.split(',');
	_html += self.backNameTr(data, arrname, 10);
	self.table2.innerHTML = _html;
}

//返回姓名tr
scoreCard.prototype.backNameTr = function(data, arrname, startnumber) {
	var _start = startnumber || 0
	var _html = '';
	var _classname = '';
	if (data.round_format == 1 || data.round_format == 3) {
		for (var i = 0; i < arrname.length; i++) {
			_html += '<tr><td colspan="2">' + arrname[i] + '</td>';
			for (var j = (0 + _start); j < (10 + _start); j++) {
				var _c_value = data.strokes[i][j] - data.par[j];
				if (_c_value < -1) {
					_classname = 'color_1';
				} else if (_c_value == -1) {
					_classname = 'color_2';
				} else if (_c_value == 0) {
					_classname = 'color_3';
				} else if (_c_value == 1) {
					_classname = 'color_4';
				} else if (_c_value > 1) {
					_classname = 'color_5';
				}
				if (j == 9 || j == 18 || j == 19) {
					_classname = '';
				}
				if (data.strokes[i][j] == null) {
					data.strokes[i][j] = '-'
					_classname = '';
				}
				_html += '<td><span class="' + _classname + '">' + data.strokes[i][j] + '</span></td>';
			}
			_html += '</tr>';
		}
	} else if (data.round_format == 2) {
		_html += '<tr><td colspan="2"><p>' + arrname[0] + '</p><p>' + arrname[1] + '<p></td>';
		for (var j = (0 + _start); j < (10 + _start); j++) {
			var _c_value = data.strokes[0][j] - data.par[j];
			if (_c_value < -1) {
				_classname = 'color_1';
			} else if (_c_value == -1) {
				_classname = 'color_2';
			} else if (_c_value == 0) {
				_classname = 'color_3';
			} else if (_c_value == 1) {
				_classname = 'color_4';
			} else if (_c_value > 1) {
				_classname = 'color_5';
			}
			if (j == 9 || j == 18 || j == 19) {
				_classname = '';
			}
			if (data.strokes[0][j] == null) {
				data.strokes[0][j] = '-'
				_classname = '';
			}
			_html += '<td><span class="' + _classname + '">' + data.strokes[0][j] + '</span></td>';
		}
		_html += '</tr>';
	}
	return _html
}

//loading 处理方法
scoreCard.prototype.setLoading = function(text,back) {
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

var scorecard = new scoreCard();
scorecard.ajaxGetScoredcard();