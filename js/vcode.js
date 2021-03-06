document.addEventListener('DOMContentLoaded', function () {
	var d = document;
	var vcode;
	var imgUrl;
	var id;
	var changeImgCodeBtn = d.getElementById("change-img-code-btn");
	var okBtn = d.getElementById("ok-btn");
	var vErrText = d.getElementById("verify-error");
	var imgCode = d.getElementById('img-code');
	var spinShape = d.querySelector(".spin-shape");
	var spinner = null;

	function exit() {
		chrome.windows.remove(id);
	}

	function spinStart() {
		spinShape.style.display = "block";
		if (spinner) {
			spinner.spin(d.body);
			return;
		}
		var opts = {
			lines: 13, // The number of lines to draw
			length: 8, // The length of each line
			width: 5, // The line thickness
			radius: 20, // The radius of the inner circle
			corners: 1, // Corner roundness (0..1)
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#000', // #rgb or #rrggbb or array of colors
			speed: 1.4, // Rounds per second
			trail: 56, // Afterglow percentage
			shadow: true, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: 'auto', // Top position relative to parent in px
			left: 'auto' // Left position relative to parent in px
		};
		spinner = new Spinner(opts).spin(d.body);
	}

	function spinStop() {
		spinShape.style.display = "none";
		if (spinner) {
			spinner.stop();
		}
	}

	changeImgCodeBtn.onclick = function() {
		var newImgUrl = imgUrl + "&" + (new Date()).getTime();
		imgCode.src = newImgUrl;
	};

	okBtn.onclick = function() {
		var code = d.getElementById("input-code");
		if (!code.value) {
			code.focus();
			return;
		} else if (code.value.length != 4) {
			code.select();
			code.focus();
			return;
		}

		chrome.runtime.sendMessage(chrome.runtime.id, {
			cmd: "post",
			vcode: vcode,
			input: code.value
		});
		spinStart();
	};

	chrome.runtime.onMessage.addListener(function(msg, sender) {
		switch (msg.cmd) {
			case "init":
				id = msg.id;
				vcode = msg.vcode;
				imgUrl = msg.img;
				imgCode.src = msg.img;
				break;
			case "error":
				spinStop();
				vcode = msg.vcode;
				imgUrl = msg.img;
				imgCode.src = msg.img;
				vErrText.innerHTML = "验证码错误，请重新输入!";
				break;
			case "close":
				exit();
				break;
			default:
				break;
		}		
	});
	chrome.runtime.sendMessage(chrome.runtime.id, {
		cmd: "finish"
	});
});

