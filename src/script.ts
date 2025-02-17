interface Projeto {
  id: number;
  name: string;
  link: string;
  category: string;
  photos: string[]; // Agora suporta múltiplas imagens
  linguagems: string[];
}

// Variável global para armazenar os projetos carregados
let allProjects: Projeto[] = [];
let currentImages: { [key: number]: number } = {}; // Índice atual da imagem para cada projeto

// Função para buscar os projetos do JSON
async function fetchProjetos(): Promise<Projeto[]> {
  const response = await fetch("./itens.json");

  if (!response.ok) {
    throw new Error("Erro ao carregar os projetos.");
  }

  return response.json();
}

// Função para renderizar os projetos filtrados
function renderProjetos(category: string) {
  const container = document.getElementById("itens");
  if (!container) return;

  const filteredProjects =
    category === "todos"
      ? allProjects
      : allProjects.filter((p) => p.category === category);

  container.innerHTML = filteredProjects
    .map(
      (projeto) => `
        
          <article class="relative flex-1 mt-1 h-75 overflow-hidden rounded-xl bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300 p-0.5 shadow-xl transition hover:shadow-xs">
            <div class="relative flex flex-col justify-end h-full rounded-[10px] bg-gray-900 p-4 sm:p-6 bg-cover bg-center transition-opacity duration-500"
              id="article-${projeto.id}"
              style="background-image: url('${projeto.photos[0]}');">
              
              <!-- Botões para mudar a imagem -->
              <button class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full" onclick="prevImage(${projeto.id})">❮</button>
              <button class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full" onclick="nextImage(${projeto.id})">❯</button>
              
              <div class="mb-3 text-start">
                <div class="start inline-block rounded-full bg-gray-800 py-0.5 px-3 text-md font-medium text-white">${projeto.name}</div>
              </div>
              <div class="flex justify-between ">
                <div class="flex flex-wrap gap-1">
                  ${projeto.linguagems
                    .map((lang) => `<div class="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-white">${lang}</div>`)
                    .join("")}
                    
                </div>
                <div>
                  <a  href="${projeto.link}">
                    <svg class="h-7 w-7 fill-gray-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                      <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 
                      c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 
                      c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 
                      c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 
                      c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 
                      c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 
                      c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 
                      c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                    </svg></a>
                </div>    
              </div>
              
            </div>
          </article>
       
      `
    )
    .join("");
}

// Funções para alternar imagens no carrossel (troca o background do article)
function nextImage(id: number) {
  const projeto = allProjects.find((p) => p.id === id);
  if (!projeto) return;

  if (!(id in currentImages)) currentImages[id] = 0;
  currentImages[id] = (currentImages[id] + 1) % projeto.photos.length;

  const article = document.getElementById(`article-${id}`);
  if (article) {
    article.style.backgroundImage = `url('${projeto.photos[currentImages[id]]}')`;
  }
}

function prevImage(id: number) {
  const projeto = allProjects.find((p) => p.id === id);
  if (!projeto) return;

  if (!(id in currentImages)) currentImages[id] = 0;
  currentImages[id] =
    (currentImages[id] - 1 + projeto.photos.length) % projeto.photos.length;

  const article = document.getElementById(`article-${id}`);
  if (article) {
    article.style.backgroundImage = `url('${projeto.photos[currentImages[id]]}')`;
  }
}

// Aguarda o carregamento do DOM e inicializa os projetos
document.addEventListener("DOMContentLoaded", () => {
  fetchProjetos()
    .then((projetos) => {
      allProjects = projetos;
      renderProjetos("todos"); // Exibe todos os projetos inicialmente
    })
    .catch((error) => console.error("Erro ao carregar projetos:", error));

  // Adiciona eventos aos botões de categoria
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const category =
        (event.currentTarget as HTMLElement).getAttribute("data-category") ||
        "todos";
      renderProjetos(category);
    });
  });
});
