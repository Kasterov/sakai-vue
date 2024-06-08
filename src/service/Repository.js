import axios from 'axios';
import apiUrl from '@/client.js';
import store from '@/store';

export function repository() {
    const createVolunteer = async (createVolunteerRequest) => {
        let res = await axios.post(`${apiUrl}volunteer`,
            createVolunteerRequest,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*',
                }
            }
        ).catch(error => {
            console.log(error);
            return false;
        });
        
        if(res){
            return res.data; 
        }
    };

    const login = async (loginRequest) => {
        let res = await axios.post(`${apiUrl}volunteer/logIn`,
            loginRequest,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*',
                }
            }
        ).catch(error => {
            console.log(error);
            return false;
        });
        
        if(res){
            const token = res.data;
            store.dispatch('saveToken', token);
            return true; 
        }
    };

    const createOrganization = async (organisationRequest) => {
        const token = store.getters.getToken
        let res = await axios.post(`${apiUrl}organisation`,
            organisationRequest,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`
                }
            }
        ).catch(error => {
            console.log(error);
            return false;
        });
        
        if(res){
            return true; 
        }
    };

    const getOrganisations = async () => {
        let res = await axios.get(`${apiUrl}organisation/getall`,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*'
                }
            }
        ).catch(error => {
            console.log(error);
            return false;
        });
        
        if(res){
            return res; 
        }
    };

    const getOrganisationById = async (orgId) => {
        let res = await axios.get(`${apiUrl}organisation/${orgId}`,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*'
                }
            }
        ).catch(error => {
            console.log(error);
            return false;
        });
        
        if(res){
            return res; 
        }
    }

    return {
        createVolunteer: createVolunteer,
        login: login,
        createOrganization: createOrganization,
        getOrganisations: getOrganisations,
        getOrganisationById: getOrganisationById
    }
}