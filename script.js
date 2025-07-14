const settings = {
	async: true,
	crossDomain: true,
	url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live',
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e7ffbdad2emshc9dc3e52a70e12ep1cf0a7jsn35b695858d83',
		'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

fetch(settings.url, {method: settings.method, headers: settings.headers})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching data: ' + response.statusText);
        }
        return response.json();
    })
    .then (data => {
        (data.typeMatches.forEach(typeMatch=> {
        console.log("Match type: ", typeMatch.matchType);
        typeMatch.seriesMatches.forEach(seriesMatch=>{
            if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches){
                const series = seriesMatch.seriesAdWrapper;
                console.log("Series Name: ", series.seriesName);
                series.matches.forEach(match=> {
                    console.log(match.matchInfo.matchDesc);
                    console.log("Match Format: ", match.matchInfo.matchFormat);
                    console.log("start date: ", match.matchInfo.startDate);
                    console.log("Toss: ", match.matchInfo.status);
                    console.log("Currently: ", match.matchInfo.state);
                    console.log(match.matchInfo.team1.teamSName, " vs ", match.matchInfo.team2.teamSName);
                    console.log("Happening at: ", match.matchInfo.venueInfo.ground,", ", match.matchInfo.venueInfo.city);
                    if (match.matchInfo.currBatTeamId == match.matchInfo.team1.teamId) {
                        console.log("Batting: ", match.matchInfo.team1.teamSName);
                    }
                    if (match.matchInfo.currBatTeamId == match.matchInfo.team2.teamId) {
                        console.log("Batting: ", match.matchInfo.team2.teamSName);
                    }
                    if (match.matchScore.team1Score){
                        console.log(match.matchInfo.team1.teamSName+"Score: ", match.matchScore.team1Score.inngs1.runs, "/", match.matchScore.team1Score.inngs1.wickets, " in ", match.matchScore.team1Score.inngs1.overs, " overs");
                    }
                    if (match.matchScore.team2Score) {
                        console.log(match.matchInfo.team2.teamSName + " Score: ", match.matchScore.team2Score.inngs1.runs, "/", match.matchScore.team2Score.inngs1.wickets, " in ", match.matchScore.team2Score.inngs1.overs, " overs");
                    }
                })    
            }
        })
    }))
    });