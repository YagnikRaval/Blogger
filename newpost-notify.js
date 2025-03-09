const feedUrl = "https://www.yagnik.eu.org/feeds/posts/default?alt=json&max-results=1";

async function checkNewPost() {
    try {
        const response = await fetch(feedUrl);
        const data = await response.json();
        
        if (!data.feed || !data.feed.entry) return;

        const latestPost = data.feed.entry[0];
        const postTitle = latestPost.title.$t;
        const postLink = latestPost.link.find(link => link.rel === "alternate").href;
        
        const lastPostTitle = localStorage.getItem("lastPostTitle");

        if (postTitle !== lastPostTitle) {
            localStorage.setItem("lastPostTitle", postTitle);
            showNotification(postTitle, postLink);
        }
    } catch (error) {
        console.error("Error fetching blog feed:", error);
    }
}

function showNotification(title, link) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: "Click to read the latest post!",
            icon: "https://www.yagnik.eu.org/favicon.ico",
            data: { url: link }
        }).onclick = function(event) {
            event.preventDefault();
            window.open(link, "_blank");
        };
    }
}

if (Notification.permission !== "denied") {
    Notification.requestPermission();
}

setInterval(checkNewPost, 60000); // हर 1 मिनट में चेक करेगा
