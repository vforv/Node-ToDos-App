module.exports = function(db) {
    return {
      requireAuth: function(req ,res, next) {
          var token = req.get('Auth');
          
          db.user.findByToken(token)
                  .then(function(user){
                      
                      req.user = user;
                      next();
          })
                  .catch(function(e){
                      res.status(401).send();
          });
      }  
    };
};