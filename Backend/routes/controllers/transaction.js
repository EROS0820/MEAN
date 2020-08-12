const {	TransactionModel } = require('../../db/index');

class TransactionController {
	add(userid, amount, type, wallet, userB = -1, changes, fee) {
		const record = new TransactionModel({
			userid,
			amount,
			type,
			wallet,
			date: new Date(),
			userB,
			old: changes.old_balance,
			new: changes.new_balance,
			fee
		});

		record.save().then(() => {
			socketservice.send(userid, "transaction created", record);
		});
	}

	getLastTransaction(userid) {
		return TransactionModel.findOne({
			userid
		}).sort({
			date: -1
		}).then(record => {
			return record;
		});
	}

	getBTCReceivedAdmin() {
		return TransactionModel.find({
			type: "received",
			userB: -1
		}).then(records => {
			return records;
		});
	}

	getBTCSentAdmin() {
		return TransactionModel.find({
			type: "sent"
		}).then(records => {
			return records;
		});
	}

	getAllTransactions(userid) {
		return TransactionModel.find({
			userid
		}).then(records => {
			return records;
		});
	}

	getBTCReceivedCount() {
		return TransactionModel.find({
			type: "received"
		}).countDocuments().then(count => {
			return count;
		});
	}

	getBTCReceivedTodayCount() {
		const today_midnight = new Date();
		today_midnight.setHours(0, 0, 0, 0);
		return TransactionModel.find({
			type: "received",
			"date": {
				$gte: today_midnight
			}
		}).countDocuments().then(count => {
			return count;
		});
	}

	getBTCSentCount() {
		return TransactionModel.find({
			type: "sent"
		}).countDocuments().then(count => {
			return count;
		});
	}

	getBTCSentTodayCount() {
		const today_midnight = new Date();
		today_midnight.setHours(0, 0, 0, 0);
		return TransactionModel.find({
			type: "sent",
			"date": {
				$gte: today_midnight
			}
		}).countDocuments().then(count => {
			return count;
		});
	}
}

module.exports = new TransactionController();