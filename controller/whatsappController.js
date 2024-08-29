export const whatsappController = {
    enviarMsg: async () => {
        await fetch('https://graph.facebook.com/v20.0/432598149927406/messages', {
            method: "post",
            headers: {
                "Authorization": "Bearer EAARnxhFxvIcBO3Tl0ImUZAQkoEYW7ZCxs0ZCHe41yFa7kNb91VCZALdTZC0lqOUXKKAW7WcGqFZAVXXpjMa1l6BSX1wfdqGd7ZAXHMcIgJkqEu5lTG2bYVKepE07OMPeN5NJYyJFmRnDPjUefSh7h28ExS33fs5MWoKZAAyWQJ5XBTFRBckYQ9LS2ckK3NWytZAnKynJGjqvWUWtqE8fH9ZB0ZD",
                "Content-Type": "application/json",

            },
            body: { messaging_product: "whatsapp", to: "+5527998568286", type: "template", name: "Mensagem teste", language: { code: "en_US" } }
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
    "to": "+5527998568286",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  }
   */
