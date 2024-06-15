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
            let token = res.data;
            console.log(token);
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
    };

    const getTags = async () => {
        let res = await axios.get(`${apiUrl}tag`,
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

    const createEvent = async (eventRequest) => {
        const token = store.getters.getToken
        let res = await axios.post(`${apiUrl}event`,
            eventRequest,
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

    const getOrganisationsByCreatorId = async () => {
        const token = store.getters.getToken
        let res = await axios.get(`${apiUrl}organisation/getByCreatorId`,
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
            return res; 
        }
    };

    const getAllEvents = async (request) => {
        let res = await axios.post(`${apiUrl}event/getAll`,
            request,
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
            return res.data; 
        }
    };

    const getEventById = async (id) => {
        let res = await axios.get(`${apiUrl}event/${id}`,
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
            return res.data; 
        }
    };

    const createTag = async (tag) => {
            let res = await axios.post(`${apiUrl}tag`,
            tag,
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
            return res.data; 
        }
    }

    const getVolunteerById = async (id) => {
        const token = store.getters.getToken
        let res = await axios.get(`${apiUrl}volunteer/${id}`,
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
            return res.data; 
        }
    };

    const updateVolunteer = async (id, request) => {
        let res = await axios.put(`${apiUrl}volunteer?volunteerId=${id}`,
            request,
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
            return true; 
        }
    };

    const generateCode = async () => {
        const token = store.getters.getToken;
        let res = await axios.patch(`${apiUrl}volunteer/generateCode`,
        {},
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

    const checkCode = async (code) => {
        const token = store.getters.getToken;
        let res = await axios.patch(`${apiUrl}volunteer/checkCode`,
        {
            changePasswordCode: code
        },
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

    const changePassword = async (password, confirmation) => {
        const token = store.getters.getToken;
        let res = await axios.patch(`${apiUrl}volunteer/changePassword`,
        {
            password: password,
            confirmpassword: confirmation
        },
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

    const createComment = async (eventId, comment) => {
        const token = store.getters.getToken;
        let res = await axios.post(`${apiUrl}comment`,
        {
            eventId: eventId,
            commnet: comment
        },
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

    const getCommentsOfEventById = async (eventId) => {
        let res = await axios.get(`${apiUrl}comment/${eventId}`,
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
            return res.data; 
        }
    };

    const deleteComment = async (commentId) => {
        const token = store.getters.getToken;
        let res = await axios.delete(`${apiUrl}comment/${commentId}`,
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

    const getAllDonates = async () => {
        let res = await axios.get(`${apiUrl}donation`,
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
            return res.data; 
        }
    };

    const donate = async (donateId, amount) => {
        let res = await axios.put(`${apiUrl}donation`,
        {
            donationId: donateId,
            amount: amount
        },
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
            return true; 
        }
    };

    const createDonate = async (donate) => {
        let res = await axios.post(`${apiUrl}donation`,
        donate,
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
            return true; 
        }
    };

    return {
        createVolunteer: createVolunteer,
        login: login,
        createOrganization: createOrganization,
        getOrganisations: getOrganisations,
        getOrganisationById: getOrganisationById,
        getTags: getTags,
        createEvent: createEvent,
        getOrganisationsByCreatorId: getOrganisationsByCreatorId,
        getAllEvents: getAllEvents,
        getEventById: getEventById,
        createTag: createTag,
        getVolunteerById: getVolunteerById,
        updateVolunteer: updateVolunteer,
        generateCode: generateCode,
        checkCode: checkCode,
        changePassword: changePassword,
        createComment: createComment,
        getCommentsOfEventById: getCommentsOfEventById,
        deleteComment: deleteComment,
        getAllDonates: getAllDonates,
        donate: donate,
        createDonate: createDonate
    }
}