<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@font-face {font-family: "iconfont";
	  src: url('//at.alicdn.com/t/font_784318_5agpgqo8iun.eot?t=1567565072728'); /* IE9 */
	  src: url('//at.alicdn.com/t/font_784318_5agpgqo8iun.eot?t=1567565072728#iefix') format('embedded-opentype'), /* IE6-IE8 */
	  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
	  url('//at.alicdn.com/t/font_784318_5agpgqo8iun.woff?t=1567565072728') format('woff'),
	  url('//at.alicdn.com/t/font_784318_5agpgqo8iun.ttf?t=1567565072728') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
	  url('//at.alicdn.com/t/font_784318_5agpgqo8iun.svg?t=1567565072728#iconfont') format('svg'); /* iOS 4.1- */
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.icon-sousuo:before {
	  content: "\e62f";
	}
	
	.icon-shangcheng:before {
	  content: "\e72b";
	}
	
	.icon-jiarugouwuche:before {
	  content: "\e616";
	}
	
	.icon-jiantou:before {
	  content: "\e60c";
	}
	
	.icon-fanhui:before {
	  content: "\e618";
	}
	
	.icon-paixujiantoushang:before {
	  content: "\e74c";
	}
	
	.icon-paixujiantouxia:before {
	  content: "\e74d";
	}
	
	.icon-gouwuche:before {
	  content: "\e61b";
	}
	
	.icon-chenggong:before {
	  content: "\e632";
	}
	
	.icon-dashang:before {
	  content: "\e647";
	}
	
	.icon-iconfontzhizuobiaozhun34:before {
	  content: "\e621";
	}
	
	.icon-tui:before {
	  content: "\e65f";
	}
	
	.icon-weixinzhifu:before {
	  content: "\e653";
	}
	
	.icon-tianjia-xue:before {
	  content: "\e636";
	}
	
	.icon-taocan:before {
	  content: "\e72e";
	}
	
	.icon-yuyin:before {
	  content: "\e64e";
	}
	
	.icon-chakanmeal:before {
	  content: "\e6099";
	}
	
	.icon-qushi:before {
	  content: "\e608";
	}
	
	.icon-paixu:before {
	  content: "\e634";
	}
	
	.icon-jiaju-fanzhuo:before {
	  content: "\e611";
	}
	
	.icon-youhuiquanyouhuiquandaijinquan:before {
	  content: "\e625";
	}
	
	.icon-jianshao:before {
	  content: "\e609";
	}
	
	.icon-sanjiaoxing:before {
	  content: "\e6bd";
	}
	
	.icon-huoxingbushoulogo:before {
	  content: "\e875";
	}
	page{
		height: 100%;
	}
</style>
