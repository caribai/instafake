//Escucha del formulario que captura los datos y los envia como parametros

document.getElementById('form').addEventListener('submit', async (e)=>{
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const JWT = await postData(email,password)
    const posts = await getPosts(JWT)
    
})

//Funcion que toma el email y password,genera un token y lo guarda en el localstorage 
const postData = async (email,password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
        {
            method:'POST',
            body: JSON.stringify({email:email,password:password})
        })
        const {token} = await response.json()
        localStorage.setItem('jwt-token',token)
        return token
    }catch(err){
        console.error(`Error: ${err}`)
    }
}

//funcion que obtiene las fotos si el usuario esta autorizado
const getPosts = async(jwt)=> {
    try{
        const response = await fetch('http://localhost:3000/api/photos',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {data} = await response.json()
        //si esta disponible la data llama a las funciones para mostrar los posts
        if(data){
            fillTable(data)
            toggleFormAndTable()            
        }
          
    }catch(err){
        localStorage.clear()
        console.error(`Error: ${err}`)
    }
}

//Funcion que muestra las imagenes
const fillTable = (data) => {
    let rows = "";
    $.each(data,(i,row)=>{
        rows += `<div class="card d-block my-5 px-0 mx-0" style="border:1px solid lightblue">
        <img class="card-img-top" src="${row.download_url}" alt=" " style="margin-inline: auto;">
        <div >
            <p class="card-text p-3">Autor: ${row.author}</p>
        </div>
    </div>`
    })
    document.getElementById('contenido').innerHTML = rows
}

//funcion que muestra o esconde los posts y el formulario
const toggleFormAndTable = ()=>{
    $(`#js-form`).toggle()
    $(`#js-contenido`).toggle()
}
//Funcion que verifica si existe un token en el localstorage y muestra el contenido en caso de existir
const init = async ()=>{
    const token = localStorage.getItem('jwt-token')
    if(token){
        const posts = await getPosts(token)
    }
}
init()

//Boton de logout
document.getElementById('logout').addEventListener('click',() => {
    localStorage.clear()
    location.reload()
})

let pagina = 2
//escucha de boton que al hacer click muestra mas posts 
document.getElementById('mostrarbtn').addEventListener('click',async()=>{
    const token = localStorage.getItem('jwt-token')
    if(pagina<=10){
        try{
            const response = await fetch(`http://localhost:3000/api/photos?page=${pagina}`,
                {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const {data} = await response.json()
            if(data){
                let rows = "";
                $.each(data,(i,row)=>{
                    rows += `<div class="card d-block my-5 px-0 mx-0" style="border:1px solid lightblue">
                                <img class="card-img-top" src="${row.download_url}" alt=" " style="margin-inline: auto;">
                                <div>
                                    <p class="card-text p-3">Autor: ${row.author}</p>
                                </div>
                            </div>`
                })
                document.getElementById('contenido').innerHTML += rows
            }
        }catch(err){
            localStorage.clear()
            console.error(`Error: ${err}`)
        } 
        pagina++
        if(pagina == 11) {
        document.getElementById('mostrarMas').innerHTML = "No hay mas elementos para mostrar"
        }
    }   
})
