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
    
    displayMatchInfo(data, mi_container);
    
    displayScorecard(scorecard_data, sc_container);
}

function displayMatchInfo(data, container) {
    if (!data || !data.matchInfo) {
        container.innerHTML = '<p class="error-text">Match information not available</p>';
        return;
    }

    const matchInfo = data.matchInfo;
    
    const mheaders = document.createElement('div');
    mheaders.classList.add('match-header');
    
    const title = document.createElement('h2');
    title.textContent = `${matchInfo.team1.name} vs ${matchInfo.team2.name}`;
    mheaders.appendChild(title);
    
    const matchDesc = document.createElement('h3');
    matchDesc.textContent = matchInfo.matchDescription;
    mheaders.appendChild(matchDesc);
    
    const status = document.createElement('div');
    status.classList.add('match-status');
    
    let resultText = matchInfo.status;
    if (matchInfo.result && matchInfo.result.winningTeam) {
        if (matchInfo.result.winByRuns) {
            resultText = `${matchInfo.result.winningTeam} won by ${matchInfo.result.winningMargin} runs`;
        } else if (matchInfo.result.winByInnings) {
            resultText = `${matchInfo.result.winningTeam} won by an innings and ${matchInfo.result.winningMargin} runs`;
        } else {
            resultText = `${matchInfo.result.winningTeam} won by ${matchInfo.result.winningMargin} wickets`;
        }
    }
    
    status.innerHTML = `
        <p><strong>Result:</strong> ${resultText}</p>
        <p><strong>Format:</strong> ${matchInfo.matchFormat}</p>
        <p><strong>Type:</strong> ${matchInfo.matchType}</p>
        <p><strong>Series:</strong> ${matchInfo.series.name}</p>
    `;
    mheaders.appendChild(status);
    
    const mdetails = document.createElement('div');
    mdetails.classList.add('match-details-section');
    if (matchInfo.venue) {
        const venueInfo = document.createElement('div');
        venueInfo.classList.add('venue-info');
        venueInfo.innerHTML = `
            <h4>Venue Details</h4>
            <p><strong>Ground:</strong> ${matchInfo.venue.name}</p>
            <p><strong>City:</strong> ${matchInfo.venue.city}, ${matchInfo.venue.country}</p>
        `;
        if (data.venueInfo && data.venueInfo.imageUrl) {
            const venueImg = document.createElement('img');
            venueImg.src = data.venueInfo.imageUrl;
            venueImg.alt = `${matchInfo.venue.name}`;
            venueImg.classList.add('venue-image');
            venueImg.style.maxWidth = '300px';
            venueImg.style.borderRadius = '8px';
            venueInfo.appendChild(venueImg);
        }
        
        mdetails.appendChild(venueInfo);
    }
    
    if (matchInfo.tossResults) {
        const tossInfo = document.createElement('div');
        tossInfo.classList.add('toss-info');
        tossInfo.innerHTML = `
            <h4>Toss</h4>
            <p><strong>Won by:</strong> ${matchInfo.tossResults.tossWinnerName}</p>
            <p><strong>Decision:</strong> ${matchInfo.tossResults.decision}</p>
        `;
        mdetails.appendChild(tossInfo);
    }
    
    const umpires = document.createElement('div');
    umpires.classList.add('officials-info');
    umpires.innerHTML = '<h4>Match Officials</h4>';
    
    if (matchInfo.umpire1) {
        umpires.innerHTML += `<p><strong>Umpire 1:</strong> ${matchInfo.umpire1.name} (${matchInfo.umpire1.country})</p>`;
    }
    if (matchInfo.umpire2) {
        umpires.innerHTML += `<p><strong>Umpire 2:</strong> ${matchInfo.umpire2.name} (${matchInfo.umpire2.country})</p>`;
    }
    if (matchInfo.umpire3) {
        umpires.innerHTML += `<p><strong>3rd Umpire:</strong> ${matchInfo.umpire3.name} (${matchInfo.umpire3.country})</p>`;
    }
    if (matchInfo.referee) {
        umpires.innerHTML += `<p><strong>Match Referee:</strong> ${matchInfo.referee.name} (${matchInfo.referee.country})</p>`;
    }
    
    mdetails.appendChild(umpires);
    
    if (matchInfo.playersOfTheMatch && matchInfo.playersOfTheMatch.length > 0) {
        const motm = document.createElement('div');
        motm.classList.add('player-of-match');
        const player = matchInfo.playersOfTheMatch[0];
        motm.innerHTML = `
            <h4>Player of the Match</h4>
            <p><strong>${player.fullName}</strong> (${player.teamName || 'Team not specified'})</p>
        `;
        mdetails.appendChild(motm);
    }
    
    const squads = document.createElement('div');
    squads.classList.add('team-squads');
    squads.innerHTML = '<h4>Team Squads</h4>';
    
    if (matchInfo.team1.playerDetails && matchInfo.team1.playerDetails.length > 0) {
        const team1Squad = document.createElement('div');
        team1Squad.classList.add('team-squad');
        team1Squad.innerHTML = `<h5>${matchInfo.team1.name} (${matchInfo.team1.shortName})</h5>`;
        
        const playingXI = matchInfo.team1.playerDetails.filter(p => !p.substitute);
        const substitutes = matchInfo.team1.playerDetails.filter(p => p.substitute);
        
        const players = document.createElement('div');
        players.innerHTML = '<h6>Playing XI:</h6>';
        const playing_list = document.createElement('ul');
        playing_list.classList.add('players-list');
        
        playingXI.forEach(player => {
            const playerItem = document.createElement('li');
            let playerText = player.fullName;
            if (player.captain) playerText += ' (C)';
            if (player.keeper) playerText += ' (WK)';
            if (player.role) playerText += ` - ${player.role}`;
            playerItem.textContent = playerText;
            playing_list.appendChild(playerItem);
        });
        
        players.appendChild(playing_list);
        team1Squad.appendChild(players);
        
        if (substitutes.length > 0) {
            const subs = document.createElement('div');
            subs.innerHTML = '<h6>Substitutes:</h6>';
            const subsList = document.createElement('ul');
            subsList.classList.add('players-list');
            
            substitutes.forEach(player => {
                const playerItem = document.createElement('li');
                playerItem.textContent = player.fullName + (player.role ? ` - ${player.role}` : '');
                subsList.appendChild(playerItem);
            });
            
            subs.appendChild(subsList);
            team1Squad.appendChild(subs);
        }
        
        squads.appendChild(team1Squad);
    }
    
    if (matchInfo.team2.playerDetails && matchInfo.team2.playerDetails.length > 0) {
        const team2Squad = document.createElement('div');
        team2Squad.classList.add('team-squad');
        team2Squad.innerHTML = `<h5>${matchInfo.team2.name} (${matchInfo.team2.shortName})</h5>`;
        
        const playingXI = matchInfo.team2.playerDetails.filter(p => !p.substitute);
        const substitutes = matchInfo.team2.playerDetails.filter(p => p.substitute);
        
        const players = document.createElement('div');
        players.innerHTML = '<h6>Playing XI:</h6>';
        const playing_list = document.createElement('ul');
        playing_list.classList.add('players-list');
        
        playingXI.forEach(player => {
            const playerItem = document.createElement('li');
            let playerText = player.fullName;
            if (player.captain) playerText += ' (C)';
            if (player.keeper) playerText += ' (WK)';
            if (player.role) playerText += ` - ${player.role}`;
            playerItem.textContent = playerText;
            playing_list.appendChild(playerItem);
        });
        
        players.appendChild(playing_list);
        team2Squad.appendChild(players);
        
        if (substitutes.length > 0) {
            const subs = document.createElement('div');
            subs.innerHTML = '<h6>Substitutes:</h6>';
            const subsList = document.createElement('ul');
            subsList.classList.add('players-list');
            
            substitutes.forEach(player => {
                const playerItem = document.createElement('li');
                playerItem.textContent = player.fullName + (player.role ? ` - ${player.role}` : '');
                subsList.appendChild(playerItem);
            });
            
            subs.appendChild(subsList);
            team2Squad.appendChild(subs);
        }
        
        squads.appendChild(team2Squad);
    }
    
    mdetails.appendChild(squads);
    mheaders.appendChild(mdetails);
    container.appendChild(mheaders);
}

