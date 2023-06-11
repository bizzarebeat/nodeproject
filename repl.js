// Problem:we need a simple way to look at a user's badge count and JavaScript points

// Solution: Use NodeJS to connect to treehouse API to get profile information to print out
//  https://teamtreehouse.com/profiles/{profile_name.json}

const https = require('https');

printMessage = (username, badgeCount, points) => {
    const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`
    console.log(message)
}

getUserData = (username) => {
    https.get(`https://teamtreehouse.com/profiles/${username}.json`, (res) => {
        let body = ''
        res.on('data', (d) => body += d.toString()).on('end', () => {
    
            const profile = JSON.parse(body)
    
            const username = profile.profile_name
            const BadgeCount = profile.badges.length
            const points = profile.points.JavaScript
    
            printMessage(username, BadgeCount, points)
           
        })
    
    }).on('error', (e) => {
        console.error(e);
    });
}


const users =  process.argv.slice(2) 
console.log(users)  // ['chalkers', 'davemcfarland']
users.forEach(user => getUserData(user))

