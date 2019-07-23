var express = require('express');
var request = require('request');
var parseString = require('xml2js').parseString;

const app = express();

//const url1 = 'http://www.gazetadopovo.com.br/rss/economia/nova-economia';
//const url2 = 'http://www.gazetadopovo.com.br/agronegocio/rss/ultimas-noticias';
const url1 = 'https://www.gazetadopovo.com.br/feed/rss/economia.xml'
const url2 = 'https://www.gazetadopovo.com.br/feed/rss/agronegocio.xml';
const url3 = 'https://economia.awesomeapi.com.br/json/all';

app.use(express.static('./public_html/'));

var rss = [];

var transform = function(xml, res) {
    parseString(xml, (err, result) => {
        var json = result;
        try {
            for(var i=0; i<json.rss.channel[0].item.length; i++) {
                var obj = {image:"", title:"", description:""};
                if(json.rss.channel[0].item[i].image != null) {
                    if(json.rss.channel[0].item[i].image[0].url == undefined) {
                        url = encodeURI("http://www.gazetadopovo.com.br" + json.rss.channel[0].item[i].image[0]);
                    } else {
                        url = encodeURI("http://www.gazetadopovo.com.br" + json.rss.channel[0].item[i].image[0].url[0]);
                    }
                }
                obj.image = url;
                obj.title = (json.rss.channel[0].item[i].title != undefined)?json.rss.channel[0].item[i].title:"";
                obj.description = (json.rss.channel[0].item[i].description != undefined)?json.rss.channel[0].item[i].description:"";
                rss.push(obj);
            }
        } catch(err) {
            console.log("Can't parser");
        }
        console.log(result);
        res.send(JSON.stringify(rss));
        return
    });
}

app.get('/noticias/economia', (req, res) => {
    request.get(url1, (err, response) => {
        transform(response.body, res)
        return
    })
})

app.get('/noticias/agronegocio', (req, res) => {
    request.get(url2, (err, response) => {
        transform(response.body, res)
        return
    })
})

app.get('/cotacao', (req, res) => {
    request.get(url3, (err, response) => {
        console.log(response)
        res.send(response.body);
    })
})

app.listen(3000, () => {
    console.log('server on line');
})