var gameboard_Arr = new Array();
var days_Arr = new Array();
var scen_Arr = new Array();
var numRooms = 3;
var scenBaseURL = 'gameboard_scen_';

days_Arr.push('SUN');
days_Arr.push('MON');
days_Arr.push('TUE');
days_Arr.push('WED');
days_Arr.push('THU');
days_Arr.push('FRI');
days_Arr.push('SAT');

Cookies.json = true;

function buildGameboard() {
    var storedArr = Cookies.get('gamedata');
    var scenArr = Cookies.get('scendata');
    if (typeof scenArr === "undefined") {
        //Character,LengthInDays,RatePerDay,StartDay,SpacesNeeded,Played
        scen_Arr.push(['Alice', 3, 1250, 'MON', 1, false]);
        scen_Arr.push(['FastPace1', 2, 900, 'WED', 1, false]);
        scen_Arr.push(['Lara', 3, 1100, 'MON', 1, false]);
        scen_Arr.push(['Max', 1, 1000, 'THU', 1, false]);
        scen_Arr.push(['Bette', 2, 1400, 'WED', 2, false]);
        scen_Arr.push(['Angus', 2, 2000, 'FRI', 2, false]);
        scen_Arr.push(['Jodi', 1, 1750, 'THU', 2, false]);
        scen_Arr.push(['Gabby', 1, 2400, 'TUE', 3, false]);
        scen_Arr.push(['David', 1, 3150, 'SAT', 3, false]);
        scen_Arr.push(['Cindy', 1, 2025, 'FRI', 2, false]);
        scen_Arr.push(['FastPace2', 1, 2000, 'MON', 2, false]);
        scen_Arr.push(['Marcus', 3, 1200, 'TUE', 2, false]);
        scen_Arr.push(['FastPace3', 2, 1125, 'WED', 1, false]);
        scen_Arr.push(['Katrina', 2, 1200, 'THU', 2, false]);
        scen_Arr.push(['FastPace4', 3, 2520, 'THU', 3, false]);
    } else {
        scen_Arr = scenArr;
    }
    if (typeof storedArr === "undefined") {
        gameboard_Arr = new Array();
        for (i = 0; i < numRooms; i++) {
            roomNum = i + 1;
            var tempArr = new Array();
            for (n = 0; n < days_Arr.length; n++) {
                //gameboard_Arr[i]
                tempArr.push([roomNum + days_Arr[n], 0]);
            }
            gameboard_Arr.push([roomNum, tempArr]);
        }
        theData = JSON.stringify(gameboard_Arr);
        Cookies.json = true;
        saveData();
    } else {

        gameboard_Arr = storedArr;
    }
}

function pickScen() {
    isFound = false;
    if (getPerc() == 100) {
        runTotals();
    } else {
        while (isFound == false) {
            theNum = Math.floor((Math.random() * scen_Arr.length));
            if (scen_Arr[theNum][5] == false) {
                isFound = true;
            }
        }
        scen_Arr[(theNum)][5] = true;
        theData = JSON.stringify(gameboard_Arr);
        saveData();
        url_str = scenBaseURL + scen_Arr[(theNum)][0].toLowerCase() + '.html';
        trivExitPage(url_str, true);
    }
}

function getPerc() {
    count = 0;
    for (pi = 0; pi < scen_Arr.length; pi++) {
        if (scen_Arr[pi][5] == true) {
            count++;
        }
    }
    perc = (count / scen_Arr.length);
    perc = Math.round(perc * 100);
    return perc;
}

