
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Black Hole Comics' });
};

exports.comic = function(req, res){
  var name = req.params.name;
  res.render('comics/' + name);
};

/*
 * GET partials.
 */
exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
