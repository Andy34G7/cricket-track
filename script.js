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


async function fetchLive(){
    const response = await fetch(settings.url, {method: settings.method, headers: settings.headers})
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.statusText);
    }
    const data = await response.json();
    return data;
}
function Matches_display(data) {
    const container = document.getElementById('match-cont');
    container.innerHTML = '';
    const heading = document.createElement('h1');
    heading.textContent = "Live Matches";
    container.appendChild(heading);
    data.typeMatches.forEach(typeMatch => {
        const typeContainer = document.createElement('div');
        typeContainer.classList.add('match-type');
        const type = document.createElement('h2');
        type.textContent = typeMatch.matchType + " Matches";
        typeContainer.appendChild(type);
        typeMatch.seriesMatches.forEach(seriesMatch => {
            if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches){
                const seriesContainer = document.createElement('div');
                seriesContainer.classList.add('series-container');
                const series = document.createElement('h3');
                series.textContent = seriesMatch.seriesAdWrapper.seriesName;
                seriesContainer.appendChild(series);
                seriesMatch.seriesAdWrapper.matches.forEach(match => {
                    const matchCard = document.createElement('div');
                    matchCard.classList.add('match-card');

                    const matchInfo = match.matchInfo;
                    const matchDesc = document.createElement('h4');
                    matchDesc.textContent = matchInfo.matchDesc;
                    matchCard.appendChild(matchDesc);

                    const matchscore = document.createElement('p');
                    let scorestr = "";
                    let team1Score = "";
                    let team2Score = "";
                    if (match.matchScore.team1Score && match.matchScore.team1Score.inngs1) {
                        team1Score = match.matchScore.team1Score.inngs1.runs+"/" + match.matchScore.team1Score.inngs1.wickets + " (" + match.matchScore.team1Score.inngs1.overs + " overs)";
                    }
                    if (match.matchScore.team2Score && match.matchScore.team2Score.inngs1){
                        team2Score = match.matchScore.team2Score.inngs1.runs+"/" + match.matchScore.team2Score.inngs1.wickets + " (" + match.matchScore.team2Score.inngs1.overs + " overs)";
                    }
                    if (matchInfo.currBatTeamId === matchInfo.team1.teamId){
                        scorestr = matchInfo.team2.teamSName + " " + team2Score + " | " + matchInfo.team1.teamSName + " " + team1Score;
                    }
                    else if (matchInfo.currBatTeamId === matchInfo.team2.teamId) {
                        scorestr = matchInfo.team1.teamSName + " " + team1Score + " | " + matchInfo.team2.teamSName + " " + team2Score;
                    }
                    else {
                        scorestr = matchInfo.team1.teamSName + " " + team1Score + " | " + matchInfo.team2.teamSName + " " + team2Score;
                    }
                    matchscore.textContent = scorestr;
                    matchCard.appendChild(matchscore);
                    
                    const matchDetails = document.createElement('p');
                    matchDetails.textContent = "Format: " + matchInfo.matchFormat + " | State: " + matchInfo.state;
                    matchCard.appendChild(matchDetails);
                    
                    const venueInfo = document.createElement('p');
                    venueInfo.textContent = "Venue: " + matchInfo.venueInfo.ground;
                    matchCard.appendChild(venueInfo);

                    seriesContainer.appendChild(matchCard);
            })
            typeContainer.appendChild(seriesContainer);
            }
        })
        container.appendChild(typeContainer);
    });
}

async function fetch_display(){
    try {
        const data = await fetchLive();
        Matches_display(data);
    }
    catch (error) {
        console.error(error);
    }
}
fetch_display();
// fetch(settings.url, {method: settings.method, headers: settings.headers})
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error fetching data: ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then (data => {
//         (data.typeMatches.forEach(typeMatch=> {
//         console.log("Match type: ", typeMatch.matchType);
//         typeMatch.seriesMatches.forEach(seriesMatch=>{
//             if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches){
//                 const series = seriesMatch.seriesAdWrapper;
//                 console.log("Series Name: ", series.seriesName);
//                 series.matches.forEach(match=> {
//                     console.log(match.matchInfo.matchDesc);
//                     console.log("Match Format: ", match.matchInfo.matchFormat);
//                     console.log("start date: ", match.matchInfo.startDate);
//                     console.log("Toss: ", match.matchInfo.status);
//                     console.log("Currently: ", match.matchInfo.state);
//                     console.log(match.matchInfo.team1.teamSName, " vs ", match.matchInfo.team2.teamSName);
//                     console.log("Happening at: ", match.matchInfo.venueInfo.ground,", ", match.matchInfo.venueInfo.city);
//                     if (match.matchInfo.currBatTeamId == match.matchInfo.team1.teamId) {
//                         console.log("Batting: ", match.matchInfo.team1.teamSName);
//                     }
//                     if (match.matchInfo.currBatTeamId == match.matchInfo.team2.teamId) {
//                         console.log("Batting: ", match.matchInfo.team2.teamSName);
//                     }
//                     if (match.matchScore.team1Score){
//                         console.log(match.matchInfo.team1.teamSName+"Score: ", match.matchScore.team1Score.inngs1.runs, "/", match.matchScore.team1Score.inngs1.wickets, " in ", match.matchScore.team1Score.inngs1.overs, " overs");
//                     }
//                     if (match.matchScore.team2Score) {
//                         console.log(match.matchInfo.team2.teamSName + " Score: ", match.matchScore.team2Score.inngs1.runs, "/", match.matchScore.team2Score.inngs1.wickets, " in ", match.matchScore.team2Score.inngs1.overs, " overs");
//                     }
//                 })    
//             }
//         })
//     }))
//     });