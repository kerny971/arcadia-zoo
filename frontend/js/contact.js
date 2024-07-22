const contactFormElHTMl = document.querySelector('#contact_form');

const API_HOST = 'http://localhost:8000/public';

async function postContactMsg (form) {
    const endpoint = API_HOST + '/contact';
    const params = new URLSearchParams();
    params.append('email', form[0].value);
    params.append('titre', form[1].value);
    params.append('description', form[2].value);
    try {
        const response = await axios.post(endpoint, params);
        const services = response.data;
        return services;
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
    }
}

async function submitContactForm(form) {
    const msg = await postContactMsg(form);
    if (msg.status.error) {
        alert(msg.status.message);
        return;
    }
    alert('Votre message à bien été pris en compte, vous serez recontacté à l\'adresse ' + form[0].value);
}

contactFormElHTMl.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    await submitContactForm(ev.target);
})
