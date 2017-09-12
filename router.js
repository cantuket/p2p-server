const Authentication = require('./controllers/authentication');
const Listings = require('./controllers/listings');
const passportService = require('./services/passport');
const passport = require('passport');

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
  
  app.get('/api/listings', requireAuth, Listings.fetchListings);
  app.get('/api/listing/:listingId', requireAuth, Listings.fetchSingleListing);

}
