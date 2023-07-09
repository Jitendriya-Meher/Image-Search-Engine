
const apiKey = "qG5taJUZBxmyIE0iYw7KHdQLpfBkZYT7X3oZ2ClGJ1QRzp2hK8nVitmb";

const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");

const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadImgBtn = lightBox.querySelector(".fa-download");

downloadImgBtn.addEventListener("click", ()=>{
    const imgURL = lightBox.querySelector("img").src;
    downloadImg(imgURL);
});

closeBtn.addEventListener("click", () =>{
    lightBox.classList.remove("show");
});

const perPage = 15;
let currentPage = 1;
let searchText = null;

const downloadImg = (imgUrl) => {
    console.log(imgUrl);

    // converting received img to blob , creating its download link, and downloading it
    fetch(imgUrl).then( res => res.blob()).then(file => {
        console.log(file);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch( () => alert("Failed to download image "))
} 

const showLightbox = (img, name) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText=name;
    lightBox.classList.add("show");
}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map( (img) => 
    `<li class="card" onclick="showLightbox('${img.src.large2x}', '${img.photographer}')">
        <img src="${img.src.large2x}" alt="">

        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera fa-flip"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}')">
                <i class="fa-solid fa-download fa-beat "></i>
            </button>
        </div>
    </li>`
    ).join("");
}

const getImages = (apiURL) => {

    loadMoreBtn.innerHTML = "Loading";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL , {
        headers: { Authorization: apiKey }
    }).then( res => res.json()).then( data=>{
        generateHTML(data.photos);
        console.log(data.photos);
        loadMoreBtn.innerHTML = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch( ()=> {
        alert("falied to load images");
    })
}

getImages(`https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`);


loadMoreBtn.addEventListener('click', () =>{
    currentPage ++;
    if( searchText){
        getImages(`https://api.pexels.com/v1/search?query=${searchText}&per_page=${perPage}&page=${currentPage}`);
    }
    else{
        getImages(`https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`);
    }
});

searchInput.addEventListener( "keyup",(e) =>{
    if( e.key =="Enter" ){
        searchText = e.target.value;
        currentPage = 1;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchText}&per_page=${perPage}&page=${currentPage}`);
    }
})