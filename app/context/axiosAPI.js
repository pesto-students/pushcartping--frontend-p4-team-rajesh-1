import axios from 'axios';
// const baseUrl = 'http://192.168.1.11:3000';
// const baseUrl = 'http://192.168.1.11:5001/pushcartping/us-central1/app';
const baseUrl = 'https://us-central1-pushcartping.cloudfunctions.net/app';

export const axFetchCustomerData = async (uid) => {
    const url = `${baseUrl}/user/${uid}`;
    const response = await axios.get(url);
    const data = await response.data;
    return { status: response.status, data: data };
};

export const axAddCustomerToDatabase = async ({ uid, userName = '', userEmail = '', userPhotoURL = '' }) => {
    const url = `${baseUrl}/user/${uid}`;
    const response = await axios.post(url, {
        userName,
        userEmail,
        userPhotoURL
    });
    const data = await response.data;
    return { status: response.status, data: data };
}

export const axFetchVendorData = async (uid) => {
    const url = `${baseUrl}/vendor/${uid}`;
    const response = await axios.get(url);
    const data = await response.data;
    return { status: response.status, data: data };
};

export const axAddVendorToDatabase = async ({ uid, userName = '', userEmail = '', userPhotoURLs = [], userCategory = '', userTagline = '', userDescription = '' }) => {
    const url = `${baseUrl}/vendor/${uid}`;
    const response = await axios.post(url, {
        userName,
        userEmail,
        userPhotoURLs,
        userCategory,
        userTagline,
        userDescription,
    });
    const data = await response.data;
    return { status: response.status, data: data };
}

export const axSetCurrentVendorLocation = async ({ uid, latitude, longitude }) => {
    const url = `${baseUrl}/vendor/${uid}`;
    const response = await axios.patch(url, {
        latitude,
        longitude,
    });
    const data = await response.data;
    return { status: response.status, data: data };
}

export const axGetAllVendorsFromDB = async () => {
    const url = `${baseUrl}/vendor/get/all`;
    const response = await axios.get(url);
    const data = await response.data;
    return { status: response.status, data: data };
}