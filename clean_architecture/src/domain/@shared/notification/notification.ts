export type NotificationErrorProps ={
    message: string;
    context: string;
};

export default class Notification {
    private errors: NotificationErrorProps[]=[];

    addError(error: NotificationErrorProps){
        this.errors.push(error);
    }

    hasErrors():boolean{
        return this.errors.length > 0;
    }

    messages(context?: string): string{
        return this.errors
        .filter((error) => error.context === context || context === undefined)
        .map((error) => `${error.context}: ${error.message}`)
        .join(",")
        .toString()
    }

    getErrors():NotificationErrorProps[]{
        return this.errors;
    }
}