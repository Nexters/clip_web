var path = require('path');
var fs = require('fs');

function ImageCtrl() {

}

ImageCtrl.getImage = function (req, res) {
    var imagePath = path.join(__dirname, '../upload', req.params.name);
    res.sendFile(imagePath);
};

module.exports = ImageCtrl;


