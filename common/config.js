const homePageConfig = {
	fabPattern: {
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#91bef0',
		buttonColor: '#91bef0'
	},
	fabContent: [{
		iconPath: '/static/revoke.png',
		selectedIconPath: '/static/revoke.png',
		text: '撤销',
		active: false
	}, {
		iconPath: '/static/activity_un.png',
		selectedIconPath: '/static/activity.png',
		text: '新订单',
		active: false
	}],
}

const shopConfig = {
	tableNum: 6,
}

export {
	shopConfig,
	homePageConfig,
}
