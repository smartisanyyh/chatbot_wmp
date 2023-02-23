<template>
	<view class="icon-voice">
		<text class="icon" :class="[`chat-${name}${index}`]"></text>
	</view>
</template>

<script>
export default {
	props: {
		play: Boolean,
		name: String,
	},

	data() {
		return {
			timer: null,
			index: "",
		};
	},

	watch: {
		play(val) {
			clearInterval(this.timer);

			if (val) {
				this.index = 1;

				this.timer = setInterval(() => {
					if (this.index == 1) {
						this.index = "";
					} else {
						this.index += 1;
					}
				}, 500);
			} else {
				this.index = "";
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.icon-voice {
	display: inline-block;

	.icon {
		font-size: 50rpx;
		position: relative;
		top: 4rpx;
	}
}
</style>
