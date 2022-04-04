const processes = {}

class TextSender{
    static sendMsg(msg, num, client){
        return new Promise(function(resolve, reject){
            client
                .sendText(num, msg)
                .then((result) => {resolve(result)})
                .catch((error) => {reject(error)})
        })
    }

    static async delivText(texts, num, client){   //Envia uma array de mensagens de forma async
        try{
            let txt = (typeof(texts) === 'string')?[texts]:texts
            for (let v in txt)
                await this.sendMsg(txt[v], num, client)
        }
        catch(err){
            console.log(err)
        }
        return
    }

    static async answerUser(texts, num, client){
        processes[num] = this.delivText(texts, num, client)
    }

    static async resolveMessages(num){
        if(num in processes){
            await processes[num]
            delete processes[num]
        }
    }

    static async notText(message, num, client){   //Tratamento no caso de uma mensagem recebida não ser texto
        if ((message.type != 'chat')){      //Depois vai receber docs tambem
            await this.delivText('Não posso respondê-lo caso não envie mensagens de texto.', num, client)
            return true
        }
        if(!/(\d|[a-zA-Z])+/g.test(message.body)){
            await this.delivText('Envie uma mensagem válida, por favor.', num, client)
            return true
        }
    }

    static unvalidNumber(num){
        return !(/\d+@\w*.us/g.test(num))
    }
}

export {TextSender}