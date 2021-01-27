import axios from "axios";

const getWorkflowLists = async () => {
    return axios.get('http://localhost:5001/workflowList', {
        method: 'GET'
    }).then(res => {
        console.log(res);
        return res.data;
    }).catch(e => {
        console.error(e);
    });

}
