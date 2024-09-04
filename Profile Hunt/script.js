const user = document.querySelector(".container-background .search input");
const codeforces = document.querySelector(".container-background .lcg .codeforces");
const github = document.querySelector(".container-background .lcg .github");
const containerBackground = document.querySelector(".container-background");
let userName = "";

user.addEventListener("input", () => {
    console.log("Current input value:", user.value);
    userName = user.value.trim();
});

codeforces.addEventListener("click", () => {
    if (userName === "") {
        console.log("Username is empty. Please enter a username.");
        return;
    }
    console.log("Fetching data for username:", userName);
    fetch(`https://codeforces.com/api/user.info?handles=${userName}`)
        .then((response) => {
            console.log("Response received:", response);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error fetching data from Codeforces API");
            }
        })
        .then((data) => {
            console.log("Fetched data:", data);
            displayCodeforcesDataOnDOM(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

github.addEventListener("click", () => {
    if (userName === "") {
        console.log("Username is empty. Please enter a username.");
        return;
    }

    console.log("Fetching data for username:", userName);

    fetch(`https://api.github.com/users/${userName}`)
        .then((response) => {
            console.log("Response received:", response);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error fetching data from GitHub API");
            }
        })
        .then((data) => {
            console.log("Fetched data:", data);
            displayGitHubDataOnDOM(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

function displayCodeforcesDataOnDOM(data) {
    const existingDataDiv = document.querySelector(".fetched-data");
    if (existingDataDiv) existingDataDiv.remove();

    if (data.status !== "OK" || !data.result || data.result.length === 0) {
        console.error("Invalid data received from API");
        return;
    }
    const dataDiv = document.createElement("div");
    dataDiv.classList.add("fetched-data");
    const userInfo = data.result[0];
    const infoHtml = `
        <p><strong>Username:</strong> ${userInfo.handle}</p>
        <p><strong>Rank:</strong> ${userInfo.rank}</p>
        <p><strong>Max Rank:</strong> ${userInfo.maxRank}</p>
        <p><strong>Rating:</strong> ${userInfo.rating}</p>
        <p><strong>Max Rating:</strong> ${userInfo.maxRating}</p>
    `;
    dataDiv.innerHTML = infoHtml;
    containerBackground.appendChild(dataDiv);
}

function displayGitHubDataOnDOM(data) {
    const existingDataDiv = document.querySelector(".fetched-data");
    if (existingDataDiv) existingDataDiv.remove();

    const dataDiv = document.createElement("div");
    dataDiv.classList.add("fetched-data");

    const infoHtml = `
        <p><strong>Username:</strong> ${data.login}</p>
        <p><strong>Public Repos:</strong> ${data.public_repos}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
        <p><strong>Following:</strong> ${data.following}</p>
    `;
    dataDiv.innerHTML = infoHtml;
    containerBackground.appendChild(dataDiv);
}
