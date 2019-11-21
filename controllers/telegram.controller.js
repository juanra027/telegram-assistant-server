import telegram from 'telegram-bot-api'

//DB Models
import User from '../models/user.model'
import Group from '../models/group.model'

var api = new telegram({
    token: "898538517:AAFEBZg0cKB-F7KtI21S3NMVnn8D65Rot8g",
    updates: {
        enabled: true
    }
});

const telegramCtrl = {};

telegramCtrl.startBot = (req,res)=>{
    api = new telegram({
        token: "898538517:AAFEBZg0cKB-F7KtI21S3NMVnn8D65Rot8g",
        updates: {
            enabled: true
    }
    });
    telegramCtrl.handlers()
    res.status(200).json("bot started")
    
};
telegramCtrl.stopBot = (req,res)=>{
    api = null;
    res.status(200).json("bot deleted")
    
};

telegramCtrl.auth = async(req,res)=>{
    let user = await User.findOne({_id: req.body.code})
    if(user){
        let groupsData=[];
        console.log(user)
        for (let index = 0; index < user.groups.length; index++) {
            console.log('group = '+user.groups[index])
            let group = await Group.findOne({_id: user.groups[index]})
            console.log(group)
            if(group){
                groupsData.push({_id:group._id, name:group.name})
            }
            
        }
        res.status(200).json({data:{name:user.name, code:user._id, groups:groupsData},message:"User Logged In"})
    }
    else{
        res.status(400).json({message:"User does'nt exist"})
    }
};



telegramCtrl.sendMesage = async(req,res)=>{
    if (req.body.code){
        let user = await User.findOne({_id: req.body.code})
        if(user){
            api.sendMessage({chat_id:req.body.chat,text:req.body.message}).then(function(data)
            {
                res.status(200).json("data")
            })
        }
        else{
            res.status(402).json("Looks like you delete your chat with me, You have to register again")
        }
        
    }
    else{
        res.status(401).json("Looks like you are not Logged In")
    }
    
    
};

telegramCtrl.sendPhoto = (req,res)=>{
    api.sendPhoto({
        chat_id: req.body.chat,
        caption: req.body.menssage,
    
        photo: req.body.url
    })
    .then(function(data)
    {
        res.status(200).json("data")
    });
}

telegramCtrl.sendPhoto2 = (req,res)=>{
    var Buffer = require('buffer').Buffer;
    var path = require('path');
    var fs = require('fs');

    fs.readFile(path.join("C:/Users/juanr/Pictures/72402.jpg"),function(error,data){
        if(error){
          throw error;
        }else{
          var buf = Buffer.from(data);
          var base64 = buf.toString('base64');
          //console.log('Base64 of ddr.jpg :' + base64);
          res.status(200).json(base64)
        }
      });
}

telegramCtrl.sendPhoto3 = (req,res)=>{
    var Buffer = require('buffer').Buffer;
    var path = require('path');
    var fs = require('fs');

    let buf = Buffer.from(req.body.base64str, 'base64');

    fs.writeFile(path.join(req.body.from+"_"+req.body.filename), buf, function(error) {
      if (error) {
        throw error;
      } else {
        api.sendPhoto({
            chat_id: req.body.chat,
            caption: req.body.menssage,
        
            //photo: path.join("C:/Users/juanr/Pictures/", req.body.filename)
            photo: path.join(req.body.from+"_"+req.body.filename)
        })
        .then(function(data)
        {
            fs.unlinkSync(path.join(req.body.from+"_"+req.body.filename))
            res.status(200).json("data")
        });
        console.log('File created from base64 string!');
      }
    });

}


telegramCtrl.signUp = async(data)=>{
    let user = await User.findOne({_id: data._id})
    console.log(user)
    if(user){
        api.sendMessage({
            chat_id:data._id,
            text:'You are already registered. Tell Alexa the next code: '+ data._id+ ' for logging'})
    }
    else{
        user = new User(data)
        user.save()
        .then(user => {
            api.sendMessage({
                chat_id:data._id,
                text:'Tell Alexa the next code: '+ data._id+ ' for logging'}    )
        })
        .catch(err => {
            api.sendMessage({
                chat_id:data._id,
                text:'Error in register'})
        });

    }
}

telegramCtrl.addGroup = async(data)=>{
    let group = await Group.findOne({_id: data._id})
    console.log(group)
    if(group){
        api.sendMessage({
            chat_id:data._id,
            text:'This group was already registered'})
    }
    else{
        group = new Group(data)
        group.save()
        .then(group => {
            api.sendMessage({
                chat_id:data._id,
                text:'Hello I´m Alexa Bot. Use /addMe if you want to use my Alexa Voice Commands'}    )
        })
        .catch(err => {
            api.sendMessage({
                chat_id:data._id,
                text:'Error adding the group to the database'})
        });
    }
}

