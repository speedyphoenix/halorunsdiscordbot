// Import the discord.js module
const discord = require('discord.js')

// Create an instance of Discord that we will use to control the bot
const bot = new discord.Client();




//Global Constants because JavaScript loads weirdly.
var result;
var arrayCount;
var instances;
var needsDM = false;
var validLink = false;

//Initialize JSON objects
var fs = require("fs");
var filecontents = fs.readFileSync("tricks.json");
var tricklist = require("./tricks.json");
var wrcommandlist = require("./shortnames.json");
var botToken = require("./clientid.json");


// Token for your bot, located in the Discord application console - https://discordapp.com/developers/applications/me/
const token = botToken.token;
const request = require("request");

function ValidTwitchYoutubeLink(url)
{
	if(url.indexOf('twitch.tv/videos/') !== -1 || url.indexOf('youtube.com/watch?v=') !== -1 || url.indexOf('youtu.be/') !== -1)
	{
		validLink = true;
	}
	else result = false;
}

function GetWRHelpList()
{
	result = "";
	for (var key in wrcommandlist)
	{
		result = result + "\n" + key /*+ " :: " + wrcommandlist[key]*/;
	}
}

function HaloGameStringFilter(gamename)
{
	var trickgame = "";
	switch (gamename)
		{
			case "halo":
			case "halo1":
			case "haloce":
			case "h1":
				trickgame = "HaloCE";
				break;
			case "halo2":
			case "h2":
				trickgame = "Halo2";
				break;
			case "mcc":
			case "h2a":
				trickgame = "Halo2MCC";
				break;
			case "halo3":
			case "h3":
				trickgame = "Halo3";
				break;
			case "odst":
			case "h3odst":
				trickgame = "Halo: ODST";
				break;
			case "reach":
				trickgame = "Halo:Reach";
				break;
			case "halo4":
			case "h4":
				trickgame = "Halo4";
				break;
			case "halo5":
			case "h5":
				trickgame = "Halo5";
				break;
			default:
				trickgame = "Game Not Found";
		}
		
		return trickgame;
}

function Occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    instances = n;
}

function GetHaloRunsRecordAPI(queryString)
{

	const url = "https://haloruns.com/api/request.php?wr=" + queryString;
	request.get(url, (error, response, body) => {
		//console.log("place 2" +body);
		if (body== '')
		{
			result = 'Nothing returned';
		}
		else
		{
			body = "\n" + body.replace('~~ ', "\n");
			result = body;
		}
		});
}

function GetHaloRunsRunnerAPI(queryString)
{

	const url = "https://haloruns.com/api/request.php?user=" + queryString;
	request.get(url, (error, response, body) => {
		//console.log("place 2" +body);
		if (body== '')
		{
			result = 'Nothing returned';
		}
		else
		{
			body = "\n" + body.replace('~~ ', "\n");
			result = body;
		}
		});
}

function GetHaloRunsLivestreamsAPI()
{

	const url = "https://haloruns.com/api/request.php?streams";
	request.get(url, (error, response, body) => {
		//console.log("place 2" +body);
		if (body== '')
		{
			result = 'Nothing returned';
		}
		else
		{
			body = "\n" + body.replace('~~ ', "\n");
			result = body;
		}
		});
}

function GetHaloRunsRecentRecordsAPI()
{
	const url = "https://haloruns.com/api/request.php?recent";
	request.get(url, (error, response, body) => {
		//console.log("place 2" +body);
		if (body== '')
		{
			result = 'Nothing returned';
		}
		else
		{
			Occurrences(body, '~~ ',)
			var count = 0;
			while(count < instances)
			{
				if(count === 0)
				{
					body = body.replace('~~ ' ,"\n");
				}
				else
				{
					body = "\n" + body.replace('~~ ' ,"\n");
				}
				count ++;
			}
			 result = body;
		}
		});
}

