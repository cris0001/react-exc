class Animal{

    constructor(name:string,age:number) {
    this.name= name
        this.#age = age
    }

    name:string
    #age:number

    speak(){
        return 'x'
    }

    static create(name:string){
        return new Animal(name,12)
    }

    getAge(){
        return this.#age
    }

}


class Dogg extends Animal{

    constructor(name: string, breed: string) {
        super(name,3)
        this.breed = breed
    }

    breed:string

    speak(){
        return `${super.speak()} how how`
    }
}