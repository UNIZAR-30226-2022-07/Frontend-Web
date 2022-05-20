export class Message {
    username!: string;
    message!: string;
    constructor(username:string, message:string) {
        this.username = username;
        this.message = message.substring(1,message.length-1);
    }
}