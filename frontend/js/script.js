const servicesListElementHTML = document.querySelector('#services_list');
const submitAvisElementHTML = document.querySelector('#submit_avis');





const API_HOST = 'http://localhost:8000/public';




async function getService () {
    const endpoint = API_HOST + '/service';
    try {
        const response = await axios.get(endpoint);
        const services = response.data;
        return services;
    } catch (error) {
        console.log(error)
        if (error.response) {
            return error.response
        }
    }
}

async function pushservice (service_list) {
    const services = await getService();
    if (services.status.error) return;

    let servicesHTML = '';
    for (const service of services.data.services) {
        servicesHTML += `
            <div class="col-12 col-sm-6 col-lg-4 text-center text-decoration-none text-dark py-4">
                <i class="bi bi-diagram-2 display-3"></i>
                <div class="fs-5">${service.nom}</div>
            </div>
        `;
    }

    service_list.innerHTML = servicesHTML;

}



window.addEventListener('load', async () => {

    submitAvisElementHTML.addEventListener('submit', ev => {
        ev.preventDefault();
        console.log(ev);
    })

    await pushservice(servicesListElementHTML);
})