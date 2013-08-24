var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ponypicker', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to database");
        db.collection('ponies', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving: ' + id);
    db.collection('ponies', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByName = function(req, res) {
    var name = req.params.name;
    db.collection('ponies', function(err, collection) {
        collection.findOne({'nameLower':name.toLowerCase()}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('ponies', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addPony = function(req, res) {
    var obj = req.body;
    console.log('Adding: ' + JSON.stringify(obj));
    db.collection('ponies', function(err, collection) {
        collection.insert(obj, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updatePony = function(req, res) {
    var id = req.params.id;
    var pony = req.body;
    console.log('Updating: ' + id);
    console.log(JSON.stringify(pony));
    db.collection('ponies', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, pony, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(pony);
            }
        });
    });
}
 
exports.deletePony = function(req, res) {
    var id = req.params.id;
    console.log('Deleting: ' + id);
    db.collection('ponies', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var ponies = [
    {
        name: "Twilight Sparkle",
		nameLower: "twilight sparkle",
		created: Date(),
        quote: "I like Mint",
        description: "Twilight Sparkle is a unicorn pony and one of the main protagonists. She lives at the Golden Oak Library along with her assistant, Spike, and her pet owl, Owlowiscious. She has an older brother, Shining Armor. She represents the element of magic.",
        picture: "saint_cosme.jpg",
		kind: "Unicorn",
		sex: "Female",
		residence: "Ponyville",
		occupation: ""
    },
    {
        name: "Rainbow Dash",
		nameLower: "rainbow dash",
		created: Date(),
        quote: "I like rainbows",
        description: "Rainbow Dash is a female Pegasus and one of the main characters in My Little Pony Friendship is Magic. She is responsible for maintaining the weather and clearing the skies in Ponyville. As a huge fan of The Wonderbolts, she dreams of one day joining their elite flying group. Known as the best flier in all of Equestria. Rainbow Dash has a pet tortoise named Tank. She represents the element of loyalty.",
        picture: "http://images2.wikia.nocookie.net/__cb20130305003910/mlp/images/thumb/a/af/Rainbow_Dash_napping_S02E06.png/180px-Rainbow_Dash_napping_S02E06.png",
		kind: "Pegasus",
		sex: "Female",
		residence: "Cloud house in the sky over Ponyville (formerly Cloudsdale)",
		occupation: "Ponyville Weather patrol, Wonderbolts trainee"
    }];
 
    db.collection('ponies', function(err, collection) {
        collection.insert(ponies, {safe:true}, function(err, result) {});
    });
 
};