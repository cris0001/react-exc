//
//
// Tabela z danymi
//
// sortowanie po kolumnach (klik nagłówka, odwracanie kierunku, wskaźnik)
// filtrowanie tekstowe
// filtr po kategorii/statusie
// paginacja (numery stron, prev/next, blokada krańców)
// licznik wyników
// reset strony przy zmianie filtra


import {Table} from './Table'

const data:Bike[] =[
    {
        "id": 1,
        "name": "Falcon 125",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 8814,
        "inStock": false
    },
    {
        "id": 2,
        "name": "Falcon 792",
        "brand": "Merida",
        "type": "MTB",
        "price": 20849,
        "inStock": true
    },
    {
        "id": 3,
        "name": "Storm 195",
        "brand": "Cannondale",
        "type": "Szosowy",
        "price": 18059,
        "inStock": true
    },
    {
        "id": 4,
        "name": "Titan 303",
        "brand": "Merida",
        "type": "Miejski",
        "price": 8723,
        "inStock": true
    },
    {
        "id": 5,
        "name": "Blaze 106",
        "brand": "Specialized",
        "type": "Miejski",
        "price": 12649,
        "inStock": false
    },
    {
        "id": 6,
        "name": "Comet 881",
        "brand": "Romet",
        "type": "MTB",
        "price": 4539,
        "inStock": true
    },
    {
        "id": 7,
        "name": "Ranger 452",
        "brand": "Orbea",
        "type": "Gravel",
        "price": 2923,
        "inStock": true
    },
    {
        "id": 8,
        "name": "Titan 227",
        "brand": "Cube",
        "type": "MTB",
        "price": 19589,
        "inStock": false
    },
    {
        "id": 9,
        "name": "Echo 470",
        "brand": "Orbea",
        "type": "Szosowy",
        "price": 24587,
        "inStock": false
    },
    {
        "id": 10,
        "name": "Comet 891",
        "brand": "Kross",
        "type": "MTB",
        "price": 9128,
        "inStock": true
    },
    {
        "id": 11,
        "name": "Pulse 384",
        "brand": "Scott",
        "type": "Gravel",
        "price": 6829,
        "inStock": true
    },
    {
        "id": 12,
        "name": "Comet 786",
        "brand": "Kross",
        "type": "MTB",
        "price": 21460,
        "inStock": true
    },
    {
        "id": 13,
        "name": "Titan 846",
        "brand": "Cannondale",
        "type": "Szosowy",
        "price": 16647,
        "inStock": true
    },
    {
        "id": 14,
        "name": "Titan 324",
        "brand": "Romet",
        "type": "MTB",
        "price": 9005,
        "inStock": true
    },
    {
        "id": 15,
        "name": "Ranger 510",
        "brand": "Kross",
        "type": "MTB",
        "price": 8413,
        "inStock": true
    },
    {
        "id": 16,
        "name": "Echo 835",
        "brand": "Romet",
        "type": "Szosowy",
        "price": 22977,
        "inStock": true
    },
    {
        "id": 17,
        "name": "Nomad 246",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 9581,
        "inStock": true
    },
    {
        "id": 18,
        "name": "Titan 369",
        "brand": "Orbea",
        "type": "Miejski",
        "price": 20621,
        "inStock": true
    },
    {
        "id": 19,
        "name": "Comet 241",
        "brand": "Merida",
        "type": "Miejski",
        "price": 4478,
        "inStock": true
    },
    {
        "id": 20,
        "name": "Falcon 256",
        "brand": "Specialized",
        "type": "Miejski",
        "price": 21043,
        "inStock": false
    },
    {
        "id": 21,
        "name": "Pulse 710",
        "brand": "Scott",
        "type": "Elektryczny",
        "price": 9738,
        "inStock": true
    },
    {
        "id": 22,
        "name": "Storm 796",
        "brand": "Giant",
        "type": "Elektryczny",
        "price": 10243,
        "inStock": true
    },
    {
        "id": 23,
        "name": "Ranger 214",
        "brand": "Kross",
        "type": "Miejski",
        "price": 6682,
        "inStock": true
    },
    {
        "id": 24,
        "name": "Blaze 612",
        "brand": "Specialized",
        "type": "Elektryczny",
        "price": 4986,
        "inStock": true
    },
    {
        "id": 25,
        "name": "Blaze 754",
        "brand": "Merida",
        "type": "Elektryczny",
        "price": 8017,
        "inStock": false
    },
    {
        "id": 26,
        "name": "Vertex 652",
        "brand": "Merida",
        "type": "MTB",
        "price": 21126,
        "inStock": true
    },
    {
        "id": 27,
        "name": "Storm 214",
        "brand": "Romet",
        "type": "Gravel",
        "price": 9346,
        "inStock": false
    },
    {
        "id": 28,
        "name": "Echo 180",
        "brand": "Giant",
        "type": "Miejski",
        "price": 3767,
        "inStock": true
    },
    {
        "id": 29,
        "name": "Titan 884",
        "brand": "Specialized",
        "type": "Szosowy",
        "price": 23118,
        "inStock": true
    },
    {
        "id": 30,
        "name": "Titan 269",
        "brand": "Kross",
        "type": "Elektryczny",
        "price": 21376,
        "inStock": true
    },
    {
        "id": 31,
        "name": "Comet 652",
        "brand": "Cannondale",
        "type": "Gravel",
        "price": 14574,
        "inStock": true
    },
    {
        "id": 32,
        "name": "Ranger 548",
        "brand": "Merida",
        "type": "Miejski",
        "price": 5465,
        "inStock": false
    },
    {
        "id": 33,
        "name": "Falcon 446",
        "brand": "Trek",
        "type": "Elektryczny",
        "price": 19650,
        "inStock": false
    },
    {
        "id": 34,
        "name": "Comet 107",
        "brand": "Giant",
        "type": "MTB",
        "price": 9001,
        "inStock": false
    },
    {
        "id": 35,
        "name": "Storm 438",
        "brand": "Giant",
        "type": "Elektryczny",
        "price": 9298,
        "inStock": false
    },
    {
        "id": 36,
        "name": "Nomad 319",
        "brand": "Merida",
        "type": "Szosowy",
        "price": 20211,
        "inStock": true
    },
    {
        "id": 37,
        "name": "Comet 584",
        "brand": "Cube",
        "type": "Szosowy",
        "price": 4590,
        "inStock": false
    },
    {
        "id": 38,
        "name": "Pulse 462",
        "brand": "Cube",
        "type": "Miejski",
        "price": 16803,
        "inStock": true
    },
    {
        "id": 39,
        "name": "Storm 789",
        "brand": "Giant",
        "type": "MTB",
        "price": 14693,
        "inStock": true
    },
    {
        "id": 40,
        "name": "Falcon 354",
        "brand": "Cannondale",
        "type": "Szosowy",
        "price": 19073,
        "inStock": true
    },
    {
        "id": 41,
        "name": "Pulse 287",
        "brand": "Kross",
        "type": "Miejski",
        "price": 9685,
        "inStock": true
    },
    {
        "id": 42,
        "name": "Falcon 553",
        "brand": "Merida",
        "type": "MTB",
        "price": 3157,
        "inStock": true
    },
    {
        "id": 43,
        "name": "Titan 115",
        "brand": "Giant",
        "type": "Szosowy",
        "price": 6949,
        "inStock": true
    },
    {
        "id": 44,
        "name": "Nomad 318",
        "brand": "Cube",
        "type": "MTB",
        "price": 6894,
        "inStock": true
    },
    {
        "id": 45,
        "name": "Pulse 371",
        "brand": "Scott",
        "type": "Gravel",
        "price": 15361,
        "inStock": true
    },
    {
        "id": 46,
        "name": "Titan 777",
        "brand": "Scott",
        "type": "Szosowy",
        "price": 7722,
        "inStock": false
    },
    {
        "id": 47,
        "name": "Storm 693",
        "brand": "Merida",
        "type": "MTB",
        "price": 11776,
        "inStock": false
    },
    {
        "id": 48,
        "name": "Echo 588",
        "brand": "Merida",
        "type": "Elektryczny",
        "price": 6658,
        "inStock": false
    },
    {
        "id": 49,
        "name": "Titan 182",
        "brand": "Specialized",
        "type": "MTB",
        "price": 20998,
        "inStock": false
    },
    {
        "id": 50,
        "name": "Comet 513",
        "brand": "Giant",
        "type": "Elektryczny",
        "price": 9567,
        "inStock": true
    },
    {
        "id": 51,
        "name": "Storm 734",
        "brand": "Giant",
        "type": "Miejski",
        "price": 23040,
        "inStock": true
    },
    {
        "id": 52,
        "name": "Titan 423",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 23445,
        "inStock": true
    },
    {
        "id": 53,
        "name": "Comet 371",
        "brand": "Cube",
        "type": "Szosowy",
        "price": 23509,
        "inStock": true
    },
    {
        "id": 54,
        "name": "Nomad 423",
        "brand": "Giant",
        "type": "MTB",
        "price": 16517,
        "inStock": true
    },
    {
        "id": 55,
        "name": "Echo 202",
        "brand": "Giant",
        "type": "Elektryczny",
        "price": 8484,
        "inStock": true
    },
    {
        "id": 56,
        "name": "Vertex 457",
        "brand": "Giant",
        "type": "Szosowy",
        "price": 13608,
        "inStock": false
    },
    {
        "id": 57,
        "name": "Nomad 656",
        "brand": "Kross",
        "type": "Elektryczny",
        "price": 22929,
        "inStock": true
    },
    {
        "id": 58,
        "name": "Titan 406",
        "brand": "Giant",
        "type": "Szosowy",
        "price": 10166,
        "inStock": false
    },
    {
        "id": 59,
        "name": "Falcon 860",
        "brand": "Merida",
        "type": "Szosowy",
        "price": 10424,
        "inStock": false
    },
    {
        "id": 60,
        "name": "Comet 834",
        "brand": "Romet",
        "type": "Szosowy",
        "price": 24027,
        "inStock": true
    },
    {
        "id": 61,
        "name": "Blaze 617",
        "brand": "Scott",
        "type": "Gravel",
        "price": 3164,
        "inStock": false
    },
    {
        "id": 62,
        "name": "Pulse 383",
        "brand": "Trek",
        "type": "MTB",
        "price": 12429,
        "inStock": true
    },
    {
        "id": 63,
        "name": "Blaze 265",
        "brand": "Scott",
        "type": "Elektryczny",
        "price": 24623,
        "inStock": true
    },
    {
        "id": 64,
        "name": "Storm 214",
        "brand": "Giant",
        "type": "Szosowy",
        "price": 19377,
        "inStock": false
    },
    {
        "id": 65,
        "name": "Ranger 696",
        "brand": "Merida",
        "type": "Szosowy",
        "price": 15583,
        "inStock": false
    },
    {
        "id": 66,
        "name": "Blaze 473",
        "brand": "Trek",
        "type": "Gravel",
        "price": 8383,
        "inStock": true
    },
    {
        "id": 67,
        "name": "Falcon 462",
        "brand": "Merida",
        "type": "Miejski",
        "price": 21837,
        "inStock": true
    },
    {
        "id": 68,
        "name": "Comet 266",
        "brand": "Specialized",
        "type": "Miejski",
        "price": 2312,
        "inStock": false
    },
    {
        "id": 69,
        "name": "Ranger 521",
        "brand": "Cannondale",
        "type": "Gravel",
        "price": 6716,
        "inStock": true
    },
    {
        "id": 70,
        "name": "Falcon 491",
        "brand": "Trek",
        "type": "Miejski",
        "price": 8788,
        "inStock": false
    },
    {
        "id": 71,
        "name": "Nomad 458",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 8804,
        "inStock": false
    },
    {
        "id": 72,
        "name": "Comet 508",
        "brand": "Romet",
        "type": "Gravel",
        "price": 3774,
        "inStock": true
    },
    {
        "id": 73,
        "name": "Blaze 459",
        "brand": "Merida",
        "type": "Miejski",
        "price": 23766,
        "inStock": true
    },
    {
        "id": 74,
        "name": "Titan 439",
        "brand": "Trek",
        "type": "MTB",
        "price": 10059,
        "inStock": false
    },
    {
        "id": 75,
        "name": "Blaze 139",
        "brand": "Giant",
        "type": "Elektryczny",
        "price": 15739,
        "inStock": true
    },
    {
        "id": 76,
        "name": "Ranger 546",
        "brand": "Orbea",
        "type": "Elektryczny",
        "price": 5289,
        "inStock": true
    },
    {
        "id": 77,
        "name": "Echo 294",
        "brand": "Kross",
        "type": "MTB",
        "price": 24725,
        "inStock": true
    },
    {
        "id": 78,
        "name": "Titan 651",
        "brand": "Cannondale",
        "type": "Gravel",
        "price": 15632,
        "inStock": false
    },
    {
        "id": 79,
        "name": "Ranger 738",
        "brand": "Romet",
        "type": "MTB",
        "price": 11340,
        "inStock": true
    },
    {
        "id": 80,
        "name": "Pulse 434",
        "brand": "Cube",
        "type": "Gravel",
        "price": 19666,
        "inStock": false
    },
    {
        "id": 81,
        "name": "Pulse 780",
        "brand": "Cube",
        "type": "Szosowy",
        "price": 21669,
        "inStock": true
    },
    {
        "id": 82,
        "name": "Pulse 661",
        "brand": "Trek",
        "type": "Gravel",
        "price": 10901,
        "inStock": false
    },
    {
        "id": 83,
        "name": "Echo 721",
        "brand": "Romet",
        "type": "Miejski",
        "price": 15976,
        "inStock": true
    },
    {
        "id": 84,
        "name": "Comet 623",
        "brand": "Scott",
        "type": "Szosowy",
        "price": 23089,
        "inStock": false
    },
    {
        "id": 85,
        "name": "Titan 779",
        "brand": "Orbea",
        "type": "Gravel",
        "price": 4560,
        "inStock": true
    },
    {
        "id": 86,
        "name": "Comet 788",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 8025,
        "inStock": false
    },
    {
        "id": 87,
        "name": "Storm 350",
        "brand": "Scott",
        "type": "Elektryczny",
        "price": 3886,
        "inStock": true
    },
    {
        "id": 88,
        "name": "Echo 299",
        "brand": "Cube",
        "type": "Miejski",
        "price": 14595,
        "inStock": false
    },
    {
        "id": 89,
        "name": "Storm 868",
        "brand": "Giant",
        "type": "Miejski",
        "price": 8670,
        "inStock": false
    },
    {
        "id": 90,
        "name": "Titan 575",
        "brand": "Trek",
        "type": "Elektryczny",
        "price": 9665,
        "inStock": true
    },
    {
        "id": 91,
        "name": "Falcon 567",
        "brand": "Specialized",
        "type": "Miejski",
        "price": 23375,
        "inStock": true
    },
    {
        "id": 92,
        "name": "Titan 709",
        "brand": "Romet",
        "type": "Miejski",
        "price": 21575,
        "inStock": true
    },
    {
        "id": 93,
        "name": "Titan 536",
        "brand": "Merida",
        "type": "Miejski",
        "price": 6715,
        "inStock": true
    },
    {
        "id": 94,
        "name": "Nomad 560",
        "brand": "Kross",
        "type": "Szosowy",
        "price": 22394,
        "inStock": false
    },
    {
        "id": 95,
        "name": "Titan 596",
        "brand": "Cannondale",
        "type": "Gravel",
        "price": 15913,
        "inStock": false
    },
    {
        "id": 96,
        "name": "Blaze 340",
        "brand": "Kross",
        "type": "Gravel",
        "price": 11976,
        "inStock": true
    },
    {
        "id": 97,
        "name": "Falcon 241",
        "brand": "Specialized",
        "type": "Szosowy",
        "price": 14051,
        "inStock": true
    },
    {
        "id": 98,
        "name": "Comet 165",
        "brand": "Cube",
        "type": "Miejski",
        "price": 12342,
        "inStock": true
    },
    {
        "id": 99,
        "name": "Pulse 163",
        "brand": "Cannondale",
        "type": "Miejski",
        "price": 14262,
        "inStock": true
    },
    {
        "id": 100,
        "name": "Echo 812",
        "brand": "Trek",
        "type": "Elektryczny",
        "price": 13964,
        "inStock": true
    }
]


export type Bike = {
    id:number,
    name:string,
    brand:string,
    type:'Szosowy'| 'Miejski'|'Gravel' |'Elektryczny'| 'MTB'
    price:number,
    inStock:boolean
}

export default function Page(){

    return <Table data={data}/>


}