telegramCtrl.handlers = ()=>{
    api.on('message', function(message)
    {
        console.log(message)
        // Received text messages direct to chat (commands)
        if(message.chat.id ===message.from.id){
            if (message.text == '/signUp'){
                telegramCtrl.signUp({_id:message.chat.id, name: message.from.first_name})

            }
            else if (message.text == '/start'){
                api.sendMessage({
                    chat_id:message.from.id,
                    text:'Hello I am the Alexa Telegram Bot. Remember that if you delete this chat'/*, all your data with me WILL BE DELETED!!!'*/})

            }
            
            else if (message.text == '/delete'){
                User.deleteOne({_id: message.from.id} , function(err, user) {
                    if(err){
                        api.sendMessage({
                            chat_id:message.from.id,
                            text:'Error deleting your data'})
                    }
                    else if(user.n===0){
                        console.log(user)
                        api.sendMessage({
                            chat_id:message.from.id,
                            text:'You does not have data to delete'})
                    }
                    else{
                        api.sendMessage({
                            chat_id:message.from.id,
                            text:'All your data were deleted'})
                    }
                })
                
            }
            else if(message.entities && message.entities[0].type=='bot_command'){
                api.sendMessage({
                    chat_id:message.from.id,
                    text:'The command doesn´t exist'})
            }
            else{
                api.sendMessage({
                    chat_id:message.from.id,
                    text:'The command are the next: ...'})
            }
        }
        else{
            if(message.new_chat_participant/* && message.new_chat_participant.id === 898538517*/){
                if(message.new_chat_participant.id === 898538517){//add new group

                    telegramCtrl.addGroup({_id:message.chat.id, name: message.chat.title})
                }
                else{
                    api.sendMessage({
                        chat_id:message.chat.id,
                        text:'Hello I´m Alexa Bot. Use /addMe if you want to use my Alexa Voice Commands'})
                }

            }
            
            else if(message.group_chat_created=== true){
                api.sendMessage({
                    chat_id:message.chat.id,
                    text:'Hello I´m Alexa Bot, you add me when created the group'})
            }
            else if(message.text == '/addMe'){
                User.findOne({_id: message.from.id} , function(err, user) {
                    if(err){//error
                        api.sendMessage({
                            chat_id:message.chat.id,
                            text:'Error looking for you in my data'})
                    }
                    else if(!user){//Not registered
                        api.sendMessage({
                            chat_id:message.from.id,
                            text:'You first need to Register in a chat with me: Alexa027_bot'}).
                            catch (function(error) {//not registered and no chat
                                api.sendMessage({
                                    chat_id:message.chat.id,
                                    text:'Looks like you deleted the data and the chat with me :(. It is necesary to add a Group'})
                                
                                    /*if (error.response && error.response.statusCode === 403) {
                                      // ...snip...
                                    }*/
                                })
                    }
                    else{
                        if(user.groups.includes(message.chat.id)){
                            api.sendMessage({//registered
                                chat_id:message.from.id,
                                text:'You already are in the group: '+ message.chat.title}).
                                catch (function(error) {//registered but no chat
                                    api.sendMessage({
                                        chat_id:message.chat.id,
                                        text:'Looks like I have your data stored but you deleted the chat with me :(. You already are in this group but you need to start a chat with me again to use it'})
                                    
                                        /*if (error.response && error.response.statusCode === 403) {
                                          // ...snip...
                                        }*/
                                    })
                        }
                        else{
                            user.groups.push(message.chat.id)
                            User.findOneAndUpdate({_id: message.from.id}, user, {upsert:true}, function(err, doc){
                                if (err){
                                    api.sendMessage({
                                        chat_id:message.chat.id,
                                        text:'Error ocurs adding you to the group.'})
                                }
                                else{
                                    api.sendMessage({//registered
                                        chat_id:message.from.id,
                                        text:'You were added to the group: '+ message.chat.title+ '. Now you can use my Alxa Voice Commands'}).
                                        catch (function(error) {//registered but no chat
                                            api.sendMessage({
                                                chat_id:message.chat.id,
                                                text:'Looks like I have your data stored but you deleted the chat with me :(. I added the group but you need to start a chat with me again to use it'})
                                            
                                                /*if (error.response && error.response.statusCode === 403) {
                                                  // ...snip...
                                                }*/
                                            })
                                }
                            });
                            
                        }
                        
                    }
                    
                })
                    
            }
        }
    });    
    
}
telegramCtrl.handlers()

export default telegramCtrl