function GetSpeedrunVOD(lvlName, difficultystring)
{
	difficultystring = difficultystring.toLowerCase();
	var difficultyValue;
	wrcommandlist = require("./shortnames.json");
	
	if(difficultystring == "easy"  || difficultystring == "e" || difficultystring == "ez")
	{
		difficultyValue = '0';
	}
	else if(difficultystring == "legend" || difficultystring == "l" || difficultystring == "leg" || difficultystring == "legendary")
	{
		difficultyValue = '1';
	}
	else difficultyValue = '-1'
	
	if(difficultyValue == '1' || difficultyValue == '0')
	{
		if(wrcommandlist.hasOwnProperty(lvlName))
		{
			const url = "https://haloruns.com/api/request.php?query=wrvods&levelname=" + lvlName+ "&difficulty=" +difficultyValue;
			request.get(url, (error, response, body) => {
			//console.log("place 2" +body);
			if (body== '')
			{
				result = "VOD not found";
			}
			else
			{
				result = body;
			}
			});
		}
		else
		{
			result = "Invalid Run Name";
		}
	}
	else
	{
		"Invalid Difficulty"
	}
	
}

function GetSpeedrunTrickVOD(queryString)
{
	tricklist = require("./tricks.json");
	
	
	if(tricklist.hasOwnProperty(queryString))
	{
		result = tricklist[queryString].tricklink;
	}
	else
	{
		result = "VOD not found";
	}
}

function AddSpeedrunTrickVOD(trickname, trickvodlink)
{
	tricklist = require("./tricks.json");
	ValidTwitchYoutubeLink(trickvodlink)
	if(validLink !== false)
	{
		if(tricklist.hasOwnProperty(trickname))
		{
			result = "VOD already exists with that name";
		}
		else
		{
			tricklist[trickname] = {"trickgame":"", "tricklink":trickvodlink};
			var filestring = JSON.stringify(tricklist);
			fs.writeFile('tricks.json',filestring, function(err){if(err) throw err;});
			result = "Trick successfully added"
		}
	}
	else
	{
		result = "Not an accepted video link";
	}
}

function AddSpeedrunTrickVODWithGame(trickname, trickvodlink, trickgame)
{
	trickgame = HaloGameStringFilter(trickgame);
	tricklist = require("./tricks.json");
	ValidTwitchYoutubeLink(trickvodlink)
	if(validLink !== false)
	{
		if(tricklist.hasOwnProperty(trickname))
		{
			result = "VOD already exists with that name";
		}
		else
		{
			if(trickgame === "Game Not Found")
			{
				result = trickgame;
			}
			else
			{
				tricklist[trickname] = {"trickgame":trickgame, "tricklink":trickvodlink};
				var filestring = JSON.stringify(tricklist);
				fs.writeFile('tricks.json',filestring, function(err){if(err) throw err;});
				result = "Trick successfully added and categorized."
			}
		}
	}
	else
	{
		result = "Not an accepted video link";
	}
}

function AddSpeedrunTrickVODGame(trickname, trickgame)
{
	tricklist = require("./tricks.json");
	trickgame = HaloGameStringFilter(trickgame);
	
		if(tricklist[trickname].trickgame === trickgame)
		{
			result = "VOD already categorized in that game.";
		}
		else
		{
			if(trickgame === "Game Not Found")
			{
				result = "Game not found";
			}
			else
			{
				var tricklink = tricklist[trickname].tricklink;
				tricklist[trickname] = {"trickgame":trickgame, "tricklink":tricklink};
				var filestring = JSON.stringify(tricklist);
				fs.writeFile('tricks.json',filestring, function(err){if(err) throw err;});
				result = "Trick successfully categorized."
			}
		}
}

function RemoveSpeedrunTrickVOD(trickname)
{
	tricklist = require("./tricks.json");
	
	if(tricklist.hasOwnProperty(trickname))
	{
		delete tricklist[trickname];
		var filestring = JSON.stringify(tricklist);
		fs.writeFile('tricks.json',filestring, function(err){if(err) throw err;});
		result = "Trick successfully deleted"
	}
	else
	{
		result = "Trick already not stored.";
	}
}