function saveScen(theNum) {
    //Set the variables from the Scene array
    theLength = scen_Arr[theNum][1]; // LengthInDays
    theRate = scen_Arr[theNum][2]; // RatePerDay
    theDay = scen_Arr[theNum][3]; // StartDay
    theSpaces = scen_Arr[theNum][4]; // SpacesNeeded

    // If one Space is needed
    if (theSpaces == 1) {
        isFound = false;
        validDays_Arr = new Array();
        
        // Check to see if StartDay is available
        for (i = 0; i < numRooms; i++) {
            for (m = 0; m < gameboard_Arr[i][1].length; m++) {
                testDay = gameboard_Arr[i][1][m][0].indexOf(theDay);
                if ((testDay == 1) && (gameboard_Arr[i][1][m][1] == 0)) {
                    validDays_Arr.push([i, m, false]);
                }
            }
        }
        // If StartDay is available, check to see if the Number of Days Needed are available
        if (validDays_Arr.length > 0) {
            for (i = 0; i < validDays_Arr.length; i++) {
                count = 0;
                for (n = 0; n < theLength; n++) {
                    if (gameboard_Arr[validDays_Arr[i][0]][1][validDays_Arr[i][1] + n][1] == 0) {
                        count++;
                    }
                }
                if (count == theLength) {
                    isFound = true;
                    validDays_Arr[i][2] = true;
                }
            }
            // If not enough Days are available, display message
            if (isFound == false) {
                alert("NOT ENOUGH DAYS AVAILABLE!\n\nThere are not enough days available to accept this inquiry.\nCheck your calendar before attempting to accept an inquiry.\n\nPlease close this box and select Reject.")
            } else {
                // If enough days are available, fill the days with the rate and load into Lectora for UI
                isDone = false;
                for (n = 0; n < validDays_Arr.length; n++) {
                    if ((isDone != true) && (validDays_Arr[n][2] == true)) {
                        for (p = 0; p < theLength; p++) {
                            gameboard_Arr[validDays_Arr[n][0]][1][(validDays_Arr[n][1] + p)][1] = theRate;

                            // Load values into Lectora variables to fill in the grid
                            vartxt = gameboard_Arr[validDays_Arr[n][0]][1][(validDays_Arr[n][1] + p)][0];
                            // Determine what currency symbol to use based on setting in Lectora
                            var intSymbol = VarInternational.getValue();
                            if (intSymbol == 1) {
                                newrate = '€' + theRate;
                                eval('Vargb_' + vartxt).set(newrate);
                            } else {
                                newrate = '$' + theRate;
                                eval('Vargb_' + vartxt).set(newrate);
                            }
                        }
                        isDone = true;
                    }
                }
                saveData();
                pickScen();
            }
        } else {
            // If StartDay is not available, display message
            alert("START DAY NOT AVAILABLE!\n\nYou cannot accept this inquiry - the start day is not available.\nCheck your calendar before attempting to accept an inquiry.\n\nPlease close this box and select Reject.")
        }
    }

    // If more than one Space is needed - NOTE: multiple Spaces may be needed for one or more Days
    if (theSpaces > 1) {
        isFound = false;
        validDays_Arr = new Array();
        
        // Check to see if StartDay is available
        for (i = 0; i < numRooms; i++) {
            for (m = 0; m < gameboard_Arr[i][1].length; m++) {
                testDay = gameboard_Arr[i][1][m][0].indexOf(theDay);
                if ((testDay == 1) && (gameboard_Arr[i][1][m][1] == 0)) {
                    validDays_Arr.push([i, m, false]);
                }
            }
        }
        // If StartDay is available, check to see if the number of Spaces Needed and Number of Days needed are available
        if (validDays_Arr.length > 0) {
            /* for (i = 0; i < validDays_Arr.length; i++) {
                count = 0;
                for (n = 0; n < theSpaces; n++) {
                    if (gameboard_Arr[validDays_Arr[i][0]][4][validDays_Arr[i][4] + n][4] == 0) {
                        count++;
                    }
                } */
                if (count == theSpaces) {
                    isFound = true;
                    validDays_Arr[i][2] = true;
                }
            }
            // If not enough spaces or days are available, display message
            if (isFound == false) {
                alert("NOT ENOUGH SPACES OR DAYS AVAILABLE!\n\nSpaces cannot be combined to accept this inquiry.\nCheck your calendar before attempting to accept an inquiry.\n\nPlease close this box and select Reject.")
            } else {
                // If enough spaces are available, fill the days with the rate
                /* isDone = false;
                for (n = 0; n < validDays_Arr.length; n++) {
                    if ((isDone != true) && (validDays_Arr[n][2] == true)) {
                        for (p = 0; p < theLength; p++) {
                            gameboard_Arr[validDays_Arr[n][0]][4][(validDays_Arr[n][4] + p)][4] = theRate;

                            // Load values into Lectora variables to fill in the grid
                            vartxt = gameboard_Arr[validDays_Arr[n][0]][4][(validDays_Arr[n][4] + p)][0];

                            // Determine what currency symbol to use based on setting in Lectora
                            var intSymbol = VarInternational.getValue();
                            if (intSymbol == 1) {
                                newrate = '€' + theRate;
                                eval('Vargb_' + vartxt).set(newrate);
                            } else {
                                newrate = '$' + theRate;
                                eval('Vargb_' + vartxt).set(newrate);
                            }
                        }
                        isDone = true;
                    }
                } */
                saveData();
                pickScen();
            }
        } else {
            // If StartDay is not available, display message
            alert("MULTIPLE SPACE INQUIRY: START DAY NOT AVAILABLE!\n\nYou cannot accept this inquiry - the start day is not available.\nCheck your calendar before attempting to accept an inquiry!\n\nPlease close this box and select Reject.")
        }
    }
}

