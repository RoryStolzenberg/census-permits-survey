
var https = require('https');
var fs = require('fs');

/* Edit with your city and time range of choice */
var city = "Albemarle"; 
var startYear = 1990;
var endYear = 2017;

var outputStr = '';
outputStr += 'Survey,FIPS,FIPS,Region,Division,County,,1-unit,,,2-units,,,3-4 units,,,5+ units,,,1-unit rep,,,2-units rep,,,3-4 units rep,,, 5+units rep';
outputStr += 'Date,State,County,Code,Code,Name,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value,Bldgs,Units,Value';

async function main() {
	var promises = {};
	for(var i = startYear; i <= endYear; i++){
		var outputData = await fetchYear(i);
		outputStr += outputData+'\n';
	}
	
	await writeFile("/data/"+city+" Census Building Permit Survey.csv", outputStr); 
	var data = await readFile("/data/"+city+" Census Building Permit Survey.csv");
	console.log(data);
}

async function fetchYear(i){
    return new Promise((resolve, reject) => {
		https.get('https://www2.census.gov/econ/bps/County/co'+i+'a.txt', (res) => {
			// console.log(res);
			const statusCode = res.statusCode;

			var error;
			if (statusCode !== 200) {
				error = new Error('Request Failed.\n' +
							  `Status Code: ${statusCode}`);
			}
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
				return;
			}


			res.setEncoding('utf8');
			var year = i+'';
			var rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					console.log(rawData.length);
					var re = new RegExp('^.*' + city + '.*$', 'm'); //https://stackoverflow.com/questions/36414187/use-node-js-fs-readfile-to-return-the-line-in-which-a-string-appears
					var lines = re.exec(rawData);
					if (lines){
						console.log(/^[0-9][0-9][0-9][0-9]/.exec(lines)[0]);
						var line = lines[0];
						var year = /^[0-9][0-9][0-9][0-9]/.exec(lines)[0];
						console.log(year);
						resolve(line);
					}else{
						console.log('City %j not found', city);
					}

				} catch (e) {
					console.error(e.message);
				}
			});
		}).on('error', (e) => {
			console.error(`Got error: ${e.message}`);
		});
    });
}

//https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await
const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) rej(err)
            else res()
        })
    })

main();