function FindTricksByGame(gamename)
{
	tricklist = require("./tricks.json");
	gamename = HaloGameStringFilter(gamename);
	
	var list = "";
	
	if(gamename === "Game Not Found")
	{
		result = gamename;
	}
	else
	{
		for(trick in tricklist)
		{			
			if(tricklist[trick]["trickgame"] === gamename)
			{
				list = list + trick + "\n";
			}
			else
				continue;
		}
		
		if(list === "")
		{
			result = "No tricks are categorized for that game";
		}
		else
		{
				result = list;
				needsDM = true;
		}
	}
}

function FindTricksWithoutGame()
{
	tricklist = require("./tricks.json");
	var gamename = "";
	
	var list = "";
	
		for(trick in tricklist)
		{			
			if(tricklist[trick]["trickgame"] === gamename)
			{
				list = list + trick + "\n";
			}
			else
				continue;
		}
		
		if(list === "")
		{
			result = "No tricks are categorized for that game";
		}
		else
		{
			result = list;
		
			needsDM = true;
		}
}

function GetShortnamesListAndDescription()
{
	wrcommandlist = require("./shortnames.json")
	var list = "";
	
	for(name in wrcommandlist)
	{
		list = list + name  +  "\n"
	}
	if(list !== "")
	{
		result = list;
		needsDM = true;
	}
	else
		result = "List could not be found";
}


/******************************************************************************************************************************/

