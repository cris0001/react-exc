// symulowana baza (API to przeszukuje)
const DATA = [
    'apple', 'apricot', 'avocado',
    'banana', 'blackberry', 'blueberry',
    'cherry', 'coconut', 'cranberry',
    'date', 'dragonfruit',
    'elderberry',
    'fig',
    'grape', 'grapefruit', 'guava',
    'kiwi',
    'lemon', 'lime', 'lychee',
    'mango', 'melon',
    'orange',
    'papaya', 'peach', 'pear', 'pineapple', 'plum', 'pomegranate',
    'raspberry',
    'strawberry',
    'tangerine',
    'watermelon',
]

export const fetchData = async(query:string, ): Promise<string[]>=>{

    return new Promise((resolve)=>{
        const delay= 300 + Math.random() * 222

        setTimeout(() => {
            const results = DATA.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            )
            resolve(results)
        }, delay)

    })

 }