function withAuth<T extends object>(Component: React.ComponentType<T>) {
    return function(props: T) {
        const isLoggedIn = false

        if (!isLoggedIn) return <>niezalogowany</>
        return <Component {...props} />; // przekaż wszystkie propsy dalej
    };
}



const Page= ()=>{

    return <>siema</>
}


const AuthPage= withAuth(Page)

export default AuthPage