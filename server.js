var documents = {};
//Main Body
app.set('view engine', 'ejs');
app.use(session({
    userid: "session",  
    keys: [SECRETKEY],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const createDocument = function(db, createddocuments, callback){
    const client = new MongoClient(mongourl);
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to the MongoDB database server.");
        const db = client.db(dbName);

        db.collection('restaurants').insertOne(createddocuments, function(error, results){
            if(error){
            	throw error
            };
            console.log(results);
            return callback();
        });
    });
}
app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
	res.render('getcity');
});

app.get('/weather',(req,res) => {
	var city = req.query.city;

	console.log(`City: ${city}`);
	setOptionPath(city);
	getWeatherDetails().then(data => {
    	data.city = city.toUpperCase();
    	res.render('weather', data);
   })
});

app.get('/api/weather',(req,res) => {
	var city = req.query.city;

	console.log(`City: ${city}`);
	setOptionPath(city);
	getWeatherDetails().then(data => {
    	res.end.json(data);
   })
})

app.listen(process.env.PORT || 8099);

const setOptionPath = (city) => {
	options.path = "/data/2.5/weather?q=" + city.replace(/ /g,"+") + "&units=metric&APPID=" + APIKEY;
}

async function getWeatherDetails() {
	let currTemp = 'N/A';
	let maxTemp = 'N/A';
	let minTemp = 'N/A';
	let letidity = 'N/A';

   const res = await fetch(`http://${options.host}/${options.path}`);
   const data = await res.json();
   
   currTemp = data.main.temp;
   maxTemp = data.main.temp_max;
   minTemp = data.main.temp_min;
   humidity = data.main.humidity;
   
   return({
      currTemp: currTemp,
      maxTemp: maxTemp,
      minTemp: minTemp,
      humidity: humidity
   });
}