function displayScorecard(scorecard_data, container) {
    if (!scorecard_data || !scorecard_data.scoreCard) {
        container.innerHTML = '<p class="error-text">Scorecard data not available</p>';
        return;
    }

    scorecard_data.scoreCard.forEach((innings, index) => {
        const innings_element = document.createElement('div');
        innings_element.classList.add('innings_element');
        
        const inningsHeader = document.createElement('div');
        inningsHeader.classList.add('innings-header');
        
        const inningsTitle = document.createElement('h3');
        const teamName = innings.batTeamDetails.batTeamName;
        const score = innings.scoreDetails;
        inningsTitle.textContent = `${teamName} - ${score.runs}/${score.wickets} (${score.overs} overs)`;
        inningsHeader.appendChild(inningsTitle);
        
        const runRate = document.createElement('p');
        runRate.textContent = `Run Rate: ${score.runRate}`;
        inningsHeader.appendChild(runRate);
        
        innings_element.appendChild(inningsHeader);

        const batting = document.createElement('div');
        batting.classList.add('batting-scorecard');
        
        const battingTitle = document.createElement('h4');
        battingTitle.textContent = 'Batting';
        batting.appendChild(battingTitle);
        
        const battingTable = document.createElement('table');
        battingTable.classList.add('scorecard-table');
        
        const battingHeader = document.createElement('tr');
        battingHeader.innerHTML = '<th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>Dismissal</th>';
        battingTable.appendChild(battingHeader);
        
        if (innings.batTeamDetails.batsmenData) {
            Object.values(innings.batTeamDetails.batsmenData).forEach(batsman => {
                if (batsman.batName) {
                    const row = document.createElement('tr');
                    const strikeRate = batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(2) : '0.00';
                    const dismissal = batsman.wicketCode ? 
                        (batsman.outDesc || formatWicketCode(batsman.wicketCode)) : 
                        'Not Out';
                    
                    row.innerHTML = `
                        <td>${batsman.batName}</td>
                        <td>${batsman.runs || 0}</td>
                        <td>${batsman.balls || 0}</td>
                        <td>${batsman.fours || 0}</td>
                        <td>${batsman.sixes || 0}</td>
                        <td>${strikeRate}</td>
                        <td>${dismissal}</td>
                    `;
                    battingTable.appendChild(row);
                }
            });
        }
        
        if (innings.extrasData) {
            const extrasRow = document.createElement('tr');
            extrasRow.classList.add('extras-row');
            extrasRow.innerHTML = `
                <td><strong>Extras</strong></td>
                <td><strong>${innings.extrasData.total}</strong></td>
                <td colspan="5">(b ${innings.extrasData.byes}, lb ${innings.extrasData.legByes}, w ${innings.extrasData.wides}, nb ${innings.extrasData.noBalls})</td>
            `;
            battingTable.appendChild(extrasRow);
        }
        
        const totalRow = document.createElement('tr');
        totalRow.classList.add('total-row');
        totalRow.innerHTML = `
            <td><strong>Total</strong></td>
            <td><strong>${score.runs}</strong></td>
            <td><strong>${score.ballNbr}</strong></td>
            <td colspan="4"><strong>${score.wickets} wickets, ${score.overs} overs</strong></td>
        `;
        battingTable.appendChild(totalRow);
        
        batting.appendChild(battingTable);
        innings_element.appendChild(batting);
        
        const bowling = document.createElement('div');
        bowling.classList.add('bowling-scorecard');
        
        const bowlingTitle = document.createElement('h4');
        bowlingTitle.textContent = 'Bowling';
        bowling.appendChild(bowlingTitle);
        
        const bowlingTable = document.createElement('table');
        bowlingTable.classList.add('scorecard-table');
        
        const bowlingHeader = document.createElement('tr');
        bowlingHeader.innerHTML = '<th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th>';
        bowlingTable.appendChild(bowlingHeader);
        
        if (innings.bowlTeamDetails.bowlersData) {
            Object.values(innings.bowlTeamDetails.bowlersData).forEach(bowler => {
                if (bowler.bowlName) {
                    const row = document.createElement('tr');
                    const economy = bowler.overs > 0 ? (bowler.runs / bowler.overs).toFixed(2) : '0.00';
                    
                    row.innerHTML = `
                        <td>${bowler.bowlName}</td>
                        <td>${bowler.overs || 0}</td>
                        <td>${bowler.maidens || 0}</td>
                        <td>${bowler.runs || 0}</td>
                        <td>${bowler.wickets || 0}</td>
                        <td>${economy}</td>
                    `;
                    bowlingTable.appendChild(row);
                }
            });
        }
        
        bowling.appendChild(bowlingTable);
        innings_element.appendChild(bowling);
        
        if (innings.wicketsData && Object.keys(innings.wicketsData).length > 0) {
            const fowickets = document.createElement('div');
            fowickets.classList.add('fall-of-wickets');
            
            const fowTitle = document.createElement('h4');
            fowTitle.textContent = 'Fall of Wickets';
            fowickets.appendChild(fowTitle);
            
            const fowList = document.createElement('div');
            fowList.classList.add('wickets-list');
            
            Object.values(innings.wicketsData)
                .sort((a, b) => a.wktNbr - b.wktNbr)
                .forEach(wicket => {
                    const wicketItem = document.createElement('span');
                    wicketItem.classList.add('wicket-item');
                    wicketItem.textContent = `${wicket.wktRuns}-${wicket.wktNbr} (${wicket.batName}, ${wicket.wktOver} ov)`;
                    fowList.appendChild(wicketItem);
                });
            
            fowickets.appendChild(fowList);
            innings_element.appendChild(fowickets);
        }
        
        container.appendChild(innings_element);
    });
}

function formatWicketCode(code) {
    const wicketCodes = {
        'CAUGHT': 'c',
        'BOWLED': 'b',
        'LBW': 'lbw',
        'RUNOUT': 'run out',
        'CAUGHTBOWLED': 'c & b',
        'STUMPED': 'st',
        'HITWICKET': 'hit wicket'
    };
    return wicketCodes[code] || code.toLowerCase();
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
