const Authentication = require('./controllers/authentication');
const Listings = require('./controllers/listings');
const passportService = require('./services/passport');
const passport = require('passport');
// var ImageUploader = require('./utils/imageUploader');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    // console.log(req.user);
    res.send(req.body);
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.post('/api/create-listing', requireAuth, Listings.createListing);
  app.post('/api/update-listing', requireAuth, Listings.updateListing);
  app.post('/api/add-item', requireAuth, Listings.addItem);
  app.post('/api/delete-item', requireAuth, Listings.deleteItem);
  app.post('/api/update-item', requireAuth, Listings.updateItem);
  
  app.get('/api/listings', requireAuth, Listings.fetchListings);
  app.get('/api/all-listings', requireAuth, Listings.fetchAllListings);
  app.get('/api/listing/:listingId', requireAuth, Listings.fetchSingleListing);
  app.post('/api/delete-listing', requireAuth, Listings.deleteListing);

  // app.post('/api/v1/image', function (req, res) {
  //     // console.log(req);
  //     var image = ImageUploader({
  //       data_uri: req.body.data_uri,
  //       filename: req.body.filename,
  //       filetype: req.body.filetype
  //     }).then(onGoodImageProcess, onBadImageProcess);
    
  //     function onGoodImageProcess(resp) {
  //       res.send({
  //         status: 'success',
  //         uri: resp
  //       });
  //     }
    
  //     function onBadImageProcess(resp) {
  //       res.send({
  //        status: 'error'
  //       });
  //     }
    
  //   });
}
