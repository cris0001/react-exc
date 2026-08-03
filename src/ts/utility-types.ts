//Napisz na podstawie tego interfejsu:

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
//     role: 'admin' | 'user';
// }




interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}

//UpdateUser — wszystkie pola opcjonalne
type UpdateUser = Partial<User>

//PublicUser — bez password
type PublicUser = Omit<User,'password'>

//UserPreview — tylko id i name
type UserPreview= Pick<User, 'id'|'name'>

//UserMap — obiekt gdzie klucz to number a wartość to User
type UserMap= Record<number,User>

//ReadonlyUser — nie można modyfikować żadnego pola
type ReadOnlyUser = Readonly<User>

//RequiredUser — wszystkie pola wymagane (zakładamy że niektóre mogłyby być opcjonalne)
type RequiredUser = Required<User>

//UserReturnType — wyciągnij typ zwracany z tej funkcji:
function createUser(name: string, role: 'admin' | 'user') {
    return { id: Math.random(), name, role, createdAt: new Date() };
}

type UserReturnType= ReturnType<typeof createUser>


//AwaitedUser — wyciągnij typ z:
async function fetchUser(): Promise<User> {
    return {} as User;
}

type AwaitedUser = Awaited<typeof fetchUser>