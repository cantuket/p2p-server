const User = require('../models/User');
const Listing = require('../models/Listing');
const config = require('../config');
const _ = require('lodash');


exports.createListing = (req,res) => {
		
	const item  = {
		equipmentType:req.body.equipmentType,
		make:req.body.make,
		model: req.body.model,
		watts:req.body.watts,
		bulb:req.body.bulb,
		condition:req.body.condition
	}; 

	const listing = new Listing({
		_user:req.user.id,
		location:req.body.location,
		availability:req.body.availability,
		price:req.body.price
	});
		
	for(var prop in item) {
	    if (item[prop] != undefined) {
		    listing.items.push(item);
	    	break;
	    }
	}

	listing.save((err)=> {
		if (err) {console.log(err);}
		res.json(req.body);
	});
}

exports.updateListing = (req,res) => {

	const listing = Listing.findOneAndUpdate({
		_user:req.user.id,
		_id:req.body['_id'],
	},
	{
		$set: {
			location:req.body.location,
			availability:req.body.availability,
			price:req.body.price
		}
	},
	{new : true}
	)
	
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

exports.addItem = (req,res) => {
	const listing = Listing.findOneAndUpdate({
		_user:req.user.id,
		_id:req.body.listingId,
	},
	{ $push: {'items' :req.body.values} },
	{safe: true, upsert: true, new : true}
	)
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

exports.updateItem = (req,res) => {
	
	Listing.update(
		 {'items._id':req.body.itemId},
	     {'$set':{'items.$':req.body.values}},
	     {safe: true, upsert: true, new : true},
	     function(err,model) {
		   	if(err){
	        	console.log(err);
	        	return res.send(err);
	        }
	        Listing.findOne({
				_user:req.user.id,
				_id:req.body.listingId
			})
	        
			.exec((err,results)=> {
				if (err) {console.log(err);}
				res.json(results);
			});
	 });
}

exports.deleteItem = (req,res) => {
	Listing.findOneAndUpdate({
		_user:req.user.id,
		_id:req.body.listingId,
	},
	{ $pull: {'items' :{_id:req.body.itemId}}},
	{safe: true, upsert: true, new : true}
	)
	
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

exports.fetchListings = (req,res) => {
	const listing = Listing.find({
		_user:req.user.id
	})
	
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

exports.fetchSingleListing = (req,res) => {
	const listing = Listing.findOne({
		_user:req.user.id,
		_id:req.params.listingId
	})
	
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

exports.deleteListing = (req,res) => {
	Listing.remove({
		_user:req.user.id,
		_id:req.body.listingId	
	})
	.exec((err,results)=> {
		if (err) {console.log(err);}
		res.json(results);
	});
}

