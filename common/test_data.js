const orderData = [{
	id: "20200413_1",
	tableNum: 1,
	isPaid: false,
	totalPrice: 25,
	detail: [{
		id: "01",
		name: "啤酒",
		num: 2,
		price: 5,
	}, {
		id: "02",
		name: "水饺",
		num: 1,
		price: 15,
	}]
}, {
	id: "20200413_2",
	tableNum: 2,
	isPaid: true,
	totalPrice: 0,
	detail: []
}, {
	id: "20200413_3",
	tableNum: 3,
	isPaid: false,
	totalPrice: 0,
	detail: []
}]

const dishData = [{
	id: "01",
	name: "啤酒",
	price: 5,
}, {
	id: "02",
	name: "水饺",
	price: 15,
}, {
	id: "03",
	name: "盖饭",
	price: 18,
}]

export {
	dishData,
	orderData,
}