bot.on('ready', () => {
    console.log('Hello World!');
	
});

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {
    // So the bot doesn't reply to itself
    if (message.author.bot) return;
    
    // Check if the message starts with the `!` trigger
    if (message.content.indexOf('!') === 0) 
	{
		// Get the user's message excluding the `!`
        var text = message.content.substring(1);
        
		if(text.indexOf(' ') === -1)	//If the command doesn't contain a space modifier.
		{
			if(text === 'whoslive' ||  text === 'recentrecords' || text === 'help' || text === "trklist" || text === "wrhelp" || text === "trkgamelist" || text === "shortnames")
			{
				if(text == "whoslive")
				{
					GetHaloRunsLivestreamsAPI();
				}
				else if(text == "recentrecords")
				{
					GetHaloRunsRecentRecordsAPI()
				}
				else if(text == 'help')
				{
					result = "\n" + "Enter __**!wr**__ and the short name of the run (IL or full game). IE: !wr halo2." + "\n"
					+ "Enter __**!wrvod**__ and the name of the halo level or run in order to have the bot provide the video of the run from Haloruns.com. IE: !wrvod h3 easy \n"
					+ "Enter __**!recentrecords**__ to view the most recently set records" + "\n" 
					+ "Enter __**!whoslive**__ to view current runner livestreams"+ "\n" 
					+ "Enter __**!runner**__ and the name of the haloruns.com runner account to see their current points and latest time IE: !runner monopoli \n"
					+ "Enter __**!trk**__ and the name of the trick stored in the bot to have the bot present you with the video of the trick.  IE: !trk keyesbump \n"
					+ "Enter __**!trkadd**__ then the name of the trick you wish to add a video for, and then the link to the video. YouTube and Twitch links only please. IE: !trkadd trickname youtube.com/trickvideolink \n"
					+ "Enter __**!trkrm**__ and the name of a trick to remove a trick video from the trick list. IE: !tkrm keyesbump \n"
					+ "Enter __**!trklist**__ to view the list of trick names to use with the !trk commands. This will be given to you in a DM by the bot. \n"
					+ "Enter __**!trkgame**__ and the name of the trick you wish to categorize, and the game with which you wish to categorize. IE: !trkgame keyesbump h1 \n"
					+ "Enter __**!trkgamelist**__ and the game you want to see a list tricks assigned. Enter this command without any additional words and it will give a list of all uncategorized tricks. IE: !trkgamelist h1 OR !trkgamelist \n"
					+ "Enter __**!shortnames**__  to receive a list of the shortnames that are acceptable parameters for the !wr and !wrvod commands \n"
					+ "Enter __**!wrhelp**__ to receive a list of  parameters that are acceptable for the !wrvod and !wr commands."
					+ "Enter __**!help**__ to view this list of commands and help text at any time.";
					needsDM = true;
				}
				else if(text === "wrhelp")
				{
					GetWRHelpList();
					needsDM = true;
				}
				else if(text === "trklist")
				{
					var list = "";
					for(var key in tricklist)
					{
						list = list + "\n" + key;
						result = list;
						needsDM = true;
					}
				}
				else if(text === "trkgamelist")
				{
					FindTricksWithoutGame();
				}
				else if(text === "shortnames")
				{
					GetShortnamesListAndDescription();
				}
			}
			else
			{
				result = " that is not a valid command, sorry!";
			}
		}
		else //Else, if it DOES have a space modifier
		{
			command = text.split(' ');
			if(command[0] === "wr" || command[0] === "runner" || command[0] === "wrvod" || command[0] === "trk" || command[0] === "trkadd" || command[0] === "trkrm" || command[0] === "trkgame" || command[0] === "trkgamelist")
			{
				if(command[0] === "wr")
				{
					var dl = 0;
					dl = text.indexOf(' ');
					text = text.substring(dl+1);
					GetHaloRunsRecordAPI(text);
				}
				else if(command[0] === "runner")
				{
					var dl = 0;
					dl = text.indexOf(' ');
					text = text.substring(dl+1);
					GetHaloRunsRunnerAPI(text);
				}
				else if(command[0] === "wrvod")
				{
					if(command.length === 3)
					{
						GetSpeedrunVOD(command[1],command[2]);
					}
					else
					{
						result = "Unexpected amount of commands for wrvod. Please try again.";
					}
				}
				else if(command[0] === "trk")
				{
					var dl = 0;
					dl = text.indexOf(' ');
					text = text.substring(dl+1);
					GetSpeedrunTrickVOD(text);
				}
				else if(command[0] === "trkadd")
				{
					if(command.length === 3)
					{
						var trickname = command[1];
						var trickURL = command[2];
						AddSpeedrunTrickVOD(trickname,trickURL);
					}
					else if(command.length === 4)
					{
						var trickname = command[1];
						var trickURL = command[2];
						var trickgame = command[3];
						AddSpeedrunTrickVODWithGame(trickname, trickURL, trickgame);
					}
					else
					{
						console.log(command);
						result = "Incorrect number of parameters in last command";
					}
				}
				else if(command[0] === "trkrm")
				{
					var dl = 0;
					dl = text.indexOf(' ');
					trickname = text.substring(dl+1);
					RemoveSpeedrunTrickVOD(trickname);
				}
				else if(command[0] === "trkgame")
				{
					if(command.length === 3)
					{
						var trickname = command[1];
						var trickgame = command[2];
						AddSpeedrunTrickVODGame(trickname,trickgame);
					}
					else
					{
						console.log(command);
						result = "Incorrect number of parameters in last command";
					}
				}
				else if(command[0] === "trkgamelist")
				{
					gamename = command[1]
					FindTricksByGame(gamename);
				}
			}
			else
			{
				result = " that is not a valid command, sorry!";
			}
		}
		
        setTimeout(function () {
           console.log('Message Function Says: ' + result);
       
		   // Reply to the user's message
		   if(needsDM === false)
		   {
			   message.channel.send(result);
		   }
		   else
		   {
			   message.author.send(result);
		   }
		   
		   
		   //Reset Globals
		   result = '';
		   needsDM = false;
		   validLink = false;
       }, 500);
    }
	else
	{
		
	}
	
});



bot.login(token);
