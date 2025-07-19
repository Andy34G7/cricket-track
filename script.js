const settings_all = {
	async: true,
	crossDomain: true,
	url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live',
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e7ffbdad2emshc9dc3e52a70e12ep1cf0a7jsn35b695858d83',
		'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

const settings_match = {
	async: true,
	crossDomain: true,
	url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/',
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e7ffbdad2emshc9dc3e52a70e12ep1cf0a7jsn35b695858d83',
		'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

async function fetchLive(){
    const response = await fetch(settings_all.url, {method: settings_all.method, headers: settings_all.headers})
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
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
                    matchCard.style.cursor = 'pointer';
                    matchCard.onclick = () => Display_more(match.matchInfo.matchId);

                    const matchInfo = match.matchInfo;
                    const matchDesc = document.createElement('h4');
                    matchDesc.textContent = matchInfo.matchDesc;
                    matchCard.appendChild(matchDesc);

                    const matchscore = document.createElement('p');
                    let scorestr = "";
                    let team1Score = "";
                    let team2Score = "";
                    if (match.matchScore){
                        if (match.matchScore.team1Score && match.matchScore.team1Score.inngs1) {
                            team1Score = `${match.matchScore.team1Score.inngs1.runs}/${match.matchScore.team1Score.inngs1.wickets} (${match.matchScore.team1Score.inngs1.overs} overs)`;
                        }
                        if (match.matchScore.team2Score && match.matchScore.team2Score.inngs1){
                            team2Score = `${match.matchScore.team2Score.inngs1.runs}/${match.matchScore.team2Score.inngs1.wickets} (${match.matchScore.team2Score.inngs1.overs} overs)`;
                        }
                        if (match.matchScore.team1Score.inngs1.inningsId == 2){
                            scorestr = `${matchInfo.team2.teamSName} ${team2Score} | ${matchInfo.team1.teamSName} ${team1Score}`
                        }
                        else {
                            scorestr = `${matchInfo.team1.teamSName} ${team1Score} | ${matchInfo.team2.teamSName} ${team2Score}`
                        }
                    }
                    matchscore.textContent = scorestr;
                    matchCard.appendChild(matchscore);
                    
                    const matchDetails = document.createElement('p');
                    matchDetails.textContent = `Format: ${matchInfo.matchFormat} | State: ${matchInfo.state}`;
                    matchCard.appendChild(matchDetails);
                    
                    const venueInfo = document.createElement('p');
                    venueInfo.textContent = `Venue: ${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city}`;
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
        console.log(data);
        Matches_display(data);
    }
    catch (error) {
        console.log(error);
        const container = document.getElementById('match-cont');
        container.innerHTML = '';
        const error_msg = document.createElement('h3')
        error_msg.classList.add('error-text');
        error_msg.textContent = `Error: ${error}`;
        error_msg.style.color = 'red';
        container.appendChild(error_msg);
    }
}

function RefreshScore(){
    fetch_display();
}

async function fetch_Match(matchId){
    const response = await fetch(settings_match.url+`${matchId}`, {method: settings_match.method, headers: settings_match.headers})
    if (!response.ok) {
        throw new Error(`Error fetching match data: ${response.statusText}`);
    }
    const match_data = await response.json();
    return match_data;
}

function display_info(data){

}

function Display_more(matchId){
    console.log(`Pressed more info button with id ${matchId}`);
}


fetch_display();