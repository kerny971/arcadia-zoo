const habitatElHTMl = document.querySelector('#habitats');

const API_HOST = 'http://localhost:8000/public';

function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

async function getHabitat () {
    const endpoint = API_HOST + '/habitat';
    try {
        const response = await axios.get(endpoint);
        const habitats = response.data;
        return habitats;
    } catch (error) {
        if (error.response) {
            return error.response.data
        }
    }
}

async function pushHabitat(html) {
    const habitats = await getHabitat(html);
    console.log(habitats);
    if (habitats.status.error) {
        return;
    }
    let habitatHTML =  '';

    for (const habitat of habitats.data.habitats) {
        console.log(habitat);
        habitatHTML += `
            <div class="col-12 col-xl-6 py-4 px-4 z-0 mb-5">
                <img src="data:image/jpeg;base64,${toBase64(habitat.habitat_image.data)}" class="img-fluid d-block w-100 rounded" style="height: 300px; object-fit: cover;"/>
                
                <div class="">
                    <h3 class="display-5">${habitat.habitat_nom}</h3>
                    <div>
                        <p>
                            ${habitat.habitat_description}
                        </p>
                        <p>
                            <div class="fw-semibold">Avis vétérinaire</div>
                            ${habitat.habitat_commentaire}
                        </p>
                    </div>
                    <div class="Les animaux">
                        <h3 class="display-6">Les animaux</h3>
                        <div class="row">
                        ${(JSON.parse(habitat.animal_list)).map(el => {
                            console.log(el.animal_rapport_date)
                            return `
                                <div class="col-12 col-md-5 py-4 px-3 bg-light rounded">
                                    <i class="bi bi-bug fs-1"></i>
                                    <h4 class="mt-3 fw-semibold">
                                        ${el.animal_prenom}
                                        <div class="fs-6 fw-lighter">
                                            ${el.animal_race}
                                        </small>
                                    </h4>
                                    <div class='mt-4'>
                                        <div class="mb-4">
                                            <div>Etat :</div>
                                            <div class="fw-bold">${el.animal_etat}</div>
                                        </div>
                                        <div class="mb-4">
                                            <div>Compte rendu dernière consultation :</div>
                                            <div class="fst-italic fs-5">${el.animal_rapport == 'null' || el.animal_rapport == null ? '...' : el.animal_rapport}</div>
                                        </div>
                                        <div class="mb-4">
                                            <div>Date consultation :</div>
                                            <div class="fw-bold">${el.animal_rapport_date != null ? new Date(el.animal_rapport_date).toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) : '...'}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    console.log(html);

    html.innerHTML = habitatHTML;
}

window.addEventListener('load', async () => {
    await pushHabitat(habitatElHTMl);
})