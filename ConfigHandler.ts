interface ConfigShape {
    [key: string]: any;
} 

class ConfigHandler { 
    //TODO: Implementierung von FileHandler
    private static config: ConfigShape = {
        "prefix": "extra",
        "defaultActivity": ["the sanic theme", { "type": "LISTENING" }],
        "admins": [
            { "name": "Extramurloc", "ID": "181805681349754880" },
            { "name": "XDawanX", "ID": "178585123707420674" },
            { "name": "Cowgummi", "ID": "138545227299422208" }
        ],
        "supportedFiletypes": ["mp3", "wav", "yeet"],
        "pizzaTime": [{
            "embed": {
                "title": "**Pizza Time**",
                "image": {
                    "url": "https://media1.tenor.com/images/fea58eb4616ff8ff041906bc5ddf9023/tenor.gif?itemid=10424139"
                },
                "author": {
                    "name": "Peter Parker",
                    "icon_url": "http://pm1.narvii.com/6517/5e4bacc110f5d63bd9254d1d0b47304ddbde1569_00.jpg"
                },
                "color": 15964934
            }
        },
        {
            "embed": {
                "title": "**Pizza Time**",
                "image": {
                    "url": "https://i.redd.it/quoifauecklz.gif"
                },
                "author": {
                    "name": "Peter Parker",
                    "icon_url": "https://img.diply.com/article-images/a/7ecf2a94-cb06-47ef-b8c2-d23374845273.png"
                },
                "color": 15964934
            }
        }]
        
        
    }
    
    static get(property: string) : any {
        return ConfigHandler.config[property];
    }
    
    static set(): boolean {
        throw new Error("Method not implemented.");
    } 
}