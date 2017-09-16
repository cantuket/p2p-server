const User = require('../models/User');
const Listing = require('../models/Listing');
const config = require('../config');
const _ = require('lodash');
const AWS = require('aws-sdk');


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
	var s3options = {accessKeyId: process.env.S3accessKeyId,secretAccessKey: process.env.S3secretAccessKey}
	AWS.config = s3options;
	var s3Bucket = new AWS.S3( { params: {Bucket: 'p2p-test'} } );
	
	function deleteImage () {
		var oldImageKey = req.body.values.imageUrl.replace("https://s3.amazonaws.com/p2p-test/", "");
		var deleteParams = {Key:oldImageKey};
		s3Bucket.deleteObject(deleteParams, function(err, data){
			if (err) { 
			console.log(err);
			console.log('Error uploading data: ', data); 
			} else {
				console.log('succesfully deleted old image!');
			}
		});
	}

	function saveImage () {
		buf = new Buffer(req.body.imageData.replace(/^data:image\/\w+;base64,/, ""),'base64')
				
		var data = {
		Key: req.body.itemId +'_'+ req.body.imageName,  
		Body: buf,
		ContentEncoding: 'base64',
		ContentType: req.body.imageType
		};

		s3Bucket.putObject(data, function(err, data){
			if (err) { 
			console.log(err);
			console.log('Error uploading data: ', data); 
			} else {
			console.log('succesfully uploaded the image!');
			console.log(data);
			req.body.values.imageUrl = "https://s3.amazonaws.com/p2p-test/"+req.body.itemId +'_'+ req.body.imageName;
			updateTheListing();
			}
		});
		
	}

	function updateTheListing () {
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

	if (req.body.imageData) {
		if (req.body.values.imageUrl) {
			deleteImage();
		}
		saveImage();
	} else {
		updateTheListing();
	}
	
	
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

exports.fetchAllListings = (req,res) => {
	const listing = Listing.find()
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

