const { BarrowerModel } = require('../../db/index');
const { BalanceModel } = require('../../db/index')
const BalanceController = require('./balance');
const AuthController = require('./auth');
var randomstring = require("randomstring");
class CryptoChequeController{

	getbalance(userid){
		console.log(userid);
		let users;
		users=userid.userarray;
		console.log(users,'wdiwdiwdiwh');
		return new Promise((resolve, reject)=> {
		BalanceModel.find({"userid" : {"$in" : users}})
		.then((result => {
			console.log(result,'user list btc bal..888*****************')
			resolve(result);
		}))			
		.catch(err => {
			reject(err);
			console.log("error in user0", err);
		})
		})
	}
	borrower(values){
		console.log("values: ", values)
		return new Promise ((resolve, reject)=> {
			const chequecode=randomstring.generate({
								  charset: 'hex',
								  length:7
								});
			const profit=( values.btc_amount * 0.5 ) /100
			const barrower=new BarrowerModel({
							cheque_code:chequecode,
							amount:values.btc_amount,
							agent_profit:profit,
							from:values.from,
							payto:values.payto,
							releasing_time:values.releasing_date,
							// SPTW,
							// APTW,
							T_BTC_TW:values.t_btc,
							T_LC_TW:values.t_lc,
							btc_balance:values.btc_balance,
							lc_balance:values.lc_balance,
							cheque_no:0,
							type: values.type,
							capitalId: values.capitalId
							// undue_cheque
						});
			barrower.save()
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getBorrower(){
		return new Promise((resolve, reject) =>{
			BarrowerModel.find({})
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getBorrowerPending(id){
		return new Promise((resolve, reject) =>{
			BarrowerModel.find({capitalId: id})
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getbarrowerById(id){
		return new Promise((resolve, reject) =>{
			BarrowerModel.findById({_id: id})
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getLedger(data){
			console.log(data);
		return new Promise((resolve, reject) =>{
			BarrowerModel.find({ $and: [ {payto:+data.userid}, { accepted: false }, { declined: false } ]})
			.then(result=> {
				console.log(result,'wdwdws')
				resolve(result);
			})
			.catch(err => {
				console.log('errrorrr')
				reject(err);
			})
		})
	}

	getTxHistory(data){
			console.log(data);
		return new Promise((resolve, reject) =>{
			BarrowerModel.find({ $and: [ {$or: [{payto:+data.userid}, {from:+data.userid}]}, { accepted: true } ] })
			.then(result=> {
				console.log(result,'wdwdws')
				resolve(result);
			})
			.catch(err => {
				console.log('errrorrr')
				reject(err);
			})
		})
	}

	acceptBorrower(data){
			console.log(data);
		return new Promise((resolve, reject) =>{
			BarrowerModel.findByIdAndUpdate({_id:data.chequeid},{$set:{accepted:true}})
			.then(result=> {
				console.log(result,'wdwdws')
				resolve(result);
			})
			.catch(err => {
				console.log('errrorrr')
				reject(err);
			})
		})	
	}

	declineBorrower(data){
			console.log(data);
		return new Promise((resolve, reject) =>{
			BarrowerModel.findByIdAndUpdate({_id:data.chequeid},{$set:{declined:true}})
			.then(result=> {
				console.log(result,'wdwdws')
				resolve(result);
			})
			.catch(err => {
				console.log('errrorrr')
				reject(err);
			})
		})	
	}

	deleteBorrower(data){
		console.log(data);
			return new Promise((resolve, reject) =>{
			BarrowerModel.findByIdAndDelete({_id:data.id})
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	deleteBorrowerCapital(data){
		console.log(data);
			return new Promise((resolve, reject) =>{
			BarrowerModel.findOneAndDelete({capitalId:data.id})
			.then(result=> {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	increaseBTCForPaid(data){
		const agent={
			agentid:data.agentid,
			amount:data.agentamount
		}
		const sender={
			senderid:data.senderid,
			amount:data.amount
		}
		return new Promise((resolve, reject) =>{
			BalanceController.increaseBtcAmount(data.reciverid, data.amount)
			.then(result=> {
				// For Changing the status to paid
				console.log("change status hit&&&&&&&&&&")
				this.changeStatus(data.chequeid);
				// this is for decreasing the sender BTC balance
				this.decreaseBTCFromSender(sender);
				// for increasing the balance of agent by agent profit
				// this.increaseBTCForAgent(agent);
				console.log("BTC BALANCE Increased");
				console.log(result);
				resolve(result);
			})
			.catch(err=> {
				console.log("Error in increasing btc balance");
				console.log(err);
				reject(err);
			})
		})
	}

		increaseBTCForAgent(data){
			BalanceController.increaseBtcAmount(data.agentid, data.amount)
			.then(result=> {
				console.log("BTC BALANCE of Agent Increased");
				console.log(result);
			})
			.catch(err=> {
				console.log("Error in increasing btc balance of Agent");
				console.log(err);
			})
	}

		decreaseBTCFromSender(data){
		return new Promise((resolve, reject) =>{
			BalanceController.increaseBtcAmount(data.senderid, -data.amount)
			.then(result=> {
				// For Changing the status to paid
				console.log("change status hit&&&&&&&&&&")
				this.changeStatus(data.chequeid);
				console.log("BTC BALANCE Decreased");
				console.log(result);
				resolve(result);
			})
			.catch(err=> {
				console.log("Error in decreasing btc balance");
				console.log(err);
				reject(err);
			})
		})
	}

	changeStatus(id){
		console.log(id,'edhebebebbebeb');
			BarrowerModel.findByIdAndUpdate({_id:id},{$set:{status:true}})
			.then(result=> {
				console.log(result,'1452363')
			})
			.catch(err => {
				console.log('errrorrr',err)
			})
	}
}

module.exports= new CryptoChequeController();
