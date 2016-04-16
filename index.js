var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// for Facebook to post message
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Jordan') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "CAAYd7b3w4YYBAGezBlANKqgDGjqFcyBNwFGWX2uYg9gljdlCJoW6miW2Tr84XTXvKNJsFDKvvmGnf4yYcLWMjMzAKDzNK20LpbNbGR74M9DP1hWAAlSNsqwHGLdIBgwqT2o1D7w8GtXWoWL4ZAPGlvphhe4FZAJXe0rAdgCUMZCHP4XwlJLaPwfdIoGZAZAgZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Air Jordan 1 ",
                    "subtitle": "Released 1985 ",
                    "image_url": "http://6.kicksonfire.net/wp-content/uploads/2008/02/945.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.kicksonfire.com/what-are-air-jordans/air-jordan-1-i/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "You clicked on Air Jordan 1",
                    }],
                }, {
                    "title": "Air Jordan 3",
                    "subtitle": "Released 1988",
                    "image_url": "http://4.kicksonfire.net/wp-content/uploads/2008/02/428.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.kicksonfire.com/what-are-air-jordans/air-jordan-3-iii/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "You clicked on Air Jordan 3",
                    }],
                }, {
                    "title": "Air Jordan 11",
                    "subtitle": "G.O.A.T",
                    "image_url": "http://5.kicksonfire.net/wp-content/uploads/2008/02/331.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.kicksonfire.com/what-are-air-jordans/air-jordan-11-xi/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "You clicked on Air Jordan 11",
                    }],
                }, {
                    "title": "Air Jordan 12",
                    "subtitle": "Released 1996",
                    "image_url": "http://4.kicksonfire.net/wp-content/uploads/2008/02/636.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.kicksonfire.com/what-are-air-jordans/air-jordan-12-xii/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "You clicked on Air Jordan 12",
                    }],
                }, {
                    "title": "Air Jordan 13",
                    "subtitle": "Released 1997",
                    "image_url": "http://4.kicksonfire.net/wp-content/uploads/2008/02/413.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.kicksonfire.com/what-are-air-jordans/air-jordan-13-xiii/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "You clicked on Air Jordan 13",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})