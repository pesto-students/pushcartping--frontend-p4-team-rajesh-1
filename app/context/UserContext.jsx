import { createContext, useState, useEffect, useCallback } from "react";

import constants from "../config/constants";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userData, setUserData] = useState({ type: constants.userTypeCustomer });

    // const fetchData = useCallback(async () => {
    //     try {
    //         console.log("trying to get userinfo");

    //         // const q = query(collection(db, "users"));
    //         // const querySnapshot = await getDocs(q);

    //         // const data = querySnapshot.docs.map((doc) => ({
    //         //     uid: doc.data().uid,
    //         //     name: doc.data().displayName,
    //         //     img: doc.data().photoURL
    //         // }));

    //         // const map = new Map(data.map(obj =>
    //         //     [obj.uid, { name: obj.name, img: obj.img }]));

    //         // console.log("USERDATA");
    //         // console.log(map);
    //         // console.log("-----------------------------------------------");

    //         // setAllUsers(map);
    //     } catch (error) {
    //         console.log("UserContext error:", error);
    //     }
    // }, []);

    useEffect(() => {
        console.log('userdata')
        console.log(userData)
    }, [userData]);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser, userData: userData, setUserData: setUserData }}>
            {children}
        </UserContext.Provider>
    );
}