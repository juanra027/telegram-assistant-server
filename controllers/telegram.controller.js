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

telegramCtrl.helloWorld = (req,res)=>{
    //console.log(req)
    res.status(200).data("helloWorld")
    
};

telegramCtrl.auth = (req,res)=>{
    //console.log(req)
    
};


telegramCtrl.sendMesage = (req,res)=>{
    api.sendMessage({chat_id:req.body.chat,text:req.body.message}).then(function(data)
    {
        res.status(200).json("data")
    });
    
};

telegramCtrl.sendPhoto = (req,res)=>{
    api.sendPhoto({
        chat_id: req.body.chat,
        caption: req.body.menssage,
    
        // you can also send file_id here as string (as described in telegram bot api documentation)
        photo: req.body.url
    })
    .then(function(data)
    {
        console.log(util.inspect(data, false, null));
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

telegramCtrl.handlers = ()=>{
    api.on('message', function(message)
    {
        console.log(message)
        // Received text messages direct to chat (commands)
        if(message.chat.id ===message.from.id){
            if (message.text == '/signUp'){
                telegramCtrl.signUp({_id:message.chat.id, name: message.from.first_name})

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
                api.sendMessage({
                    chat_id:message.chat.id,
                    text:'Hello I´m Alexa Bot. Use /addMe if you want to use my Alexa Voice Commands'})
            }
            
            else if(message.group_chat_created=== true){
                api.sendMessage({
                    chat_id:message.chat.id,
                    text:'Hello I´m Alexa Bot, you add me when created the group'})
            }
            else if(message.text == '/addMe'){
                try {
                    api.sendMessage({
                        chat_id:message.chat.id,
                        text:'You were added to the group :'+ message.chat.title+ '. Now you can use my Alxa Voice Commands'})
                } catch (error) {
                    
                }
                
            }
        }
    });
    
}

telegramCtrl.handlers()

export default telegramCtrl