const Discord = require('discord.js');
const {prefix, token} = require('./twitterBotconfig.json');
const client = new Discord.Client();
const socket = require('socket.io-client')('http://localhost:3000');

const max = 70; //maximum no of tweets to search at a time

var searchFlag = true;

const helpEmbed = new Discord.MessageEmbed().setColor('#0099ff')
.setTitle('Help page')
.setDescription('Commands')
.addField('Search <n> number of recent tweets (Max:'+max+ ' tweets)', '%<n>')
.addField('Custom Search <n> recent tweets','%s<search field> n<n>')
.addField('Example Usage to search for recent 50 tweets','%50')
.addField('Example custom Search searches recent 20 codes with search tag \'zoom codes\'','%szoom codes n20')



client.once('ready',()=>{
    //client.user.setAvatar('./ava.jpg')
    console.log('Bot connected');
    client.user.setActivity('%help');
    let botChannel=client.channels.cache.find(channel => channel.id==='747101701982519307');

    client.on('message',message=>{
        let messageChannelid = message.channel.id;
       // console.log(messageChannelid);
        
        if(messageChannelid==botChannel.id){
            
            if(message.content.startsWith(`${prefix}help`)){
                botChannel.send(helpEmbed);
    
            }
            else if(message.content.startsWith(`${prefix}`)){
                
                let prefixPos = message.content.indexOf("%");
                let tweetCount = message.content.slice(prefixPos+1);
                tweetCount = parseInt(tweetCount);
                if(Number.isInteger(tweetCount) && searchFlag){
                    if(tweetCount>max){
                        tweetCount=max;
                    }
                    if(!(tweetCount===0 || tweetCount<0)){
                        
                       socket.emit('tweetCount',tweetCount); //send for searching tweets
                       searchFlag=false;
                    }
                    else{
                        botChannel.send('Enter valid number of tweets.');
                    }
                    
                }
                else{
                    if(!searchFlag){
                        botChannel.send('Wait I am already searching.');

                    }
                    else{
                        botChannel.send('Unknown command.Type ```%help``` for a list of available commands.');
                    }
                    

                }
            }

        }
        

    })

    socket.on('zoomUrls',zoomurls=>{ //on receiving urls
        
        //console.log(zoomurls);
        
        /*
        let loops = (zoomurls.length/25)+1;
        let j=0;
        let k=25;
        let sendFlag = false;
        for(let i=0;i<loops;i++){
            sendFlag=false;
            let zoomurlsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Zoom Links')
            k=k*(i+1);
            for(j;j<k && j<zoomurls.length;j++){
                zoomurlsEmbed.addField('\u200b',zoomurls[j]);
                sendFlag = true;
            }
            if(sendFlag){
                botChannel.send(zoomurlsEmbed);

            }
            
            
        }*/
        let zoomurlsEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')

            zoomurlsEmbed.addField('\u200b',zoomurls);
            botChannel.send(zoomurlsEmbed);

        
        

        //searchFlag = true;
    })



    

});

socket.on('searchFlag',flag=>{
    searchFlag=true;
})




socket.on('connect',()=>{
    console.log('Socket server connected at port 3000 ')
    client.login(token);
})




