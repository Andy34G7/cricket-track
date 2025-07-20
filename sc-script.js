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

const settings_scorecard = {
	async: true,
	crossDomain: true,
	url: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/',
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e7ffbdad2emshc9dc3e52a70e12ep1cf0a7jsn35b695858d83',
		'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
	}
};

async function fetch_Match(matchId){
    const response = await fetch(settings_match.url+`${matchId}`, {method: settings_match.method, headers: settings_match.headers})
    if (!response.ok) {
        throw new Error(`Error fetching match data: ${response.statusText}`);
    }
    const match_data = await response.json();
    return match_data;
}

async function fetch_Scorecard(matchId){
    const response = await fetch(settings_scorecard.url+`${matchId}/hscard`, {method: settings_scorecard.method, headers: settings_scorecard.headers})
    if (!response.ok) {
        throw new Error(`Error fetching scorecard data: ${response.statusText}`);
    }
    const scorecard_data = await response.json();
    return scorecard_data;
}

function display_info(data, scorecard_data){
    const sc_container = document.getElementById('scorecard-container');
    sc_container.innerHTML = '';
    const mi_container = document.getElementById('match_info-container');
    mi_container.innerHTML = '';
    //work with the data ;-;
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function goBack() {
    window.location.href = 'index.html';
}

async function initScorecard() {
    const matchId = getUrlParameter('matchId');
    
    if (!matchId) {
        const container = document.getElementById('scorecard-container');
        container.innerHTML = '<p class="error-text">No match ID provided</p>';
        return;
    }	

    try {
        const data = await fetch_Match(matchId);
        console.log('Match data:', data);
        const datasc = await fetch_Scorecard(matchId);
        console.log(`Scorecard:`, datasc);
        display_info(data, datasc);
    } catch (error) {
        console.error('Error fetching data:', error);
        const container = document.getElementById('scorecard-container');
        container.innerHTML = `<p class="error-text">Error loading match data: ${error.message}</p>`;
    }
}

window.addEventListener('DOMContentLoaded', initScorecard);
