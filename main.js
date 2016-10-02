var Game = function(startButton) {
	startButton.style.display = 'none';
	this.input = document.createElement('textarea');
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.setUpCanvas(this.canvas, this.ctx);
	this.nextBtn = document.querySelector('.next');
	this.endBtn = document.querySelector('.finish');
	this.turns = [];
	this.inputArea = document.getElementById('user-input');
	this.displayArea = document.getElementById('display-area');
	this.displayArea.innerHTML = '';
	this.nextBtn.style.display = 'block';
	this.nextClick = this.nextClick.bind(this);
	this.nextBtn.addEventListener('click', this.nextClick);
	this.endGame = this.endGame.bind(this);
	this.endBtn.style.display = 'block';
	this.endBtn.addEventListener('click', this.endGame);
	this.startNewTurn();
}

Game.prototype.nextClick = function(e) {
	e.preventDefault();
	this.recordValue();
	this.startNewTurn();
}
Game.prototype.recordValue = function() {
	if ((this.turns.length-1) % 2) {
		var dataURL = this.canvas.toDataURL()
		this.currentTurn.setValue(dataURL);
	} else {
		this.currentTurn.setValue(this.input.value);
	}
}
Game.prototype.startNewTurn = function() {
	this.input.value = '';
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.currentTurn = new Turn(this.turns.length, this);
	this.turns.push(this.currentTurn);
	return this.currentTurn;
}
Game.prototype.showPreviousUserInput = function() {
	this.displayArea.innerHTML = '';
	var lastTurn = this.turns[this.turns.length-1];
	this.displayArea.appendChild(lastTurn.el);
}
Game.prototype.endGame = function(e) {
	e.preventDefault();
	this.recordValue();
	document.querySelector('.start').style.display = 'block';
	this.nextBtn.style.display = 'none';
	this.nextBtn.removeEventListener('click', this.nextClick);
	this.endBtn.style.display = 'none';
	this.endBtn.removeEventListener('click', this.endGame);
	this.displayEndOfGame();
}
Game.prototype.displayEndOfGame = function() {
	this.displayArea.innerHTML = '';
	this.inputArea.innerHTML = '';
	this.turns.forEach(turn => {
		this.displayArea.appendChild(turn.el);
	})
}

var Turn = function(n, game) {
	game.inputArea.innerHTML = '';
	if (n % 2) {
		this.type = 'img';
		this.el = document.createElement('img');
		game.inputArea.appendChild(game.canvas);
	} else {
		this.type = 'h2';
		this.el = document.createElement('h2');
		game.input.placeholder = n === 0 ?
			'Write any sentence you like!' :
			'Write a sentence that goes with the above picture'
		game.inputArea.appendChild(game.input);
	}
	if (n !== 0) {
		game.showPreviousUserInput();
	}
}

Turn.prototype.setValue = function(val) {
	this.value = val;
	if (this.type === 'h2') {
		this.el.innerHTML = val;
	} else {
		this.el.src = val;
	}
}

var game;

document.querySelector('input').addEventListener('click', function(e) {
	e.preventDefault();
	game = new Game(this);
})

Game.prototype.setUpCanvas = function(canvas, ctx) {
	function draw(ctx, e) {
		if (!e.x) {
			e.x = e.touches[0].clientX;
			e.y = e.touches[0].clientY;
		}
		ctx.lineTo(e.x-canvas.offsetLeft, e.y-canvas.offsetTop);
		ctx.stroke();
	}

	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight,
			drawFn = draw.bind(null, ctx);
	canvas.width = x-4;
	canvas.height = y/4*3;

	canvas.addEventListener('mousedown', function(e) {
		ctx.moveTo(e.x-canvas.offsetLeft, e.y-canvas.offsetTop);
		ctx.beginPath()
		document.addEventListener('mouseup', function() {
			canvas.removeEventListener('mousemove', drawFn);
			ctx.closePath();
		})
		canvas.addEventListener('mousemove', drawFn)
	})

	canvas.addEventListener("touchstart", function(e) {
		e.preventDefault();
		ctx.moveTo(e.x-canvas.offsetLeft, e.y-canvas.offsetTop);
		ctx.beginPath()
		canvas.addEventListener('touchend', function() {
			canvas.removeEventListener('touchmove', drawFn);
			ctx.closePath();
		})
		canvas.addEventListener('touchmove', drawFn);
	})
}
