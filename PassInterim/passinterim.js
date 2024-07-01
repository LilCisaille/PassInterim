// NE PAS TOUCHER
titans = ['16;8;1155', '12;10;1081', '3;10;270', '17;7;1073', '13;9;1059', '22;6;1192'];
habitations = ['21;36', '26;23', '16;48'];
gaz = 1112;
// NE PAS TOUCHER

const parseTitan = (titanStr) => {
    const [heightStr, speedStr, pvStr] = titanStr.split(';');
    return {
        height: parseInt(heightStr),
        speed: parseInt(speedStr),
        pv: parseInt(pvStr)
    };
};

const parseHabitation = (habitationStr) => {
    const [heightStr, distanceStr] = habitationStr.split(';');
    return {
        height: parseInt(heightStr),
        distance: parseInt(distanceStr)
    };
};

const parsedTitans = titans.map(parseTitan);
const parsedHabitations = habitations.map(parseHabitation);
gaz = parseInt(gaz);

parsedTitans.sort((a, b) => b.height - a.height);

parsedHabitations.sort((a, b) => a.height - b.height);

let totalPoints = 0;
let currentGaz = gaz;
let currentHeight = 0;

const calcPowerAndGaz = (height, titanHeight, distance, speed, above) => {
    let power, gazConsumed;
    if (above) {
        power = (height - titanHeight) * 10 + distance * 2 - speed;
        gazConsumed = (height - titanHeight + distance);
    } else {
        power = Math.abs(height - titanHeight) * 5 + distance * 2 - speed;
        gazConsumed = Math.abs(height - titanHeight + distance);
    }
    return { power, gazConsumed };
};

for (const titan of parsedTitans) {
    let { height: tHeight, speed: tSpeed, pv: tPv } = titan;
    let bestHabitation = null;
    let above = false;

    for (const habitation of parsedHabitations) {
        const { height: hHeight, distance: hDistance } = habitation;
        if (hHeight > tHeight) {
            bestHabitation = habitation;
            above = true;
            break;
        } else {
            bestHabitation = habitation;
        }
    }

    if (bestHabitation === null) continue;

    const { height: hHeight, distance: hDistance } = bestHabitation;

    const moveGaz = Math.abs(currentHeight - hHeight);
    if (currentGaz < moveGaz) break;

    currentGaz -= moveGaz;
    currentHeight = hHeight;

    while (tPv > 0) {
        const { power, gazConsumed } = calcPowerAndGaz(hHeight, tHeight, hDistance, tSpeed, above);
        if (currentGaz < gazConsumed) break;

        tPv -= power;
        totalPoints += 1; // 1 pt par coup d'épée
        currentGaz -= gazConsumed;
    }

    if (tPv <= 0) {
        totalPoints += 100; // 100 pts par titan abattu
    }
}

console.log(totalPoints);