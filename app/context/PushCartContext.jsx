import { createContext, useState, useEffect, useCallback } from "react";
// import { getVendorsFromDB } from '../../firebase';

export const PushCartContext = createContext();

export const PushCartContextProvider = ({ children }) => {
    const [pushCartList, setPushCartList] = useState({});
    const [selectedPushCart, setSelectedPushCart] = useState({});

    // const fetchData = useCallback(async () => {
    //     try {
    //         console.log("trying to get all push carts");
    //         const samplePushcarts = await getVendorsFromDB()
    //         setPushCartList(samplePushcarts);
    //     } catch (error) {
    //         console.log("UserContext error:", error);
    //     }
    // }, []);

    // useEffect(() => {
    //     console.log("trying to load all push carts");
    //     fetchData();
    //     // setPushCartList(samplePushcarts);
    // }, []);

    return (
        <PushCartContext.Provider value={{ pushCartList, setPushCartList, selectedPushCart, setSelectedPushCart }}>
            {children}
        </PushCartContext.Provider>
    );
}

// const samplePushcarts = [
//     {
//         'id': 1,
//         'name': 'Murugan Idli Shop',
//         'imageURL': require('../assets/fordemo/muruganidli.jpg'),
//         'averageCost': 50,
//         'category': 'Food',
//         'short_desc': 'Famous for their finger-licking coconut chutney.',
//         'rating': '4.5',
//         'phone': '+11111111111',
//         'distance': 150,
//         'lat': 13.020338291639757,
//         'lng': 80.25426122032799
//     },
//     {
//         'id': 2,
//         'name': 'Burger Man',
//         'imageURL': require('../assets/fordemo/burgerman.jpg'),
//         'averageCost': 150,
//         'category': 'Food',
//         'short_desc': 'Famous for their deep-fried burgers and house sauces.',
//         'rating': '4.1',
//         'phone': '+12222222222',
//         'distance': 200,
//         'lat': 13.02022746104633,
//         'lng': 80.25496697446783
//     },
//     {
//         'id': 3,
//         'name': 'Paan Shop',
//         'imageURL': require('../assets/fordemo/paanshop.jpg'),
//         'averageCost': 20,
//         'category': 'General Store',
//         'short_desc': 'Buy just about anything here.',
//         'rating': '3.8',
//         'phone': '+13333333333',
//         'distance': 350,
//         'lat': 13.019884643584833,
//         'lng': 80.25548875338806
//     },
//     {
//         'id': 4,
//         'name': 'Delhi Farsan Center',
//         'imageURL': require('../assets/fordemo/farsanshop.jpg'),
//         'averageCost': 100,
//         'category': 'Sweet Shop',
//         'short_desc': 'All your sweet tooth cravings will be taken care of.',
//         'rating': '4.8',
//         'phone': '+14444444444',
//         'distance': 50,
//         'lat': 13.01877643149983,
//         'lng': 80.25585593786546
//     },
//     {
//         'id': 5,
//         'name': 'Chennai Spice Mart',
//         'imageURL': require('../assets/fordemo/spicemart.jpg'),
//         'averageCost': 'N/A',
//         'category': 'General Store',
//         'short_desc': 'All things spice and all things nice, make this a great place.',
//         'rating': '4.0',
//         'phone': '+15555555555',
//         'distance': 80,
//         'lat': 13.019196039914794,
//         'lng': 80.25683602588953
//     }
// ];