function runTotals() {
    totalArr = new Array();
    dayArr = new Array();
    count = 0;
    for (i = 0; i < numRooms; i++) {
        sum = 0;
        for (m = 0; m < gameboard_Arr[i][1].length; m++) {
            sum += gameboard_Arr[i][1][m][1];
            if (gameboard_Arr[i][1][m][1] != 0) {
                count++;
            }
        }
        totalArr.push([i + 1, sum]);
    }
    total = 0;
    for (p = 0; p < totalArr.length; p++) {
        total += totalArr[p][1]
        var intSymbol = VarInternational.getValue();
        if (intSymbol == 1) {
            theNum = '€' + totalArr[p][1];
            eval('Vartot_' + (p + 1) + 'T').set(theNum);
        } else {
            theNum = '$' + totalArr[p][1];
            eval('Vartot_' + (p + 1) + 'T').set(theNum);
        }
    }
    ADR = total / count;
    occ = count / 15;
    var REVPAR = 0;
    //REVPAR = occ*ADR;
    REVPAR = total / 1500;
    Varfinalrevpar.set(REVPAR.toFixed(2));
    Varfinaladr.set(ADR.toFixed(2));
    if (REVPAR > 14) {
        trivExitPage('gameboard_end_goodjob.html', true);
    } else {
        trivExitPage('gameboard_end_goodtry.html', true);
    }
}

function checkSpace(theName) {

}

function resetData() {
    Cookies.remove('gamedata', {
        path: '/'
    });
    Cookies.remove('scendata', {
        path: '/'
    });
}

function saveData() {
    Cookies.json = true;
    Cookies.set('scendata', scen_Arr, {
        expires: 7,
        path: '/'
    });
    Cookies.set('gamedata', gameboard_Arr, {
        expires: 7,
        path: '/'
    });
}

function renderBoard() {
    theTable = "<table>";
    theTable += "<tr><td></td><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thur</td><td>Fri</td><td>Sat</td></tr>";
    for (i = 0; i < gameboard_Arr.length; i++) {
        theTable += "<tr><td>Room " + gameboard_Arr[i][0] + "</td>";
        for (m = 0; m < gameboard_Arr[i][1].length; m++) {
            theTable += "<td>" + gameboard_Arr[i][1][m][1] + "</td>";
        }
        theTable += "</tr>";
    }
    theTable += "</table>"
    $('#gameboard_gui').html(theTable);
}

function renderScen(theNum) {
    theTable = "<table>";
    theTable += "<tr><td colspan=2>Do you accept " + scen_Arr[theNum][0] + " for " + scen_Arr[theNum][1] + " day(s) at a rate of " + scen_Arr[theNum][2] + "/day starting on " + scen_Arr[theNum][3] + "</td><tr>";
    theTable += "<tr><td><a href='javascript:saveScen(" + theNum + ")'>Yes</a></td><td><a href='javascript:pickScen()'>No</a></td></tr>";
    theTable += "</table>";
    $('#scen').html(theTable);
}
