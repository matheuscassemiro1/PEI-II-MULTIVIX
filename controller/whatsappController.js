export const whatsappController = {
    enviarMsg: async () => {
        await fetch('https://graph.facebook.com/v20.0/x/messages', {
            method: "post",
            headers: {
                "Authorization": "x",
                "Content-Type": "application/json",

            },
            body: { messaging_product: "whatsapp", to: "+55x", type: "template", name: "Mensagem teste", language: { code: "en_US" } }
        })
            .catch(error => { console.log(error) })
            .then(async dados => {
                console.log("==========MSG ENVIADA==============")
                console.log(await dados.json())
            })
    }
}

//HEADER AUTHORIZATION BEARER + CONTENT TYPE APPLICATION/JSON
//////////////////BODY REQ WHATSAPP PUSH
/* {
    "messaging_product": "whatsapp",
    "to": "+x",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  }
   */
